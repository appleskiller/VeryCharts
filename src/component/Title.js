define(function (require , exports , module) {
    "use strict";
    var Component = require("verycharts/Component");
    var ChartFactory = require("verycharts/ChartFactory")
    
    var Title = Component.extend({
        constructor: function Title(chart) {
            Component.apply(this , arguments);
        } ,
        options: null ,
        setOptions: function (options) {
            this.option = options
            return this;
        } , 
        layout: function () {
            return this;
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
                "style": {
                    "font": {
                        "family": "Verdana , Arial, sans-serif" ,
                        "size": 12 ,
                        "color": "#000000" ,
                    } 
                } ,
                "position": {
                    "horizontal": "center" ,
                    "vertical": "top" ,
                    "float": false
                }
            }
        }
    });
    
    module.exports = Title;
})