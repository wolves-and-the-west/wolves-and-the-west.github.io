var LossGlance;

LossGlance = (function() {

  LossGlance.data = [
    {
      year: 1995,
      source: {
        text: 'Cattle Predator Loss, 05.17.1996',
        url: 'http://usda.mannlib.cornell.edu/usda/nass/CattPredLo//1990s/1996/CattPredLo-05-17-1996.txt',
      },
      data: [
        {
          type: 'Predators',
          percent: 0.027
        },
        {
          type: 'Coyotes',
          percent: 0.016
        },
        {
          type: 'Wolves',
          percent: 0.001,
        },
        {
          type: 'Dogs',
          percent: 0.005,
        },
        {
          type: 'Non-predators',
          percent: 0.973,
        },
        {
          type: 'Weather',
          percent: 0.095
        }
      ]
    },
    {
      year: 2005,
      source: {
        text: 'Cattle Death Loss, 05.05.2006',
        url: 'http://usda.mannlib.cornell.edu/usda/nass/CattDeath//2000s/2006/CattDeath-05-05-2006.txt'
      },
      data: [
        {
          type: 'Predators',
          percent: 0.047
        },
        {
          type: 'Coyotes',
          percent: 0.047 * 0.511,
        },
        {
          type: 'Wolves',
          percent: 0.047 * 0.023,
        },
        {
          type: 'Dogs',
          percent: 0.047 * 0.115
        },
        {
          type: 'Weather',
          percent: 0.953 * 0.071
        },
        {
          type: 'Non-predators',
          percent: 0.953
        }
      ]
    },
    {
      year: 2010,
      source: {
        text: 'Cattle Death Loss, 05.12.2011',
        url: 'http://usda.mannlib.cornell.edu/usda/nass/CattDeath//2010s/2011/CattDeath-05-12-2011.txt'
      },
      data: [
        {
          type: 'Predators',
          percent: 0.043
        },
        {
          type: 'Coyotes',
          percent: 0.043 * 0.531
        },
        {
          type: 'Wolves',
          percent: 0.043 * 0.037
        },
        {
          type: 'Weather',
          percent: 0.945 * 0.13
        },
        {
          type: 'Dogs',
          percent: 0.043 * 0.099
        },
        {
          type: 'Non-predators',
          percent: 0.945
        }
      ]
    }
  ];

  function LossGlance(data) {
    this.data = data;
    this.data.data.sort(function(a, b) { return d3.descending(b.percent, a.percent); });
    
    this.height = this.data.data.length * 20;
    this.width = 450;

    this.buildScales();
    this.buildSVG();
  }


  LossGlance.prototype.buildScales = function() {
    this.x = d3.scaleLinear()
      .range([0, this.width])
      .domain([0, 1]);
    this.y = d3.scaleBand()
      .range([this.height, 0])
      .domain(this.data.data.map(function(d) { return d.type }))
      .padding(0.2);
  }

  LossGlance.prototype.buildSVG = function() {
    var self = this;

    var section = d3.select('.loss-glance')
      .append('div')
      .attr('class', 'large-4 medium-6 columns')
      .append('section')
      .attr('class', 'callout')
      
    section.append('h1')
      .attr('class', 'loss-year')
      .text(this.data.year);
      
    this.svg = section.append('svg')
      .attr('viewBox', [
        0,
        0,
        this.width,
        this.height
      ].join(' '))
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .append('g');

    var g = this.svg.append('g');

    g.selectAll('.bar')
      .data(this.data.data)
      .enter()
      .append('rect')
      .attr('class', 'loss-glance-bar')
      .attr('x', 115)
      .attr('height', self.y.bandwidth())
      .attr('y', function(d) { return self.y(d.type) })
      .attr('width', function(d) { return self.x(d.percent) });

    g.selectAll('.label')
      .data(this.data.data)
      .enter()
      .append('text')
      .attr('class', function(d) {
        var classes = ['loss-glance-label'];
        if (d.type == 'Wolves') {
          classes.push('loss-glance-label-wolves');
        }
        return classes.join(' ');
      })
      .attr('x', 0)
      .attr('y', function(d) { return self.y(d.type) + 12 })
      .text(function(d) { return d.type });

    var p = section.append('p')
      .attr('class', 'loss-source');

    p.append('span').text('Source: ')
    p.append('a')
      .attr('href', this.data.source.url)
      .attr('target', '_blank')
      .text(this.data.source.text);
  }

  return LossGlance;

})();