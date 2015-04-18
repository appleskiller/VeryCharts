define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    require("d3");
    
    var Chart = oop.Class.extend({
        constructor: function Chart(selector) {
        } ,
        _dom: null ,
        _option: null ,
        _theme: null ,
        setOption: function (option) {
            this._option = option;
            return this;
        } ,
        getOption: function () {
            return this._option;
        } ,
        setTheme: function (theme) {
            this._theme = theme;
            return this;
        } ,
        resize: function () {
            return this;
        }
    });
    
    module.exports = Chart;
})