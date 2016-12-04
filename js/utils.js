var formatNumber = d3.format(',');
var formatPercent = d3.format('.4%');
var titleCase = function(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}
var heredoc = function(f) {
  return f.toString( ).match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
}