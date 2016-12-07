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
    .domain(['total', 'cattle', 'sheep', 'confirmedDepredation', 'unconfirmedDepredation', 'loss'])
    .range(['darkolivegreen', 'steelblue', 'silver', 'black', 'gray', 'red']);
  Population.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([10, 0])
    .direction('s')
    .html(function(d) {
      return '<h1 class="header">' + d.data.state + '</h1>' +
        '<h2 class="header">' + titleCase(d.type) + '</h2>' +
        '<table><tbody>' +
        '<tr>' +
          '<th>Population</th>' +
          '<td>' +
            formatNumber(d.data.inventory[d.type]) +
          '</td>' +
          '<td>' +
            formatPercent(d.data.inventory[d.type + 'Pct']) +
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
          '<th>Confirmed Wolf Depredations</th>' +
          '<td>' +
            (d.data.confirmedDepredation[d.type] == null ? NO_DATA : formatNumber(d.data.confirmedDepredation[d.type])) +
          '</td>' +
          '<td>' +
            (d.data.confirmedDepredation[d.type] == null ? '&mdash;' : formatPercentLong(d.data.confirmedDepredation[d.type + 'Pct'])) +
          '</td>' +
        '</tr>' +
        (d.type == 'cattle' ?
        '<tr>' +
          '<th>Unconfirmed Wolf Depredations</th>' +
          '<td>' +
            (d.data.unconfirmedDepredation.all.wolfDepredations == null ? NO_DATA : formatNumber(d.data.unconfirmedDepredation.all.wolfDepredations)) +
          '</td>' +
          '<td>' +
            (d.data.unconfirmedDepredation.all.percentWolfDepredationsOfInventory == null ? '&mdash;' : formatPercentLong(d.data.unconfirmedDepredation.all.percentWolfDepredationsOfInventory)) +
          '</td>' +
        '</tr>' : '') +
        '</tbody></table';
    });

  function Population(populationDepredationData) {
    this.pD = populationDepredationData;
    this.buildSupporting();
    this.buildSVG();
    this.buildStates();
    this.buildLegend();
  }

  Population.prototype.buildSupporting = function() {
    this.stateMax = d3.max(this.pD, function(d) { return d.inventory.total });
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
    var stateData = state.datum();
    console.log(stateData);
    var area = state.selectAll('.' + type)
      .data(function(d) {
        return [{ type: type, data: d }] 
      })
      .enter()
      .append('g')
      .attr('class', 'area');
    area.selectAll('.inventory')
      .data(function(d) { return [d] })
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', function(d) { return areaMax - areaScale(d.data.inventory[d.type]) })
      .attr('width', function(d) { return areaScale(d.data.inventory[d.type]) })
      .attr('height', function(d) { return areaScale(d.data.inventory[d.type]) })
      .style('fill', Population.areaColorScale(type))
      .on('mouseover', isLegend ? null : Population.tip.show)
      .on('mouseout', isLegend ? null : Population.tip.hide);
    area.selectAll('.loss')
      .data(function(d) { return [d] })
      .enter()
      .append('rect')
      .attr('class', 'loss')
      .attr('x', function(d) { return areaScale(d.data.inventory[d.type]) - areaScale(d.data.loss[d.type]) })
      .attr('y', function(d) { return areaMax - areaScale(d.data.inventory[d.type]) })
      .attr('width', function(d) { return areaScale(d.data.loss[d.type]) })
      .attr('height', function(d) { return areaScale(d.data.loss[d.type]) });
    if (type == 'cattle' && stateData.unconfirmedDepredation.all.wolfDepredations != null) {
      area.selectAll('.unconfirmed-depredation')
        .data(function(d) { return [d] })
        .enter()
        .append('rect')
        .attr('x', function(d) { return areaScale(d.data.inventory[d.type]) - areaScale(d.data.unconfirmedDepredation.all.wolfDepredations) })
        .attr('y', function(d) { return areaMax - areaScale(d.data.inventory[type]) })
        .attr('width', function(d) { return areaScale(d.data.unconfirmedDepredation.all.wolfDepredations) })
        .attr('height', function(d) { return areaScale(d.data.unconfirmedDepredation.all.wolfDepredations) })
        .style('fill', Population.areaColorScale('unconfirmedDepredation'));
    }
    area.selectAll('.confirmed-depredation')
      .data(function(d) { return [d] })
      .enter()
      .append('rect')
      .attr('x', function(d) { return areaScale(d.data.inventory[d.type]) - areaScale(d.data.confirmedDepredation[d.type]) })
      .attr('y', function(d) { return areaMax - areaScale(d.data.inventory[d.type]) })
      .attr('width', function(d) { return areaScale(d.data.confirmedDepredation[d.type]) })
      .attr('height', function(d) { return areaScale(d.data.confirmedDepredation[d.type]) })
      .style('fill', Population.areaColorScale('confirmedDepredation'));
    if (isLegend) {
      area.selectAll('.label')
      .data(function(d) { return [d] })
      .enter()
      .append('text')
      .attr('class', 'legend-label')
      .attr('x', 5)
      .attr('y', function(d) { return areaMax - areaScale(d.data.inventory[d.type]) })
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
        return d3.descending(a.inventory.total, b.inventory.total);
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
      var areas = data.inventory.cattle > data.inventory.sheep ? ['cattle', 'sheep'] : ['sheep', 'cattle'];
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
        inventory: {
          total: this.stateMax,
          cattle: this.stateMax * (2/3),
          sheep: this.stateMax * (1/3),
        },
        confirmedDepredation: {},
        unconfirmedDepredation: {},
        loss: {}
      }
    ];
    legendData[0].loss.cattle = legendData[0].inventory.cattle * .01;
    legendData[0].loss.sheep = legendData[0].inventory.sheep * .01;
    legendData[0].loss.total = legendData[0].loss.cattle + legendData[0].loss.sheep;
    legendData[0].confirmedDepredation.cattle = legendData[0].loss.cattle * .1;
    legendData[0].confirmedDepredation.sheep = legendData[0].loss.sheep * .1;
    legendData[0].confirmedDepredation.total = legendData[0].confirmedDepredation.cattle + legendData[0].confirmedDepredation.sheep;
    legendData[0].unconfirmedDepredation = {
      all: {
        wolfDepredations: legendData[0].loss.cattle * .3
      }
    };

    var legend = this.svg.append('g')
      .attr('transform', 'translate(0,-10)')
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('height', (Population.legendSize + (Population.areaMargin)) * 1.35)
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
      var areas = data.inventory.cattle > data.inventory.sheep ? ['cattle', 'sheep'] : ['sheep', 'cattle'];
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
      .attr('x', 13)
      .attr('y', 8)
      .text('= All Losses');
    var d = depredationG.append('g')
      .attr('transform', 'translate(0,15)');
    d.append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', Population.areaColorScale('confirmedDepredation'));
    d.append('text')
      .attr('class', 'legend-label')
      .attr('x', 13)
      .attr('y', 8)
      .text('= Confirmed Wolf Loss');
    var d = depredationG.append('g')
      .attr('transform', 'translate(0,30)');
    d.append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', Population.areaColorScale('unconfirmedDepredation'));
    d.append('text')
      .attr('class', 'legend-label')
      .attr('x', 13)
      .attr('y', 8)
      .text('= Unconfirmed Wolf Loss');

  }

  return Population;

})();