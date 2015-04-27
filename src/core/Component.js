define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    var helper = require("verycharts/helper");
    
    var Component = oop.Class.extend({
        constructor: function Component(owner , renderer) {
            this.owner = owner;
            this.renderer = renderer;
        } ,
        owner: null ,
        renderer: null ,
        _options: null ,
        _data: null , 
        options: function (options) {
            if (arguments.length === 0){ return this._options; }
            this._options = options;
            this._isDirty = true;
            return this;
        } ,
        data: function (data) {
            if (arguments.length === 0){ return this._data; }
            this._data = data;
            this._isDirty = true;
            return this;
        } ,
        layout: function (bounds) {
            this._isDirty = true;
            return bounds;
        } ,
        render: function () {
            if (this._isDirty){
                this.redraw();
                this._isDirty = false;
            }
            return this;
        } ,
        redraw: function () {
            // 子类重写，以重绘
        } ,
        destroy: function () {
            this.renderer.remove();
            this.renderer = null;
            this.owner = null;
            this._options = null;
            this._data = null;
            this._bounds = null;
            this._bbox = null;
        } ,
        bounds: function (bounds) {
            if (arguments.length === 0){ return this._bounds; }
            this._bounds = bounds;
            this._isDirty = true;
            return this;
        } ,
        bbox: function (bbox) {
            if (arguments.length === 0){ return this._bbox; }
            this._bbox = bbox;
            this._isDirty = true;
            return this;
        }
    });
    
    module.exports = Component;
})