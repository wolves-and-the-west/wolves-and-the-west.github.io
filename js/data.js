/*

Population
==========
Source: https://quickstats.nass.usda.gov
Notes:
  How to gather cattle data:
   1. Go to https://quickstats.nass.usda.gov.
   2. Select "ANIMALS & PRODUCTS" under Sector.
   3. Select "LIVESTOCK" under Group.
   4. Select "CATTLE" under Commodity.
   5. Select "INVENTORY" under Category.
   6. Select "CATTLE, CALVES - INVENTORY" under Data Item.
   7. Select "TOTAL" under Domain.
   8. Select "STATE" under Geographic Level.
   9. Choose states: IDAHO, MONTANA, WYOMING, OREGON, WASHINGTON.
  10. Select "2015" under Year.
  11. Click Get Data.
  
  For sheep, repeat the above with these changes:
   4. Select "SHEEP" under Commodity.
   6. Select "SHEEP, INCL LAMBS - INVENTORY" under Data Item.

*/
var populationData = {
  year: 2015,
  data: [
    {
      state: 'ID',
      cattle: 310000,
      sheep: 260000
    },
    {
      state: 'MT',
      cattle: 75000,
      sheep: 215000
    },
    {
      state: 'OR',
      cattle: 170000,
      sheep: 195000
    },
    {
      state: 'WA',
      cattle: 157000,
      sheep: 52000
    },
    {
      state: 'WY',
      cattle: 85000,
      sheep: 345000
    },
  ]
}
populationData.data.forEach(function(d) {
  d.total = d.cattle + d.sheep;
});

/*

Depredation
===========
Source: https://www.fws.gov/mountain-prairie/es/species/mammals/wolf/2016/FINAL_NRM%20summary%20-%202015.pdf
Notes:
  FWS data is preferred as wolf depredations are confirmed (unlike USDA).

*/
var depredationData = {
  year: 2015,
  data: [
    {
      state: 'ID',
      cattle: 35,
      sheep: 125
    },
    {
      state: 'MT',
      cattle: 41,
      sheep: 21
    },
    {
      state: 'OR',
      cattle: 3,
      sheep: 10
    },
    {
      state: 'WA',
      cattle: 7,
      sheep: 0
    },
    {
      state: 'WY',
      cattle: 72,
      sheep: 62
    }
  ]
}

// Combined.
populationDepredationData = _.clone(populationData);
populationDepredationData.data.forEach(function(pd) {
  var dd = pd.depredation = depredationData.data.filter(function(d) {
    return d.state == pd.state;
  })[0];
  dd.total = dd.cattle + dd.sheep;
});

console.log(populationDepredationData);