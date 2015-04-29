define(function (require , exports , module) {
    "use strict";
    var helper = require("verycharts/helper");
    var ChartComponent = require("verycharts/Component").ChartComponent;
    var ChartFactory = require("verycharts/ChartFactory");
    var htmlUtil = require("verycharts/htmlUtil");
    /**
     * 标题组件。
     **/
    var Title = ChartComponent.extend({
        constructor: function Title(owner , renderer) {
            ChartComponent.apply(this , arguments);
        } ,
        options: function (options) {
            if (arguments.length === 0) { return this._options; }
            options = options.title;
            options.style = helper.parseOption("stats" , options.style);
            return ChartComponent.prototype.options.call(this , options);
        } , 
        layout: function (bounds) {
            var options = this.options();
            if (!this.enabled()){
                return bounds;
            }else{
                var titleSize = this._getTitleSize(options);
                var ret = helper.archorLayout(titleSize , bounds , options.layout);
                this.bounds(ret.bounds).bbox(ret.bbox);
                return ret.rest;
            }
        } ,
        clean: function () {
            this.renderer.select(".title").remove();
            return this;
        } ,
        redraw: function () {
            var renderer = this.renderer;
            var titleDisplay = renderer.select(".title");
            var options = this.options();
            if (titleDisplay.empty()){
                titleDisplay = renderer.label().attr("class" , "title");
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
            titleDisplay.attr("x" , bbox.x)
                    .attr("y" , bbox.y - 2)
                    .attr("transform" , transform)
                    .style({
                        "fill": normalStyle.color ,
                        "font-size": normalStyle.fontSize + "px" ,
                        "font-weight": normalStyle.fontWeight ,
                        "font-family": normalStyle.fontFamily
                    })
                    .text(options.text);
            return this;
        } ,
        _getTitleSize: function (options) {
            return htmlUtil.stringSize(options.text , options.style.normal)
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
                    "color": "#000000" ,
                    "fontSize": 24 ,
                    "fontWeight": "none" ,
                    "fontFamily": "Verdana , Arial, sans-serif"
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