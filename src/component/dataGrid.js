define(function (require , exports , module) {
    "use strict";
    var d3 = require("d3");
    var oop = require("oop");
    var helper = require("verycharts/helper");
    var htmlUtil = require("verycharts/htmlUtil");
    var Component = require("verycharts/Component").Component;
    var ChartComponent = require("verycharts/Component").ChartComponent;
    
    var MIN_COLUMN_WIDTH = 16;
    var MIN_ROW_HEIGHT = 16;
    var MIN_CELL_SIZE = 16;
    var TYPICLE_COLUMN_WIDTH = 80;
    var TYPICLE_ROW_HEIGTH = 24;
    
    var FULL = "full" ;
    var FIT_WIDTH = "fitwidth" ;
    var FIT_HEIGHT = "fitheigh" ;
    var NORMAL = "normal" ;
    
    var GridTopic = helper.Topic.extend({
        constructor: function GridTopic() {
            helper.Topic.apply(this , arguments);
            if (this.isVirtual){
                this.caption = this.header.name;
            }
            this.captionSize = htmlUtil.stringSize(this.caption);
        } ,
        captionSize: null ,
        size: null ,
        totalMembers: 0
    })
    
    // var GridColumnHeader = helper.CrossHeader.extend({
    //     constructor: function GridColumnHeader() {
    //         helper.CrossHeader.apply(this , arguments);
    //     } ,
    //     width: 0 ,
    //     height: 0 ,
    // });
    
    // var GridRowHeader = helper.CrossHeader.extend({
    //     constructor: function GridRowHeader() {
    //         helper.CrossHeader.apply(this , arguments);
    //     } ,
    //     width: 0 ,
    //     height: 0
    // })
    
    // var GridBody = helper.CrossBody.extend({
    //     constructor: function GridBody() {
    //         helper.CrossBody.apply(this , arguments);
    //     } ,
    //     rows: null ,
    //     columns: null ,
    // })
    
    var GridDataCube = helper.CrossDataCube.extend({
        constructor: function GridDataCube() {
            helper.CrossDataCube.apply(this , arguments);
        } ,
        _createTopic: function (key , value , depth , parent , isVirtualTopic) {
            return new GridTopic(key , value , depth , parent , isVirtualTopic);
        } ,
        // _createColumnHeader: function () {
        //     return new helper.CrossHeader();
        // } ,
        // _createRowHeader: function () {
        //     return new helper.CrossHeader();
        // } ,
        // _createBody: function () {
        //     return new GridBody();
        // } ,
        // _setupTopic: function (topic) {
        //     helper.CrossDataCube.prototype._setupTopic.apply(this , arguments);
        // }
    });
    
    var GroupDisplay = Component.extend({
        constructor: function GroupDisplay(owner , renderer) {
            Component.apply(this , arguments);
        } , 
    })
    
    var CellGroup = GroupDisplay.extend({
        constructor: function CellGroup(owner , renderer) {
            GroupDisplay.apply(this , arguments);
        } , 
    })
    var HeaderGroup = GroupDisplay.extend({
        constructor: function HeaderGroup(owner , renderer) {
            GroupDisplay.apply(this , arguments);
        } , 
        redraw: function () {
            var self = this;
            var renderer = this.renderer;
            var headerData = this.data();
            var bounds = this.bounds();
            // 更新位置。
            var translate = "translate(" + bounds.x + " " + bounds.y + ")"
            renderer.attr("transform" , translate);
            
            var bgRect = renderer.select(".background-rect");
            if (bgRect.empty()){
                bgRect = renderer.rect().attr("class" , "background-rect");
            }
            bgRect.attr("fill" , "#cccccc")
                .attr("width" , bounds.width)
                .attr("height" , bounds.height);
            
            var hearderGroups = renderer.selectAll("." + this._getHeaderClass());
            var update = hearderGroups.data(headerData.levels)
            update.exit().remove();
            // TODO 处理更新
            // this._setupUpdate(update);
            // 处理新增。
            this._setupLevels(headerData , update.enter()
                                                    .append("g")
                                                    .attr("class" , "." + this._getHeaderClass()));
        } , 
        _getHeaderClass: function () {
            return "header-group";
        } ,
        _setupLevels: function (header , selector) {
            // 子类重写
        } 
    })
    var CornerGroup = GroupDisplay.extend({
        constructor: function CornerGroup(owner , renderer) {
            GroupDisplay.apply(this , arguments);
        } , 
    })
    var ColumnGroup = HeaderGroup.extend({
        constructor: function ColumnGroup(owner , renderer) {
            HeaderGroup.apply(this , arguments);
        } ,
        _getHeaderClass: function () {
            return "column-header-group";
        } ,
        _setupLevels: function (header , selector) {
            var bounds = this.bounds();
            var bbox = this.bbox();
            var offX = bbox.x - bounds.x;
            var offY = bbox.y - bounds.y;
            var cellOffX = 0;
            var transform , layoutBounds;
            selector.each(function (topicLevel , i) {
                transform = "translate(" + offX + " " + offY + ")";
                d3.select(this)
                    .attr("transform" , transform)
                    .selectAll(".header-cell")
                    .data(topicLevel.topics)
                    .enter()
                    .append("g")
                    .attr("class" , "header-cell")
                    .each(function (topic , i) {
                        layoutBounds = {x: cellOffX , y: 0 , width: topic.width , height: topicLevel.height};
                        if (topicLevel.isAxis === true){
                            layoutBounds.width = topicLevel.cellWidth;
                        }
                        layoutBounds = helper.textLayout(topic.captionSize , layoutBounds , {
                            rotate: topicLevel.textRotate ,
                            margin: 0 ,
                            vertical: "middle" ,
                            horizontal: "center"
                        });
                        transform = helper.textTransform("top" , layoutBounds , topic.captionSize);
                        d3.select(this)
                            .attr("transform" , transform)
                            .append("text")
                            .attr("class" , "header-label")
                            .text(topic.caption);
                        if (topicLevel.isAxis === true){
                            cellOffX += topicLevel.cellWidth;
                        }else{
                            cellOffX += topic.width;
                        }
                    })
                cellOffX = 0;
                offX = bbox.x - bounds.x;
                offY += topicLevel.height;
            });
        } 
    })
    var RowGroup = HeaderGroup.extend({
        constructor: function RowGroup(owner , renderer) {
            HeaderGroup.apply(this , arguments);
        } ,
        _getHeaderClass: function () {
            return "row-header-group";
        } ,
        _setupLevels: function (header , selector) {
            var bounds = this.bounds();
            var bbox = this.bbox();
            var offX = bbox.x - bounds.x;
            var offY = bbox.y - bounds.y;
            var cellOffY = 0;
            var transform , layoutBounds;
            selector.each(function (topicLevel , i) {
                transform = "translate(" + offX + " " + offY + ")";
                d3.select(this)
                    .attr("transform" , transform)
                    .selectAll(".header-cell")
                    .data(topicLevel.topics)
                    .enter()
                    .append("g")
                    .attr("class" , "header-cell")
                    .each(function (topic , i) {
                        layoutBounds = {x: 0 , y: cellOffY , width: topicLevel.width , height: topic.height};
                        if (topicLevel.isAxis === true){
                            layoutBounds.height = topicLevel.cellHeight;
                        }
                        layoutBounds = helper.textLayout(topic.captionSize , layoutBounds , {
                            rotate: topicLevel.textRotate ,
                            margin: 0 ,
                            vertical: "middle" ,
                            horizontal: "right"
                        });
                        transform = helper.textTransform("left" , layoutBounds , topic.captionSize);
                        d3.select(this)
                            .attr("transform" , transform)
                            .append("text")
                            .attr("class" , "header-label")
                            .text(topic.caption);
                        if (topicLevel.isAxis === true){
                            cellOffY += topicLevel.cellHeight;
                        }else {
                            cellOffY += topic.height;
                        }
                    })
                cellOffY = 0;
                offX += topicLevel.width;
                offY = bbox.y - bounds.y;
            });
        }
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
    
    var DataGrid = ChartComponent.extend({
        constructor: function DataGrid(owner , renderer) {
            ChartComponent.apply(this , arguments);
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
            this.cellGroup.data(this.model.body);
            return Component.prototype.data.apply(this , arguments);
        } ,
        layout: function (bounds) {
            var columnHeader = this.model.columnHeader , rowHeader = this.model.rowHeader , body = this.model.body;
            var viewModel = this.options().viewModel;
            //TODO 暂时不考虑viewModel和cellOption
            // 1.计算列轴的高度
            this._layoutColumnAxisHeight(bounds , viewModel);
            // 2.计算列表头的高度
            this._layoutColumnHeaderHeight(bounds , viewModel);
            // 3.根据列头的高度确定行轴的宽高。
            this._layoutRowAxis(bounds , viewModel);
            // 4.确定行表头。
            this._layoutRowHeader(bounds , viewModel);
            // 5.确定列轴的宽度。
            this._layoutColumnAxisWidth(bounds , viewModel);
            // 6.确定列表头。
            this._layoutColumnHeader(bounds , viewModel);
            // 7.确定corner
            this.cornerGroup.bounds({x: bounds.x , y: bounds.y , width: rowHeader.width , height: columnHeader.height});
            this.cornerGroup.bbox({x: bounds.x , y: bounds.y , width: rowHeader.width , height: columnHeader.height});
            // 8.确定各部分布局位置。
            // TODO 考虑滚动。
            var rect = this.cornerGroup.bounds();
            this.columnGroup.bounds({x: rect.x + rect.width , y: rect.y , width: bounds.width - rect.width , height: columnHeader.height});
            this.columnGroup.bbox({x: rect.x + rect.width , y: rect.y , width: columnHeader.width , height: columnHeader.height});
            this.rowGroup.bounds({x: rect.x , y: rect.y + rect.height , width: rowHeader.width , height: bounds.height - rect.height});
            this.rowGroup.bbox({x: rect.x , y: rect.y + rect.height , width: rowHeader.width , height: rowHeader.height});
            this.cellGroup.bounds({x: rect.x + rect.width , y: rect.y + rect.height , width: bounds.width - rect.width , height: bounds.height - rect.height});
            this.cellGroup.bbox({x: rect.x + rect.width , y: rect.y + rect.height , width: columnHeader.width , height: rowHeader.height});
            
            this.bounds({x: bounds.x , y: bounds.y , width: bounds.width , height: bounds.height});
            this.bbox({x: bounds.x , y: bounds.y , width: rect.width + columnHeader.width , height: rect.height + rowHeader.height});
            
            return bounds;
        } ,
        _layoutColumnAxisHeight: function (bounds , viewModel) {
            var body = this.model.body , columns = body.columns;
            var isMeasure = false , i , captionSize , topicLevel;
            // 如果columns不存在，则创建一个站位用的topicLevel
            if (!columns){
                topicLevel = new helper.TopicLevel();
                topicLevel.cellHeight = topicLevel.height = 0;
                body.columns = topicLevel;
                this.model.columnHeader.levels.push(topicLevel);
                return;
            }
            for (i = 0; i < columns.topics.length; i++) {
                isMeasure = columns.topics[i].isMeasure;
                captionSize = columns.topics[i].captionSize;
                break;
            }
            topicLevel = body.columns;
            topicLevel.isAxis = true;
            if (isMeasure === true){
                // TODO 计算数值轴的高度。
                topicLevel.cellHeight = topicLevel.height = captionSize.height;
                topicLevel.isMeasure = true;
                topicLevel.textRotate = true;
            } else {
                topicLevel.cellHeight = topicLevel.height = captionSize.height;
                topicLevel.isMeasure = false;
            }
        } ,
        _layoutColumnHeaderHeight: function (bounds , viewModel) {
            var columnHeader = this.model.columnHeader , topic , topicLevel , captionSize;
            var levels = columnHeader.levels;
            columnHeader.height = 0;
            for (var i = 0; i < levels.length - 2; i++) {
                topicLevel = levels[i];
                topic = topicLevel.at(0);
                captionSize = topic.captionSize;
                topicLevel.height = captionSize.height;
                columnHeader.height += captionSize.height;
            }
            columnHeader.height += columnHeader.lastLevel().height;
        } ,
        _layoutRowAxis: function (bounds , viewModel) {
            var columnHeader = this.model.columnHeader , rowHeader = this.model.rowHeader , body = this.model.body;
            var columns = body.columns , rows = body.rows;
            var topicLevel , max , i , captionSize;
            topicLevel = body.rows;
            topicLevel.isAxis = true;
            topicLevel.height = bounds.height - columnHeader.height;
            topicLevel.cellHeight = Math.max(MIN_ROW_HEIGHT , Math.floor(topicLevel.height / topicLevel.length()));
            isMeasure = false;
            max = 0;
            for (i = 0; i < rows.topics.length; i++) {
                isMeasure = rows.topics[i].isMeasure;
                captionSize = rows.topics[i].captionSize;
                max = Math.max(captionSize.width , max);
            }
            // 如果body行表头是度量或者max小于rowHeight的1.4倍，将考虑旋转文字
            if (isMeasure === true){
                // TODO value axis
                topicLevel.cellWidth = topicLevel.width = captionSize.height;
                topicLevel.textRotate = true;
                topicLevel.isMeasure = true;
            } else if (max <= topicLevel.cellHeight * 1.5){
                topicLevel.cellWidth = topicLevel.width = captionSize.height;
                topicLevel.textRotate = true;
            } else {
                topicLevel.cellWidth = topicLevel.width = max;
                topicLevel.textRotate = false;
            }
        } , 
        _layoutRowHeader: function (bounds , viewModel) {
            var columnHeader = this.model.columnHeader , rowHeader = this.model.rowHeader , body = this.model.body;
            var levels , i , j , max , count , topicLevel , members , captionSize;
            rowHeader.width = body.rows.width;
            rowHeader.height = body.rows.height;
            levels = rowHeader.levels;
            for (i = levels.length - 2; i >= 0 ; i--) {
                topicLevel = levels[i];
                max = 0 ;
                count = 0;
                topicLevel.each(function (topic , index) {
                    captionSize = topic.captionSize;
                    members = topic.members;
                    if (levels[i+1] === rowHeader.lastLevel()){
                        topic.totalMembers = members.length;
                    } else {
                        topic.totalMembers = 0;
                        for (j = 0; j < members.length; j++) {
                            topic.totalMembers += members[j].totalMembers;
                        }
                    }
                    topic.height = topic.totalMembers * body.rows.cellHeight;
                    if (topic.height >= captionSize.width){
                        count++;
                    }
                    max = Math.max(captionSize.width , max);
                });
                // 如果子topic中大部分高度允许文字旋转，则旋转文字。
                topicLevel.height = body.rows.height;
                topicLevel.cellWidth = body.rows.cellWidth;
                topicLevel.cellHeight = body.rows.cellHeight;
                if (count / topicLevel.topics.length > 3/4){
                    topicLevel.width = captionSize.height;
                    topicLevel.textRotate = true;
                } else {
                    topicLevel.width = max;
                    topicLevel.textRotate = false;
                }
                rowHeader.width += topicLevel.width;
            }
        } ,
        _layoutColumnAxisWidth: function (bounds , viewModel) {
            var rowHeader = this.model.rowHeader , body = this.model.body;
            var topicLevel;
            topicLevel = body.columns;
            topicLevel.width = bounds.width - rowHeader.width;
            topicLevel.cellWidth = Math.max(MIN_COLUMN_WIDTH , Math.floor(topicLevel.width / topicLevel.topics.length));
        } ,
        _layoutColumnHeader: function (bounds , viewModel) {
            var columnHeader = this.model.columnHeader , rowHeader = this.model.rowHeader , body = this.model.body;
            var levels , i , j , members , topicLevel , captionSize;
            columnHeader.width = body.columns.width;
            columnHeader.height = body.columns.height;
            levels = columnHeader.levels;
            for (i = levels.length - 2; i >= 0 ; i--) {
                topicLevel = levels[i];
                topicLevel.each(function (topic , index) {
                    captionSize = topic.captionSize;
                    members = topic.members;
                    if (levels[i+1] === columnHeader.lastLevel()){
                        topic.totalMembers = members.length;
                    } else {
                        topic.totalMembers = 0;
                        for (j = 0; j < members.length; j++) {
                            topic.totalMembers += members[j].totalMembers;
                        }
                    }
                    topic.width = topic.totalMembers * body.columns.cellWidth;
                });
                // 列表头不旋转文字。
                topicLevel.width = body.columns.width;
                topicLevel.height = captionSize.height;
                topicLevel.cellWidth = body.columns.cellWidth;
                topicLevel.cellHeight = body.columns.cellHeight;
                columnHeader.height += topicLevel.height;
            }
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
                    this[prop] = new this.factories[prop](this , this.renderer.instance(this.renderer.g().attr("class" , name2class[prop]).node()));
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