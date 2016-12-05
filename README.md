# tl-datepicker
Tounick datepicker based on scroll

## 支持功能
+ 用户取消后可以缓存上一次选择的数据
+ 动态生成日期数据，不依赖外部JSON
+ 当前月份无上一次用户选择的日的时候，自动返回当前可以选日最大值

## 最简单的用法
+ 先加载tl-datepick.css
+ 然后加载anima_scroll.js
+ 然后加载tl-datepick.js
+ 最后在页面激活它

```
最简单的用法...

第一个参数为要绑定的元素id或者class
第二个参数为用户选中后的callback
第三个为默认选中日期(默认为当前日期,为了安全起见，可以从服务器返回时间，然后传进去，接收的是JS date 对象)
第四个参数为最大的可选日期(默认为当前日期,为了安全起见，可以从服务器返回时间，然后传进去，接收的是JS date 对象)

var test = new DatePick('.trigger', function(value){
console.log(value)})

```

## 提供的API

+ ``cancel``  取消
+ ``confirm``  确认执行callback
+ ``selected`` 返回当前用户选择的日期
+ ``show``  显示日期选择器

## 传输多个参数
```
var test = new DatePick('.trigger', function(value){
console.log(value)}, new Date(2016, 0, 1), new Date(2016, 11, 10))
```
