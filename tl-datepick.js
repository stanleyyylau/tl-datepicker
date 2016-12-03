

function isLeapYear (year){
  if ((year%4 == 0 && year%100 !=0) || (year%400 == 0)) return true;
  return false;
}

function getNumberOfDays (month, year){
  if (month == 4 || month == 6 || month == 9 || month == 11){
    return 30;
  }
  else if(month == 2){
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





var DatePick = function(DOM, callback, defaultDate, currentDate){
  // it will be safer if these two dates can be generated by server
  // and pass to this function
  var _defaultDate = defaultDate || new Date();
  var _currentDate = currentDate || new Date();
  var _firstInit = false;
  var _isAllDestroy = false;
  var _years = [], _months = [], _days = [];
  var cache;

  // set default selected value
  var _selected = {
    year: {
      name: _defaultDate.getFullYear(),
      value: _defaultDate.getFullYear()
    },
    month: {
      name: _defaultDate.getMonth()+1,
      value: _defaultDate.getMonth()+1
    },
    day: {
      name: _defaultDate.getDate(),
      value: _defaultDate.getDate()
    }
  }

  cache = _selected.year.value + '&' + _selected.month.value + '&' + _selected.day.value;

  function genDate(){
    _years = []; _months = []; _days = [];
    for( var currentYear = _currentDate.getFullYear(), i = currentYear - 100 ; i <= currentYear; i++){
       _years.push({
         name: i,
         value: i
       });
    }

    for( var i = 1, totalMonths = _selected.year.value == _currentDate.getFullYear() ? _currentDate.getMonth()+1 : 12 ; i <= totalMonths; i++){
      _months.push({
        name: i,
        value: i
      });
    }

    for( var i = 1, days = ((_selected.year.value == _currentDate.getFullYear()) && (_selected.month.value >= _currentDate.getMonth()+1)) ? _currentDate.getDate() : getNumberOfDays(_selected.month.value, _selected.year.value); i<= days; i++){
      _days.push({
        name: i,
        value: i
      });
    }
  }

  genDate();
  var yearScroll, monthScroll, dayScroll;

  var initScroller = function(){
    // debugger
    yearScroll = new Scroller('#J_scrollerYear',{
        data: _years,
        defaultValue: _selected.year.value,
        onSelect: function(value){
          // debugger
          _selected.year = value;
          // debugger
          genDate();
          _selected.month = Number(_selected.month.value) > Number(_months[_months.length-1].value) ? _months[_months.length-1] : _selected.month;

          // re instantiate month Scroller
          monthScroll.destroy();
          monthScroll = new Scroller('#J_scrollerMonth',{
            data: _months,
            defaultValue: _selected.month.value,
            onSelect: function(value){
              _selected.month = value;
              dayScroll.destroy();
              genDate();
              // debugger
              _selected.day = Number(_selected.day.value) > Number(_days[_days.length-1].value) ? _days[_days.length-1] : _selected.day;
              dayScroll = new Scroller('#J_scrollerDay',{
                data: _days,
                defaultValue: _selected.day.value,
                onSelect: function(value){
                  _selected.day = value;
                }
              })
            }
          })

          // destroy day
          _selected.day = Number(_selected.day.value) > Number(_days[_days.length-1].value) ? _days[_days.length-1] : _selected.day;
          dayScroll.destroy();

          dayScroll = new Scroller('#J_scrollerDay', {
            data: _days,
            defaultValue: _selected.day.value,
            onSelect: function(value){
              _selected.day = value;
            }
          })
        }
      })

    monthScroll = new Scroller('#J_scrollerMonth',{
        data: _months,
        defaultValue: _selected.month.value,
        onSelect: function(value){
          _selected.month = value;
          dayScroll.destroy();
          genDate();
          // debugger
          _selected.day = Number(_selected.day.value) > Number(_days[_days.length-1].value) ? _days[_days.length-1] : _selected.day;
          dayScroll = new Scroller('#J_scrollerDay',{
            data: _days,
            defaultValue: _selected.day.value,
            onSelect: function(value){
              _selected.day = value;
            }
          })
        }
      })

    dayScroll = new Scroller('#J_scrollerDay',{
        data: _days,
        defaultValue: _selected.day.value,
        onSelect: function(value){
          _selected.day = value;
        }
      })
  }

  var show = function(){
    if(cache){
      var cacheArr = cache.split('&');
      _selected.year.name = cacheArr[0];
      _selected.year.value = cacheArr[0];
      _selected.month.name = cacheArr[1];
      _selected.month.value = cacheArr[1];
      _selected.day.name = cacheArr[2];
      _selected.day.value = cacheArr[2];
    }
    $('#J_datePick').show();
    if(!_firstInit){
      initScroller();
      _firstInit = true;
    }else if(_isAllDestroy){
      initScroller();
      _isAllDestroy = false;
    }
  }

  var confirm = function(){
    if(callback){
      callback(_selected);
    }else{
      console.log('You need to provide a callback function which will take in the selected value as argument...')
    }
    cache = _selected.year.value + '&' + _selected.month.value + '&' + _selected.day.value;
    cancel();
  }

  var cancel = function(){
    yearScroll.destroy();
    monthScroll.destroy();
    dayScroll.destroy();
    _isAllDestroy = true;
    $('#J_datePick').hide();
  }

  var selected = function(){
    return _selected;
  }

  $(DOM).on('click', show);
  $('.J_scrollerConfirm').on('click', confirm);
  $('.J_scrollerCancel').on('click', cancel);
  return {
    show: show,
    confirm: confirm,
    cancel: cancel,
    selected: selected
  }
}



//
// function DatePick(callback){
//   this.selected = {
//     year: null,
//     month: null,
//     day: null
//   }
//   this.year = new Scroller('#J_scrollerYear',{
//     data: tounickDate,
//     defaultValue: tounickDate[0],
//     onSelect: function(value){
//       this.selected.year = value;
//       this.month.destroy();
//       this.day.destroy();
//
//       this.selected.year = value;
//       this.month = new Scroller('#J_scrollerMonth',{
//         data: value.month,
//         defaultValue: value.month[0],
//         onSelect: function(value){
//           this.selected.day = value;
//           this.day.destroy();
//           this.day = new Scroller('#J_scrollerDay',{
//             data: value.day,
//             defaultValue: value.day[0],
//           })
//         }
//       })
//     }
//   })
//   this.month = new Scroller('#J_scrollerMonth',{
//     data: tounickDate[0].month,
//     defaultValue: tounickDate[0].month[0],
//     onSelect: function(value){
//       this.selected.month = valu;
//       this.day.destroy();
//       this.day = new Scroll('#J_scrollerDay',{
//         data: value.day,
//         defaultValue: value.day[0],
//       })
//     }
//   })
//   this.day = new Scroller('#J_scrollerDay',{
//     data: tounickDate[0].month[0].day,
//     defaultValue: tounickDate[0].month[0].day[0],
//     onSelect: function(value){
//       this.selected.day = value
//     }
//   })
// }

//
// DatePick.prototype = {
//   show: function(){
//     $('#J_datePick').show();
//   },
//   hide: function(){
//     $('#J_datePick').hide();
//   },
//   confirm: function(){
//     // to to, run callback passing the selected value
//   },
//   init: function(){
//
//   }
// }

// debugger
// var test = new DatePick()
