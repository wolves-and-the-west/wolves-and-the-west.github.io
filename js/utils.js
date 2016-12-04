var formatNumber = d3.format(',');
var formatPercent = d3.format('.1%');
var formatPercentLong = d3.format('.4%');

var titleCase = function(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

var heredoc = function(f) {
  return f.toString( ).match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
}

var prepCsvData = function(csv) {
  var stateGrouped = d3.nest()
    .key(function(d) { return d.State })
    .entries(d3.csvParse(csv));

  stateGrouped.forEach(function(state) {
    state.state = titleCase(state.key);
    delete state.key;
    state.values.forEach(function(v) {
      state[v.Commodity.toLowerCase()] = parseInt(v.Value.replace(/,/g, ''));
    });
    delete state.values;
  });

  return stateGrouped;
}