var PieGraph;

PieGraph = (function() {

  PieGraph.radius = 25;
  
  function PieGraph(lossGraph, container, state) {
    var self = this;
    this.container = container;

    var data = unconfirmedDepredations.filter(function(d) {
      return d.state == state;
    })[0].data;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var arc = d3.arc()
      .outerRadius(PieGraph.radius - 10)
      .innerRadius(0);
    
    var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d; });

    var years = container.selectAll('.year')
      .data(data)
      .enter()
      .append('g') 
      .attr('transform', function(d) {
        return 'translate(' +
          (lossGraph.lineGraph.x(d.year) - PieGraph.radius * 0.5) + ',' + 
          (LineGraph.height + LossGraph.margin.top + 40) + ')';
      });

    years
      .append('line')
      .attr('x1', PieGraph.radius * 0.5)
      .attr('x2', PieGraph.radius * 0.5)
      .attr('y1', -30)
      .attr('y2', -16)
      .attr('class', 'pie-line');

    var arcs = years.selectAll(".arc")
      .data(function(d) {
        return pie([d.predatorLoss, d.nonPredatorLoss]);
      })
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr('transform', 'translate(' + (PieGraph.radius * 0.5) + ',0)');

    arcs.append("path")
      .attr("d", arc)
      .attr("class", function(d, i) {
        return i == 0 ? 'predator-loss-slice' : 'non-predator-loss-slice';
      });

    var labels = years.append('g')
      .attr('transform', 'translate(0,' + (PieGraph.radius * 0.75) + ')');

    var formatPercent = d3.format('.1%');

    labels.append('foreignObject')
      .attr('height', 50)
      .attr('width', 50)
      .append('xhtml:div')
      .html(function(d) {
        return '<section class="pie-loss">' +
        '<span class="predator-loss-label">' +
        formatPercent(d.predatorLoss) +
        '</span><br>' +
        '<span class="non-predator-loss-label">' +
        formatPercent(d.nonPredatorLoss) +
        '</span>' +
        '</section>'
      });
  }

  return PieGraph;

})();