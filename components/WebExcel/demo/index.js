/**
 * Created by xcp on 2016/4/12.
 */

const IndexHeaderWebExcel = require('../IndexHeaderWebExcel');
const BaseWebExcel = require('../BaseWebExcel');
const dom = require('../lib/dom');
const WebExcelModel = require('../WebExcelModel');
var css = require('../assets/excel.css');

// 基础模型
var baseWebExcel = new BaseWebExcel({
    parent: document.querySelector('#base-web-excel'),
    model: new WebExcelModel(10)
});


// 注册事件监听
// 单元格改变事件
// 该事件会传递到所有的cell上
baseWebExcel.on('change', function (oldVal, newVal, cell) {
    console.log('cell\'s value changed: ', oldVal, newVal, cell.x, cell.y);
});

// 单元格render后事件
// 该事件会传递到所有的cell上
baseWebExcel.on('cellRender', function (cell) {
    console.log('cellRender', cell.x, cell.y);
});

var region = dom.DOM.div({className: 'region'});
baseWebExcel.node.appendChild(region);

region.addEventListener('mouseup', function (e) {
    baseWebExcel.isDragStatus = false;
    baseWebExcel.agentTextArea.focus();
});

// 鼠标进行选择时事件
// 比如画出所选范围
baseWebExcel.on('moving', function (startNode, endNode, focusCells) {
    var start = {x: startNode.offsetLeft, y: startNode.offsetTop};
    var end = {
        x: endNode.offsetLeft + endNode.offsetWidth,
        y: endNode.offsetTop + endNode.offsetHeight
    };

    region.setAttribute('style', 'top:' + start.y + 'px;left:' + start.x
        + 'px;width:' + (end.x - start.x) + 'px;height:'
        + (end.y - start.y) + 'px');
});

baseWebExcel.on('startRegion', function (startNode) {
    try {
        baseWebExcel.node.appendChild(region)
    } catch (e) {
    }
});

baseWebExcel.on('endRegion', function (endNode) {
    try {
        baseWebExcel.node.removeChild(region)
    } catch (e) {
    }
});

baseWebExcel.render();