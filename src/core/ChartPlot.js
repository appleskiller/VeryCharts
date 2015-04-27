define(function (require , exports , module) {
    "use strict";
    var Component = require("verycharts/Component");
    /**
     * chart图形基类。
     **/
    var ChartPlot = Component.extend({
        constructor: function ChartPlot(chart , renderer) {
            Component.apply(this. arguments);
        }
    });
    
    var AxisPlot = ChartPlot.extend({
        
    });
    
    module.exports = {
        ChartPlot: ChartPlot ,
        AxisPlot: AxisPlot
    };
});