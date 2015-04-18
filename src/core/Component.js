define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    
    var Component = oop.Class.extend({
        constructor: function Component() {}
    });
    
    module.exports = Component;
})