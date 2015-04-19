define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    
    var Component = oop.Class.extend({
        constructor: function Component() {} ,
        setOptions: function (options) {
            this._options = options;
            return this;
        }
    });
    
    module.exports = Component;
})