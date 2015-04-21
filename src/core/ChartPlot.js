define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    
    var chartType = "chart";
    
    var ChartPlot = oop.Class.extend({
        constructor: function ChartPlot(chart , defaultOptions) {
            this._chart = chart;
            this._defaultOptions = defaultOptions;
        } ,
        _viewPort: null ,
        _chart: null ,
        _defaultOptions: null ,
        getChartType: function () {
            return chartType;
        } ,
        setViewPort: function (viewport) {
            this._viewPort = viewport;
        }
    })
    
    module.exports = ChartPlot;
});