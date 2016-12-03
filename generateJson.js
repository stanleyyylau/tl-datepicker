var fs = require('fs');

function isLeapYear (year){
  if ((year%4 === 0 && year%100 !==0) || (year%400 === 0)) return true;
  return false;
}

function getNumberOfDays (month, year){
  if (month === 4 || month === 6 || month === 9 || month === 11){
    return 30;
  }
  else if(month === 2){
    // check if it's leap year
    if(isLeapYear(year)){
      return 29;
    }else {
      return 28;
    }
  }else{
    return 31;
  }
}

// above is the helper function, below is the real stuff

var tounickDate = [];

for(var i = 2016 - 100; i <= 2016; i++){
  var year = {};
  year.name = i;
  year.code = i;
  year.month = [];

  // generate month for each year
  [1,2,3,4,5,6,7,8,9,10,11,12].forEach(function(elem, index){
    var month = {
      name: elem,
      code: elem,
      day: []
    }
    // generate days here
    for(var d = 1, days=getNumberOfDays(elem, i); d <= days; d++){
      var day = {
        name: d,
        code: d
      }
      month.day.push(day);
    }
    year.month.push(month);
  })
  tounickDate.push(year);
}


// var content = 'var tounickDate = ' + JSON.stringify(tounickDate);
// console.log('the content is ...')
// console.log(content)


fs.writeFile("tounickDate.json", "var tounickDate = " + JSON.stringify(tounickDate), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
