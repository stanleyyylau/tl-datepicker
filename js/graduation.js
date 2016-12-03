// Plugin @RokoCB :: Return the visible amount of px
// of any element currently in viewport.
// stackoverflow.com/questions/24768795/
;(function($, win) {
  $.fn.inViewport = function(cb) {
     return this.each(function(i,el){
       function visPx(){
         var H = $(this).height(),
             r = el.getBoundingClientRect(), t=r.top, b=r.bottom;
         return cb.call(el, Math.max(0, t>0? H-t : (b<H?b:H)));
       } visPx();
       $(win).on("resize scroll", visPx);
     });
  };
}($, window));


// get current month
var curMonth = new Date().getMonth()+1;
curMonth = curMonth < 10 ? '0' + String(curMonth) : String(curMonth);
curMonthObj = read.month.filter(function(item, index){
  if(item.value == curMonth){
    return item;
  }
})
curMonthObj = curMonthObj[0];

var mkOPS = function(suffix){
  suffix = suffix ? suffix : '';
  var newObj = {
    activeDOM: '#select' + suffix,
    confirmDOM: '.J_scrollerConfirm' + suffix,
    cancelDOM: '.J_scrollerCancel' + suffix,
    wrapperDOM: '.J_showScroller' + suffix,
    outputDOM: '#select' + suffix,
    firstMenu: '#J_scrollerYear' + suffix,
    secondMenu: '#J_scrollerMonth' + suffix,
    onSelectFirst: null,
    onSelectSecond: null,
  }
  return newObj;
}

var mkDashOP = function(){
  return function(){
    return this.selected.first.value + '-' + this.selected.second.value;
  }
}

// Make options for those six scrolls
var options = mkOPS();
options.activeDOM = '#J_select_date';
options.outputDOM = '#J_select_date';
options.dataFirst = read.year;
options.dataSecond = read.month;
options.handleOutput = mkDashOP();
options.defaultValue = {
  first: read.yearIn[0],
  second: curMonthObj
}

var optionsIn = mkOPS('In');
optionsIn.dataFirst = read.yearIn;
optionsIn.dataSecond = read.month;
optionsIn.handleOutput = mkDashOP();
optionsIn.defaultValue = {
  first: read.yearIn[0],
  second: curMonthObj
}

var optionsExpected = mkOPS('Expected');
optionsExpected.simpleMode = true;
optionsExpected.handleOutput = function(){
  return this.selected.first.name;
};
optionsExpected.dataFirst = [{
  name: '不限',
  value: 333
},{
  name: '0-1000',
  value: 111
},{
  name: '1000以上',
  value: 222
}];

var optionsFirst = mkOPS('First');
optionsFirst.dataFirst = read.company;
optionsFirst.dataSecond = read.location;
optionsFirst.onSelectFirst = function(ret){
  // debugger
  this.selected.first = ret;
  this.secondScroll.destroy();
  read.generateLocaion(this.selected.first.value)
  this.secondScroll = new Scroller(this.options.secondMenu, {
    data: read.location,
    defaultValue: read.location[0].value,
    onSelect: function(ret) {
      this.selected.second = ret;
    }.bind(this)
  })
  this.selected.second.name = read.location[0].name;
  this.selected.second.value = read.location[0].value;
};
optionsFirst.handleOutput = function(){
  if(this.selected.first.value == 'null'){
    return null;
  }
  return this.selected.first.name + '-' + this.selected.second.name;
}

var optionsSecond = mkOPS('Second');
optionsSecond.dataFirst = read.company;
optionsSecond.dataSecond = read.location;
optionsSecond.onSelectFirst = optionsFirst.onSelectFirst;
optionsSecond.handleOutput = optionsFirst.handleOutput;

var optionsCity = mkOPS('City');
optionsCity.dataFirst = read.province;
optionsCity.dataSecond = read.city;
optionsCity.onSelectFirst = function(ret){
  // debugger
  this.selected.first = ret;
  this.secondScroll.destroy();
  read.generateCity(this.selected.first.value)
  this.secondScroll = new Scroller(this.options.secondMenu, {
    data: read.city,
    defaultValue: read.city[0].value,
    onSelect: function(ret) {
      this.selected.second = ret;
    }.bind(this)
  })
  this.selected.second.name = read.city[0].name;
  this.selected.second.value = read.city[0].value;
};
optionsCity.handleOutput = optionsFirst.handleOutput;
optionsCity.defaultValue = {
  first: {
    name: '广东省',
    value: 440000
  },
  second: {
    name: '广州市',
    value: 440100
  }
};



