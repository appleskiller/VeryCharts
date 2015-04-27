define(function (require , exports , module) {
    "use strict";
    
    var consts = require("verycharts/consts");
    
    //-----------------------------------------------------------
    //
    // 工具函数
    //
    //===========================================================
    /**
     * 实现为requestAnimationFrame，如果浏览器不支持则使用setTimeout实现。
     **/
    var nextFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame;
    
    if (nextFrame)
        nextFrame = nextFrame.bind(window);
    else{
        nextFrame = function(callback) { setTimeout(callback, 17); };
    }
    /**
     * 延迟执行。
     **/
    function callLater(callback) {
        setTimeout(callback , 0);
    }
    
    var toString = Object.prototype.toString;
    var isArray = Array.isArray || function(obj) {
        return toString.call(obj) == '[object Array]';
    };
    var slice = Array.prototype.slice;
    
    function clone(obj , deep) {
        var result = obj , i , prop;
        var type = typeof obj;
        if (isArray(obj)){
            if (deep){
                result = [];
                for (var i = 0; i < obj.length; i++) {
                    result.push(clone(obj[i] , deep));
                }
            }else{
                result = obj.concat();
            }
        } else if (type === "date"){
            result = new Date();
            result.setTime(obj.getTime());
        } else if (type === "object"){
            result = {};
            for (prop in obj) {
                result[prop] = deep ? clone(obj[prop] , deep) : obj[prop];
            }
        }
        return result;
    }
    
    function mergeObject(o1 , o2 , arrayCallback) {
        var t1 , t2;
        for (var prop in o2) {
            t1 = typeof o1[prop];
            t2 = typeof o2[prop];
            if (t1 === "object" && t2 === "object"){
                mergeObject(o1[prop] , o2[prop])
            }else if (isArray(o1[prop]) && isArray(o2[prop]) && arrayCallback){
                o1[prop] = arrayCallback(o1[prop] , o2[prop] , prop);
            }else{
                o1[prop] = clone(o2[prop] , true);
            }
        }
        return o1;
    }
    
    function merge() {
        var obj = arguments[0];
        if (!obj || typeof obj !== "object")
            return;
        var arrayCallback = arguments[arguments.length];
        arrayCallback = (typeof arrayCallback) === "function" ? arrayCallback : null;
        var l = arrayCallback ? arguments.length - 1 : arguments.length;
        for (var i = 1; i < l; i++) {
            if (typeof arguments[i] === "object")
                mergeObject(obj , arguments[i] , arrayCallback);
        }
        return obj;
    }
    /**
     * 返回对象属性。prop可以是以“.”分割的属性链。
     **/
    function getValue(obj , prop) {
        if (!prop)
            return obj;
        var props = prop.split(".") , value = obj;
        for (var i = 0; i < props.length; i++){
            if (!value || !props[i] || !(props[i] in value))
                return undefined;
            value = value[props[i]];
        }
        return value;
    }
    //-----------------------------------------------------------
    //
    // 工具类
    //
    //===========================================================
    var Topic = function (value , groups , valueIndeies , parent) {
        this.value = value;
        this.groups = groups;
        this.parent = parent;
        this.cube = (parent instanceof CrossDataCube) ? parent : parent.cube;
    }
    Topic.prototype = {
        rowIndeies: null ,
        cross: function (topic) {
            // TODO
        } ,
        getMembers: function () {
            if (!this.members)
                this.members = [];
            return this.members;
        } ,
        getDatas: function () {
            // TODO
        }
    }
    
    var CrossDataCube = function (cube , rows , columnIndeies , valueIndeies) {
        this.sourceCube = cube;
        this.rows = rows || [];
        this.columnIndeies = columnIndeies || [];
        this.valueIndeies = valueIndeies || [];
        this.groups = rows.concat(columnIndeies);
    };
    CrossDataCube.prototype = {
        getValue: function (columnIndex , rowIndex) {
            return this._sourceCube.getValue(this.groups[columnIndex] , rowIndex);
        } ,
        getMembers: function () {
            if (!this.members){
                this._build();
            }
            return this.members;
        } ,
        _build: function () {
            this.members = [];
            
            if (!this.groups.length)
                return;
            
            var indicator = this.sourceCube.createIndicator();
            var i , l = this.groups.length , headerLength = this.sourceCube.headers.length ,
                last = this.valueIndeies.length === 0 ? headerLength - 1 : headerLength ,
                rowData , cind , value , topic , topicParent , map ;
            var groups = this.groups;
            var topicMap = {};
            while(!indicator.afterLast()){
                rowData = indicator.rowData;
                topic = topicParent = this;
                map = topicMap;
                for (i = 0; i < l; i++){
                    cind = groups[i];
                    if (cind === last)
                        break;
                    value = rowData[cind];
                    if (!map[value]){
                        map[value] = {map: {} , topic: null};
                        map[value].topic = new Topic(value , groups.slice(1) , this.valueIndeies , topicParent);
                    }
                    topic = map[value].topic;
                    topicParent.getMembers().push(topic);
                    topicParent = topic;
                    map = map[value].map;
                }
                if (!topic.rowIndeies)
                    topic.rowIndeies = [];
                topic.rowIndeies.push(rowData.rowIndex);
                indicator.moveNext();
            }
        }
    };
    
    var DataCube = function (headers , datas) {
        this.headers = headers;
        this.datas = datas;
    };
    DataCube.prototype = {
        createCrossDataCube: function (rows , columns , values) {
            return new CrossDataCube(this , rows , columns , values);
        } ,
        /**
         * 为此cube创建访问指针。
         */
        createIndicator: function () { return new DataCubeIndicator(this); },
        /**
         * 返回结果集行数
         */
        getRowLength: function () { return this._datas.length; },
        /**
         * 按索引返回指定行列数据。
         * @param columnName
         * @param rowIndex
         * @return
         */
        getValue: function (columnIndex, rowIndex) {
            return this._datas[rowIndex][columnIndex];
        },
        hasGroupType: function (groupType) {
            for (var i = 0; i < this._headers.length; i++) {
                if (this._headers[i].groupType === groupType)
                    return true;
            }
            return false;
        },
        getGroupTypeIndex: function () {
            if (this._groupTypeIndex)
                return this._groupTypeIndex;
            this.buildMaps();
            return this._groupTypeIndex;
        },
        /**
         * 返回组类型相对表头所包含的索引数组
         * @return
         */
        getIndexsByGroupType: function (groupType) {
            return this.getGroupTypeIndex()[groupType] ? this.getGroupTypeIndex()[groupType] : [];
        },
        /**
         * 按表头索引位置返回列描述
         * @return
         */
        getColumnByIndex: function (columnIndex) {
            return this.getMetas()[DataCube.COLUMN_INDEX][columnIndex];
        },
        /**
         * 返回针对列的各项描述值。
         * @return
         */
        getMetas: function () {
            if (this._meta)
                return this._meta;
            this.buildMaps();
            return this._meta;
        },
        buildMaps: function () {
            this._meta = [[], [], [], [], [], [], [], [], [], [], []];
            this._groupTypeIndex = {};
            this._columnNams = [];
            var index = 0, groupType, groupSet, columnSet, vec;
            for (var i = 0; i < this._desc.length; i++) {
                groupSet = this._desc[i];
                groupType = groupSet.name;
                vec = [];
                this._groupTypeIndex[groupType] = [];
                for (var j = 0; j < groupSet.items.length; j++) {
                    columnSet = groupSet.items[j];
                    vec.push(index);
                    this._groupTypeIndex[groupType].push(index);
                    this._meta[DataCube.COLUMN_NAME_INDEX].push(columnSet.field.title);
                    // this._meta[DataCube.COLUMN_TYPE_INDEX].push(columnSet.get("fieldType"));
                    // this._meta[DataCube.COLUMN_DESCRIPTION_INDEX].push(columnSet.description);
                    this._meta[DataCube.GROUP_NAME_INDEX].push(groupSet.label);
                    this._meta[DataCube.GROUP_TYPE_INDEX].push(groupSet.name);
                    // this._meta[DataCube.GROUP_DESCRIPTION_INDEX].push(groupSet.description);
                    this._meta[DataCube.COLUMN_INDEX].push(columnSet);
                    this._meta[DataCube.GROUP_INDEX].push(groupSet);
                    this._meta[DataCube.COLUMN_DATA_TYPE].push(columnSet.field.dataType);
                    this._meta[DataCube.COLUMN_DATA_FORMAT].push(columnSet.field.format);
                    // this._meta[DataCube.COLUMN_ID].push(columnSet.get("name"));
                    this._columnNams.push(columnSet.field.title);
                    index++;
                }
            }
        }
    };
    
    DataCube.COLUMN_INDEX = 0
    DataCube.COLUMN_NAME_INDEX = 1;
    DataCube.COLUMN_TYPE_INDEX = 2;
    
    var DataCubeIndicator = function (cube) {
        this.cube = cube;
        this.rowIndex = 0;
        this.rowData = cube.getData()[0];
    };
    DataCubeIndicator.prototype = {
        getColumnName: function (columnIndex) {
            return this.cube.getMetas()[DataCube.COLUMN_NAME_INDEX][columnIndex];
        },
        getColumnType: function (columnIndex) {
            return this.cube.getMetas()[DataCube.COLUMN_TYPE_INDEX][columnIndex];
        },
        getColumn: function (columnIndex) {
            return this.cube.getMetas()[DataCube.COLUMN_INDEX][columnIndex];
        },
        getColumnNames: function () {
            return this.cube.getColumnNames();
        },
        beforeFirst: function () {
            return this.rowIndex < 0;
        },
        afterLast: function () {
            return this.rowIndex >= this.cube.getRowLength();
        },
        moveNext: function () {
            if (!this.afterLast()) {
                this.rowIndex++;
                this.rowData = this.cube.datas[this.rowIndex];
                return true;
            }
            return false;
        },
        movePrevious: function () {
            if (!this.beforeFirst()) {
                this.rowIndex--;
                this.rowData = this.cube.datas[this.rowIndex];
                return true;
            }
            return false;
        }
    };
    DataCubeIndicator.create = function (headers , datas) {
        return new DataCubeIndicator(new DataCube(headers, datas));
    };
    /**
     * 解析具有状态的样式。例如
     * {
     *      "a": true
     *      "normal" {
     *          "b": 1
     *      }
     * }
     * 将被解析成为
     * {
     *      normal: {
     *          "a": true ,
     *          "b": 1
     *      }
     * }
     **/
    function parseStats(opt) {
        if (!opt)
            return {normal: opt , hover: null , selected: null};
        var ret = {normal: {} , hover: null , selected: null} , prop;
        for (prop in opt) {
            if (!ret.hasOwnProperty(prop)){
                ret.normal[prop] = opt[prop];
            }
        }
        if (opt.normal){
            ret.normal = merge(ret.normal , opt.normal);
        }
        for (prop in ret) {
            if (prop != "normal" && opt[prop]){
                ret[prop] = merge(ret[prop] , opt[prop]);
            }
        }
        return ret;
    }
    /**
     * 解析指定type的option。
     **/
    function parseOption(type , opt) {
        if (type === "stats"){
            return parseStats(opt);
        }
        return opt;
    }
    /**
     * 执行布局。
     **/
    function archorLayout(size , bounds , layout) {
        var restBounds = {x: bounds.x , y: bounds.y , width: bounds.width , height: bounds.height} , layoutBounds , bbox ,
            xx , yy , ww , hh , bbxx , bbyy , bbww , bbhh;
        if (layout.anchor === "bottom"){
            ww = bounds.width ; hh = size.height + layout.margin*2; xx = bounds.x ; yy = bounds.y + bounds.height - hh ;
            bbww = size.width; bbhh = size.height;
            if (layout.floating !== true){ restBounds.height -= hh; }
        }else if (layout.anchor === "left"){
            ww = size.height + layout.margin*2 ; hh = bounds.height; xx = bounds.x ; yy = bounds.y ;
            bbww = size.height; bbhh = size.width;
            if (layout.floating !== true){ restBounds.x -= ww ; restBounds.width -= ww; }
        }else if (layout.anchor === "right"){
            ww = size.height + layout.margin*2 ; hh = bounds.height; xx = bounds.x + bounds.width - ww ; yy = bounds.y ;
            bbww = size.height; bbhh = size.width;
            if (layout.floating !== true){ restBounds.width -= ww; }
        }else{
            ww = bounds.width ; hh = size.height + layout.margin*2; xx = bounds.x ; yy = bounds.y ; 
            bbww = size.width; bbhh = size.height;
            if (layout.floating !== true){ restBounds.y -= hh; restBounds.height -= hh; }
        }
        layoutBounds = {x: xx , y: yy , width: ww , height: hh};
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
        bbox = {x: bbxx , y: bbyy , width: bbww , height: bbhh};
        return {
            bounds: layoutBounds ,
            bbox: bbox ,
            rest: restBounds
        };
    }
    
    module.exports = {
        nextFrame: nextFrame ,
        callLater: callLater ,
        clone: clone ,
        merge: merge ,
        getValue: getValue ,
        parseOption: parseOption ,
        archorLayout: archorLayout ,
        
        DataCube: DataCube ,
        DataCubeIndicator: DataCubeIndicator
    };
})