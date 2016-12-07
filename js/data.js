/*

Inventory
==========
Source: https://quickstats.nass.usda.gov
Saved search: https://quickstats.nass.usda.gov/results/AB0B9BFC-7A94-317C-8F1B-6DCAB7E59EFF
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
  10. Select "2011" under Year.
  11. Click Get Data.

*/
var inventoryDump = heredoc(function() {/*
"Program","Year","Period","Week Ending","Geo Level","State","State ANSI","Ag District","Ag District Code","County","County ANSI","Zip Code","Region","watershed_code","Watershed","Commodity","Data Item","Domain","Domain Category","Value","CV (%)"
"SURVEY","2011","FIRST OF JAN","","STATE","COLORADO","08","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","2,650,000",""
"SURVEY","2011","FIRST OF JAN","","STATE","COLORADO","08","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","370,000",""
"SURVEY","2011","FIRST OF JAN","","STATE","IDAHO","16","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","2,220,000",""
"SURVEY","2011","FIRST OF JAN","","STATE","IDAHO","16","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","235,000",""
"SURVEY","2011","FIRST OF JAN","","STATE","MONTANA","30","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","2,500,000",""
"SURVEY","2011","FIRST OF JAN","","STATE","MONTANA","30","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","230,000",""
"SURVEY","2011","FIRST OF JAN","","STATE","OREGON","41","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","1,340,000",""
"SURVEY","2011","FIRST OF JAN","","STATE","OREGON","41","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","215,000",""
"SURVEY","2011","FIRST OF JAN","","STATE","WASHINGTON","53","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","1,090,000",""
"SURVEY","2011","FIRST OF JAN","","STATE","WASHINGTON","53","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","56,000",""
"SURVEY","2011","FIRST OF JAN","","STATE","WYOMING","56","","","","","","","00000000","","CATTLE","CATTLE, INCL CALVES - INVENTORY","TOTAL","NOT SPECIFIED","1,300,000",""
"SURVEY","2011","FIRST OF JAN","","STATE","WYOMING","56","","","","","","","00000000","","SHEEP","SHEEP, INCL LAMBS - INVENTORY","TOTAL","NOT SPECIFIED","365,000",""
*/})
var inventoryData = prepCsvData(inventoryDump);

/*

Losses
======
Source: https://quickstats.nass.usda.gov
Saved search: https://quickstats.nass.usda.gov/results/56B0DEBE-BBE8-334F-A1B8-8F150E749934
Notes:
   1. Go to https://quickstats.nass.usda.gov.
   2. Select "ANIMALS & PRODUCTS" under Sector.
   3. Select "LIVESTOCK" under Group.
   4. Select "CATTLE" and "SHEEP" under Commodity.
   5. Select "LOSS, DEATH" under Category.
   6. Select "CATTLE, CALVES - LOSS, DEATH, MEASURED IN HEAD" and "SHEEP, LAMBS - LOSS, DEATH, MEASURED IN HEAD" under Data Item.
   7. Select "TOTAL" under Domain.
   8. Select "STATE" under Geographic Level.
   9. Choose states: COLORADO, IDAHO, MONTANA, OREGON, WASHINGTON, WYOMING.
  10. Select "2011" under Year.
  11. Click Get Data.

*/
var lossesDump = heredoc(function() {/*
"Program","Year","Period","Week Ending","Geo Level","State","State ANSI","Ag District","Ag District Code","County","County ANSI","Zip Code","Region","watershed_code","Watershed","Commodity","Data Item","Domain","Domain Category","Value","CV (%)"
"SURVEY","2011","YEAR","","STATE","COLORADO","08","","","","","","","00000000","","CATTLE","CATTLE, CALVES - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","50,000",""
"SURVEY","2011","YEAR","","STATE","COLORADO","08","","","","","","","00000000","","SHEEP","SHEEP, LAMBS - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","20,000",""
"SURVEY","2011","YEAR","","STATE","IDAHO","16","","","","","","","00000000","","CATTLE","CATTLE, CALVES - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","45,000",""
"SURVEY","2011","YEAR","","STATE","IDAHO","16","","","","","","","00000000","","SHEEP","SHEEP, LAMBS - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","13,000",""
"SURVEY","2011","YEAR","","STATE","MONTANA","30","","","","","","","00000000","","CATTLE","CATTLE, CALVES - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","62,000",""
"SURVEY","2011","YEAR","","STATE","MONTANA","30","","","","","","","00000000","","SHEEP","SHEEP, LAMBS - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","16,000",""
"SURVEY","2011","YEAR","","STATE","OREGON","41","","","","","","","00000000","","CATTLE","CATTLE, CALVES - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","45,000",""
"SURVEY","2011","YEAR","","STATE","OREGON","41","","","","","","","00000000","","SHEEP","SHEEP, LAMBS - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","7,000",""
"SURVEY","2011","YEAR","","STATE","WASHINGTON","53","","","","","","","00000000","","CATTLE","CATTLE, CALVES - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","23,000",""
"SURVEY","2011","YEAR","","STATE","WASHINGTON","53","","","","","","","00000000","","SHEEP","SHEEP, LAMBS - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","2,000",""
"SURVEY","2011","YEAR","","STATE","WYOMING","56","","","","","","","00000000","","CATTLE","CATTLE, CALVES - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","31,000",""
"SURVEY","2011","YEAR","","STATE","WYOMING","56","","","","","","","00000000","","SHEEP","SHEEP, LAMBS - LOSS, DEATH, MEASURED IN HEAD","TOTAL","NOT SPECIFIED","13,000",""
*/})
var lossesData = prepCsvData(lossesDump);

