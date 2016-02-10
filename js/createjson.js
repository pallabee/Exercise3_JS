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

  //Fetching the column index of the required columns
  var cropTypeIndex,yearIndex;

  for (var h = 0, hlen = headers.length; h < hlen; h++) {
    if (headers[h].indexOf("Particulars") > -1) {
      cropTypeIndex = h;
    }
    if (headers[h].indexOf("2013") > -1) {
      yearIndex = h;
    }
  }

  //Storing each line as an object,in an object array
  oilseedsRows = [],foodgrainRows = [];
  for (var i = 1, ilen = lines.length; i < ilen; i++) {
    // Code to filter bad data
    var linestr = lines[i].trim().replace(", ", " ");

    //Loading each line into an array
    var currentline = linestr.split(",");

    //Filtering data for 'Oilseeds' crop
    if (currentline[cropTypeIndex].indexOf("Oilseeds") > -1) {
      //Filtering if production is not NA
      if (currentline[yearIndex] !== 'NA') {
        var row = new Object();

        row.x = currentline[cropTypeIndex];
        row.y = parseFloat(currentline[yearIndex]);
        oilseedsRows.push(row);
      }
    }
    //Filtering data for 'Foodgrains' crop
    if (currentline[cropTypeIndex].indexOf("Foodgrains") > -1) {
      //Filtering if production is not NA
      if (currentline[yearIndex] !== 'NA') {
        var frow = new Object();

        frow.x = currentline[cropTypeIndex];
        frow.y = parseFloat(currentline[yearIndex]);
        foodgrainRows.push(frow);
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
  writetoFile('../data/oilseedsVsProd.json',JSON.stringify(oilseedsRows));

  writetoFile('../data/foodgrainsVsProd.json',JSON.stringify(foodgrainRows));

  function writetoFile(path,jsonResult){

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
