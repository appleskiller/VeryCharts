define(function (require , exports , module) {
    "use strict";
    
    var oop = require("oop");
    var ChartDefault = require("verycharts/ChartDefault");
    var ChartPlot = require("verycharts/ChartPlot");
    var Component = require("verycharts/Component");
    
    var chartPlotLib = {};
    var componentLib = {};
    
    module.exports = {
        getChartPlotInstance: function (chartType) {
            if (chartPlotLib[chartType]){
                var instance = new chartPlotLib[chartType]();
                return instance;
            }
            return null;
        } ,
        getComponentInstance: function (componentName , chart) {
            if (componentLib[componentName]){
                var instance = new componentLib[componentName](chart);
                return instance;
            }
            return null;
        } ,
        register: function (desc) {
            if (!desc) return;
            var type = desc.type , ctor = desc.ctor , 
                defaultOptions = desc.defaultOptions;
            if (!type || !ctor) return;
            if (oop.is(ctor , ChartPlot)){
                chartPlotLib[type] = ctor;
                ChartDefault.mergeDefault(defaultOptions);
            } else if (oop.is(ctor , Component)){
                componentLib[type] = ctor;
                ChartDefault.mergeDefault(defaultOptions);
            }
        } 
    }
});