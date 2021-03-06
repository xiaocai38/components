/**
 * Created by xcp on 2016/4/27.
 */

const React = require('react');
const moment = require('moment');
const DropDown = require('../Selectable/DropDown');
const noop = require('../../com/noop');
const DatePicker = require('./DatePicker');
const PickerHeader = require('./PickerHeader');

// 如果日期在当前日期之前，则禁用掉
const disabledDate = function (time) {
  return time.isBefore(new Date(), 'day')
};

// 如果日期不属于同一月，则表示diff
const diffDate = function (base, comp) {
  return !(base.isSame(comp, 'month') && base.isSame(comp, 'year'))
};

const Calendar = React.createClass({

  propTypes: {
    weekDaysMin: React.PropTypes.array
  },

  getInitialState: function () {
    return {
      show: false,
      changeFromHeader: false,
      currentTime: null,
      onlyShowMonth: false
    }
  },

  getDefaultProps: function () {
    return {
      // class name
      wrapClassName: 'comp-date-picker',
      headerClassName: 'date-header',
      disabledClassName: 'disabled',
      currentClassName: 'curr',
      diffMonthClassName: 'diff',

      // header
      startTime: [2010, 0, 1],
      endTime: [2020, 0, 1],

      defaultTime: new Date() * 1,
      showDays: 6 * 7,
      weekDaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

      startWeek: 0, // [0-6]
      format: 'YYYY-MM-DD HH:mm:ss',
      onlyShowMonth: false,
      disabledDate: disabledDate,
      diffDate: diffDate,
      onChange: noop,
      onSelect: noop,
      onMount: noop,
      shouldUpdate: noop,
      getContent: function (time) {
        return <div>{time.date()}</div>
      }
    }
  },

  componentWillMount: function () {
    this.setState({
      currentTime: moment(this.props.defaultTime),
      showDays: this.props.showDays,
      onlyShowMonth: this.props.onlyShowMonth
    });
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      currentTime: moment(nextProps.defaultTime),
      showDays: nextProps.showDays,
      onlyShowMonth: nextProps.onlyShowMonth
    });
  },

  componentDidMount: function () {
    this.props.onMount(this)
  },

  // 如果年份或月分发生了变化
  // 则更新
  shouldComponentUpdate: function (nextProps, nextState) {
    return nextState.changeFromHeader || !!this.props.shouldUpdate()
  },

  today: function () {
    this.setState({currentTime: moment()})
  },

  _isSameDate: function (base, comp) {
    return base.isSame(comp, 'year') &&
        base.isSame(comp, 'month') &&
        base.isSame(comp, 'day')
  },

  _spliceArray: function (arr, step) {
    var l = arr.length;
    var start = 0;
    var r = [];
    while (start < l) {
      r.push(arr.slice(start, start + step));
      start += step;
    }
    return r;
  },

  onHeaderChange: function (year, month) {
    // 如果当前选中的时间和下一次更新的时间的月份相同
    // 那么设置下一次的天为当前的天数
    // 也就是说当前选中的日期，在下一次UI刷新时[月分相同]，依然为选中状态
    var cur = this.state.currentTime;
    var nextDate = 1;
    if (month === cur.month()) {
      nextDate = cur.date()
    }
    var next = moment([year, month, nextDate]);

    this.setState({currentTime: next, changeFromHeader: true},
        function () {
          this._onChange(next, cur);
        });
  },

  onSelect: function (cur) {
    var prev = this.state.currentTime;

    this.setState({currentTime: cur, changeFromHeader: false},
        function () {
          this.props.onSelect(cur);
          this._onChange(cur, prev);
        }.bind(this));
  },

  _onChange: function (cur, prev) {
    if (!this._isSameDate(cur, prev)) {
      this.props.onChange(cur, prev);
    }
  },

  render: function () {
    var self = this;
    var props = self.props;
    var state = self.state;

    var m, firstDay, w, start,
        total, count, list, l, days,
        week, datePanel;

    if (!state.onlyShowMonth) {
      m = moment(state.currentTime);
      // 获得当前月的第一天
      firstDay = m.clone().date(1);
      // 获得第一天的星期
      w = firstDay.day();
      // 计算其开始位置的日期
      // 从周日开始[默认为0]
      start = w > props.startWeek ?
          firstDay.clone().add(-(w - props.startWeek), 'day') :
          firstDay;

      self.__startTime = start;

      total = props.showDays;
      count = 0;

      // 循环生成每一天
      // 日期分成多份，每份长度为一周
      list = this._spliceArray(new Array(total).fill(true), 7);
      l = list.length - 1;
      days = list.map(function (week, index) {
        return <tr key={index}>
          {week.map(function () {
            var time = start.clone().add(count++, 'day');

            if (index === l) {
              self.__endTime = time
            }

            return <td key={count}>
              <DatePicker
                  className={props.headerClassName}
                  onSelect={self.onSelect}
                  diffMonthClassName={props.diffMonthClassName}
                  disabledClassName={props.disabledClassName}
                  currentClassName={props.currentClassName}
                  currentTime={m}
                  disabledDate={props.disabledDate}
                  diffDate={props.diffDate}
                  format={props.format}
                  time={time}
                  getContent={props.getContent}/>
            </td>
          })}
        </tr>
      });

      week = [];
      total = props.weekDaysMin.length;
      count = props.startWeek;

      while (count < total) {
        week.push(<td key={'week-' + count}>
          <div className="date-week">{props.weekDaysMin[count++]}</div>
        </td>);
      }

      count = 0;
      total = props.startWeek;
      while (count < total) {
        week.push(<td key={'week-' + count}>
          <div>{props.weekDaysMin[count++]}</div>
        </td>)
      }

      week = <tr>{week}</tr>;

      datePanel = <table>
        <thead>{week}</thead>
        <tbody>{days}</tbody>
      </table>;
    }

    return <div className={props.wrapClassName}>
      <PickerHeader
          className={props.headerClassName}
          currentTime={state.currentTime}
          startTime={props.startTime}
          endTime={props.endTime}
          onChange={this.onHeaderChange}/>
      {datePanel}
    </div>
  }
});

module.exports = Calendar;