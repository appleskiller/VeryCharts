define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
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
    //-----------------------------------------------------------
    //
    // 工具类
    //
    //===========================================================
    var Topic = oop.Class.extend({
        constructor: function Topic (caption , value , depth , parent , isVirtualTopic) {
            this.caption = caption;
            this.value = value;
            this.depth = depth;
            this.parent = parent;
            this.members = [];
            var cube = this.cube = (parent instanceof CrossDataCube) ? parent : parent.cube;
            this.header = cube.headers[cube.groups[this.depth]]
            this.isMeasure = (cube.measureMap[cube.groups[depth]] === true);
            this.isVirtualTopic = (isVirtualTopic === true);
        } ,
        rowIndeies: null ,
        cross: function (topic) {
            // TODO
        } ,
        getDatas: function () {
            // TODO
        }
    });
    
    var CrossHeader = oop.Class.extend({
        constructor: function CrossHeader(cube) {
            this.cube = cube;
            this.levels = [];
        } ,
        addTopic: function (depth , topic) {
            if (!this.levels[depth]){
                this.levels[depth] = []
            }
            this.levels[depth].push(topic);
        }
    });
    
    var CrossBody = oop.Class.extend({
        constructor: function CrossBody(cube) {
            this.cube = cube;
            this.columns = [];
            this.rows = [];
        } ,
        getData: function (columnIndex , rowIndex) {
            // TODO
            return null;
        }
    })
    
    var CrossDataCube = oop.Class.extend({
        constructor: function CrossDataCube (headers , datas , rows , columns , measures) {
            this.headers = headers || [];
            this.datas = datas || [];
            this.cube = new DataCube(headers , datas);
            this.rows = rows || [];
            this.columns = columns || [];
            measures = measures || [];
            this.others = [];
            this.members = [];
            this.noMeasure = !measures || measures.length === 0;
            this.crossPoint = this.rows.length;
            this.measureMap = {};
            var measureMap = this.measureMap , others = this.others , i , inds = {};
            for (i = 0; i < measures.length; i++) {
                measureMap[measures[i]] = true;
            }
            this.groups = [];
            for (i = 0; i < rows.length; i++) {
                this.groups.push(rows[i]);
                inds[rows[i]] = true;
            }
            for (i = 0; i < columns.length; i++) {
                this.groups.push(columns[i]);
                inds[columns[i]] = true;
            }
            // 将其他列组织到一起。
            for (i = 0; i < this.headers.length; i++) {
                if (inds[i] !== true){
                    others.push(i);
                }
            }
        } ,
        getValue: function (columnIndex , rowIndex) {
            return this._sourceCube.getValue(this.groups[columnIndex] , rowIndex);
        } ,
        build: function () {
            this.columnHeader = this._createColumnHeader();
            this.rowHeader = this._createRowHeader();
            this.body = this._createBody();
            
            if (!this.groups.length)
                return;
            
            var indicator = this.cube.createIndicator();
            var l = this.groups.length , 
                i , rowData , cind , key , value , topic , topicParent , map , isMeasure , isVirtualTopic;
            var groups = this.groups;
            var topicMap = {};
            while(!indicator.afterLast()){
                rowData = indicator.rowData;
                topic = topicParent = this;
                map = topicMap;
                for (i = 0; i < l; i++){
                    cind = groups[i];
                    isMeasure = (this.measureMap[cind] === true)
                    // 如果为度量或没有度量且为最后一个维度，则以索引作为key
                    if (isMeasure || (this.noMeasure && i === l - 1 && this.others.length === 0)){
                        key = cind;
                        isVirtualTopic = true;
                    }else{
                        key = rowData[cind];
                        isVirtualTopic = false;
                    }
                    value = rowData[cind];
                    if (!map[key]){
                        map[key] = {map: {} , topic: null};
                        topic = map[key].topic = this._createTopic(key , value , i , topicParent , isVirtualTopic);
                        this._setupTopic(topic);
                        topicParent.members.push(topic);
                    } else {
                        topic = map[key].topic;
                    }
                    topicParent = topic;
                    map = map[key].map;
                }
                if (!topic.rowIndeies)
                    topic.rowIndeies = [];
                topic.rowIndeies.push(indicator.rowIndex);
                indicator.moveNext();
            }
            return this;
        } ,
        _createTopic: function (key , value , depth , parent , isVirtualTopic) {
            return new Topic(key , value , depth , parent , isVirtualTopic);
        } ,
        _createColumnHeader: function () {
            return new CrossHeader();
        } ,
        _createRowHeader: function () {
            return new CrossHeader();
        } ,
        _createBody: function () {
            return new CrossBody();
        } ,
        _setupTopic: function (topic) {
            var depth = topic.depth;
            if (depth < this.crossPoint){
                this.rowHeader.addTopic(depth , topic);
                if (depth == this.crossPoint - 1){
                    this.body.rows.push(topic);
                }
            } else {
                this.columnHeader.addTopic(depth - this.crossPoint , topic);
                if (depth == this.crossPoint){
                    this.body.columns.push(topic);
                }
            }
        }
    })
    
    var DataCube = oop.Class.extend({
        constructor: function (headers , datas) {
            this.headers = headers || [];
            this.datas = datas || [];
            this.metas = {};
            this.indeiesMap = {};
        } ,
        createCrossDataCube: function (rows , columns , measures , CubeCtor) {
            CubeCtor = CubeCtor || CrossDataCube;
            var cube = new CubeCtor(this.headers , this.datas , rows , columns , measures);
            cube.cube = this;
            return cube;
        } ,
        /**
         * 为此cube创建访问指针。
         */
        createIndicator: function () { return new DataCubeIndicator(this); },
        /**
         * 返回结果集行数
         */
        getRowLength: function () { return this.datas.length; },
        /**
         * 按索引返回指定行列数据。
         * @param columnName
         * @param rowIndex
         * @return
         */
        getValue: function (columnIndex, rowIndex) {
            return this.datas[rowIndex][columnIndex];
        } ,
        getIndeiesBy: function (prop , value) {
            if (prop == null)
                return [];
            if (!this.indeiesMap[prop] || !this.indeiesMap[prop][value]){
                this._buildIndeiesMap(prop , value);
            }
            return this.indeiesMap[prop][value] || [];
        } ,
        getMetasBy: function (prop) {
            if (!prop)
                return [];
            if (!this.metas[prop]){
                this._buildMetas(prop);
            }
            return this.metas[prop];
        } ,
        isEmpty: function () {
            return this.headers.length === 0;
        } ,
        _buildIndeiesMap: function (prop) {
            if (!this.metas[prop]){
                this._buildMetas(prop);
            }
            var metas = this.metas[prop];
            var map = this.indeiesMap[prop] = {};
            var value;
            for (var i = 0; i < metas.length; i++) {
                value = metas[i];
                if (!map[value]){
                    map[value] = [];
                }
                map[value].push(i);
            }
        } ,
        _buildMetas: function (prop) {
            this.metas[prop] = [];
            for (var i = 0; i < this.headers.length; i++) {
                this.metas[prop].push(getValue(this.headers[i] , prop));
            }
        }
    });
    
    var DataCubeIndicator = function (cube) {
        this.cube = cube;
        this.rowIndex = 0;
        this.rowData = cube.datas[0];
    };
    DataCubeIndicator.prototype = {
        get: function (columnIndex , prop) {
            return this.cube.getMetasBy(prop)[columnIndex];
        } ,
        getHeader: function (columnIndex) {
            return this.cube.headers[columnIndex];
        } ,
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
    
    var Dictionary = function () {
		this._keys = [];
		this._values = [];
	};
	Dictionary.prototype = {
		length: 0 , 
		_keys: null , 
		_values: null , 
		put: function (key , value) {
			if (this._keys.indexOf(key) == -1){
				this._keys.push(key);
				this._values.push(value);
				this.length++;
				return value;
			};
			return null;
		} , 
		del: function (key) {
			var ind = this._keys.indexOf(key);
			var value;
			if (ind != -1){
				this._keys.splice(ind , 1);
				value = this._values.splice(ind , 1)[0];
				this.length--;
				return value;
			};
			return null;
		} , 
		get: function (key) {
			var ind = this._keys.indexOf(key);
			if (ind != -1)
				return this._values[ind];
			return null;
		} , 
		has: function (key) {
			return this._keys.indexOf(key) != -1;
		} ,
		each: function (fn , thisObject) {
			if (!fn || typeof fn !== "function")
				return;
			for (var i = 0; i < this.length; i++){
				if (thisObject)
					fn.apply(thisObject , this._keys[i] , this._values[i] , i);
				else
					fn(this._keys[i] , this._values[i] , i);
			};
		} , 
		clear: function () {
			this._keys = [];
			this._values = [];
			this.length = 0;
			return this;
		}
	};
    module.exports = {
        nextFrame: nextFrame ,
        callLater: callLater ,
        clone: clone ,
        merge: merge ,
        getValue: getValue ,
        parseOption: parseOption ,
        archorLayout: archorLayout ,
        
        DataCube: DataCube ,
        DataCubeIndicator: DataCubeIndicator ,
        CrossHeader: CrossHeader ,
        CrossBody: CrossBody ,
        Topic: Topic ,
        CrossDataCube: CrossDataCube ,
        Dictionary: Dictionary
    };
})