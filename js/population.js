var Population;

Population = (function() {

  Population.margin = {
    top: 20,
    bottom: 0,
    right: 0,
    left: 0
  };
  Population.height = 210;
  Population.width = 880;
  Population.areaMax = 125;
  Population.legendAreaMax = 130;
  Population.legendWidth = 140;
  Population.areaMargin = 10;
  Population.legendSize = 150;
  Population.areaColorScale = d3.scaleOrdinal()
    .domain(['total', 'cattle', 'sheep', 'depredation', 'loss'])
    .range(['darkolivegreen', 'steelblue', 'silver', 'black', 'red']);
  Population.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .direction('s')
    .html(function(d) {
      return '<h1 class="header">' + d.data.state + '</h1>' +
        '<h2 class="header">' + titleCase(d.type) + '</h2>' +
        '<table><tbody>' +
        '<tr>' +
          '<th>Population</th>' +
          '<td>' +
            formatNumber(d.data[d.type]) +
          '</td>' +
          '<td>' +
            formatPercent(d.data[d.type + 'Pct']) +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<th>Losses</th>' +
          '<td>' +
            formatNumber(d.data.loss[d.type]) +
          '</td>' +
          '<td>' +
            formatPercent(d.data.loss[d.type + 'Pct']) +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<th>Wolf Depredations</th>' +
          '<td>' +
            (d.data.depredation[d.type] == null ? 'No Data' : formatNumber(d.data.depredation[d.type])) +
          '</td>' +
          '<td>' +
            (d.data.depredation[d.type] == null ? '&mdash;' : formatPercentLong(d.data.depredation[d.type + 'Pct'])) +
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
    this.buildSource();
  }

  Population.prototype.buildSupporting = function() {
    this.stateMax = d3.max(this.pD, function(d) { return d.total });
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
    area.selectAll('.loss')
      .data(function(d) { return [d] })
      .enter()
      .append('rect')
      .attr('class', 'loss')
      .attr('x', function(d) { return areaScale(d.data[d.type]) - areaScale(d.data.loss[d.type]) })
      .attr('y', function(d) { return areaMax - areaScale(d.data[d.type]) })
      .attr('width', function(d) { return areaScale(d.data.loss[d.type]) })
      .attr('height', function(d) { return areaScale(d.data.loss[d.type]) });
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
      .attr('transform', 'translate(' + (Population.areaMargin * 2) + ',15)');
    var states = stateG.selectAll('.state')
      .data(this.pD.sort(function(a, b) {
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
      .text(function(d) { return d });

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
        depredation: {},
        loss: {}
      }
    ];
    legendData[0].loss.cattle = legendData[0].cattle * .01;
    legendData[0].loss.sheep = legendData[0].sheep * .01;
    legendData[0].loss.total = legendData[0].loss.cattle + legendData[0].loss.sheep;
    legendData[0].depredation.cattle = legendData[0].loss.cattle * .1;
    legendData[0].depredation.sheep = legendData[0].loss.sheep * .1;
    legendData[0].depredation.total = legendData[0].depredation.cattle + legendData[0].depredation.sheep;

    var legend = this.svg.append('g')
      .attr('transform', 'translate(0,-10)')
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('height', (Population.legendSize + (Population.areaMargin)) * 1.25)
      .attr('width', Population.legendWidth)
      .style('fill', '#ccc');
    legend.append('text')
      .attr('x', 10)
      .attr('y', 25)
      .text('State');
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
      .attr('transform', 'translate(0,140)');
    var loss = depredationG.append('g');
    loss.append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('class', 'loss');
    loss.append('text')
      .attr('class', 'legend-label')
      .attr('x', 15)
      .attr('y', 8)
      .text('= All Losses');
    var d = depredationG.append('g')
      .attr('transform', 'translate(0,15)');
    d.append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', Population.areaColorScale('depredation'));
    d.append('text')
      .attr('class', 'legend-label')
      .attr('x', 15)
      .attr('y', 8)
      .text('= Wolf Depredations');

  }

  Population.prototype.buildSource = function() {
    var source = this.svg.append('g')
      .attr('transform', function(d, i) {
        return 'translate(' +
          (Population.legendWidth + (Population.areaMargin*2)) + ',150)';
      })
      .append('foreignObject')
      .attr('width', 500)
      .attr('height', 100);
    source.append('xhtml:p')
      .attr('class', 'sources')
      .html(
        '<strong>Sources</strong><br>' +
        'Population: <a href="https://quickstats.nass.usda.gov" target="_blank">' +
        'USDA/NASS QuickStats Ad-hoc Query Tool' +
        '</a>' +
        '<br>' +
        'Depredation: <a href="https://www.fws.gov/mountain-prairie/es/species/mammals/wolf/2016/FINAL_NRM%20summary%20-%202015.pdf" target="_blank">' +
        'Northern Rocky Mountain Wolf Recovery Program 2015 Interagency Annual Report' +
        '</a>'
      );
  }

  return Population;

})();