/*

Confirmed Depredations
======================
Source: https://www.fws.gov/mountain-prairie/es/species/mammals/wolf/2016/FINAL_NRM%20summary%20-%202015.pdf
Notes:
  FWS data is preferred as wolf depredations are confirmed (unlike USDA).

*/
var confirmedDepredationData = {
  year: 2011,
  data: [
    {
      state: 'Colorado',
      cattle: null,
      sheep: null
    },
    {
      state: 'Idaho',
      cattle: 90,
      sheep: 147
    },
    {
      state: 'Montana',
      cattle: 96, // 74 kills, 22 injured.
      sheep: 11
    },
    {
      state: 'Oregon',
      cattle: 13,
      sheep: null // Cannot find in report.
    },
    {
      state: 'Washington',
      cattle: 0,
      sheep: 0
    },
    {
      state: 'Wyoming',
      cattle: 38, // 28 calves, 7 cows; injured 3 calves.
      sheep: 30
    }
  ]
}
confirmedDepredationData.data.forEach(function(d) {
  d.total = addIfNotNull(d.cattle, d.sheep);
});

/*

Unconfirmed Depredations
========================
Source: https://usda.mannlib.cornell.edu/MannUsda/viewDocumentInfo.do?documentID=1625
Notes:
  This data is not preferred since wolf depredations are not confirmed.
  However, it is included to round out the picture. After all, not all
  killed livestock may be found.

*/
var cattleAndCalvesLossesDump = heredoc(function() { /*
Colorado ...........:     55,000         55,000           800          4,300          54,200         50,700
Idaho ..............:     42,000         51,000         1,900          4,200          40,100         46,800
Montana ............:     23,000         57,000         1,000          4,200          22,000         52,800
Oregon .............:     20,000         35,000           600          3,200          19,400         31,800
Washington .........:     20,000         19,000           200          1,500          19,800         17,500
Wyoming ............:     11,000         30,000           400          3,500          10,600         26,500
*/});
var cattlePercentPredatorLossesDump = heredoc(function () { /*
Colorado ...........:   17.7         4.0         0.8         -         -      21.4       47.6          8.5
Idaho ..............:    3.9         1.5         0.5         -      30.0       0.4        3.2         60.5
Montana ............:    4.8           -           -         -      44.0       6.5        3.7         41.0
Oregon .............:   63.6        13.3           -         -         -       7.3          -         15.8
Washington .........:   80.7         7.5           -         -         -         -          -         11.8
Wyoming ............:   19.8        11.9         1.0         -      18.6      15.7          -         33.0
*/});
var calfPercentPredatorLossesDump = heredoc(function () { /*
Colorado ...........:   82.2         6.3         1.0         -         -       7.8        0.3         2.4
Idaho ..............:   26.9         4.3         3.3       0.3      47.4       0.7        3.0        14.1
Montana ............:   46.9         5.2           -         -      20.3       2.3        1.6        23.7
Oregon .............:   70.0         8.7         0.5         -       7.7       1.0        8.7         3.4
Washington .........:   77.3         3.4           -         -       2.4       3.3          -        13.6
Wyoming ............:   46.5        11.5         1.7         -      14.6       7.7        3.3        14.7
*/});

