define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    
    var Graphics = oop.Class.extend({
        constructor: function Graphics() {
            // body...
        }
    })
    
    var Display = oop.Class.extend({
        constructor: function Display() {} ,
        
    })
    
    module.exports = {
        Display: Display ,
        Graphics: Graphics
    };
})