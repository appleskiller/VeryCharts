define(function (require , exports , module) {
    "use strict";
    var helper = require("verycharts/helper");
    var Chart = require("verycharts/Chart");
    var ChartFactory = require("verycharts/ChartFactory");
    
    var instances = {};
    var count = 0;
    var ATTR_KEY = "__verycharts__"
    
    var verycharts = {
        version: "0.1.0" ,
        create: function (dom) {
            var id = dom.getAttribute(ATTR_KEY);
            if (!id){
                id = ATTR_KEY + count++;
                dom.setAttribute(ATTR_KEY , id);
            }
            if (instances[id]){
                instances[id].dispose();
            }
            instances[id] = new Chart();
            return instances[id];
        } ,
    }
    
    module.exports = verycharts;
})