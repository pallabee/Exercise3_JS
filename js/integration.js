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
  var yearLookup = [{
    "year": "3-1993"
  }, {
    "year": "3-1994"
  }, {
    "year": "3-1995"
  }, {
    "year": "3-1996"
  }, {
    "year": "3-1997"
  }, {
    "year": "3-1998"
  }, {
    "year": "3-1999"
  }, {
    "year": "3-2000"
  }, {
    "year": "3-2001"
  }, {
    "year": "3-2002"
  }, {
    "year": "3-2003"
  }, {
    "year": "3-2004"
  }, {
    "year": "3-2005"
  }, {
    "year": "3-2006"
  }, {
    "year": "3-2007"
  }, {
    "year": "3-2008"
  }, {
    "year": "3-2009"
  }, {
    "year": "3-2010"
  }, {
    "year": "3-2011"
  }, {
    "year": "3-2012"
  }, {
    "year": "3-2013"
  }, {
    "year": "3-2014"
  }];
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
  var stackedChartData = [],aggregatedData = [];

  //Looping thorough header elements
  for (var h = 0, hlen = headers.length; h < hlen; h++) {
    //Fetching the column index of Cropname Column
    if (headers[h].indexOf("Particulars") > -1) {
      cropTypeIndex = h;
    }

    //Check if header of current cell is a year
    var hstr = headers[h];
    var yresult = searchYearLookup(headers[h], yearLookup);
    //console.log(yresult);
    if(typeof yresult !== 'undefined')
    {
        //Create new Object if header element is in year lookup array
      var stackObj = new Object();
      var aggrObj = new Object();

      var agg=0;
      //Looping through all lines for each year
      for (var l = 1, llen = lines.length; l < llen; l++) {
        //Check if line is not empty string
        if (lines[l]) {
          //Remove bad datas
          var linestr = lines[l].trim().replace(", ", " ");
          //Loading each line into an array
          var currentline = linestr.split(",");
          //Check if prod yield for current year is not NA
          if (currentline[h] !== "NA") {
            //find if prod yield for is southern State.
            var region = searchLookup(currentline[cropTypeIndex], stateLookup);
            if (region === "South") {
              stackObj.Year = yresult;
              stackObj[currentline[cropTypeIndex]] = currentline[h];
            }
              //Aggregate all Commercial Crops for a year - Problem 3
              if (currentline[cropTypeIndex].indexOf("Commercial") > -1) {
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

 writetoFile('../data/stackedChartData.json',JSON.stringify(stackedChartData));
 writetoFile('../data/aggregatedData.json',JSON.stringify(aggregatedData));
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
