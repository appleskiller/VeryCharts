define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    var evts = require("evts");
    var consts = require("verycharts/consts");
    var htmlUtil = require("verycharts/htmlUtil");
    var helper = require("verycharts/helper");
    var ChartDefault = require("verycharts/ChartDefault");
    var ChartFactory = require("verycharts/ChartFactory");
    require("verycharts/ChartRenderer");
    require("verycharts/ChartPlot");
    require("verycharts/Component");
    
    require("verycharts/Component/Title");
    /**
     * chart。
     **/
    var Chart = evts.EventTrigger.extend({
        constructor: function Chart(dom) {
            this.dom = this._initDOM(dom);
            this._defaultOptions = ChartDefault.cloneDefault();
            this._chartPlots = {};
            this._components = {};
            this.bounds({x: 0 , y: 0 , width: 0 , height: 0});
        } ,
        renderer: null ,
        dom: null ,
        originOptions: null ,
        originData: null ,
        
        _bounds: null ,
        _components: null ,
        _chartPlots: null ,
        _defaultOptions: null ,
        _mergedOptions: null ,
        _options: null ,
        _data: null ,
        _theme: null ,
        /**
         * 设置数据。
         * 标准结构为[[headerOpt , headerOpt , ...] , [value , value , ...] , [value , value , ...]]
         * 或者{header: [headerOpt , headerOpt , ...] , data: [[value , value , ...] , [value , value , ...]]}
         * 也可以是一维数组[headerOpt , value , value , ...] - 它代表了一列数据。
         **/
        data: function (data) {
            if (arguments.length === 0){ return this._data; }
            this._data = data;
            this._dataChanged = true;
            this.invalidateRender();
            return this;
        } ,
        /**
         * 设置配置。可选是否与上次的option进行merge，默认为不merge
         **/
        options: function (options , merge) {
            if (arguments.length === 0){ return this._options; }
            this._options = options;
            this._mergeOptionFlag = (merge === true);
            this._optionChanged = true;
            this.invalidateRender();
            return this;
        } ,
        /**
         * 设置主题。
         **/
        theme: function (theme) {
            if (arguments.length === 0){ return this._theme; }
            this._theme = theme;
            this._themeChanged = true;
            this.invalidateRender();
            return this;
        } ,
        /**
         * 重新计算大小。
         **/
        resize: function () {
            this.invalidateLayout();
            return this;
        } ,
        bounds: function (value) {
            if (arguments.length === 0){ return this._bounds; }
            this._bounds = value;
            return this;
        } ,
        /**
         * 失效renderer，稍后进行渲染。
         **/
        invalidateRender: function () {
            if (!this._renderFlag){
                this._renderFlag = true;
                this._nextFrame();
            }
        } ,
        /**
         * 失效布局，稍后执行布局。
         **/
        invalidateLayout: function () {
            if (!this._layoutFlag){
                this._layoutFlag = true;
                this._nextFrame();
            }
        } ,
        destroy: function () {
            this._options = null;
            this._data = null;
            this._theme = null;
            this._defaultOptions = null;
            this._mergedOptions = null;
            this.bounds(null);
            
            this.dom = null;
            this.originData = null;
            this.originOptions = null;
            if (this.renderer){ this.renderer.destroy(); }
            this.renderer = null;
            
            var prop;
            for (prop in this._components) { this._components[prop].destroy(); }
            this._components = null;
            for (prop in this._chartPlots) { this._chartPlots[prop].destroy(); }
            this._chartPlots = null;
            
            this._destroyed = true;
            return this;
        } ,
        /**
         * 提交属性改变。
         **/
        _commitChanged: function () {
            if (this._themeChanged){
                this._mergeTheme();
                this._optionChanged = true;
                this._themeChanged = false;
            }
            if (this._optionChanged){
                this._mergeOption();
                this.invalidateLayout();
                this._optionChanged = false;
            }
            if (this._dataChanged){
                this._performData();
                this.invalidateLayout();
                this._dataChanged = false;
            }
        } ,
        /**
         * 初始化dom。
         **/
        _initDOM: function (dom) {
            dom.style["-webkit-tap-highlight-color"] = "transparent" ;
            dom.style["-webkit-user-select"] = "none" ;
            dom.style["background-color"] = "rgba(0, 0, 0, 0)" ;
            dom.style["cursor"] = "default" ;
            return dom;
        } ,
        /**
         * 合并主题。
         **/
        _mergeTheme: function () {
            helper.merge(this._defaultOptions , this._theme);
        } ,
        /**
         * 合并options。同时更新组件及图形的options。
         **/
        _mergeOption: function () {
            if (this._mergeOptionFlag && this._mergedOptions){
                this._mergedOptions = helper.merge(this._mergedOptions , this._options);
            }else{
                this._mergedOptions = this._options;
            }
            this.originOptions = helper.merge(helper.clone(this._defaultOptions) , this._mergedOptions);
            var component , prop , renderer;
            // 检查renderer类型。
            var rendererType = this.originOptions.chart.renderer;
            if (this.renderer){
                var oldType = this.renderer.type;
                if (oldType !== rendererType){
                    this.renderer.destroy();
                    for (prop in this._components) { this._components[prop].destroy(); }
                    this._components = {};
                    for (prop in this._chartPlots) { this._chartPlots[prop].destroy(); }
                    this._chartPlots = {};
                    this.dom.innerHTML = ""
                    this.renderer = ChartFactory.createRenderer(rendererType , this.dom);
                }
            }else{
                this.renderer = ChartFactory.createRenderer(rendererType , this.dom);
            }
            // 更新options
            for (prop in this.originOptions) {
                if (this._components[prop]){
                    this._components[prop].options(this.originOptions);
                }else{
                    renderer = ChartFactory.createRenderer(this.renderer.type , this.renderer.g("verychart-components").node());
                    component = ChartFactory.createComponent(prop , this , renderer);
                    if (component){
                        this._components[prop] = component;
                        this._enterComponents.push(component);
                    }
                }
            }
            for (prop in this._chartPlots) {
                this._chartPlots[prop].options(this.originOptions);
            }
        } ,
        /**
         * 准备数据。同时更新组件及图形的data。
         **/
        _performData: function () {
            var header , data , plotTypes , plot , type , i;
            // 准备数据
            if (!this._data){
                this.originData = null;
            }else{
                if (oop.is(this._data , Array)){
                    header = this._data[0];
                    data = this._data.slice(1);
                    // 一维数组,转为二维结构。
                    if (!oop.is(header , Array)){
                        header = [header];
                        data = [data];
                    }
                    this.originData = {
                        header: header ,
                        data: data
                    }
                } else if (typeof this._data === "object") {
                    header = this._data.header;
                    data = this._data.data;
                    if (!header || !data || !oop.is(header , Array) || oop.is(data , Array)){
                        this.originData = null;
                    }else{
                        this.originData = data;
                    }
                } else {
                    this.originData = null;
                }
            }
            // 解析header
            plotTypes = {};
            if (this.originData){
                header = this.originData.header;
                data = this.originData.data;
                for (i = 0; i < header.length; i++) {
                    if (header[i].plotType){
                        plotTypes[header[i].plotType] = true;
                    }
                }
            }
            // 更新或删除plot
            for (type in this._chartPlots) {
                if (plotTypes[type] === true){
                    this._chartPlots[type].data(this.originData);
                    delete plotTypes[type];
                }else{
                    this._chartPlots[type].destroy();
                    delete this._chartPlots[type];
                }
            }
            // 创建plot
            var renderer;
            for (type in plotTypes) {
                renderer = ChartFactory.createRenderer(this.renderer.type , this.renderer.g("verychart-chartplot").node());
                plot = ChartFactory.createChartPlot(type , this , renderer);
                if (plot){
                    this._chartPlots[type] = plot;
                    this._enterComponents.push(plot);
                }
            }
            // 更新components
            for (type in this._components) {
                this._components[type].data(this.originData);
            }
        } ,
        /**
         * 执行布局。先进行组件布局，然后进行图形布局。各个元素按顺序切割布局框。
         **/
        _performLayout: function () {
            var size = htmlUtil.size(this.dom);
            var bounds = this.bounds({x: 0 , y: 0 , width: size.width , height: size.height}).bounds();
            var type;
            for (type in this._components) {
                bounds = this._components[type].layout(bounds);
            }
            for (type in this._chartPlots) {
                bounds = this._chartPlots[type].layout(bounds);
            }
        } ,
        /**
         * 执行render函数绘制显示。
         **/
        _render: function () {
            var bounds = this.bounds();
            this.renderer.attr("width" , bounds.width).attr("height" , bounds.height);
            // 渲染基础组件及chart
            var type;
            for (type in this._chartPlots) { this._chartPlots[type].render(); }
            for (type in this._components) { this._components[type].render(); }
        } ,
        /**
         * 请求下一帧回调。
         **/
        _nextFrame: function () {
            if (!this._nextFrameFlag){
                this._nextFrameFlag = true;
                var self = this;
                helper.nextFrame(function () {
                    self._enterFrame();
                    self._nextFrameFlag = false;
                });
            }
        } ,
        /**
         * nextFrame回调。
         **/
        _enterFrame: function () {
            if (this._destroyed)
                return;
            this._enterComponents = [];
            // 提交属性改变。
            this._commitChanged();
            // 为新增加的组件及plot设置options和data
            for (var i = 0; i < this._enterComponents.length; i++) {
                this._enterComponents[i].options(this.originOptions).data(this.originData);
                this._layoutFlag = true;
            }
            this._enterComponents = null;
            if (this._layoutFlag){
                this.trigger("layout_start");
                this._performLayout();
                this._renderFlag = true;
                this._layoutFlag = false;
                this.trigger("layout_end");
            }
            if (this._renderFlag){
                this.trigger("render_start");
                this._render();
                this._renderFlag = false;
                this.trigger("render_end");
            }
        }
    });
    
    module.exports = Chart;
})