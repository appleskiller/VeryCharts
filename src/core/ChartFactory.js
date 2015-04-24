define(function (require , exports , module) {
    "use strict";
    
    var oop = require("oop");
    var ChartDefault = require("verycharts/ChartDefault");
    var ChartPlot = require("verycharts/ChartPlot");
    var Component = require("verycharts/Component");
    var Renderer = require("verycharts/ChartRenderer");
    
    var chartPlotLib = {};
    var componentLib = {};
    var rendererLib = {};
    
    module.exports = {
        getChartPlotInstance: function (chartType) {
            if (chartPlotLib[chartType]){
                return new chartPlotLib[chartType]();
            }
            return null;
        } ,
        getComponentInstance: function (componentName , chart) {
            if (componentLib[componentName]){
                return new componentLib[componentName](chart);
            }
            return null;
        } ,
        getRendererInstance: function (type , target) {
            if (rendererLib[type]){
                return new rendererLib[type](target);
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
            } else if (oop.is(ctor , Renderer)){
                rendererLib[type] = ctor;
            }
        } 
    }
});