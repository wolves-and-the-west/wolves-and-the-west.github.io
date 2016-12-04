/*

Population
==========
Source: https://quickstats.nass.usda.gov
Saved search: https://quickstats.nass.usda.gov/results/6F3D99B7-B093-3DF0-9CF2-6C4BEBDF4D2B
Notes:
   1. Go to https://quickstats.nass.usda.gov.
   2. Select "ANIMALS & PRODUCTS" under Sector.
   3. Select "LIVESTOCK" under Group.
   4. Select "CATTLE" and "SHEEP" under Commodity.
   5. Select "INVENTORY" under Category.
   6. Select "CATTLE, INCL CALVES - INVENTORY" and "SHEEP, INCL LAMBS - INVENTORY" under Data Item.
   7. Select "TOTAL" under Domain.
   8. Select "STATE" under Geographic Level.
   9. Choose states: COLORADO, IDAHO, MONTANA, OREGON, WASHINGTON, WYOMING.
  10. Select "2015" under Year.
  11. Click Get Data.

*/
var populationDump = heredoc(function() {/*
"Program","Year","Period","Week Ending","Geo Level","State","State ANSI","Ag District","Ag District Code","County","County ANSI","Zip Code","Region","watershed_code","Watershed","Commodity","Data Item","Domain","Domain Category","Value","CV (%)"
"SURVEY","2015","FIRST OF JAN","","STATE","COLORADO","08","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","2,550,000",""
"SURVEY","2015","FIRST OF JAN","","STATE","COLORADO","08","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","420,000",""
"SURVEY","2015","FIRST OF JAN","","STATE","IDAHO","16","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","2,280,000",""
"SURVEY","2015","FIRST OF JAN","","STATE","IDAHO","16","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","260,000",""
"SURVEY","2015","FIRST OF JAN","","STATE","MONTANA","30","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","2,500,000",""
"SURVEY","2015","FIRST OF JAN","","STATE","MONTANA","30","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","215,000",""
"SURVEY","2015","FIRST OF JAN","","STATE","OREGON","41","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","1,300,000",""
"SURVEY","2015","FIRST OF JAN","","STATE","OREGON","41","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","195,000",""
"SURVEY","2015","FIRST OF JAN","","STATE","WASHINGTON","53","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","1,150,000",""
"SURVEY","2015","FIRST OF JAN","","STATE","WASHINGTON","53","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","52,000",""
"SURVEY","2015","FIRST OF JAN","","STATE","WYOMING","56","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","1,300,000",""
"SURVEY","2015","FIRST OF JAN","","STATE","WYOMING","56","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","345,000",""
*/})
var parsedPopulationData = d3.csvParse(populationDump);

var stateGrouped = d3.nest()
  .key(function(d) { return d.State })
  .entries(parsedPopulationData);

var populationData = stateGrouped;
populationData.forEach(function(state) {
  state.state = titleCase(state.key);
  delete state.key;
  state.values.forEach(function(v) {
    state[v.Commodity.toLowerCase()] = parseInt(v.Value.replace(/,/g, ''));
  });
  delete state.values;
});

populationData.forEach(function(d) {
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
      state: 'Colorado',
      cattle: null,
      sheep: null
    },
    {
      state: 'Idaho',
      cattle: 35,
      sheep: 125
    },
    {
      state: 'Montana',
      cattle: 41,
      sheep: 21
    },
    {
      state: 'Oregon',
      cattle: 3,
      sheep: 10
    },
    {
      state: 'Washington',
      cattle: 7,
      sheep: 0
    },
    {
      state: 'Wyoming',
      cattle: 72,
      sheep: 62
    }
  ]
}

// Combined.
populationDepredationData = _.clone(populationData);
populationDepredationData.forEach(function(pd) {
  var dd = pd.depredation = depredationData.data.filter(function(d) {
    return d.state == pd.state;
  })[0];
  dd.total = dd.cattle + dd.sheep;
  delete dd.state;
});

console.log(populationDepredationData);