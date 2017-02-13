var LossGlanceGraph;

LossGlanceGraph = (function() {

  function LossGlanceGraph(container, data) {
    this.container = container;
    this.data = data;
    this.data.data.sort(function(a, b) { return d3.descending(b.value, a.value); });
    
    this.marginLeft = 115;
    this.height = this.data.data.length * 20;
    this.width = 450;

    this.buildScales();
    this.buildSVG();
  }


  LossGlanceGraph.prototype.buildScales = function() {
    this.x = d3.scaleLinear()
      .range([0, this.width - this.marginLeft]);

    if (this.data.type == 'percentages') {
      this.x.domain([0, 1]);
    }
    else {
      this.x.domain([0, d3.max(this.data.data, function(d) { return d.value })]);
    }

    this.y = d3.scaleBand()
      .range([this.height, 0])
      .domain(this.data.data.map(function(d) { return d.type }))
      .padding(0.2);
  }

  LossGlanceGraph.prototype.buildSVG = function() {
    var self = this;

    var section = this.container;
    section.append('h1')
      .attr('class', 'loss-type-header')
      .text(this.data.type == 'percentages' ? 'Causes' : 'Cost');

    this.svg = section.append('svg')
      .attr('viewBox', [
        0,
        0,
        this.width,
        this.height
      ].join(' '))
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .append('g');

    var g = this.svg.append('g');

    g.selectAll('.bar')
      .data(this.data.data)
      .enter()
      .append('rect')
      .attr('class', 'loss-glance-bar')
      .attr('x', this.marginLeft)
      .attr('height', self.y.bandwidth())
      .attr('y', function(d) { return self.y(d.type) })
      .attr('width', function(d) { console.log(d.value, self.x(d.value)); return self.x(d.value) });

    g.selectAll('.label')
      .data(this.data.data)
      .enter()
      .append('text')
      .attr('class', function(d) {
        var classes = ['loss-glance-label'];
        if (d.type == 'Wolves') {
          classes.push('loss-glance-label-wolves');
        }
        return classes.join(' ');
      })
      .attr('x', 0)
      .attr('y', function(d) { return self.y(d.type) + 12 })
      .text(function(d) { return d.type });

  }

  return LossGlanceGraph;

})();