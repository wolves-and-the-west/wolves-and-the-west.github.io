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
  var grouped = d3.nest()
    .key(function(d) { return d.State })
    .entries(d3.csvParse(csv));

  grouped.forEach(function(state) {
    state.state = titleCase(state.key);
    state.total = 0;
    delete state.key;
    state.values.forEach(function(v) {
      var value = parseInt(v.Value.replace(/,/g, ''));
      state[v.Commodity.toLowerCase()] = value;
      state.total += value;
    });
    delete state.values;
  });

  return grouped;
}

var parseUSDA = function(data) {
  var out = [];
  var lines = data.split("\n");
  lines.forEach(function(line) {
    var cols = line.split(/\s+\.+:\s+|\s+/);
    cols = cols.map(function(d) {
      return d.replace(/,/g, '');
    });
    out.push(cols);
  });
  return out;
}

var getUSDAWolfLossPercent = function(state, data) {
  var pct = data.filter(function(d) {
    return state == d[0];
  })[0][5];
  return pct == '-' ? null : +pct / 100;
}

var addIfNotNull = function(a, b) {
  return (a != null && b != null) ?
    a + b :
    null;
}