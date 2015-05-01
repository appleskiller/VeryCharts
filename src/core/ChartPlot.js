define(function (require , exports , module) {
    "use strict";
    var ChartComponent = require("verycharts/Component").ChartComponent;
    /**
     * chart图形基类。
     **/
    var ChartPlot = ChartComponent.extend({
        constructor: function ChartPlot(chart , renderer) {
            ChartComponent.apply(this , arguments);
        }
    });
    module.exports = {
        ChartPlot: ChartPlot ,
    };
});