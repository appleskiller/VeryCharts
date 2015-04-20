define(function (require , exports , module) {
    "use strict";
    var evts = require("evts");
    var helper = require("verycharts/helper");
    var ChartDefault = require("verycharts/ChartDefault");
    
    var Chart = evts.EventTrigger.extend({
        constructor: function Chart() {
            this._defaultOptions = ChartDefault.cloneDefault();
        } ,
        _space: null ,
        _defaultOptions: null ,
        _dom: null ,
        _data: null ,
        _options: null ,
        _theme: null ,
        initialize: function (selector) {
            if (!this._dom){
                this._dom = document.createElement("div");
            }
            this.invalidateRender();
            return this;
        } ,
        setData: function (data) {
            this._data = data;
            this._dataChanged = true;
            this.invalidateRender();
            return this;
        } ,
        setOptions: function (options) {
            this._options = options;
            this._optionChanged = true;
            this.invalidateRender();
            return this;
        } ,
        getOptions: function () {
            return this._options;
        } ,
        setTheme: function (theme) {
            this._theme = theme;
            this._themeChanged = true;
            this.invalidateRender();
            return this;
        } ,
        resize: function () {
            this.invalidateLayout();
            return this;
        } ,
        invalidateRender: function () {
            if (!this._renderFlag){
                this._renderFlag = true;
                this._nextFrame();
            }
        } ,
        invalidateLayout: function () {
            if (!this._layoutFlag){
                this._layoutFlag = true;
                this._nextFrame();
            }
        } ,
        destroy: function () {
            this._selector = null;
            this._styles = null;
            this._data = null;
            this._theme = null;
            if (this._space){
                this._space.destroy();
                this._space = null;
            }
            this._destroyed = true;
            return this;
        } ,
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
        _mergeTheme: function () {
            helper.merge(this._defaultOptions , this._theme);
        } ,
        _mergeOption: function () {
            
        } ,
        _performData: function () {
            
        } ,
        _performLayout: function () {
            // body...
        } ,
        _render: function () {
            // body...
        } ,
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
        _enterFrame: function () {
            if (this._destroyed)
                return;
            this._commitChanged();
            if (this._layoutFlag){
                this._performLayout();
                this._renderFlag = true;
                this._layoutFlag = false;
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