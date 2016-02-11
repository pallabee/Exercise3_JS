//File Read
var fs = require('fs');
var inputFile = '../data/Production-Department_of_Agriculture_and_Cooperation_1.csv';

fs.readFile(inputFile, "utf-8", function(err, data) {
  if (err) {
    return console.log(err);
  }
  // Split each line based on newline character
  var lines = data.split("\n");

  //Storing column headers in an array
  var headers = lines[0].trim().split(",");

  //Lookup for Year (1993-2014)
  var yearLookup = [];
  for (var h = 3, hlen = headers.length; h < hlen; h++) {
    var yrObj = new Object();
    yrObj.year = headers[h].trim();
    yearLookup.push(yrObj);
  }

  //Lookup for States
  var stateLookup = [{
    "region": "South",
    "state": "Agricultural Production Foodgrains Rice Yield Karnataka"
  }, {
    "region": "South",
    "state": "Agricultural Production Foodgrains Rice Yield Andhra Pradesh"
  }, {
    "region": "South",
    "state": "Agricultural Production Foodgrains Rice Yield Kerala"
  }, {
    "region": "South",
    "state": "Agricultural Production Foodgrains Rice Yield Tamil Nadu"
  },
  {
    "region": "North",
    "state": "Agricultural Production Foodgrains Rice Yield Haryana"
  }];
  //Declare Object array here for final json
  var oilseedsRows=[],foodgrainRows=[],stackedChartData = [],aggregatedData = [];

  //Looping thorough header elements
  for (var h = 0, hlen = headers.length; h < hlen; h++) {

    //Check if header of current cell is a year
    var hstr = headers[h];
    var yresult = searchYearLookup(headers[h], yearLookup);
    //console.log(yresult);
    if(typeof yresult !== 'undefined')
    {
      //Create new Object for stacked,aggregated data;
      var stackObj = new Object();
      var aggrObj = new Object();

      var agg=0;
      //Looping through all lines for each year
      for (var l = 1, llen = lines.length; l < llen; l++) {
        //Check if line is not empty string
        if (lines[l]) {
          //Remove bad data
          var linestr = lines[l].trim().replace(", ", " ");
          //Loading each line into an array
          var currentline = linestr.split(",");
          //Filtering Oilseeds and Foodgrains data for the year 2013 - Problem 2a,2b
          if(yresult=="3-2013"){
            if(currentline[23]!== "NA"){
                if (currentline[0].indexOf("Oilseeds") > -1) {
                  var orow = new Object();

                  orow.x = currentline[0];
                  orow.y = parseFloat(currentline[23]);
                  oilseedsRows.push(orow);
                }
                if (currentline[0].indexOf("Foodgrains") > -1) {
                if ((currentline[0].indexOf("Total") === -1) && (currentline[0].indexOf("Volume") === -1) && (currentline[0].indexOf("Area") === -1)  && (currentline[0].indexOf("Coarse") === -1)) {
                  
                    var frow = new Object();

                    frow.x = currentline[0];
                    frow.y = parseFloat(currentline[23]);
                    foodgrainRows.push(frow);
                //  }
                }
              }
            }
          }
          //Check if prod yield for current year is not NA
          if (currentline[h] !== "NA") {
            //find if prod yield for is southern State.
            var region = searchLookup(currentline[0], stateLookup);
            if (region === "South") {
              stackObj.Year = yresult;
              stackObj[currentline[0]] = currentline[h];
            }
              //Aggregate all Commercial Crops for a year - Problem 3
              if (currentline[0].indexOf("Commercial") > -1) {
                aggrObj.x = yresult;
                agg +=parseFloat(currentline[h]);
                aggrObj.y=agg.toFixed(2);
              }
          }

        }
      }

      var isStackObjEmpty = isEmpty(stackObj);
      if(!isStackObjEmpty){
          stackedChartData.push(stackObj);
      }
      var isAggrObjEmpty = isEmpty(aggrObj);
      if(!isAggrObjEmpty){
          aggregatedData.push(aggrObj);
      }
    }
  }
  //Sorting data in descending order of 'Oilseeds' production
  oilseedsRows.sort(function(a, b) {
    return b.y - a.y;
  });
  //Sorting data in descending order of 'Foodgrains' production
  foodgrainRows.sort(function(a, b) {
    return b.y - a.y;
  });

  //Writing to JSON file
  writetoFile('../data/oilseedsVsProd.json',JSON.stringify(oilseedsRows)); //Problem 2a
  writetoFile('../data/foodgrainsVsProd.json',JSON.stringify(foodgrainRows));//Problem 2b
  writetoFile('../data/aggregatedData.json',JSON.stringify(aggregatedData));//Problem 3
  writetoFile('../data/stackedChartData.json',JSON.stringify(stackedChartData));//Problem 4


  function writetoFile(path, jsonResult) {

    fs.writeFile(path, jsonResult, function(err) {
      if (err) {
        console.log('There has been an error saving your json data.');
        console.log(err.message);
        return;
      }
      console.log('JSON saved successfully.');
    });
  }
  });
//Check if Object is Empty
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}
//Searching Lookup to find year match
function searchYearLookup(year, yearArray) {
  for (var i = 0; i < yearArray.length; i++) {
    if (yearArray[i].year === year.trim()) {
      return yearArray[i].year;
    }
  }
}

//Searching Lookup,if the given State is a southern State
function searchLookup(stateName, stateArray) {
  for (var i = 0; i < stateArray.length; i++) {
    if (stateArray[i].state === stateName) {
      return stateArray[i].region;
    }
  }
}
