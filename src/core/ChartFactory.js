define(function (require , exports , module) {
    "use strict";
    
    var ChartDefault = require("verycharts/ChartDefault");
    
    var chartPlotLib = {};
    var componentLib = {};
    var rendererLib = {};
    
    /**
     * chart工厂对象。
     **/
    module.exports = {
        createChartPlot: function (chartType , chart , renderer) {
            if (chartPlotLib[chartType]){
                return new chartPlotLib[chartType](chart , renderer);
            }
            return null;
        } ,
        createComponent: function (componentName , chart , renderer) {
            if (componentLib[componentName]){
                return new componentLib[componentName](chart , renderer);
            }
            return null;
        } ,
        createRenderer: function (type , dom) {
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