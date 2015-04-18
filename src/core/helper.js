define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    
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
    
    module.exports = {
        nextFrame: nextFrame ,
        callLater: callLater
    };
})