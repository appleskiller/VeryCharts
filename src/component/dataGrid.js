define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    var helper = require("verycharts/helper");
    var Component = require("verycharts/Component").Component;
    
    var MIN_COLUMEN_WIDTH = 16;
    var MIN_ROW_WIDTH = 16;
    var MIN_CELL_SIZE = 16;
    
    var CellELement = Component.extend({
        constructor: function CellELement(owner , renderer) {
            Component.apply(this , arguments);
            this.meature();
        } , 
        options: function () {
            if (arguments.length === 0) { return this._options }
            
            return Component.prototype.options.apply(this , arguments);
        }
    })
    var CellGroup = Component.extend({
        constructor: function CellGroup(owner , renderer) {
            Component.apply(this , arguments);
        } , 
        columnWidth: function (value) {
            if (arguments.length === 0) { return this._columnWidth }
            value = value || Math.max(MIN_CELL_SIZE , value);
            if (this._columnWidth !== value){
                this._columnWidth = value;
                this._isDirty = true;
            }
            return this;
        } ,
        rowHeight: function (value) {
            if (arguments.length === 0) { return this._rowHeight }
            value = value || Math.max(MIN_CELL_SIZE , value);
            if (this._rowHeight !== value){
                this._rowHeight = value;
                this._isDirty = true;
            }
            return this;
        } ,
    })
    var HeaderGroup = Component.extend({
        constructor: function HeaderGroup(owner , renderer) {
            Component.apply(this , arguments);
        } , 
    })
    var AxisElement = Component.extend({
        constructor: function AxisElement(owner , renderer) {
            Component.apply(this , arguments);
        } , 
    })
    var CornerGroup = Component.extend({
        constructor: function CornerGroup(owner , renderer) {
            Component.apply(this , arguments);
        } , 
    })
    
    var defaultGroupFactory = {
        cornerGroup: CornerGroup ,
        columnGroup: HeaderGroup ,
        rowGroup: HeaderGroup ,
        cellGroup: CellGroup
    }
    var name2class = {
        cornerGroup: ".corner-group" ,
        columnGroup: ".column-group" ,
        rowGroup: ".row-group" ,
        cellGroup: ".cell-group"
    }
    
    function isMeasure(header) {
        return (header && header.fieldType === "measure");
    }
    
    function isDimension(header) {
        return (header && !isMeasure(header));
    }
    
    var DataGrid = Component.extend({
        constructor: function DataGrid(owner , renderer) {
            Component.apply(this , arguments);
            this.factories = helper.clone(defaultGroupFactory);
            this.createChildren();
        } , 
        cornerGroup: null , 
        columnGroup: null , 
        rowGroup: null ,
        cellGroup: null ,
        cube: null ,
        options: function (options) {
            if (arguments.length === 0) { return this._options }
            if (options && options.factory){
                this.factories = helper.merge(this.factories , options.factory);
                this.createChildren();
            }
            return Component.prototype.options.apply(this , arguments);
        } ,
        data: function (data) {
            if (arguments.length === 0) { return this._data }
            
            return Component.prototype.data.apply(this , arguments);
        } ,
        
        redraw: function () {
            
            return this;
        } ,
        createChildren: function () {
            var ctor;
            for (var prop in name2class) {
                ctor = this.factories[prop];
                if (!oop.is(this[prop] , ctor)){
                    if (this[prop]){
                        this[prop].clean();
                    }
                    this[prop] = new this.factories[prop](this , this.renderer.g().attr("class" , name2class[prop]));
                }
            }
        } ,
        clean: function () {
            if (this.cornerGroup)
                this.cornerGroup.clean();
            if (this.columnGroup)
                this.columnGroup.clean();
            if (this.rowGroup)
                this.rowGroup.clean();
            if (this.cellGroup)
                this.cellGroup.clean();
            var groups = [".corner-group" , ".column-group" , ".row-group" , ".cell-group"];
            return this;
        }
    });
    
    module.exprots ={
        DataGrid: DataGrid
    }
});