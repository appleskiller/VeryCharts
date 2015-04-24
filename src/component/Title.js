define(function (require , exports , module) {
    "use strict";
    var helper = require("verycharts/helper");
    var Component = require("verycharts/Component");
    var ChartFactory = require("verycharts/ChartFactory")
    
    var Title = Component.extend({
        constructor: function Title(chart) {
            Component.apply(this , arguments);
        } ,
        options: null ,
        setOptions: function (options) {
            this.option = options.title;
            this.option.style = helper.parseOption("stats" , this.option.style);
            return this;
        } , 
        layout: function (bounds) {
            if (this.options.enabled === false){
                return bounds;
            }else{
                
            }
        } ,
        render: function () {
            return this;
        }
    });
    
    ChartFactory.register({
        type: "title" ,
        ctor: Title ,
        defaultOptions: {
            "title": {
                "enabled": true ,
                "text": "Chart Title" ,
                // "useHTML": false ,
                "style": {
                    "normal": {
                        "color": "#000000" ,
                        "fontSize": 12 ,
                        "fontWeight": "none" ,
                        "fontFamily": "Verdana , Arial, sans-serif"
                    }
                } ,
                "layout": {
                    "floating": false ,
                    "anchor": "top" ,
                    "horizontal": "center" ,
                    "vertical": "top" ,
                    "margin": 0 ,
                }
            }
        }
    });
    
    module.exports = Title;
})