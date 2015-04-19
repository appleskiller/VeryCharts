define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    var ChartDefault = require("verycharts/ChartDefault");
    
    var Component = oop.Class.extend({
        constructor: function Component(chart) {
            this._chart = chart;
        } ,
        _chart: null ,
        setOptions: function (options) {
            this._options = options;
            return this;
        }
    });
    
    module.exports = Component;
})