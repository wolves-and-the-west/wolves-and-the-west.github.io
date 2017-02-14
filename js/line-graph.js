/*
  Linear regressions are not well-fitted (R2):
  COLORADO   0.00016385376552541242
  IDAHO      0.5524487750790632
  MONTANA    0.00008970562549115435
  OREGON     0.10270062003011249
  WASHINGTON 0.5091452428095392
  WYOMING    0.024396232063105705
*/

var LineGraph;

LineGraph = (function() {

  LineGraph.height = 125;
  LineGraph.width = LossGraph.width;
  
  LineGraph.yLabelOffset = 8;
  LineGraph.tooltipTemplate = _.template(heredoc(function(){/*
    <table class="line-tooltip-table">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th colspan="2" style="text-align: center">Percent Loss</th>
        </tr>
        <tr>
          <th></th>
          <th>Inventory</th>
          <th>Loss</th>
          <th>Of Type</th>
          <th>Of Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Cattle</th>
          <td><%= formatNumber(d.cattleInv) %></td>
          <td><%= formatNumber(d.cattleLoss) %></td>
          <td><%= d3.format('.2%')(d.cattlePercent) %></td>
          <td><%= d3.format('.2%')(d.cattlePercentOfTotal) %></td>
        </tr>
        <tr>
          <th>Calves</th>
          <td><%= formatNumber(d.calvesInv) %></td>
          <td><%= formatNumber(d.calvesLoss) %></td>
          <td><%= d3.format('.2%')(d.calvesPercent) %></td>
          <td><%= d3.format('.2%')(d.calvesPercentOfTotal) %></td>
        </tr>
      </tbody>
    </table>
  */}));

  LineGraph.reintroYears = [1995, 1996];

  function LineGraph(lossGraph, container, state, annotate) {
    this.svg = container;
    this.state = state.toUpperCase();
    this.annotateText = annotate;
    this.prepData();
    this.buildScales();
    this.buildSVG();
    this.buildAxes();
    this.plotLines();
    this.annotate();
    this.addOverlay();
  }

  LineGraph.prototype.prepData = function() {
    var self = this;

    var keys = [
      "cattlePercent", "calvesPercent"
    ];

    var stack = d3.stack().keys(keys);

    this.percentLossData = [];

    parsedLossData.filter(function(d) {
      return d.State == self.state &&
        d["Data Item"] == "CATTLE, (EXCL CALVES) - LOSS, DEATH, MEASURED IN HEAD";
    }).forEach(function(cattleLoss) {

      var calvesLoss = parsedLossData.filter(function(d) {
        return d.State == cattleLoss.State &&
          d.Year == cattleLoss.Year &&
          d["Data Item"] == "CATTLE, CALVES - LOSS, DEATH, MEASURED IN HEAD";
      })[0];

      var calvesInv = calfCropData.filter(function(inv) {
        return inv.State == cattleLoss.State &&
          inv.Year == cattleLoss.Year
      })[0];

      var cattleInv = invDataWithCattle.filter(function(inv) {
        return inv.State == cattleLoss.State &&
          inv.Year == cattleLoss.Year + 1 &&
          inv.Period == "FIRST OF JAN" &&
          inv["Data Item"] == "__CATTLE__";
      })[0];

      console.log(
        'Matched losses of',
        cattleLoss.Year,
        'to inventory of',
        cattleInv.Year,
        cattleInv.Period
      );

      var row = {
        year: cattleLoss.Year,
        state: cattleLoss.State,
        cattleLoss: cattleLoss.Value,
        cattleInv: cattleInv.Value,
        cattlePercent: cattleLoss.Value / cattleInv.Value,
        cattlePercentOfTotal: cattleLoss.Value / (cattleInv.Value + calvesInv.Value),
        calvesLoss: calvesLoss.Value,
        calvesInv: calvesInv.Value,
        calvesPercent: calvesLoss.Value / calvesInv.Value,
        calvesPercentOfTotal: calvesLoss.Value / (cattleInv.Value + calvesInv.Value),
      }

      self.percentLossData.push(row);

    });

    this.stackedValues = stack(this.percentLossData);
  }

  LineGraph.prototype.buildScales = function() {
    var self = this;
    this.years = d3.set(parsedLossData.map(function(d) { return d.Year }))
      .values()
      .map(function(d) { return +d })
      .sort();
    var states = d3.set(parsedLossData.map(function(d) { return d.State }))
      .values()
      .sort();

    this.x = d3.scalePoint()
      .domain(this.years)
      .range([0, LineGraph.width]);

    this.y = d3.scaleLinear()
      .domain([0, 0.2])
      .range([LineGraph.height, 0])
      .nice();

    this.tooltip = d3.select("body").append("div")
      .attr("class", "line-tooltip")
      .style("display", "none");

    this.bisectYear = d3.bisector(function(d) { return d.year; });

    this.area = d3.area()
      .x(function(d) { return self.x(d.data.year); })
      .y0(function(d) { return self.y(d[0]) })
      .y1(function(d) { return self.y(d[1]); })
      .curve(d3.curveMonotoneX);
  }

  LineGraph.prototype.mouseover = function() {
    this.hoverLine.style('display', 'inline');
    this.tooltip.style('display', 'inline');
  }

  LineGraph.prototype.mouseout = function() {
    var self = this;
    this.hoverLine.style('display', 'none');
    this.tooltip.style('display', 'none');
    this.svg.select('.x.axis').selectAll('.tick')
      .style('opacity', function(d) {
        return self.xTicks.indexOf(d) != -1 ? 1 : 0;
      });
  }

  LineGraph.prototype.mousemove = function() {
    var self = this;
    var xPos = d3.mouse(d3.event.target)[0];
    var rangePoints = d3.range(
      this.x.range()[0],
      this.x.range()[1],
      this.x.step()
    );
    var year = this.x.domain()[d3.bisect(rangePoints, xPos)];

    this.hoverLine.select('line')
      .attr('x1', this.x(year) + 0.5)
      .attr('x2', this.x(year) + 0.5)
      .attr('y1', this.y(this.y.domain()[0]))
      .attr('y2', this.y(this.y.domain()[1]));

    this.svg.select('.x.axis').selectAll('.tick')
      .style('opacity', function(d) {
        return [year].concat(self.xTicks).indexOf(d) != -1 ? 1 : 0;
      });

    var tooltipX = d3.event.pageX > $(document).width() - 300 ? 
      d3.event.pageX - 300 : d3.event.pageX;
    this.tooltip
      .style("left", (tooltipX) + 20 + "px")
      .style("top", (d3.event.pageY) + "px")
      .html(this.buildYearTooltip(year))
  }

  LineGraph.prototype.buildYearTooltip = function(year) {
    var tooltipData;
    this.stackedValues[0].forEach(function(d) {
      if (d.data.year == year) {
        tooltipData = d.data;
      }
    });
    return LineGraph.tooltipTemplate({self: this, d: tooltipData });
  }

  LineGraph.prototype.buildSVG = function() {
    var self = this;
    var container = d3.select('#line-graphs')
      .append('div')
      .attr('class', 'large-4 medium-6 columns');
    container.append('h5').text(titleCase(self.state));

    this.hoverLine = this.svg.append("g")
      .attr('class', 'hover-line')
      .style("display", "none")
      
    this.hoverLine.append("line")
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', this.y(this.y.domain()[0]))
      .attr('y2', this.y(this.y.domain()[1]));

  }

  LineGraph.prototype.addOverlay = function() {
    var self = this;
    this.svg.append("rect")
      .attr("class", "overlay")
      .attr("width", LineGraph.width)
      .attr("height", LineGraph.height)
      .on("mouseover", function() { return self.mouseover(self); })
      .on("mouseout", function() { return self.mouseout(self); })
      .on("mousemove", function() { return self.mousemove(self); });
  }

  LineGraph.prototype.buildAxes = function() {
    var self = this;
    this.xAxis = d3.axisBottom(this.x);
    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + LineGraph.height + ')')
      .call(this.xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr("transform", "rotate(-45 -3 0)");

    this.xTicks = this.years.filter(function(d, i) { return i == 0 || d % 5 == 0 });
    this.svg.select('.x.axis').selectAll('.tick')
      .style('opacity', function(d) {
        return self.xTicks.indexOf(d) != -1 || LineGraph.reintroYears.indexOf(d) != -1 ? 1 : 0;
      })

    this.yAxis = d3.axisLeft(this.y)
      .tickFormat(d3.format('.0%'))
      .ticks(3);
    this.svg.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);
  }

  LineGraph.prototype.plotLines = function() {
    var self = this;
    var lastLabelY = 0;

    var g = self.svg.selectAll('.layer')
      .data(self.stackedValues)
      .enter()
      .append('g');
    
    g.append('path')
      .attr('class', function(d) {
        return 'loss-' + d.key;
      })
      .attr('d', self.area);
  }

  LineGraph.prototype.annotate = function() {
    var self = this;
    var annotation = this.svg.append('g').attr('class', 'wolf-reintro-annotation');
    LineGraph.reintroYears.forEach(function(year) {
      annotation.append('line')
        .attr('x1', self.x(year) + 0.5)
        .attr('x2', self.x(year) + 0.5)
        .attr('y1', self.y(self.y.domain()[0]))
        .attr('y2', self.y(self.y.domain()[1]));
      self.svg.selectAll('.tick').filter(function(d) {
        return d == year;
      }).attr('class', 'wolf-reintro-tick');
    });
    if (this.annotateText) {
      annotation.append('text')
        .attr('x', self.x(1998))
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .text('Wolves reintroduced to Yellowstone & Idaho');
    }
  }

  return LineGraph;

})();