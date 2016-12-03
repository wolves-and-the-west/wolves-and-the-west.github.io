var Population;

Population = (function() {

  Population.margin = 20;
  Population.height = 280;
  Population.width = 880;
  Population.areaMax = 150;
  Population.areaMargin = 10;
  Population.areaColorScale = d3.scaleOrdinal()
    .domain(['total', 'cattle', 'sheep'])
    .range(['darkolivegreen', 'sienna', 'silver']);
  Population.stateTextScale = d3.scaleOrdinal()
    .domain(['ID', 'MT', 'OR', 'WA', 'WY'])
    .range(['Idaho', 'Montana', 'Oregon', 'Washington', 'Wyoming']);
  Population.tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
      return d3.format(',')(d.value) + ' ' + d.type;
    });

  function Population(populationData) {
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
  }

  Population.prototype.buildSVG = function() {
    this.svg = d3.select('#population')
      .append('svg')
      .attr('viewBox', [
        0,
        0,
        Population.width + (Population.margin * 2),
        Population.height + (Population.margin * 2)
      ].join(' '))
      .append('g')
      .attr('transform', 'translate(' + Population.margin + ',' + Population.margin + ')');
    this.svg.call(Population.tip);
  }

  Population.prototype.buildArea = function(state, type, _this) {
    state.data(function(d) { return [{ type: type, value: d[type] }] })
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', function(d) { return Population.areaMax - _this.areaScale(d.value) })
      .attr('width', function(d) { return _this.areaScale(d.value) })
      .attr('height', function(d) { return _this.areaScale(d.value) })
      .style('fill', Population.areaColorScale(type))
      .on('mouseover', Population.tip.show)
      .on('mouseout', Population.tip.hide);
  }

  Population.prototype.buildStates = function() {
    var _this = this;
    var states = this.svg.selectAll('.state')
      .data(this.pD.data.sort(function(a, b) {
        return d3.descending(a.total, b.total);
      }))
      .enter()
      .append('g')
      .attr('transform', function(d, i) {
        return 'translate(' +
          (i * Population.areaMax) + ',0)';
      });
    states.selectAll('.label')
      .data(function(d) { return [d.state] })
      .enter()
      .append('text')
      .text(function(d) { return Population.stateTextScale(d) });

    states.each(function() {
      var state = d3.select(this);
      var data = state.datum();
      state.selectAll('.total').call(_this.buildArea, 'total', _this);
      var areas = data.cattle > data.sheep ? ['cattle', 'sheep'] : ['sheep', 'cattle'];
      areas.forEach(function(area) {
        state.selectAll('.' + area).call(_this.buildArea, area, _this);
      });
    });
  }

  Population.prototype.buildLegend = function() {
    var legend = this.svg.append('g')
      .attr('transform', 'translate(0,' + (Population.areaMax + 25) + ')');
    var area = legend.selectAll('.area')
      .data(Population.areaColorScale.domain())
      .enter()
      .append('g')
      .attr('transform', function(d, i) {
        return 'translate(' + (i * 100) + ',0)';
      });
    area.selectAll('.key')
      .data(function(d) { return [d] })
      .enter()
      .append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .style('fill', function(d) { return Population.areaColorScale(d) });
    area.selectAll('.label')
      .data(function(d) { return [d] })
      .enter()
      .append('text')
      .attr('dy', '1em')
      .attr('x', 25)
      .text(function(d) { return d.slice(0, 1).toUpperCase() + d.slice(1) });

  }

  return Population;

})();