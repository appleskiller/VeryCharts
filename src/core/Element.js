define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    
    var Element = oop.Class.extend({
        constructor: function Element() {}
    });
    
    module.exports = Element;
})