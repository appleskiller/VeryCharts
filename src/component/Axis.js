define(function (require , exports , module) {
    "use strict";
    var Component = require("verycharts/Component").Component;
    var d3 = require("d3");
    /**
     * 轴组件。
     **/
    var Axis = Component.extend({
        constructor: function Axis(owner , renderer) {
            Component.apply(this , arguments);
        } ,
        // axisType: null , // "ordinal" | "linear"
        // type: null , // "x" | "y"
        _scale: null ,
        _axis: null ,
        scale: function () {
            if (arguments.length === 0) {return this._scale}
            this._scale = arguments[0];
            var axis = this.axis();
            if (axis)
                axis.scale(this._scale);
            this._isDirty = true;
            return this;
        } , 
        axis: function () {
            if (arguments.length === 0) {return this._axis}
            this._axis = arguments[0];
            var scale = this.scale();
            if (scale){
                this._axis.scale(scale);
            }
            this._isDirty = true;
            return this;
        } ,
        redraw: function () {
            var axisDisplay = this.renderer.select(".axis");
            if (axisDisplay.empty()){
                axisDisplay = this.renderer.g().attr("class" , "axis");
            }
            axisDisplay.call(this.axis());
            return this;
        } ,
        clean: function () {
            this.renderer.select(".axis").remove();
            return this;
        } ,
        destroy: function () {
            this._scale = null ,
            this._axis = null ,
            Component.prototype.destroy.apply(this , arguments);
        } ,
        _createScale: function (axisType) {
            if (axisType === "ordinal"){
                return d3.scale.ordinal();
            } else if (axisType === "linear"){
                return d3.scale.linear();
            } else if (axisType === "log") {
                return d3.scale.log();
            }
            return d3.scale.linear();
        } ,
        _createAxis: function (rendererType) {
            // TODO 根据不同呈现器类型创建不同的轴。
            return d3.svg.axis();
        }
    });
    
    var OrdinalAxis = Axis.extend({
        constructor: function XAxis(owner , renderer , axisType) {
            // body...
        } ,
        
    })
    
    var defaultOptions = {
        "enabled": true ,
        "axisType": "linear" , // 轴类型
        "allowDecimals": false , // 是否允许小数位
        "alternateGridColor": [], // 隔列颜色
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