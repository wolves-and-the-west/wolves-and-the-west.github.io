var resources = [
  {
    url: 'http://www.wolfeducation.org',
    title: 'Colorado Wolf and Wildlife Center'
  },
  {
    url: 'https://www.rockymountainwolfproject.org',
    title: 'Rocky Mountain Wolf Project'
  },
  {
    url: 'http://www.sierraclub.org/rocky-mountain-chapter/wolves',
    title: 'Sierra Club: Wolves'
  }
];

var loadResources = function() {
  var ol = d3.select('#resources').append('ol');
  ol.selectAll('li')
    .data(resources)
    .enter()
    .append('li')
      .append('a')
      .attr('target', '_blank')
      .attr('href', function(d) { return d.url })
      .text(function(d) { return d.title });
}