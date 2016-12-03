function tounickScroll(options){
  this.options = options;
  this.selected = {
    first: {
      name: null,
      value: null,
    },
    second: {
      name: null,
      value: null
    }
  };
  this.firstScroll = null;
  this.secondScroll = null;
  // Shortcut to store this.options
  var OPS = this.options;
  this.init = function(){
    if(OPS.simpleMode){
      return this.firstScroll = this.makeScl(OPS.onSelectFirst, OPS.firstMenu, 'first', OPS.dataFirst);
    }else if(OPS.defaultValue){
      this.firstScroll = this.makeScl(OPS.onSelectFirst, OPS.firstMenu, 'first', OPS.dataFirst, OPS.defaultValue.first);
      this.secondScroll = this.makeScl(OPS.onSelectSecond, OPS.secondMenu, 'second', OPS.dataSecond, OPS.defaultValue.second);
    }else {
      this.firstScroll = this.makeScl(OPS.onSelectFirst, OPS.firstMenu, 'first', OPS.dataFirst);
      this.secondScroll = this.makeScl(OPS.onSelectSecond, OPS.secondMenu, 'second', OPS.dataSecond);
    }
  };
  $(OPS.activeDOM).on('click',function(){
    this.show();
    if(!this.firstScroll) return this.init.call(this);
  }.bind(this));
  $(OPS.confirmDOM).on('click',this.confirm.bind(this));
  $(OPS.cancelDOM).on('click',this.cancel.bind(this));
}


tounickScroll.prototype = {
  // instaniate new scroll based on input
  /*
    which: What to do when on select, will use default if no funciton provided
    menu: the container of the first colmun
    selectedValue: selected value will be stored to where
    dataCol: the data to pass to Scroller
    defaultValue: defaultValue to set
  */
  makeScl: function(which, menu, selectedValue, dataCol, defaultVal){
    //If no default value is passed, default will be the first of dataset
    var defVal = this.options.dataFirst[0].value;
    var defaultOnSelect = function(ret){
      if(selectedValue == 'first'){
        this.selected.first = ret;
      }else{
        this.selected.second = ret;
      }
    };
    var onSelectFn = which ? which : defaultOnSelect;
    if(defaultVal){
      return new Scroller(menu, {
        data: dataCol,
        defaultValue: defaultVal.value,
        onSelect: onSelectFn.bind(this)
      });
    }else{
      return new Scroller(menu, {
        data: dataCol,
        defaultValue: defVal,
        onSelect: onSelectFn.bind(this)
      });
    }
  },
  cancel: function(){
    var wrapper = this.options.wrapperDOM || '.J_showScroller';
    $(wrapper).hide();
  },
  confirm: function(){
    // debugger;
    var output;
    var outputDOM = this.options.outputDOM || '#J_select_date';
    var SLT = this.selected;
    var OPS = this.options;
    // if clicking confirm but no scroll, set selected to defaultValue
    if(SLT.first.value == null && OPS.defaultValue){
      SLT.first = OPS.defaultValue.first;
      SLT.second = OPS.defaultValue.second;
    }else if(SLT.first.value == null){
      SLT.first = OPS.dataFirst[0];
      SLT.second = OPS.dataSecond ? OPS.dataSecond[0] : null;
    }
    // User can handle output to DOM by passing custom function
    if(OPS.handleOutput){
      output = OPS.handleOutput.call(this);
    }else{
      var firstCol = SLT.first.value ? SLT.first.value : SLT.first;
          output = firstCol + SLT.second.value;
    }
    this.cancel();
    if(output == null){
      return $(OPS.outputDOM).val('');
    }
    $(outputDOM).val(output);
  },
  show: function(){
    var wrapper = this.options.wrapperDOM || '.J_showScroller';
    $(wrapper).show();
  }
}
