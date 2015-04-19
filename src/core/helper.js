define(function (require , exports , module) {
    "use strict";
    
    //-----------------------------------------------------------
    //
    // 工具函数
    //
    //===========================================================
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
    }
    
    function getValue(obj) {
        if (arguments.length <= 1)
            return obj;
        var props = slice(arguments , 1) , value = obj;
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
    module.exports = {
        nextFrame: nextFrame ,
        callLater: callLater ,
        clone: clone ,
        merge: merge ,
        getValue: getValue
    };
})