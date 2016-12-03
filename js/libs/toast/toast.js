'use strict';
function Toast(option){
  this.attrs = {
    hideDelay : 2000,
    animateDuration: 600,
    content : null,
    template : '<div class="am-toast" style="background-color: transparent;"></div>',
    type: 'none'
  };

  //merge
  if(option && typeof option == 'object'){
     $.extend(this.attrs, option);
  }
  this.setup();
};

Toast.prototype = {
  get: function(key){
    return this.attrs[key];
  },
  set: function(key, value){
    return this.attrs[key] = value;
  },
  //初始化
  setup: function(){
    var self = this;
    self._initContent();
  },
  //填充toast内容
  _initContent: function(){
    var self = this;
    var el = self._getElement();
    var tpl = self._getInnerTpl();
    var winWidth = $(window).width();
    el.html(tpl);
    //定位
    el.css({
      left: (winWidth - el.width())/2
    });
  },
  //获取元素，不存在则新建
  _getElement: function(){
    var self = this;
    //不存在
    if(!self.element && !self.created){
      var template = self.get('template');
      var element = $(template).appendTo($('body'));
      self.element = element;
      self.created = true;
    }
    return self.element;
  },
  //获取模板
  _getInnerTpl: function(){
    var self = this;
    var content = self.get('content');
    var type = self.get('type');
    var iconCssTpl = type == 'none' ? '' : '<span class="am-toast-icon ' + 'am-icon-' + type + '"></span>';
    var tpl = '<div class="am-toast-text">'
              + iconCssTpl
              + content
            + '</div>';
    return tpl;
  },
  /**
   * 更改内容和类型
   * @param  {String} content 内容
   * @param  {String} type   类型
   */
  change: function(content,type){
    var self = this;
    self.set('content',content);
    self.set('type',type);
    self._initContent();
  },
  /**
   * 显示
   */
  show: function(){
    var self = this;
    //隐藏动画时长
    var animateDuration = parseInt(self.get('animateDuration'), 10);
    var hideDelay = parseInt(self.get('hideDelay'), 10);
    var el = self._getElement();
    var cssString = 'opacity '+ animateDuration/1000 +'s ease-in-out';

    el.css({
      '-webkit-transition': cssString,
      'transition': cssString,
      'z-index': 99,
      'visibility': 'visible',
      'opacity': 0
    });
    if(self.timeflag){
      clearTimeout(self.timeflag);
    }
    //显示
    setTimeout(function(){
      el.css({
        opacity: 1,
      });

      //设置隐藏flag
      self.timeflag = setTimeout(function(){
        self.timeflag = false;
        self._hide();
      },hideDelay || 2000);

    },16);
    self.set('visible', true);
  },
  /**
   * 隐藏
   */
  hide: function(){
    var self = this;
    var el = self._getElement();
    el.css({
      visibility: 'hidden',
      '-webkit-transition': 'initial',
      'transition': 'initial',
      opacity: 0
    });
  },
  //渐隐
  _hide: function(){
    var self = this;
    var el = self._getElement();
    var animateDuration = parseInt(self.get('animateDuration'), 10);
    el.css({
      opacity: 0
    });
    //时间到了 隐藏
    setTimeout(function(){
      if(!self.timeflag){
        el.css({
          'visibility': 'hidden'
        });
      }
    },animateDuration + 16);
    self.set('visible', false);
  },
  //销毁
  destroy: function(){
    var self = this;
    var el = self._getElement();
    el.remove()
    for (var p in self) {
      if (self.hasOwnProperty(p)) {
        delete self[p];
      }
    }
    self.destroy = function() {};
  }
};
