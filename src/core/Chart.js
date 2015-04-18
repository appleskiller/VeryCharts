define(function (require , exports , module) {
    "use strict";
    var evts = require("evts");
    require("d3");
    
    var Chart = evts.EventTrigger.extend({
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