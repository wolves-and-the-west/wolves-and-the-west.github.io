var Population;

Population = (function() {

  Population.margin = {
    top: 20,
    bottom: 0,
    right: 0,
    left: 0
  };
  Population.height = 280;
  Population.width = 880;
  Population.areaMax = 125;
  Population.legendAreaMax = 125;
  Population.legendWidth = 150;
  Population.areaMargin = 10;
  Population.legendSize = 150;
  Population.areaColorScale = d3.scaleOrdinal()
    .domain(['total', 'cattle', 'sheep', 'depredation'])
    .range(['darkolivegreen', 'steelblue', 'silver', 'black']);
  Population.stateTextScale = d3.scaleOrdinal()
    .domain(['CO', 'ID', 'MT', 'OR', 'WA', 'WY', 'State'])
    .range(['Colorado', 'Idaho', 'Montana', 'Oregon', 'Washington', 'Wyoming', 'State']);
  Population.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .direction('s')
    .html(function(d) {
      return '<h1 class="header">' + Population.stateTextScale(d.data.state) + '</h1>' +
        '<h2 class="header">' + titleCase(d.type) + '</h2>' +
        '<table><tbody>' +
        '<tr>' +
          '<th>Population</th>' +
          '<td>' +
            formatNumber(d.data[d.type]) +
          '</td>' +
          '<td>' +
            formatPercent(d.data[d.type] / d.data.total) +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<th>Wolf Depredations</th>' +
          '<td>' +
            (d.data.depredation[d.type] == null ? 'No Data' : formatNumber(d.data.depredation[d.type])) +
          '</td>' +
          '<td>' +
            (d.data.depredation[d.type] == null ? '&mdash;' : formatPercent(d.data.depredation[d.type] / d.data.total)) +
          '</td>' +
        '</tr>' +
        '</tbody></table';
    });

  function Population(populationDepredationData) {
    this.pD = populationData;
    this.buildSupporting();
    this.buildSVG();
    this.buildStates();
    this.buildLegend();
  }

  Population.prototype.buildSupporting = function() {
    this.stateMax = d3.max(this.pD.data, function(d) { return d.total });
    this.areaScale = d3.scaleSqrt()
      .domain([0, this.stateMax])
      .range([0, Population.areaMax - Population.areaMargin]);
    this.legendAreaScale = this.areaScale.copy()
      .range([0, Population.legendAreaMax - Population.areaMargin]);
  }

  Population.prototype.buildSVG = function() {
    this.svg = d3.select('#population')
      .append('svg')
      .attr('viewBox', [
        0,
        0,
        Population.width + Population.margin.left + Population.margin.right,
        Population.height + Population.margin.top + Population.margin.bottom
      ].join(' '))
      .append('g')
      .attr('transform', 'translate(' + Population.margin.left + ',' + Population.margin.top + ')');
    this.svg.call(Population.tip);
  }

  Population.prototype.buildArea = function(state, type, _this, isLegend=false) {
    var areaScale = isLegend ? _this.legendAreaScale : _this.areaScale;
    var areaMax = isLegend ? Population.legendAreaMax : Population.areaMax;
    var area = state.selectAll('.' + type)
      .data(function(d) {
        return [{ type: type, data: d }] 
      })
      .enter()
      .append('g')
      .attr('class', 'area');
    area.selectAll('.area')
      .data(function(d) { return [d] })
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', function(d) { return areaMax - areaScale(d.data[d.type]) })
      .attr('width', function(d) { return areaScale(d.data[d.type]) })
      .attr('height', function(d) { return areaScale(d.data[d.type]) })
      .style('fill', Population.areaColorScale(type))
      .on('mouseover', isLegend ? null : Population.tip.show)
      .on('mouseout', isLegend ? null : Population.tip.hide);
    area.selectAll('.depredation')
      .data(function(d) { return [d] })
      .enter()
      .append('rect')
      .attr('x', function(d) { return areaScale(d.data[d.type]) - areaScale(d.data.depredation[d.type]) })
      .attr('y', function(d) { return areaMax - areaScale(d.data[d.type]) })
      .attr('width', function(d) { return areaScale(d.data.depredation[d.type]) })
      .attr('height', function(d) { return areaScale(d.data.depredation[d.type]) })
      .style('fill', Population.areaColorScale('depredation'));
    if (isLegend) {
      area.selectAll('.label')
      .data(function(d) { return [d] })
      .enter()
      .append('text')
      .attr('class', 'legend-label')
      .attr('x', 5)
      .attr('y', function(d) { return areaMax - areaScale(d.data[d.type]) })
      .attr('dy', '1.25em')
      .text(function(d) { return titleCase(d.type) });
    }
  }

  Population.prototype.buildStates = function() {
    var _this = this;
    var stateG = this.svg.append('g')
      .attr('transform', 'translate(' + (Population.areaMargin * 2) + ',0)');
    var states = stateG.selectAll('.state')
      .data(this.pD.data.sort(function(a, b) {
        return d3.descending(a.total, b.total);
      }))
      .enter()
      .append('g')
      .attr('transform', function(d, i) {
        return 'translate(' +
          ((i * Population.areaMax) + Population.legendWidth) + ',0)';
      });
    states.selectAll('.label')
      .data(function(d) { return [d.state] })
      .enter()
      .append('text')
      .attr('class', 'state-label')
      .text(function(d) { return Population.stateTextScale(d) });

    states.each(function() {
      var state = d3.select(this);
      var data = state.datum();
      state.call(_this.buildArea, 'total', _this);
      var areas = data.cattle > data.sheep ? ['cattle', 'sheep'] : ['sheep', 'cattle'];
      areas.forEach(function(area) {
        state.call(_this.buildArea, area, _this);
      });
    });
  }

  Population.prototype.buildLegend = function() {
    var _this = this;
    var legendData = [
      {
        state: 'State',
        total: this.stateMax,
        cattle: this.stateMax * (2/3),
        sheep: this.stateMax * (1/3),
        depredation: {}
      }
    ];
    legendData[0].depredation.cattle = legendData[0].cattle * .01;
    legendData[0].depredation.sheep = legendData[0].sheep * .01;
    legendData[0].depredation.total = legendData[0].depredation.cattle + legendData[0].depredation.sheep;
    var legend = this.svg.append('g')
      .attr('transform', 'translate(0,-10)')
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('height', (Population.legendSize + (Population.areaMargin)) * 1.13)
      .attr('width', Population.legendSize + (Population.areaMargin))
      .style('fill', '#ccc');
    legend.append('text')
      .attr('x', 10)
      .attr('y', 25)
      .text('Legend');
    var legendG = legend.append('g')
      .attr('transform', 'translate(10,25)');
    var area = legendG.selectAll('.legend')
      .data(legendData)
      .enter()
      .append('g');
    area.each(function() {
      var state = d3.select(this);
      var data = state.datum();
      state.call(_this.buildArea, 'total', _this, true);
      var areas = data.cattle > data.sheep ? ['cattle', 'sheep'] : ['sheep', 'cattle'];
      areas.forEach(function(area) {
        state.call(_this.buildArea, area, _this, true);
      });
    });
    var depredationG = legendG.append('g')
      .attr('transform', 'translate(0,135)');
    depredationG.append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', Population.areaColorScale('depredation'));
    depredationG.append('text')
      .attr('class', 'legend-label')
      .attr('x', 15)
      .attr('y', 8)
      .text('= Wolf Depredation');

  }

  return Population;

})();