var LineGraph;

LineGraph = (function() {

  LineGraph.margin = {
    top: 10,
    bottom: 30,
    right: 15,
    left: 25
  };
  LineGraph.height = 125 - LineGraph.margin.top - LineGraph.margin.bottom;
  LineGraph.width = 400 - LineGraph.margin.left - LineGraph.margin.right;
  
  LineGraph.yLabelOffset = 8;
  LineGraph.tooltipTemplate = _.template(heredoc(function(){/*
    <table class="line-tooltip-table">
      <thead>
        <tr>
          <th>Inventory</th>
          <th>Loss</th>
          <th>Percent Loss</th>
        </tr>
      </thead>
      <tbody>
        <% d.forEach(function(state) { %>
          <tr>
            <td><%= formatNumber(state.inventory) %></td>
            <td><%= formatNumber(state.loss) %></td>
            <td><%= d3.format('.2%')(state.percent) %></td>
          </tr>
        <% }); %>
      </tbody>
    </table>
  */}));

  LineGraph.reintroYears = [1995, 1996];

  function LineGraph(state, annotate=true) {
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
    this.lossData = parseCSV(lossesDump).filter(function(d) {
      return d.State == self.state;
    });
    this.inventoryData = parseCSV(inventoryDump).filter(function(d) {
      return d.State == self.state;
    });
    this.percentLossData = [];

    this.lossData.forEach(function(l) {
      var matchingInventory = _.find(self.inventoryData, function(i) {
        return i.State == l.State && i.Year == l.Year + 1;
      });
      console.log(
        'Matched losses of', 
        l.Year,
        'against inventory of',
        matchingInventory.Year,
        matchingInventory.Period
      );
      self.percentLossData.push({
        year: l.Year,
        state: l.State,
        percent: l.Value / matchingInventory.Value,
        inventory: matchingInventory.Value,
        loss: l.Value
      });
    });

    this.groupedPercentLossData = d3.nest()
      .key(function(d) { return d.state; })
      .entries(this.percentLossData);
    console.log(this.groupedPercentLossData);
  }

  LineGraph.prototype.buildScales = function() {
    var self = this;
    this.years = d3.set(this.lossData.map(function(d) { return d.Year }))
      .values()
      .map(function(d) { return +d })
      .sort();
    var states = d3.set(this.lossData.map(function(d) { return d.State }))
      .values()
      .sort();

    this.stateColor = d3.scaleOrdinal(d3.schemeCategory10);

    this.x = d3.scalePoint()
      .domain(this.years)
      .range([0, LineGraph.width]);

    this.y = d3.scaleLinear()
      .domain([0, 0.05])
      .range([LineGraph.height, 0])
      .nice();

    this.tooltip = d3.select("body").append("div")
      .attr("class", "line-tooltip")
      .style("display", "none");

    this.bisectYear = d3.bisector(function(d) { return d.year; }).left;

    this.area = d3.area()
      .x(function(d) { return self.x(d.year); })
      .y0(this.y(0))
      .y1(function(d) { return self.y(d.percent); })
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
    var year = this.x.domain()[d3.bisect(rangePoints, xPos) -1];

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
    var tooltipData = [];
    this.groupedPercentLossData.forEach(function(state) {
      var stateYearData = state.values.filter(function(d) { return d.year == year; })[0];
      tooltipData.push(stateYearData);
    });
    return LineGraph.tooltipTemplate({self: this, d: tooltipData });
  }

  LineGraph.prototype.buildSVG = function() {
    var self = this;
    var container = d3.select('#line-graphs')
      .append('div')
      .attr('class', 'large-4 columns');
    container.append('h4').text(titleCase(self.state));
    this.svg = container.append('svg')
      .attr('viewBox', [
        0,
        0,
        LineGraph.width + LineGraph.margin.left + LineGraph.margin.right,
        LineGraph.height + LineGraph.margin.top + LineGraph.margin.bottom
      ].join(' '))
      .append('g')
      .attr('transform', 'translate(' + LineGraph.margin.left + ',' + LineGraph.margin.top + ')');


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
        .attr("transform", "rotate(-45 -2 9)");

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

    this.groupedPercentLossData
      .sort(function(a, b) {
        return d3.descending(a.values[0].percent, b.values[0].percent);
      })
      .forEach(function(state) {
        self.svg.append('path')
          .data([state.values])
          .attr('class', 'area')
          .attr('d', self.area)
          .style('stroke', self.stateColor(state.key));
      });
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
        .attr('x', self.x(1996))
        .attr('y', -2)
        .attr('text-anchor', 'middle')
        .text('Wolves reintroduced to Yellowstone');
    }
  }

  return LineGraph;

})();