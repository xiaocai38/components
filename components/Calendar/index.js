/**
 * Created by xcp on 2016/4/27.
 */

const moment = require('moment');
const DropDown = require('../Selectable/DropDown');
const React = require('react');
const noop = require('../../com/noop');
const DatePicker = require('./DatePicker');
const PickerHeader = require('./PickerHeader');

const addTimes = function (baseTime, num, unit) {
    return moment(baseTime).clone().add(num, unit);
};

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
            currentTime: null
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
            startTime: [2010, 1, 1],
            endTime: [2020, 1, 1],

            defaultTime: new Date() * 1,
            showDays: 6 * 7,
            weekDaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

            startWeek: 0, // [0-6]
            format: 'YYYY-MM-DD HH:mm:ss',

            disabledDate: disabledDate,
            diffDate: diffDate,
            onChange: noop,
            onSelect: noop
        }
    },

    componentWillMount: function () {
        this.setState({
            currentTime: moment(this.props.defaultTime),
            showDays: this.props.showDays
        });
    },

    nextMonth: function () {
        this.setState({currentTime: addTimes(this.state.currentTime, 1, 'month')})
    },

    previousMonth: function () {
        this.setState({currentTime: addTimes(this.state.currentTime, -1, 'month')})
    },

    nextYear: function () {
        this.setState({currentTime: addTimes(this.state.currentTime, 1, 'year')})
    },

    previousYear: function () {
        this.setState({currentTime: addTimes(this.state.currentTime, -1, 'year')})
    },

    today: function () {
        this.setState({currentTime: moment()})
    },

    _isSameDate: function (base, comp) {
        return base.isSame(comp, 'year') &&
            base.isSame(comp, 'month') &&
            base.isSame(comp, 'day')
    },

    // 如果年份或月分发生了变化
    // 则更新
    shouldComponentUpdate: function (nextProps, nextState) {
        if (!this._isSameDate(nextState.currentTime, this.state.currentTime)) {
            this.props.onChange(nextState.currentTime, this.state.currentTime);
        }
        return nextState.changeFromHeader
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
        this.setState({
            currentTime: moment([year, month, 1]),
            changeFromHeader: true
        })
    },

    onSelect: function (cur) {
        this.setState({
            currentTime: cur,
            changeFromHeader: false
        });
        this.props.onSelect(cur);
    },

    render: function () {
        var self = this;
        var props = self.props;
        var state = self.state;

        var m = moment(state.currentTime);

        // 获得当前月的第一天
        var firstDay = m.clone().date(1);

        // 获得第一天的星期
        var w = firstDay.day();

        // 计算其开始位置的日期
        // 从周日开始[默认为0]
        var start = w > props.startWeek ?
            firstDay.clone().add(-(w - props.startWeek), 'day') :
            firstDay;

        self.__startTime = start;

        var total = props.showDays;
        var count = 0;

        // 循环生成每一天
        // 日期分成多份，每份长度为一周
        var list = this._spliceArray(new Array(total).fill(true), 7);
        var l = list.length - 1;
        var days = list.map(function (week, index) {
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
                            time={time}/>
                    </td>
                })}
            </tr>
        });

        var week = [];

        total = props.weekDaysMin.length;
        count = props.startWeek;

        while (count < total) {
            week.push(<td key={'week-' + count}>
                <div>{props.weekDaysMin[count++]}</div>
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

        return <div className={props.wrapClassName}>
            <PickerHeader
                className={props.headerClassName}
                currentTime={state.currentTime}
                startTime={props.startTime}
                endTime={props.endTime}
                onChange={this.onHeaderChange}/>
            <table>
                <thead>{week}</thead>
                <tbody>{days}</tbody>
            </table>
        </div>
    }
});

module.exports = Calendar;