var form = {
  tips: null,
  content: {
    name: null,
    phone: null,
    school: null,
    gradTime: null,
    idealCity: null,
    experience: null,
    internStart: null,
    ExpectedSal: null,
    stOption: null,
    rdOption: null,
    jobArrange: null
  },
  $Const: {
    name : $('.apply-form input[name="name"]'),
    phone : $('.apply-form input[name="tel"]'),
    school : $('.apply-form input[name="university"]'),
    gradTime : $('.apply-form input[name="grad-date"]'),
    idealCity : $('.apply-form input[name="ideal-city"]'),
    experience : $('.apply-form textarea[name="experience"]'),
    internStart : $('.apply-form input[name="trial-date"]'),
    ExpectedSal : $('.apply-form input[name="expected-salary"]'),
    stOption : $('.apply-form input[name="first-option"]'),
    rdOption : $('.apply-form input[name="second-option"]'),
    jobArrange : $('.dispatch-check-container .on-select')
  },
  getContent: function(){
    var cnt = this.content;
    var CST = this.$Const;
    cnt.name = CST.name.val();
    cnt.phone = CST.phone.val();
    cnt.school = CST.school.val();
    cnt.gradTime = CST.gradTime.val();
    cnt.idealCity = CST.idealCity.val();
    cnt.experience = CST.experience.val();
    cnt.internStart = CST.internStart.val();
    cnt.ExpectedSal = CST.ExpectedSal.val();
    // If value instead of string are needed, get them from tounickScroll instance
    cnt.stOption = CST.stOption.val();
    cnt.rdOption = CST.rdOption.val();
    cnt.jobArrange = CST.jobArrange.text().trim() == '是' ? true : false;
  },
  validate: function(){
    var cnt = this.content;
    if(!(/[\u4e00-\u9fa5]{2,}/.test(cnt.name))){
      return this.showFailMsg('请完成姓名的填写', 'name');
    }
    if(!(/^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(cnt.phone))){
      return this.showFailMsg('请完成电话的填写', 'phone');
    }
    if(!(/[\u4e00-\u9fa5]{2,100}/.test(cnt.school))){
      return this.showFailMsg('请完成学校的填写', 'school');
    }
    if(!(cnt.gradTime)){
      return this.showFailMsg('请完成毕业时间的填写', 'gradTime');
    }
    if(!(cnt.idealCity)){
      return this.showFailMsg('请完成理想工作的填写', 'idealCity');
    }
    return 'pass';
  },
  showFailMsg: function(msg, item){
    this.tips.change(msg,'fail');
    this.tips.show();
    this.$Const[item].focus().closest('.form-cell').addClass('on-focus')
    .find('input').on('blur', function(){
      $(this).closest('.form-cell').removeClass('on-focus');
    });
    $('.J_submit').text('重新提交');
    return false;
  },
  handleAjax: function(){
    // prevent multiple clicking of submit button
    $( ".J_submit" ).prop( "disabled", true );
    this.tips.change('表单提交中...');
    this.tips.show();
    $.ajax({
      url: backEndUrl,
      type: 'POST',
      data: {message: this.content},
      success: function(data){
        if(data.status === 200){
           // Show popup
           $('.mask').show();
           $('.popup').show();
           $('.J_submit').text('已提交').addClass('submitted');
        }else{
          this.tips.change('提交失败');
          this.tips.show();
        }
        $( ".J_submit" ).prop( "disabled", false );
      }.bind(this),
      error: function(){
        this.tips.change('网络出错');
        this.tips.show();
        $( ".J_submit" ).prop( "disabled", false );
      }.bind(this)
    });
  },
  handleClick: function(){
    this.getContent();
    var isPass = this.validate();
    if(isPass == 'pass'){
      //make ajax call
      this.handleAjax();
    }
  },
  init: function(){
    this.tips = new Toast({
        content : 'Hello Toast', //文本
       // hideDelay : 2000,  //延迟隐藏的时间
        type : 'success' //类型，默认为none
    });
    this.tips.hide();
    $('.J_submit').on('click', function(){
      // User can only submit one time/unless he refresh the browser
      if($(this).hasClass('submitted')){
        return;
      }else{
        form.handleClick()
      }
    })
  }
}

var allScl = {
  tscroll: options,
  tscrollIn: optionsIn,
  tscrollFirst: optionsFirst,
  tscrollSecond: optionsSecond,
  tscrollExpected: optionsExpected,
  tscrollCity: optionsCity
}

$(document).ready(function(){

  // instantiate all scrolls
  for (var prop in allScl) {
    allScl[prop] = new tounickScroll(allScl[prop])
  }

  form.init();
  $('.dispatch-check-container > div').on('click',function(){
    if($(this).hasClass('on-select')){
      return;
    }else{
      $(this).toggleClass('on-select').siblings().toggleClass('on-select');
    }
  })
  $('.mask').on('click', function(){
    $(this).hide();
    $('.popup').hide();
  })
  $('.J_share-btn').on('click', function(){
    $(this).text('点击右上角 即可分享哟');
    $('.share-arrow').show();
  })

  // Animation effects
  $('.apply-form').inViewport(function(vis){
    if(vis){
      return $('.call-to-action').hide();
    }
  })

  $('.galanz-container').inViewport(function(vis){
    if(vis){
      return $('.call-to-action').show();
    }
  })

  $('.once').inViewport(function(vis){
    if(vis){
      return $(this).addClass('animated bounceIn');
    }
  })

  $('.title-break').inViewport(function(vis){
    if(vis){
      return $('.call-to-action').show().addClass('animated slideInDown');
    }
  })

})
