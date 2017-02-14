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
          type: 'percentages',
          data: [
            {
              type: 'Predators',
              value: 0.027
            },
            {
              type: 'Coyotes',
              value: 0.016
            },
            {
              type: 'Wolves',
              value: 0.001,
            },
            {
              type: 'Dogs',
              value: 0.005,
            },
            {
              type: 'Non-predators',
              value: 0.973,
            },
            {
              type: 'Weather',
              value: 0.095
            }
          ]
        },
        {
          type: 'dollars',
          data: [
            {
              type: 'All losses',
              value: numbro().unformat('1.801402b')
            },
            {
              type: 'Predators',
              value: numbro().unformat('39.562m')
            },
            {
              type: 'Non-predators',
              value: numbro().unformat('1.761839b')
            }
          ]
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
          type: 'percentages',
          data: [
            {
              type: 'Predators',
              value: 0.047
            },
            {
              type: 'Coyotes',
              value: 0.047 * 0.511,
            },
            {
              type: 'Wolves',
              value: 0.047 * 0.023,
            },
            {
              type: 'Dogs',
              value: 0.047 * 0.115
            },
            {
              type: 'Weather',
              value: 0.953 * 0.071
            },
            {
              type: 'Non-predators',
              value: 0.953
            }
          ]
        },
        {
          type: 'dollars',
          data: [
            {
              type: 'Predators',
              value: numbro().unformat('92.674m')
            },
            {
              type: 'Non-predators',
              value: numbro().unformat('2.498575b')
            },
            {
              type: 'All losses',
              value: numbro().unformat('2.591249b')
            }
          ]
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
          type: 'percentages',
          data: [
            {
              type: 'Predators',
              value: 0.055
            },
            {
              type: 'Coyotes',
              value: 0.055 * 0.531
            },
            {
              type: 'Wolves',
              value: 0.055 * 0.037
            },
            {
              type: 'Weather',
              value: 0.945 * 0.13
            },
            {
              type: 'Dogs',
              value: 0.055 * 0.099
            },
            {
              type: 'Non-predators',
              value: 0.945
            }
          ]
        },
        {
          type: 'dollars',
          data: [
            {
              type: 'Predators',
              value: numbro().unformat('98.475m')
            },
            {
              type: 'Non-predators',
              value: numbro().unformat('2.352899b')
            },
            {
              type: 'All losses',
              value: numbro().unformat('2.451374b')
            }
          ]
        }
      ]
    }
  ];

  function LossGlance(data) {
    var self = this;
    this.data = data;

    this.section = d3.select('.loss-glance')
      .append('div')
      .attr('class', 'large-4 medium-6 columns')
      .append('section')
      .attr('class', 'callout')

    this.section.append('h4')
      .attr('class', 'loss-year')
      .text(this.data.year);

    this.data.data.forEach(function(d) {
      new LossGlanceGraph(self.section, d);
    });

    var p = this.section.append('p')
      .attr('class', 'loss-source');

    p.append('span').text('Source: ')
    p.append('a')
      .attr('href', this.data.source.url)
      .attr('target', '_blank')
      .text(this.data.source.text);
  }

  return LossGlance;

})();