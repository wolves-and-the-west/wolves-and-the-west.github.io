var PopulationTable;

PopulationTable = (function() {

  function PopulationTable(populationDepredationData) {
    this.pD = populationData;
    this.buildTable();
  }

  PopulationTable.prototype.buildTable = function() {
    var table = d3.select('#population')
      .append('table')
      .attr('class', 'population-table');
    var thead = table.append('thead');
    var row = thead.append('tr');
    row.append('th');
    row.append('th')
      .attr('colspan', 5)
      .text('Populations');
    row.append('th')
      .attr('colspan', 6)
      .text('All Losses');
    row.append('th')
      .attr('colspan', 6)
      .text('Wolf Depredations');
    row = thead.append('tr')
      .attr('class', 'population-table-header');
    row.append('th').text('State');
    for (var i = 0; i < 3; i ++) {
      row.append('th')
        .attr('colspan', i == 0 ? 1 : 2)
        .text('Total');
      row.append('th')
        .attr('colspan', 2)
        .text('Cattle');
      row.append('th')
        .attr('colspan', 2)
        .text('Sheep');
    }
    var tbody = table.append('tbody');
    var state = tbody.selectAll('tr')
      .data(populationData)
      .enter()
      .append('tr');
    state.selectAll('td')
      .data(function(d) { return [
        d.state,
        formatNumber(d.total),
        formatNumber(d.cattle),
        '<span class="pct">' + formatPercent(d.cattlePct) + '</span>',
        formatNumber(d.sheep),
        '<span class="pct">' + formatPercent(d.sheepPct) + '</span>',
        formatNumber(d.loss.total),
        '<span class="pct">' + formatPercent(d.loss.totalPct) + '</span>',
        formatNumber(d.loss.cattle),
        '<span class="pct">' + formatPercent(d.loss.cattlePct) + '</span>',
        formatNumber(d.loss.sheep),
        '<span class="pct">' + formatPercent(d.loss.sheepPct) + '</span>',
        d.depredation.total == null ? NO_DATA : formatNumber(d.depredation.total),
        d.depredation.total == null ? '<span class="mdash">&mdash;</span>' : '<span class="pct">' + formatPercentLong(d.depredation.totalPct) + '</span>',
        d.depredation.cattle  == null ? NO_DATA : formatNumber(d.depredation.cattle),
        d.depredation.total == null ? '<span class="mdash">&mdash;</span>' : '<span class="pct">' + formatPercentLong(d.depredation.cattlePct) + '</span>',
        d.depredation.sheep  == null ? NO_DATA : formatNumber(d.depredation.sheep),
        d.depredation.total == null ? '<span class="mdash">&mdash;</span>' : '<span class="pct">' + formatPercentLong(d.depredation.sheepPct) + '</span>',
      ]})
      .enter()
      .append('td')
      .html(function(d) {
        return d;
      });
  }

  return PopulationTable;

})();