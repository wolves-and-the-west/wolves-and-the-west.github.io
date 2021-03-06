var LossGraph;

LossGraph = (function() {

  LossGraph.baseHeight = 185;
  LossGraph.baseWidth = 400;

  LossGraph.margin = {
    top: 10,
    bottom: 0,
    right: 15,
    left: 30
  };

  LossGraph.height = LossGraph.baseHeight
    - LossGraph.margin.top
    - LossGraph.margin.bottom;

  LossGraph.width = LossGraph.baseWidth
    - LossGraph.margin.left
    - LossGraph.margin.right;

  function LossGraph(state, annotate) {
    this.state = state.toUpperCase();
    this.annotate = annotate;
    this.buildSVG();
  }

  LossGraph.prototype.buildSVG = function() {
    var self = this;
    var container = d3.select('#loss-graphs')
      .append('div')
      .attr('class', 'large-4 medium-6 columns')
      .append('div')
      .attr('class', 'callout');
    container.append('h5').text(titleCase(self.state));
    this.svg = container.append('svg')
      .attr('viewBox', [
        0,
        0,
        LossGraph.width + LossGraph.margin.left + LossGraph.margin.right,
        LossGraph.height + LossGraph.margin.top + LossGraph.margin.bottom
      ].join(' '))
      .append('g')
      .attr('transform', 'translate(' + LossGraph.margin.left + ',' + LossGraph.margin.top + ')');

    this.lineGraph = new LineGraph(
      this,
      this.svg.append('g'),
      this.state,
      this.annotate
    );

    this.pieGraph = new PieGraph(
      this,
      this.svg.append('g'),
      this.state
    );
  }

  return LossGraph;

})();