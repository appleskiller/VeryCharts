define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    
    var chartType = "chart";
    
    var ChartPlot = oop.Class.extend({
        constructor: function ChartPlot(chart) {
            this.chart = chart;
        } ,
        viewPort: null ,
        chart: null ,
        options: null ,
        data: null ,
        getChartType: function () {
            return chartType;
        } ,
        setOptions: function (options) {
            // body...
            return this;
        } ,
        setData: function () {
            // body...
            return this;
        } ,
        setViewPort: function (viewport) {
            this.viewPort = viewport;
            return this;
        } ,
        destroy: function () {
            
        }
    })
    
    module.exports = ChartPlot;
});