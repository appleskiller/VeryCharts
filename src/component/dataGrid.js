define(function (require , exports , module) {
    "use strict";
    var d3 = require("d3");
    var oop = require("oop");
    var helper = require("verycharts/helper");
    var htmlUtil = require("verycharts/htmlUtil");
    var Component = require("verycharts/Component").Component;
    
    var MIN_COLUMN_WIDTH = 16;
    var MIN_ROW_WIDTH = 16;
    var MIN_CELL_SIZE = 16;
    var TYPICLE_COLUMN_WIDTH = 80;
    var TYPICLE_ROW_HEIGTH = 24;
    
    var GridTopic = helper.Topic.extend({
        constructor: function GridTopic() {
            helper.Topic.apply(this , arguments);
            if (this.isVirtualTopic){
                this.caption = this.header.name;
            }
        } ,
        size: function () {
            if (!this._size){
                this._size = htmlUtil.stringSize(this.caption);
            }
            return this._size;
        }
    })
    
    var GridDataCube = helper.CrossDataCube.extend({
        constructor: function GridDataCube() {
            helper.CrossDataCube.apply(this , arguments);
        } ,
        _createTopic: function (key , value , depth , parent , isVirtualTopic) {
            return new GridTopic(key , value , depth , parent , isVirtualTopic);
        } ,
        _createColumnHeader: function () {
            return new helper.CrossHeader();
        } ,
        _createRowHeader: function () {
            return new helper.CrossHeader();
        } ,
        _createBody: function () {
            return new helper.CrossBody();
        } ,
        _setupTopic: function (topic) {
            var depth = topic.depth;
            if (depth < this.crossPoint){
                this.rowHeader.addTopic(depth , topic);
            } else {
                this.columnHeader.addTopic(depth - this.crossPoint , topic);
            }
        }
    })
    
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
        // columnWidth: function (value) {
        //     if (arguments.length === 0) { return this._columnWidth }
        //     value = value || Math.max(MIN_CELL_SIZE , value);
        //     if (this._columnWidth !== value){
        //         this._columnWidth = value;
        //         this._isDirty = true;
        //     }
        //     return this;
        // } ,
        // rowHeight: function (value) {
        //     if (arguments.length === 0) { return this._rowHeight }
        //     value = value || Math.max(MIN_CELL_SIZE , value);
        //     if (this._rowHeight !== value){
        //         this._rowHeight = value;
        //         this._isDirty = true;
        //     }
        //     return this;
        // } ,
    })
    var AxisElement = Component.extend({
        constructor: function AxisElement(owner , renderer) {
            Component.apply(this , arguments);
        } , 
    })
    var HeaderGroup = Component.extend({
        constructor: function HeaderGroup(owner , renderer) {
            Component.apply(this , arguments);
        } , 
    })
    var ColumnGroup = HeaderGroup.extend({
        constructor: function ColumnGroup(owner , renderer) {
            HeaderGroup.apply(this , arguments);
        } ,
        data: function (data) {
            if (arguments.length === 0) { return this._data };
            return Component.prototype.data.apply(this , arguments);
        } ,
        redraw: function () {
            
            var columnWidth = 100;
            var rowHeight = 30;
            
            var data = this.data();
            var levels = data.levels;
            var renderer = this.renderer;
            var hearderGroups = renderer.selectAll(".column-header-group");
            var offset , xx;
            hearderGroups.data(levels)
                            .enter()
                            .append("g")
                            .attr("class" , "column-header-group")
                            .each(function (d , i) {
                                d3.select(this)
                                    .selectAll("column-header-cell")
                                    .data(levels[i])
                                    .enter()
                                    .append("text")
                                    .attr("class" , "column-header-cell")
                                    .attr("x" , function (d , j) {
                                        if (j == 0){
                                            offset = 0;
                                        }
                                        xx = offset;
                                        if (i == levels.length - 1)
                                            offset += columnWidth;
                                        else
                                            offset += d.members.length * columnWidth;
                                        return xx;
                                    })
                                    .attr("y" , i * rowHeight)
                                    .attr("class" , "header-label")
                                    .attr("transform" , "translate(0 , 12)")
                                    .text(function (d) {
                                        return d.caption;
                                    });
                            })
            return this;
        } ,
        clean: function () {
            return this;
        }
    })
    var RowGroup = HeaderGroup.extend({
        constructor: function RowGroup(owner , renderer) {
            HeaderGroup.apply(this , arguments);
        } ,
        redraw: function () {
            
            var columnWidth = 100;
            var rowHeight = 30;
            
            
            var data = this.data();
            var levels = data.levels;
            var renderer = this.renderer;
            var hearderGroups = renderer.selectAll(".row-header-group");
            var offset , yy;
            hearderGroups.data(levels)
                            .enter()
                            .append("g")
                            .attr("class" , "row-header-group")
                            .each(function (d , i) {
                                d3.select(this)
                                    .selectAll(".row-header-cell")
                                    .data(levels[i])
                                    .enter()
                                    .append("text")
                                    .attr("class" , "row-header-cell")
                                    .attr("x" , i * columnWidth)
                                    .attr("y" , function (d , j) {
                                        if (j == 0){
                                            offset = 0;
                                        }
                                        yy = offset;
                                        if (i == levels.length - 1)
                                            offset += rowHeight;
                                        else
                                            offset += d.members.length * rowHeight;
                                        return yy;
                                    })
                                    .attr("class" , "header-label")
                                    .attr("transform" , "translate(0 , 12)")
                                    .text(function (d) {
                                        return d.caption;
                                    });
                            })
            return this;
        } ,
    })
    var CornerGroup = Component.extend({
        constructor: function CornerGroup(owner , renderer) {
            Component.apply(this , arguments);
        } , 
    })
    
    var defaultGroupFactory = {
        cornerGroup: CornerGroup ,
        columnGroup: ColumnGroup ,
        rowGroup: RowGroup ,
        cellGroup: CellGroup
    }
    var name2class = {
        cornerGroup: "corner-group" ,
        columnGroup: "column-group" ,
        rowGroup: "row-group" ,
        cellGroup: "cell-group"
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
        model: null ,
        options: function (options) {
            if (arguments.length === 0) { return this._options }
            if (options){
                if (options.factory){
                    this.factories = helper.merge(this.factories , options.factory);
                    this.createChildren();
                }
                options.columnHeader && this.columnGroup.options(options.columnHeader);
                options.rowHeader && this.rowGroup.options(options.rowHeader);
                options.corner && this.cornerGroup.options(options.corner);
                options.body && this.cellGroup.options(options.body);
            }
            return Component.prototype.options.apply(this , arguments);
        } ,
        data: function (data) {
            if (arguments.length === 0) { return this._data };
            this.model = this._createModel(data).build();
            this.cornerGroup.data(this.model);
            this.columnGroup.data(this.model.columnHeader);
            this.rowGroup.data(this.model.rowHeader);
            this.cellGroup.data(this.model);
            return Component.prototype.data.apply(this , arguments);
        } ,
        render: function () {
            this.columnGroup.render();
            this.rowGroup.render();
            this.cornerGroup.render();
            this.cellGroup.render();
            return Component.prototype.render.apply(this , arguments);
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
        _createModel: function (data) {
            if (!data)
                return null;
            var header = data.header , order1 , order2 , i , ind;
            var dataCube = new helper.DataCube(header , data.data);
            var columns = dataCube.getIndeiesBy("groupType" , "column");
            var rows = dataCube.getIndeiesBy("groupType" , "row");
            var measures = [];
            function sortFunction (a , b) {
                order1 = header[a].groupOrder == null ? 0 : header[a].groupOrder;
                order2 = header[b].groupOrder == null ? 0 : header[b].groupOrder;
                return order1 - order2;
            }
            columns.sort(sortFunction);
            rows.sort(sortFunction);
            for (i = 0; i < columns.length; i++) {
                ind = columns[i]
                if (isMeasure(header[ind])){
                    measures.push(ind);
                }
            }
            for (i = 0; i < rows.length; i++) {
                ind = rows[i]
                if (isMeasure(header[ind])){
                    measures.push(ind);
                }
            }
            return dataCube.createCrossDataCube(rows , columns , measures , GridDataCube);
        } ,
        clean: function () {
            this.cornerGroup.clean();
            this.columnGroup.clean();
            this.rowGroup.clean();
            this.cellGroup.clean();
            return this;
        }
    });
    
    module.exports = {
        DataGrid: DataGrid
    }
});