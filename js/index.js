var load = function () {

  LossGlance.data.forEach(function(d) {
    new LossGlance(d);
  });

  ['Colorado', 'Idaho', 'Montana', 'Oregon', 'Washington', 'Wyoming'].forEach(function(state, i) {
    new LossGraph(state, i == 0);
  });
  loadResources();
}