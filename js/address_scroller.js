/*
* @Author: anchen
* @Date:   2016-10-17 14:21:35
* @Last Modified by:   anchen
* @Last Modified time: 2016-10-17 14:22:15
*/

var addressScroller = {
  init: function() {
    if (addressScroller.province != undefined) return false;
    addressScroller.province = new Scroller('#J_scrollerProvince', {
      data: read.arrProvince,
      defaultValue: defaultCity.id,
      onSelect: function(ret) {
        defaultCity.id = ret.value
        defaultCity.name = ret.name
        read.city(ret.value)
        defaultCity.children.id = read.arrCity[0].value
        defaultCity.children.name = read.arrCity[0].name

        addressScroller.city.destroy();

        addressScroller.city = new Scroller('#J_scrollerCity', {
          data: read.arrCity,
          defaultValue: defaultCity.children.id,
          onSelect: function(ret) {
            defaultCity.children.id = ret.value
            defaultCity.children.name = ret.name
          }
        })

      }
    });
    addressScroller.city = new Scroller('#J_scrollerCity', {
      data: read.arrCity,
      defaultValue: defaultCity.children.id,
      onSelect: function(value) {}
    });
  },
  cancel: function() {
    $('.J_showScroller').hide()
  },
  confirm: function() {
    window.location.href = '/job/phone/find.do?pageNum=1&areaId' + defaultCity.id + '&type=' + type;
  },
  show: function() {
    $('.J_showScroller').show()
  }
}



// job/phone/find.do?pageNum=1&areaId=440600&type=1
