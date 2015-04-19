define(function (require , exports , module) {
    "use strict";
    
    var helper = require("verycharts/helper");
    
    function chart() {
        return {
            "title": {
                "enabled": true ,
                "text": "Chart Title" ,
                "style": {
                    "font": {
                        "family": "Verdana , Arial, sans-serif" ,
                        "size": 12 ,
                        "color": "#000000" ,
                    } 
                } ,
                "position": {
                    "horizontal": "center" ,
                    "vertical": "top" ,
                    "float": false
                }
            } ,
            "style": {}
        }
    }
    
    function chartPlot() {
        return {
            "style": {}
        }
    }
    
    function animation() {
        return {
            "enabled": true 
        }
    }
    
    function palettes() {
        return {
            "verycharts": {
                "type": "normal" ,
                "colors": []
            }
        }
    }
    
    function loading() {
        return {};
    }
    
    function nodata() {
        // body...
    }
    
    var defaultOptions = {
        "chart": chart() ,
        "animation": animation() ,
        "palettes": palettes() ,
        "chartPlot": chartPlot() ,
        "loading": loading() ,
        "noData": nodata()
    };
    
    module.exports = {
        cloneDefault: function () {
            if (arguments.length == 0){
                return helper.clone(defaultOptions);
            }else{
                var args = [defaultOptions];
                for(var i = 0; i < arguments.length; i++){
                    args.push(arguments[i]);
                }
                return helper.getValue.apply(null , args);
            }
        } ,
        mergeDefault: function (options) {
            options = options || {};
            helper.merge(defaultOptions , options);
        }
    };
})