var NO_DATA = 'N/A';
var load = function () {
  // new Population(data);
  // new PopulationTable(data);
  ['Colorado', 'Idaho', 'Montana', 'Oregon', 'Washington', 'Wyoming'].forEach(function(state, i) {
    new LineGraph(state, i == 0);
  });
}