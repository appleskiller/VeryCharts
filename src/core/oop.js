define(function (require , exports , module) {
    "use strict";
    var ObjProto = Object.prototype;
    var hasOwnProperty = ObjProto.hasOwnProperty;
    var toString = ObjProto.toString;
    var slice = Array.prototype.slice;
    
    var isArray = Array.isArray || function(obj) {
        return toString.call(obj) == '[object Array]';
    };
    /**
     * 指定对象是否具有某属性。
     **/
    function has(obj , prop) {
        return hasOwnProperty.call(obj , prop);
    }
    /**
     * 指定实例是否是某类实例。
     **/
    function is(instance , ctor) {
        if (ctor === Array)
            return isArray(instance);
        else
            return instance instanceof ctor;
    }
    /**
     * 浅克隆属性到指定obj上。
     **/
    function extend(obj) {
        var args = slice.call(arguments , 1);
        for (var i = 0; i < args.length; i++) {
            if (args[i]){
                for (var prop in args[i]) {
                    obj[prop] = args[i][prop];
                }
            }
        }
        return obj;
    }
    
    function classExtend(props) {
        var parent = this , child;
    
        if (props && has(props, 'constructor')) {
          child = props.constructor;
        } else {
          child = function(){ return parent.apply(this, arguments); };
        }
    
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();
    
        if (props) extend(child.prototype, props);
    
        child.__super__ = parent.prototype;
        child.extend = classExtend;
        return child;
    }
    /**
     * 类。
     **/
    function Class() {
        // body...
    }
    Class.prototype = {};
    Class.extend = classExtend;
    
    module.exports = {
        extend: extend ,
        extendable: function (ctor) {
            ctor.extend = classExtend;
        } ,
        has: has ,
        is: is ,
        Class: Class
    };
})