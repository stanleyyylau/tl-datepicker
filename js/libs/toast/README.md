# toast

---

简单的提示信息

---

## Usage

成功、失败之类的提示信息，显示后延迟2s（默认）隐藏

```javascript
  var $ = require('anima-yocto-lite');
  var Toast = require('anima-toast');
  var toast = new Toast({
      content : '成功加载', //文本
     // hideDelay : 2000,  //延迟隐藏的时间
      type : 'success' //类型，默认为none
  });
  toast.show();

  //修改，再次显示
  $('#btnChange').on('click',function(){
    toast.change('加载失败','fail');
    toast.show();
  });
```

## Api

### 配置项

#### content `String` 
  
  * 提示信息

#### type `String` 默认 'none'

  * 'none' : 不显示icon
  * 'success','fail' 会增加 am-icon-success 或者 am-icon-fail 的icon
  * 'xxx'： 任意类型，附加 am-icon-xxx的样式


### 方法

#### show() 显示

#### hide() 隐藏

#### chang(content,type) 更改类型

  * content : 提示信息
  * type : 提示类型

