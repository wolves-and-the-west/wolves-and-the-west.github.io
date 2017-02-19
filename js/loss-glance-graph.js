var LossGlanceGraph;

LossGlanceGraph = (function() {

  function LossGlanceGraph(container, data) {
    var self = this;
    this.container = container;
    this.data = data;
    this.data.data.sort(function(a, b) { return d3.descending(b.value, a.value); });
    
    this.margin = {
      left: 0,
      right: 0,
      bottom: 0,
      top: 10
    }

    this.captionHeight = 35;
    this.dataHeight = (this.data.data.length * 20);
    this.height = this.captionHeight + this.dataHeight - this.margin.top - this.margin.bottom;
    this.width = 400 - this.margin.left - this.margin.right;

    this.barStart = 115;
    this.barEnd = this.width - this.barStart - 20;

    this.tip = d3.tip().attr('class', 'd3-tip')
      .html(function(d) {
        return self.data.type == 'percentages' ?
          d3.format('.1%')(d.value) :
          numbro(d.value).formatCurrency('($ 0.00 a)');
      });

    this.buildScales();
    this.buildSVG();
  }


  LossGlanceGraph.prototype.buildScales = function() {
    this.x = d3.scaleLinear()
      .range([0, this.barEnd]);

    if (this.data.type == 'percentages') {
      this.x.domain([0, 1]);
    }
    else {
      var max = d3.max(LossGlance.data, function(d) {
        return d3.max(
          d.data.filter(function(d2) {
            return d2.type == 'dollars';
          })[0].data,
          function(d3) { return d3.value; }
        );
      });
      this.x.domain([0, max]);
    }

    this.y = d3.scaleBand()
      .range([this.dataHeight, 0])
      .domain(this.data.data.map(function(d) { return d.type }))
      .padding(0.2);
  }

  LossGlanceGraph.prototype.buildSVG = function() {
    var self = this;

    var section = this.container;

    this.svg = section.append('svg')
      .attr('viewBox', [
        0,
        0,
        this.width + this.margin.left + this.margin.right,
        this.height + this.margin.bottom + this.margin.top
      ].join(' '))
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.svg.call(this.tip);

    this.svg.append('text')
      .attr('y', 15)
      .attr('class', 'loss-type-header')
      .text(this.data.type == 'percentages' ? 'Causes' : 'Cost');

    var g = this.svg.append('g')
      .attr('transform', 'translate(0,' + this.captionHeight + ')');

    g.selectAll('.bar')
      .data(this.data.data)
      .enter()
      .append('rect')
      .attr('class', 'loss-glance-bar')
      .attr('x', this.barStart)
      .attr('height', self.y.bandwidth())
      .attr('y', function(d) { return self.y(d.type) - self.y.bandwidth() + 2 })
      .attr('width', function(d) { return self.x(d.value) })
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide);

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
      .attr('y', function(d) { return self.y(d.type) })
      .text(function(d) { return d.type });

    g.append('line')
      .attr('x1', this.barEnd + this.barStart)
      .attr('x2', this.barEnd + this.barStart)
      .attr('y1', -20)
      .attr('y2', this.height)
      .style('stroke', 'black')
      .style('stroke-opacity', 0.3);

    this.svg.append('text')
      .attr('x', this.width)
      .attr('y', 10)
      .text(
        this.data.type == 'percentages' ? '100%' : 
          numbro(this.x.domain()[1]).formatCurrency('($ 0.00 a)')
      )
      .style('text-anchor', 'end')
      .style('font-size', '0.75em')
      .style('opacity', 0.3);

  }

  return LossGlanceGraph;

})();