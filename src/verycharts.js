define(function (require , exports , module) {
    "use strict";
    
    var Chart = require("verycharts/Chart");
    
    var instances = {};
    var count = 0;
    var ATTR_KEY = "__verycharts-id__"
    
    var verycharts = {
        version: "0.1.0" ,
        /**
         * 在指定的dom上创建一个chart实例。
         * 在同一个dom上重复创建，之前的chart实例会被销毁。
         **/
        create: function (dom) {
            if (!dom)
                return null;
            var id = dom.getAttribute(ATTR_KEY);
            if (!id){
                id = "instance_" + count++;
                dom.setAttribute(ATTR_KEY , id);
            }
            if (instances[id]){
                instances[id].dispose();
            }
            instances[id] = new Chart(dom);
            return instances[id];
        } ,
    }
    
    module.exports = verycharts;
})