define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    var ChartDefault = require("verycharts/ChartDefault");
    
    var Component = oop.Class.extend({
        constructor: function Component(chart) {
            this.chart = chart;
        } ,
        chart: null ,
        options: null ,
        data: null , 
        setOptions: function (options) {
            this.options = options;
            return this;
        } , 
        setData: function (data) {
            this.data = data;
            return this;
        } ,
        layout: function () {
            return this;
        } ,
        render: function () {
            return this;
        }
    });
    
    module.exports = Component;
})