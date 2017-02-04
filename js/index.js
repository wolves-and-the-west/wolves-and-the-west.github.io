var load = function () {
  ['Colorado', 'Idaho', 'Montana', 'Oregon', 'Washington', 'Wyoming'].forEach(function(state, i) {
    new LineGraph(state, i == 0);
  });
  loadResources();
}