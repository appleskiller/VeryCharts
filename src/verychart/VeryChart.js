define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    var Chart = require("verycharts/Chart");
    
    var VeryChart = oop.Class.extend({
        constructor: function VeryChart(selector) {
            this._chart = new Chart(selector);
        } ,
        _chart: null ,
        _data: null ,
        setData: function (data) {
            this._data = data;
            return this;
        } ,
        setOption: function (option) {
            this._chart.setOption(option);
            return this;
        } ,
        getOption: function () {
            return this._chart.getOption();
        } ,
        setTheme: function (theme) {
            this._chart.setTheme(theme);
            return this;
        } ,
        resize: function () {
            this._chart.resize();
            return this;
        }
    });
    
    module.exports = VeryChart;
})