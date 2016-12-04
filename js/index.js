var formatNumber = d3.format(',');
var formatPercent = d3.format('.3%');
var titleCase = function(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

var load = function () {
  new Population(populationData);
}