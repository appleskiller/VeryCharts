define(function (require , exports , module) {
    "use strict";
    var evts = require("evts");
    var ChartFactory = require("verycharts/ChartFactory");
    // 缺省SVG renderer
    var Element = evts.EventTrigger.extend({
        constructor: function Element(canvas , parent) {
            this.canvas = canvas;
        } ,
        canvas: null ,
        parent: null ,
        css: function (value) {
            // body...
            return this;
        } ,
        attr: function (value) {
            // body...
            return this;
        } ,
        getBBox: function () {
            // body...
        } ,
        toFront: function () {
            // body...
        } ,
        add: function () {
            // body...
            return this;
        } ,
        destroy: function () {
            // body...
        }
    })
    var Path = Element.extend({
        constructor: function Path(renderer) {
            // body...
        } ,
        datas: function (value) {
            // body...
        }
    })
    var Label = Element.extend({
        constructor: function Label(renderer) {
            // body...
        } ,
        text: function (value) {
            // body...
        } ,
    })
    var Renderer = evts.EventTrigger.extend({
        constructor: function Renderer(ctx) {
            // body...
        } ,
        label: function (text , left , top) {
            // body...
        } ,
        path: function (datas) {
            // body...
        } ,
        g: function () {
            // body...
        } ,
        circle: function (centerX , centerY , radius) {
            
        } ,
        image: function (source, x, y, width, height){
            
        } ,
        rect: function (x , y , width , height , cornerRadius) {
            // body...
        } 
    });
    
    ChartFactory.register({
        type: "svg" ,
        ctor: Renderer
    });
    module.exports = Renderer;
})