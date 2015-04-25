define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    var d3 = require("d3");
    var htmlUtil = require("verycharts/htmlUtil");
    var ChartFactory = require("verycharts/ChartFactory");
    // 缺省d3 SVG renderer
    var Renderer = oop.Class.extend({
        constructor: function Renderer(dom) {
            this.selection = d3.select(dom).append("svg");
        } ,
        getType: function () {
            return "svg";
        } ,
        select: function () {
            return this.selection.select.apply(this.selection , arguments);
        } ,
        selectAll: function () {
            return this.selection.selectAll.apply(this.selection , arguments);
        } ,
        attr: function () {
            return this.selection.attr.apply(this.selection , arguments);
        } ,
        g: function (className) {
            var g = this.selection.select(className)
            if (g.empty()){
                g = this.selection.append("g").attr("class" , className);
            }
            return g;
        } ,
        destroy: function () {
            this.selection.remove();
            this.selection = null;
        }
    });
    
    ChartFactory.register({
        type: "svg" ,
        factory: "renderer" ,
        ctor: Renderer
    });
    module.exports = Renderer;
})