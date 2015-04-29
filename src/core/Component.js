define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    var helper = require("verycharts/helper");
    /**
     * 组件基类。
     * 定义了最基本的接口。
     **/
    var Component = oop.Class.extend({
        constructor: function Component(owner , renderer) {
            this.owner = owner;
            this.renderer = renderer;
            this._bounds = {x: 0 , y: 0 , width: 0 , height: 0};
            this._bbox = {x: 0 , y: 0 , width: 0 , height: 0};
        } ,
        owner: null ,
        renderer: null ,
        _options: null , 
        _data: null , 
        _enabled: true ,
        /**
         * 配置。
         **/
        options: function (options) {
            if (arguments.length === 0){ return this._options; }
            this._options = options;
            this.enabled(!(options.enabled === false));
            this._isDirty = true;
            return this;
        } ,
        /**
         * 数据。
         **/
        data: function (data) {
            if (arguments.length === 0){ return this._data; }
            this._data = data;
            this._isDirty = true;
            return this;
        } ,
        /**
         * 设置是否可用。
         **/
        enabled: function (value) {
            if (arguments.length === 0){ return this._enabled; }
            var old = this._enabled;
            this._enabled = value;
            if (old != value){
                this._isDirty = true;
            }
            return this;
        } ,
        /**
         * 渲染。
         **/
        render: function () {
            if (this._isDirty){
                if (!this.enabled()){
                    this.clean();
                }else{
                    this.redraw();
                }
                this._isDirty = false;
            }
            return this;
        } ,
        /**
         * 重绘。
         **/
        redraw: function () {
            // 子类重写，以重绘
            return this;
        } ,
        /**
         * 擦除。
         **/
        clean: function () {
            return this;
        } ,
        /**
         * 销毁。
         **/
        destroy: function () {
            this.renderer.remove();
            this.renderer = null;
            this.owner = null;
            this._options = null;
            this._data = null;
            this._bounds = null;
            this._bbox = null;
        } ,
        /**
         * 布局矩形。
         **/
        bounds: function (bounds) {
            if (arguments.length === 0){ return this._bounds; }
            bounds = bounds || {x: 0 , y: 0 , width: 0 , height: 0};
            var old = this._bounds;
            this._bounds = bounds;
            if (old.x != bounds.x || old.y != bounds.y || old.width != bounds.width || old.height != bounds.height){
                this._isDirty = true;
            }
            return this;
        } ,
        /**
         * 实体包围矩形。
         **/
        bbox: function (bbox) {
            if (arguments.length === 0){ return this._bbox; }
            bbox = bbox || {x: 0 , y: 0 , width: 0 , height: 0};
            var old = this._bbox;
            this._bbox = bbox;
            this._isDirty = true;
            if (old.x != bbox.x || old.y != bbox.y || old.width != bbox.width || old.height != bbox.height){
                this._isDirty = true;
            }
            return this;
        }
    });
    
    var ChartComponent = Component.extend({
        constructor: function ChartComponent(owner , renderer) {
            Component.apply(this , arguments);
        } ,
        /**
         * 布局。
         * 传入指定bounds，在规定的bounds内执行布局。布局后通常返回切割后剩下的部分。
         **/
        layout: function (bounds) {
            return bounds;
        } ,
    })
    
    module.exports = {
        Component: Component ,
        ChartComponent: ChartComponent
    };
})