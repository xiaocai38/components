## Popup 包含了所有的弹层，内容较多，所以文档分开写

### Popup 包含如下两个大类
  + [Bubble](./bubble.html "右键新开窗口打开") - 带有箭头的大型汽泡
  + [Bias](./bias.html "右键新开窗口打开") - 带有箭头的小型提示信息

`Popup` 本身只是一个包装组件，主要负责当一个元素被渲染之后，计算其在页面上的位置。
并根据其属性 `placement` 来计算其子元素应该放置的位置。

### Props
 + animate - `Object` 包含了 `Animate` 组件的所有属性
 + trigger - `String` 目前可选 `click` 与 `hover`
 + placement - `String` 目前可选 `top` `right` `bottom` `left`
 + content - `String | React.Element` 弹窗内容
 + onHide - `Function` 弹窗关闭后回调
 + onChange - `Function` 弹窗切换后的回调 <div class="info">新属性</div>
 + shouldUpdate - `Function` - 是否需要重新渲染 <div class="info">新属性</div>
 + triggerHide - `Function` 如果该函数返回false，则弹窗不会关闭，返回true，关闭
   <div class="error">已废弃,请用 `shouldHide` 代替</div>
 + shouldHide - `Function` 如果该函数返回false，则弹窗不会关闭，返回true，关闭
 + onComponentMount - `Function` 组件挂载后调用，传入组件实例
   <div class="warning">将会被废弃,请用 `onMount` 代替</div>
 + onMount - `Function` 组件挂载后调用，传入组件实例。
 + baseElement - `HTMLElement` - 定位依赖元素，如果传入该值，则忽略
   `props.children` 的值，不会被渲染。
 + `shouldUpdate()` - 外部定义是否更新组件 - noop
 + `unMountOnHide` - 组件隐藏时是否卸载 - true <div class="info">新增属性</div>

### Methods
+ hide - 隐藏组件,如果 `props.unMountOnHide` 为真值,组件会被卸载;
  上一版本该函数名为 `autoVisible`,当前版本依然保留该函数,下一版本删除。
+ show - 显示组件,上一版本的该函数名为 `showPopup`;
  当前版本依然保留该函数,下一版本删除。
+ unMount - 卸载组件

## 最简单的调用
目前封装性较低，所以最简单的也比较复杂~

1. 引入内容
```Javascript
var React = require('react');
var ReactDOM = require('react-dom');
var Popup = require('react-components');
var Popup = Popup.Popup;
var Bubble = Popup.Bubble;
```

2. 建立一个 Bubble
```JavaScript
var horizontal = <Bubble symbolStyle={{left:'50%',marginLeft:-10}}>
    <div style={{width:270}}>Popup组件中的元素，在body被点击后，会隐藏</div>
</Bubble>;
```

3. 渲染
```JavaScript
ReactDOM.render(
    <Popup placement="top" content={horizontal}>
        <button className="btn btn-primary btn-sm">靠上的弹层</button>
    </Popup>,
    mountNode
);
```