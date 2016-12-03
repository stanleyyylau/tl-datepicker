var companyData = [{
  name: '请选择企业',
  value: 'null',
  children: [{
    name: '请选择工作岗位/地址',
    value: 'null'
  }]
  },
  {
  name: '美的',
  value: 1,
  children: [{
    name: '中山东凤',
    value: 111
  },{
    name: '美的生活电器/北滘',
    value: 112
  },{
    name: '美的环境事业部/北滘',
    value: 112
  },{
    name: '美的华凌冰箱/广州',
    value: 114
  },{
    name: '美的厨房电器事业部/北滘',
    value: 115
  },{
    name: '美的厨房电器家具厂/北滘',
    value: 116
  },{
    name: '广州南沙冰箱工厂',
    value: 117
  }]
},{
  name: '经纬日用五金',
  value: 2,
  children: [{
    name: '伦教镇',
    value: 118
  }]
},{
  name: '华声电器股份有限公司',
  value: 3,
  children: [{
    name: '容桂',
    value: 119
  }]
},{
  name: '格兰仕电器',
  value: 4,
  children: [{
    name: '中山',
    value: 120
  }]
},{
  name: '海信科龙电器',
  value: 5,
  children: [{
    name: '容桂',
    value: 121
  }]
},{
  name: '海信厨卫电器',
  value: 6,
  children: [{
    name: '大良',
    value: 122
  }]
},{
  name: '万和新电器',
  value: 7,
  children: [{
    name: '万和/容桂',
    value: 123
  }]
},{
  name: '旭日集团',
  value: 8,
  children: [{
    name: '深圳平湖镇',
    value: 124
  }]
}];


var read = {
  year: [],
  yearIn: [],
  month: ['一月份','二月份','三月份','四月份','五月份','六月份','七月份','八月份','九月份','十月份','十一月份','十二月份'],
  company: [],
  location: [],
  province: [],
  city: [],
  generateYear: function(){
    var currentYear = new Date().getFullYear();
    for(var i = currentYear+3; i > currentYear - 50; i--){
      var newOjb = {
        name: i,
        value: i
      }
      this.year.push(newOjb);
    }
  },
  generateYearIn: function(){
    var currentYear = new Date().getFullYear();
    for(var i = currentYear; i < currentYear + 20; i++){
      var newOjb = {
        name: i,
        value: i
      }
      this.yearIn.push(newOjb);
    }
  },
  generateMonth: function(){
    var newMonth = [];
    this.month.forEach(function(value, index){
      var newObj = {
        name : value,
        value : index < 9 ? '0' + (index + 1) : String(index + 1)
      }
      newMonth.push(newObj);
    })
    this.month = newMonth;
  },
  generateCompany: function(){
    companyData.forEach(function(value,index){
      var newObj = {
        name: value.name,
        value: value.value
      };
      this.company.push(newObj);
    }.bind(this))
  },
  generateLocaion: function(comVal){
    // debugger
    this.location = [];
    for(var i=0; i<companyData.length; i++){
      if(companyData[i].value == comVal){
         companyData[i].children.forEach(function(value,index){
          var newObj = {
            name: value.name,
            value: value.value
          };
          this.location.push(newObj);
        }.bind(this))
        break;
      }
    }
  },
  generateProvince: function(){
    cityData.forEach(function(value,index){
      var newObj = {
        name: value.name,
        value: value.code
      }
      this.province.push(newObj);
    }.bind(this))
  },
  generateCity: function(comVal){
    this.city = [];
    for(var i=0; i<cityData.length; i++){
      if(cityData[i].code == comVal){
         cityData[i].children.forEach(function(value,index){
          var newObj = {
            name: value.name,
            value: value.code
          };
          this.city.push(newObj);
        }.bind(this))
        break;
      }
    }
  },
  init: function(){
    this.generateYear();
    this.generateYearIn();
    this.generateMonth();
    this.generateCompany();
    this.generateLocaion(read.company[0].value);
    this.generateProvince();
    this.generateCity(440000); // Make default selected city canto
  }
}

read.init();
// to set default city
