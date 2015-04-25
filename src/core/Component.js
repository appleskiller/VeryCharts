define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    var helper = require("verycharts/helper");
    
    var Component = oop.Class.extend({
        constructor: function Component(chart) {
            this.chart = chart;
        } ,
        chart: null ,
        _options: null ,
        _data: null , 
        options: function (options) {
            if (arguments.length === 0){ return this._options; }
            this._options = options;
            return this;
        } ,
        data: function (data) {
            if (arguments.length === 0){ return this._data; }
            this._data = data;
            return this;
        } ,
        layout: function (bounds) {
            return bounds;
        } ,
        render: function () {
            return this;
        } ,
        destroy: function () {
            this.chart = null;
            this._options = null;
            this._data = null;
            this._bounds = null;
            this._bbox = null;
        } ,
        getCanvas: function () {
            return this.chart.renderer.g("verychart-components");
        } ,
        bounds: function (bounds) {
            if (arguments.length === 0){ return this._bounds; }
            this._bounds = bounds;
            return this;
        } ,
        bbox: function (bbox) {
            if (arguments.length === 0){ return this._bbox; }
            this._bbox = bbox;
            return this;
        }
    });
    
    module.exports = Component;
})