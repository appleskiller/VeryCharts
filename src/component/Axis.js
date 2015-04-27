define(function (require , exports , module) {
    "use strict";
    var Component = require("verycharts/Component");
    require("d3");
    /**
     * 轴组件。
     **/
    var Axis = Component.extend({
        constructor: function Axis(owner , renderer , axisType) {
            this.axisType = axisType;
            Component.apply(this , arguments);
        } ,
        axisType: null , // "x"|"y"
        _ranges: null ,
        _axis: null ,
        layout: function (bounds) {
            var options = this.options();
            if (!this.enabled()){
                return bounds;
            }else{
                
            }
            return bounds;
        } ,
        redraw: function () {
            // body...
            return this;
        } ,
        clean: function () {
            // body...
            return this;
        } ,
        destroy: function () {
            this._ranges = null ,
            this._axis = null ,
            Component.prototype.destroy.apply(this , arguments);
        }
    });
    
    var defaultOptions = {
        "enabled": true ,
        "allowDecimals": false , // 是否允许小数位
        "alternateGridColor": [], // 隔列颜色
        "categories": [] , // 分类项目
        "max": null ,
        "maxPadding": 0.12 ,
        "min": null ,
        "minPadding": 0.12 ,
        "offset": 0, // 轴标题位置
        "opposite": false , // 轴位置翻转
        
        "dateTimeLabelFormats": {
            'millisecond': '%H:%M:%S.%L',
        	'second': '%H:%M:%S',
        	'minute': '%H:%M',
        	'hour': '%H:%M',
        	'day': '%e. %b',
        	'week': '%e. %b',
        	'month': '%b \'%y',
        	'year': '%Y'
        },
        "grid": {
            "gridLineColor": "#C0C0C0",
            "gridLineDashStyle": "solid",
            "gridLineWidth": 1,
            "minorGridLineColor": "#E0E0E0",
            "minorGridLineDashStyle": "dash" ,
            "minorGridLineWidth": 1,
        } ,
        "line": {
            "lineColor": "#C0D0E0",
            "lineWidth": 1,
        } ,
        "tick": {
            "tickColor": "#C0D0E0" ,
            "tickInterval": "auto" ,
            "tickLength": 6 ,
            "tickPosition": "inside",
            "tickWidth": 1 ,
            "minorTickColor": "#A0A0A0",
            "minorTickInterval": null ,
            "minorTickLength": 2 ,
            "minorTickPosition": "inside" ,
            "minorTickWidth": 1 ,
        } ,
        "labels": {
            "enabled": true ,
            "align": "center" ,
            "formatter": null , // 字符串或函数
            "overflow": false , // 如何处理溢出
            "rotation":  null , // 旋转角度
        } ,
        "title": {
            "text": "{name}" ,
            "align": {},
            "margin": {},
            "offset": {},
            "rotation": {},
            "style": {},
        } ,
        // "plotBands": {
        //     "color": {},
        //     "events": {},
        //     "from": {},
        //     "id": {},
        //     "to": {},
        //     "zIndex": {},
        //     "label": {
        //         "align": {},
        //         "rotation": {},
        //         "style": {},
        //         "textAlign": {},
        //         "useHTML": {},
        //         "verticalAlign": {},
        //         "x": {},
        //         "y": {}
        //     }
        // },
        // "plotLines": {
        //     "color": {},
        //     "dashStyle": {},
        //     "events": {},
        //     "id": {},
        //     "value": {},
        //     "width": {},
        //     "zIndex": {},
        //     "label": {
        //         "align": {},
        //         "rotation": {},
        //         "style": {},
        //         "textAlign": {},
        //         "useHTML": {},
        //         "verticalAlign": {},
        //         "x": {},
        //         "y": {}
        //     }
        // }
    }
    module.exports = Axis;
});