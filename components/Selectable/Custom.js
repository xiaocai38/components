/**
 * Created by xcp on 2016/3/23.
 */

var React = require('react');
var DropDown = require('./DropDown');
var noop = require('../../com/noop');

var Custom = React.createClass({

  getInitialState: function () {
    return {
      currentSelectedValue: null,
      disabled: true
    }
  },

  getDefaultProps: function () {
    return {
      itemList: [],
      wrapClassName: null,
      defaultSelectedValue: null,
      disabled: false,
      onSelect: noop,
      getItemWrap: noop,
      getSelectorContent: noop,
      getItemsContent: noop,
      getItemContent: noop
    }
  },

  onSelect: function (value) {
    this.props.onSelect(value)
  },

  componentWillMount: function () {
    this.setState({
      currentSelectedValue: this.props.defaultSelectedValue === null ?
          this.props.itemList[0] :
          this.props.defaultSelectedValue,
      disabled: this.props.disabled
    })
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      currentSelectedValue: nextProps.defaultSelectedValue,
      disabled: nextProps.disabled
    })
  },

  ensureEvent: function () {
    return this.state.currentSelectedValue !== this.props.rejectValue && !this.state.disabled;
  },

  render: function () {
    var self = this;
    var props = self.props;

    var selectorContent = <DropDown.Selector
        defaultSelectedValue={self.state.currentSelectedValue}
        getSelectorContent={props.getSelectorContent}/>;

    var panelContent = props.getItemsContent(props, self.state, this) ||
        props.itemList.map(function (value, index) {
          return <DropDown.Item
              value={value}
              key={index}
              getItemContent={props.getItemContent}/>;
        });

    return <DropDown
        onSelect={self.onSelect}
        disabled={this.state.disabled}
        getItemWrap={props.getItemWrap}
        wrapClassName={props.wrapClassName}
        selectorBindEvent={this.ensureEvent()}
        selectorContent={selectorContent}
        panelContent={panelContent}/>
  }
});

module.exports = Custom;