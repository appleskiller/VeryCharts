define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    var ChartSpace = require("verycharts/ChartSpace");
    var ChartFactory = require("verycharts/ChartFactory");
    
    var spaceType = "screen";
    
    var ScreenSpace = ChartSpace.extend({
        constructor: function ScreenSpace(chart) {
            this._chart = chart;
            this._plots = [];
        } ,
        setOptions: function (options) {
            this._options = options;
        } ,
        layout: function () {
            // body...
        }
    });
    
    ChartFactory.register({
        type: spaceType ,
        ctor: ChartSpace
    })
    
    module.exports = ChartSpace;
});