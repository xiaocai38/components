## Dialog

## Props
+ style - 外层容器style - {backgroundColor: '#fff'}
+ className - 外层容器className - 'bub-dialog bubble-company-staff'
+ refTarget - 依赖节点，点击依赖节点时，不会触发弹层关闭行为 - null
+ visible - 是否显示 - true - 暂时不要改动该配置，因为该组件隐藏后会卸载，所以show也show不出来...
+ onHide - 关闭后的回调 - noop
+ onComponentMount(inst, wrap) - 组件挂载时回调 - noop
  - `inst` 为组件实例
  - `wrap` 为包装容器， 是一个 `Node` 对象，可以往里塞内容，
     比如:`wrap.innerHTML = <h2>123</h2>`，也可以将`angular` compile 之后的内容
     添加到 `wrap` 中
  - <div class="warning">将要被废弃,请用onMount 代替</div>
+ onMount(inst, wrap) - 组件挂载时回调 - noop
  - `inst` 为组件实例
  - `wrap` 为包装容器， 是一个 `Node` 对象，可以往里塞内容，
     比如:`wrap.innerHTML = <h2>123</h2>`，也可以将`angular` compile 之后的内容
     添加到 `wrap` 中
       
## Methods
+ `hide` 关闭弹层，如果关闭成功，返回true，否则返回false。

```JavaScript
var Dialog = require('essa-components').Popup.Dialog;
var MountDialog = React.createClass({
  getInitialState: function () {
    return {show: false}
  },
  renderDialog: function () {
    this._mountNode = document.createElement('div');
    document.body.appendChild(this._mountNode);
    ReactDOM.render(<Dialog
            onMount={this.onMount}
            onHide={this.onHide}/>,
        this._mountNode
    );
  },
  onMount: function (inst, wrapNode) {
    wrapNode.innerHTML = '<h2>Dialog Content</h2>';
  },
  onHide: function () {
    var self = this;
    this.setState({show: false}, function () {
      document.body.removeChild(self._mountNode);
    })
  },
  // 如果下一次的状态是显示，且不与上一次的状态相同
  // 则表明上一次的状态是未显示，也就是未渲染
  // 所以应该渲染Dialog
  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.show !== this.state.show && this.state.show) {
      this.renderDialog()
    }
  },
  toggle: function () {
    this.setState({show: !this.state.show})
  },
  render: function () {
    var text = this.state.show ? '再点我就关了' : '点我显示Dialog';
    return <div>
      <button
          onClick={this.toggle}
          className="btn btn-default btn-sm">
        {text}
      </button>
    </div>
  }
});
ReactDOM.render(<MountDialog/>, mountNode);
```
