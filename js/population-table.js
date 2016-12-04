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
      .attr('colspan', 3)
      .text('Populations');
    row.append('th')
      .attr('colspan', 3)
      .text('All Losses');
    row.append('th')
      .attr('colspan', 3)
      .text('Wolf Depredations');
    row = thead.append('tr')
      .attr('class', 'population-table-header');
    row.append('th').text('State');
    for (var i = 0; i < 3; i ++) {
      row.append('th').text('Total');
      row.append('th').text('Cattle');
      row.append('th').text('Sheep');
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
        formatNumber(d.sheep),
        formatNumber(d.loss.total) + '<span class="pct">' + formatPercent(d.loss.totalPct) + '</span>',
        formatNumber(d.loss.cattle) + '<span class="pct">' + formatPercent(d.loss.cattlePct) + '</span>',
        formatNumber(d.loss.sheep) + '<span class="pct">' + formatPercent(d.loss.sheepPct) + '</span>',
        d.depredation.total == null ? 'No Data' : formatNumber(d.depredation.total) + '<span class="pct">' + formatPercentLong(d.depredation.totalPct) + '</span>',
        d.depredation.cattle  == null ? 'No Data' : formatNumber(d.depredation.cattle) + '<span class="pct">' + formatPercentLong(d.depredation.cattlePct) + '</span>',
        d.depredation.sheep  == null ? 'No Data' : formatNumber(d.depredation.sheep)  + '<span class="pct">' + formatPercentLong(d.depredation.sheepPct) + '</span>',
      ]})
      .enter()
      .append('td')
      .html(function(d) {
        return d;
      });
  }

  return PopulationTable;

})();