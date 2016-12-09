var PopulationTable;

PopulationTable = (function() {

  function PopulationTable(data) {
    this.data = data;
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
      .text('Inventory');
    row.append('th')
      .attr('colspan', 6)
      .text('All Losses');
    row.append('th')
      .attr('colspan', 6)
      .text('Confirmed Wolf Depredations');
    row.append('th')
      .attr('colspan', 6)
      .text('Unconfirmed Wolf Depredations');
    row = thead.append('tr')
      .attr('class', 'population-table-header');
    row.append('th').text('State');
    for (var i = 0; i < 4; i ++) {
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
      .data(this.data)
      .enter()
      .append('tr');
    state.selectAll('td')
      .data(function(d) { return [
        d.state,
        formatNumber(d.inventory.total),
        formatNumber(d.inventory.cattle),
        '<span class="pct">' + formatPercent(d.inventory.cattlePct) + '</span>',
        formatNumber(d.inventory.sheep),
        '<span class="pct">' + formatPercent(d.inventory.sheepPct) + '</span>',
        formatNumber(d.loss.total),
        '<span class="pct">' + formatPercent(d.loss.totalPct) + '</span>',
        formatNumber(d.loss.cattle),
        '<span class="pct">' + formatPercent(d.loss.cattlePct) + '</span>',
        formatNumber(d.loss.sheep),
        '<span class="pct">' + formatPercent(d.loss.sheepPct) + '</span>',
        d.confirmedDepredation.total == null ? NO_DATA : formatNumber(d.confirmedDepredation.total),
        d.confirmedDepredation.total == null ? NO_DATA : '<span class="pct">' + formatPercentLong(d.confirmedDepredation.totalPct) + '</span>',
        d.confirmedDepredation.cattle  == null ? NO_DATA : formatNumber(d.confirmedDepredation.cattle),
        d.confirmedDepredation.total == null ? NO_DATA : '<span class="pct">' + formatPercentLong(d.confirmedDepredation.cattlePct) + '</span>',
        d.confirmedDepredation.sheep  == null ? NO_DATA : formatNumber(d.confirmedDepredation.sheep),
        d.confirmedDepredation.total == null ? NO_DATA : '<span class="pct">' + formatPercentLong(d.confirmedDepredation.sheepPct) + '</span>',
        NO_DATA,
        NO_DATA,
        d.unconfirmedDepredation.all.wolfDepredations  == null ? NO_DATA : formatNumber(d.unconfirmedDepredation.all.wolfDepredations),
        d.unconfirmedDepredation.all.percentWolfDepredationsOfInventory == null ? NO_DATA : '<span class="pct">' + formatPercentLong(d.unconfirmedDepredation.all.percentWolfDepredationsOfInventory) + '</span>',
        NO_DATA,
        NO_DATA
      ]})
      .enter()
      .append('td')
      .html(function(d) {
        return d;
      });
  }

  return PopulationTable;

})();