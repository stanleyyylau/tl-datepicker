/*
* @Author: anchen
* @Date:   2016-10-31 17:05:34
* @Last Modified by:   anchen
* @Last Modified time: 2016-11-29 15:27:54
*/
// 必须存在默认值
/*
address.provinceData 筛选后的省json
address.cityData 筛选后的市json
address.areaData 筛选后的区json
address.StreetData 街道数据
address.selectedVal 包含了选择的省市区，街道数据
 */
var address = {
  // 初始化
  init: function (argument) {
    var that = this
    var arr = ['province', 'city', 'area']
    that.readProvince(cityDefauleVal.province)
    that.readCity(cityDefauleVal.city)
    that.readArea(cityDefauleVal.area)
    if (citydata) {
      that.scrollerProvince(cityDefauleVal.province.code)
      that.scrollerCity(cityDefauleVal.city.code)
      that.scrollerArea(cityDefauleVal.area.code)
    }

    $('.J_scrollerConfirmCity').on('click', function(event) {
      var p = $(this).parents('.m-dialog')
      that.confirm(p[0])
    });

    // $('.J_scrollerCancel').on('click', function(event) {
    //   var p = $(this).parents('.m-dialog')
    //   that.cancel(p[0])
    // });


    // $('.J_streetCancel').on('click', function(event) {
    //   that.streetCancel()
    // });
  },
  // 实例化省滚动
  scrollerProvince: function (defaultValue) {
    var that = this
    that.province = new Scroller('#J_scrollerProvince', {
      data: that.provinceData,
      defaultValue: defaultValue,
      onSelect : function(value) {
        for (var i = 0, len = that.provinceData.length; i < len; i++) {
          // 将默认或者当前选择的省索引保存
          if (that.provinceData[i].value === value.value ) {
            that.provinceIndex = i
            break;
          }
        }
        that.city.destroy()
        that.readCity({id: value.value, name: value.name})
        that.scrollerCity()
        that.readArea()

        that.cityIndex = 0 // 切换市，归零
        that.area.destroy()
        that.readArea()
        that.scrollerArea()
      }
    })
  },
  // 实例化市滚动
  scrollerCity: function (defaultValue) {
    var that = this
    that.city = new Scroller('#J_scrollerCity', {
      data: that.cityData,
      defaultValue: defaultValue,
      onSelect : function(value) {
        for (var i = 0, len = that.cityData.length; i < len; i++) {
          // 将默认或者当前选择的市索引保存
          if (that.cityData[i].value === value.value ) {
            that.cityIndex = i
            break;
          }
        }
        that.area.destroy()
        that.readArea({id: value.value, name: value.name})
        that.scrollerArea()
      }
    })
  },
  // 实例化区滚动
  scrollerArea: function (defaultValue) {
    var that = this
    that.area = new Scroller('#J_scrollerArea', {
      data: that.areaData,
      defaultValue: defaultValue,
      onSelect : function(value) {}
    })
  },
  // 实例化街道滚动
  scrollerStreet: function (defaultValue) {
    var that = this
    that.street = new Scroller('#J_scrollerStreet', {
      data: that.streetData,
      defaultValue: defaultValue,
      onSelect : function(value) {
        that.selectedVal.street = {
          code: value.value,
          name: value.name
        }
      }
    })
  },
  // 读取省份数据
  readProvince: function(options){
    this.provinceData = []
    options = options || {
      id: citydata[0].code,
      name: citydata[0].name
    }
    this.provinceIndex = 0;
    var obj = {}
    if (citydata) {
      var data = citydata;
      for (var i = 0, len = data.length; i < len; i++) {
        obj.name = data[i].name
        obj.value = data[i].code
        this.provinceData.push(obj)
        obj = {}
        // 将默认或者当前选择的省索引保存
        if (data[i].code === options.id) {
          this.provinceIndex = i
        }
      }
    }
  },
  // 读取市数据
  readCity: function(options){
    this.cityData = []
    this.cityIndex = 0;
    options = options || {
      id: citydata[0].code,
      name: citydata[0].name
    }
    var obj = {}
    if (citydata) {
      var data = citydata[this.provinceIndex].children
      for (var i = 0, len = data.length; i < len; i++) {
        obj.name = data[i].name
        obj.value = data[i].code
        this.cityData.push(obj)
        obj = {}
        // 将默认或者当前选择的市索引保存
        if (data[i].code === options.id) {
          this.cityIndex = i
        }
      }
    }
  },
  // 读取区数据
  readArea: function(options){
    this.areaData = []
    options = options || {
      id: this.cityData[0].value,
      name: this.cityData[0].name
    }
    var obj = {}
    if (citydata) {
      // 根据保存的省、市索引直接获取到区的数据，节省两个外套循环
      var data = citydata[this.provinceIndex].children[this.cityIndex].children
      // 澳门无区数据
      if (options.id === '820100' || options.id === '820200') {
        data = [{name: '暂不选择', value: '000000'}]
      }
      for (var i = 0, len = data.length; i < len; i++) {
        obj.name = data[i].name
        obj.value = data[i].code
        this.areaData.push(obj)
        obj = {}
      }
    }
  },
  // 是否加载数据中
  isLoading: false,
  // 异步获取街道数据
  getStreet: function(id, url){
    var that = this
    that.streetData = []
    var streetTip;
    function read(data) {
      var obj = {}
      var arr = []
      for (var i = 0, len = data.length; i < len; i++) {
        obj.name = data[i].name
        obj.value = data[i].id
        arr.push(obj)
        obj = {}
      }
      return arr
    }
    if (id && !that.isLoading) {
      that.isLoading = true
      streetTip = new Toast({hideDelay: 3000, content: '加载中...'})
      $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: {id: id},
        success: function(ret){
          if (ret.status || ret.errcode === 0) {
            streetTip.hide()
            ret.result.length > 0 ? that.streetData = read(ret.result) : that.streetData = {name: '暂不选择', value: '000000'}
            !!that.street ? that.street.destroy() : '';

            that.scrollerStreet(cityDefauleVal.street.code)
            address.show('J_scrollerStreetBox')
          } else {
            streetTip.hide().change(ret.errmsg).show();
          }
          that.isLoading = false
        },
        error: function(){
          that.isLoading = false
          streetTip.hide().change('加载失败，请重试！').show();
        }
      })
    }
  },
  // city confirm
  confirm: function (dom, callback) {
    var that = this
    that.selectedVal = {};
    var txt = '';
    var val = '';
    var arr = ['province', 'city', 'area']
    that.hide(dom)
    $(dom).find('.scroller-item-selected').each(function(i, v) {
      that.selectedVal[arr[i]] = {
        code: $(this).data('value'),
        value: $(this).data('name')
      }
      txt += $(this).data('name');
      val += i !== 2 ? $(this).data('value') + '&' : $(this).data('value');
    });
    $('#J_selectCityTxt').html(txt);
    $('#J_selectCityVal').val(val)
  },
  // city cancel
  cancel: function (dom) {
    this.hide(dom)
  },
  // street Confirm
  streetConfirm: function (){
    var ret = $('.J_scrollerStreetBox').find('.scroller-item-selected')
    var txt = ret.data('name');
    var val = ret.data('value');

    this.streetCancel()
    return { name: txt, value: val }
  },
  // street Cancel
  streetCancel: function () {
    this.hide('J_scrollerStreetBox')
  },
  show: function (dom) {
    dom = dom || 'J_scrollerCityBox'
    var cn =  document.querySelector('.' + dom).className
    document.querySelector('.' + dom).className = cn + ' m-dialog-active'
  },
  hide: function (dom) {
    var d = typeof dom === 'object' ? dom : document.querySelector('.' + dom)
    var str = d.className;
    d.className = str.replace('m-dialog-active', '')
  }
}

address.init()