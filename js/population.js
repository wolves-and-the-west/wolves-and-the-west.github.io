var Population;

Population = (function() {

  Population.margin = {
    top: 20,
    bottom: 0,
    right: 0,
    left: 0
  };
  Population.height = 210;
  Population.width = 900;

  Population.stateMax = 125;
  Population.stateMargin = 10;

  Population.legendMax = 155;
  Population.legendWidth = 140;
  Population.legendSize = 150;

  Population.areaColorScale = d3.scaleOrdinal()
    .domain(['cattle', 'sheep', 'confirmedWolfDepredations', 'unconfirmedWolfDepredations', 'loss'])
    .range(['#7395b1', 'silver', 'firebrick', 'red', 'black']);
  
  Population.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([10, 0])
    .direction('s')
    .html(function(d) {
      return '<h3 class="header">' + d.data.state + ' ' +
        titleCase(d.type) + '</h3>' +
        '<table><tbody>' +
        '<tr>' +
          '<th>Inventory</th>' +
          '<td>' +
            formatNumber(d.data.inventory[d.type]) +
          '</td>' +
          '<td>' +
            formatPercent(d.data.inventory[d.type + 'Pct']) +
            ' of cattle and sheep' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<th>Losses</th>' +
          '<td>' +
            formatNumber(d.data.loss[d.type]) +
          '</td>' +
          '<td>' +
            formatPercent(d.data.loss[d.type + 'Pct']) +
            ' of all ' + d.type + 
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

  function Population(data) {
    this.data = data;
    this.buildScales();
    this.buildSVG();
    this.buildStates();
    this.buildLegend();
  }

  Population.prototype.buildScales = function() {
    this.inventoryMax = d3.max(this.data, function(d) { return Math.max(d.inventory.cattle, d.inventory.sheep) });
    this.inventoryScale = d3.scaleSqrt()
      .domain([0, this.inventoryMax])
      .range([0, Population.stateMax - Population.stateMargin]);
    this.legendInventoryScale = this.inventoryScale.copy()
      .range([0, Population.legendMax - Population.stateMargin]);
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

  Population.prototype.applyCommonAreaAttrs = function(selection, area) {
    var areaKey = area + 'Area';
    var fill = area == 'inventory' ?
      d3.select(selection.node().parentNode).attr('class') :
      area;
    selection
      .attr('class', area)
      .attr('width', function(d) { return d.vizData[areaKey] })
      .attr('height', function(d) { return d.vizData[areaKey] })
      .style('fill', Population.areaColorScale(fill));
  }

  // type = cattle, sheep
  Population.prototype.buildArea = function(state, type, _this, isLegend=false) {
    var inventoryScale = isLegend ? _this.legendInventoryScale : _this.inventoryScale;
    var stateMax = isLegend ? Population.legendMax : Population.stateMax;
    var stateData = state.datum();
    var area = state.selectAll('.' + type)
      .data(function(d) {
        return [{
          type: type,
          data: d,
          vizData: {
            inventoryArea: inventoryScale(d.inventory[type]),
            lossArea: inventoryScale(d.loss[type]),
            confirmedWolfDepredationsArea: inventoryScale(d.confirmedDepredation[type]),
            unconfirmedWolfDepredationsArea: inventoryScale(d.unconfirmedDepredation.all.wolfDepredations),
          }
        }] 
      })
      .enter()
      .append('g')
      .attr('class', type);
    area.selectAll('.inventory')
      .data(function(d) { return [d] })
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', function(d) { return stateMax - d.vizData.inventoryArea })
      .on('mouseover', isLegend ? null : Population.tip.show)
      .on('mouseout', isLegend ? null : Population.tip.hide)
      .call(_this.applyCommonAreaAttrs, 'inventory');
    area.selectAll('.loss')
      .data(function(d) { return [d] })
      .enter()
      .append('rect')
      .attr('x', function(d) { return d.vizData.inventoryArea - d.vizData.lossArea })
      .attr('y', function(d) { return stateMax - d.vizData.inventoryArea })
      .call(_this.applyCommonAreaAttrs, 'loss');
    if (type == 'cattle' && stateData.unconfirmedDepredation.all.wolfDepredations != null) {
      area.selectAll('.unconfirmed-depredation')
        .data(function(d) { return [d] })
        .enter()
        .append('rect')
        .attr('x', function(d) { return d.vizData.inventoryArea - inventoryScale(d.data.unconfirmedDepredation.all.wolfDepredations) })
        .attr('y', function(d) { return stateMax - d.vizData.inventoryArea })
        .call(_this.applyCommonAreaAttrs, 'unconfirmedWolfDepredations');
    }
    area.selectAll('.confirmed-depredation')
      .data(function(d) { return [d] })
      .enter()
      .append('rect')
      .attr('x', function(d) { return d.vizData.inventoryArea - inventoryScale(d.data.confirmedDepredation[d.type]) })
      .attr('y', function(d) { return stateMax - inventoryScale(d.data.inventory[d.type]) })
      .call(_this.applyCommonAreaAttrs, 'confirmedWolfDepredations');
    if (isLegend) {
      area.selectAll('.label')
      .data(function(d) { return [d] })
      .enter()
      .append('text')
      .attr('class', 'legend-label')
      .attr('x', 5)
      .attr('y', function(d) { return stateMax - d.vizData.inventoryArea })
      .attr('dy', '1.25em')
      .text(function(d) { return titleCase(d.type) });
    }
  }

  Population.prototype.buildStates = function() {
    var _this = this;
    var stateG = this.svg.append('g')
      .attr('class', 'states')
      .attr('transform', 'translate(' + (Population.stateMargin * 2) + ',15)');
    var states = stateG.selectAll('.state')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'state')
      .attr('transform', function(d, i) {
        return 'translate(' +
          ((i * Population.stateMax) + Population.legendWidth) + ',0)';
      });

    states.selectAll('.label')
      .data(function(d) { return [d.state] })
      .enter()
      .append('text')
      .text(function(d) { return d });

    states.each(function() {
      var state = d3.select(this);
      var data = state.datum();
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
          total: this.inventoryMax,
          cattle: this.inventoryMax * (2/3),
          sheep: this.inventoryMax * (1/3),
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
      .attr('height', (Population.legendSize + (Population.stateMargin)) * 1.3)
      .attr('width', Population.legendWidth)
      .style('fill', '#ddd  ');
    legend.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .text('State');
    var legendG = legend.append('g')
      .attr('class', 'state')
      .attr('transform', 'translate(10,-10)');
    var area = legendG.selectAll('.legend')
      .data(legendData)
      .enter()
      .append('g');
    area.each(function() {
      var state = d3.select(this);
      var data = state.datum();
      var areas = data.inventory.cattle > data.inventory.sheep ? ['cattle', 'sheep'] : ['sheep', 'cattle'];
      areas.forEach(function(area) {
        state.call(_this.buildArea, area, _this, true);
      });
    });
    var depredationG = legendG.append('g')
      .attr('transform', 'translate(0,165)');
    var loss = depredationG.append('g');
    loss.append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', Population.areaColorScale('loss'));
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
      .style('fill', Population.areaColorScale('confirmedWolfDepredations'));
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
      .style('fill', Population.areaColorScale('unconfirmedWolfDepredations'));
    d.append('text')
      .attr('class', 'legend-label')
      .attr('x', 13)
      .attr('y', 8)
      .text('= Unconfirmed Wolf Loss');

  }

  return Population;

})();