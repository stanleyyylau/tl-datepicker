/*
 * @Author: anchen
 * @Date:   2016-10-06 14:59:37
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-10-14 15:17:36
 */

var common = {
  init: function() {},
  // 统计代码
  ga: function() {
    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.append != undefined ? m.parentNode.append(a, m) : m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-75275443-4', 'auto');
    ga('send', 'pageview');
  },
  getUa: function(){
    var ua = window.navigator.appVersion.match(/iphone|android/gi)
    return ua;
  }
}

setTimeout(common.ga, 30)
