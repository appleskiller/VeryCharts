define(function (require , exports , module) {
    "use strict";
    
    var ChartDefault = require("verycharts/ChartDefault");
    
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
        getRendererInstance: function (type , dom) {
            if (rendererLib[type]){
                return new rendererLib[type](dom);
            }
            return null;
        } ,
        register: function (desc) {
            if (!desc) return;
            var type = desc.type , factory = desc.factory , ctor = desc.ctor , 
                defaultOptions = desc.defaultOptions;
            if (!type || !factory || !ctor) return;
            if (factory === "plot"){
                chartPlotLib[type] = ctor;
                ChartDefault.mergeDefault(defaultOptions);
            } else if (factory === "component"){
                componentLib[type] = ctor;
                ChartDefault.mergeDefault(defaultOptions);
            } else if (factory === "renderer"){
                rendererLib[type] = ctor;
            }
        } 
    }
});