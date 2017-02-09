var load = function () {
  ['Colorado', 'Idaho', 'Montana', 'Oregon', 'Washington', 'Wyoming'].forEach(function(state, i) {
    new LossGraph(state, i == 0);
  });
  loadResources();
}