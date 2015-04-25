define(function (require , exports , module) {
    "use strict";
    var helper = require("verycharts/helper");
    var Component = require("verycharts/Component");
    var ChartFactory = require("verycharts/ChartFactory");
    var htmlUtil = require("verycharts/htmlUtil");
    
    var Title = Component.extend({
        constructor: function Title(chart) {
            Component.apply(this , arguments);
        } ,
        options: function (options) {
            if (arguments.length === 0) { return this._options; }
            this._options = options.title;
            this._options.style = helper.parseOption("stats" , this._options.style);
            return this;
        } , 
        layout: function (bounds) {
            var options = this.options();
            if (options.enabled === false){
                return bounds;
            }else{
                var layout = options.layout , retBounds = bounds ;
                var titleSize = this._calcTextSize(options);
                var xx , yy , ww , hh , bbxx , bbyy , bbww , bbhh;
                if (layout.anchor === "bottom"){
                    ww = bounds.width ; hh = titleSize.height + layout.margin*2; xx = bounds.x ; yy = bounds.y + bounds.height - hh ;
                    bbww = titleSize.width; bbhh = titleSize.height;
                    if (layout.floating !== true){ retBounds.height -= hh; }
                }else if (layout.anchor === "left"){
                    ww = titleSize.height + layout.margin*2 ; hh = bounds.height; xx = bounds.x ; yy = bounds.y ;
                    bbww = titleSize.height; bbhh = titleSize.width;
                    if (layout.floating !== true){ retBounds.x -= ww ; retBounds.width -= ww; }
                }else if (layout.anchor === "right"){
                    ww = titleSize.height + layout.margin*2 ; hh = bounds.height; xx = bounds.x + bounds.width - ww ; yy = bounds.y ;
                    bbww = titleSize.height; bbhh = titleSize.width;
                    if (layout.floating !== true){ retBounds.width -= ww; }
                }else{
                    ww = bounds.width ; hh = titleSize.height + layout.margin*2; xx = bounds.x ; yy = bounds.y ; 
                    bbww = titleSize.width; bbhh = titleSize.height;
                    if (layout.floating !== true){ retBounds.y -= hh; retBounds.height -= hh; }
                }
                this.bounds({x: xx , y: yy , width: ww , height: hh});
                if (layout.horizontal === "right"){
                    bbxx = xx + ww - layout.margin - bbww;
                }else if (layout.horizontal === "center"){
                    bbxx = xx + Math.floor((ww - bbww)/2);
                }else{
                    bbxx = xx + layout.margin;
                }
                if (layout.vertical === "bottom"){
                    bbyy = yy + hh - layout.margin - bbhh;
                }else if (layout.vertical === "center"){
                    bbyy = yy + Math.floor((hh - bbhh)/2);
                }else{
                    bbyy = yy + layout.margin;
                }
                this.bbox({x: bbxx , y: bbyy , width: bbww , height: bbhh});
                return retBounds;
            }
        } ,
        render: function () {
            var canvas = this.getCanvas();
            var display = canvas.select(".title");
            var options = this.options();
            if (options.enabled === false){
                if (!display.empty()){
                    display.remove();
                }
            }else{
                if (display.empty()){
                    display = canvas.append("text").attr("class" , "title");
                }
                var bbox = this.bbox();
                var transform = "";
                var layout = options.layout;
                var normalStyle = options.style.normal;
                if (layout.anchor === "left"){
                    transform = "translate(" + bbox.width + " , " + bbox.height + ")";
                    transform += " rotate(-90 , " + bbox.x + " , " + bbox.y + ")";
                } else if (layout.anchor === "right"){
                    transform = "rotate(90 , " + bbox.x + " , " + bbox.y + ")";
                } else {
                    transform = "translate(0 , " + bbox.height + ")";
                }
                //描绘的时候上提2像素位置
                display.attr("x" , bbox.x)
                        .attr("y" , bbox.y - 2)
                        .attr("transform" , transform)
                        .style({
                            "fill": normalStyle.color ,
                            "font-size": normalStyle.fontSize + "px" ,
                            "font-weight": normalStyle.fontWeight ,
                            "font-family": normalStyle.fontFamily
                        })
                        .text(options.text);
            }
            return this;
        } ,
        _calcTextSize: function (options) {
            var fontOpt = options.style.normal;
            return htmlUtil.stringSize(options.text , {
                "font-size": fontOpt.fontSize + "px" ,
                "font-weight": fontOpt.fontWeight ,
                "font-family": fontOpt.fontFamily
            });
        }
    });
    
    ChartFactory.register({
        type: "title" ,
        factory: "component" ,
        ctor: Title ,
        defaultOptions: {
            "title": {
                "enabled": true ,
                "text": "Chart Title" ,
                // "useHTML": false ,
                "style": {
                    "normal": {
                        "color": "#000000" ,
                        "fontSize": 24 ,
                        "fontWeight": "none" ,
                        "fontFamily": "Verdana , Arial, sans-serif"
                    }
                } ,
                "layout": {
                    "floating": false ,
                    "anchor": "top" ,
                    "horizontal": "center" ,
                    "vertical": "center" ,
                    "margin": 4 ,
                }
            }
        }
    });
    
    module.exports = Title;
})