var parsedCattleAndCalvesLosses = parseUSDA(cattleAndCalvesLossesDump);
var parsedCattlePercentPredatorLosses = parseUSDA(cattlePercentPredatorLossesDump);
var parsedCalfPercentPredatorLosses = parseUSDA(calfPercentPredatorLossesDump);

var unconfirmedDepredationData = [];

parsedCattleAndCalvesLosses.forEach(function(line) {
  var state = line[0];

  var stateInventoryData = inventoryData.filter(function(d) {
    return d.state == state;
  })[0];

  var percentCattleLoss = getUSDAWolfLossPercent(
    state,
    parsedCattlePercentPredatorLosses
  );
  var percentCalvesLoss = getUSDAWolfLossPercent(
    state,
    parsedCalfPercentPredatorLosses
  );
  var cattle = {
    all: +line[3],
    percentWolfDepredations: percentCattleLoss,
    wolfDepredations:
      percentCattleLoss != null ?
        Math.ceil(line[3] * percentCattleLoss) :
        null,
  };
  cattle.percentWolfDepredationsOfInventory = 
    cattle.wolfDepredations != null ?
      cattle.wolfDepredations / stateInventoryData.total :
      null;
  var calves = {
    all: +line[4],
    percentWolfDepredations: percentCalvesLoss,
    wolfDepredations:
      percentCalvesLoss != null ?
        Math.ceil(line[4] * percentCalvesLoss) :
        null,
  };
  var all = {
    all: cattle.all + calves.all,
    percentWolfDepredations: addIfNotNull(cattle.percentWolfDepredations, calves.percentWolfDepredations),
    wolfDepredations: addIfNotNull(cattle.wolfDepredations, calves.wolfDepredations)
  };
  all.percentWolfDepredationsOfInventory = 
    all.wolfDepredations != null ?
      all.wolfDepredations / stateInventoryData.total :
      null;
  unconfirmedDepredationData.push(
    {
      state: state,
      cattle: cattle,
      cavles: calves,
      all: all
    }
  )
});

// Combined.
var data = [];
inventoryData.forEach(function(pd) {
  
  var inventoryTotal = pd.total;
  var cd = confirmedDepredationData
    .data.filter(function(d) {
      return d.state == pd.state;
    })[0];
  var ud = unconfirmedDepredationData.filter(function(d) {
    return d.state == pd.state;
  })[0];
  var ld = lossesData.filter(function(d) {
    return d.state == pd.state;
  })[0];

  data.push({
    state: pd.state,
    inventory: {
      cattle: pd.cattle,
      sheep: pd.sheep,
      total: pd.cattle + pd.sheep,
      cattlePct: pd.cattle / inventoryTotal,
      sheepPct: pd.sheep / inventoryTotal,
      totalPct: 1
    },
    confirmedDepredation: {
      cattle: cd.cattle,
      sheep: cd.sheep,
      total: addIfNotNull(cd.cattle, cd.sheep),
      cattlePct: cd.cattle / inventoryTotal,
      sheepPct: cd.sheep / inventoryTotal,
      totalPct: cd.total / inventoryTotal,
    },
    unconfirmedDepredation: ud,
    loss: {
      cattle: ld.cattle,
      sheep: ld.sheep,
      total: ld.cattle + ld.sheep,
      cattlePct: ld.cattle / inventoryTotal,
      sheepPct: ld.sheep / inventoryTotal,
      totalPct: ld.total / inventoryTotal,
    }
  });
});

console.log(data);