define(function (require , exports , module) {
    
    function cssWidth (dom) {  
        if (dom.style.width) return dom.style.width;  
        if (dom.currentStyle) return dom.currentStyle.width;  
        if (document.defaultView && document.defaultView.getComputedStyle)  
            return document.defaultView.getComputedStyle(dom , "").getPropertyValue("width");  
    }
    function cssHeight (dom) {  
        if (dom.style.height) return dom.style.height;  
        if (dom.currentStyle) return dom.currentStyle.height;  
        if (document.defaultView && document.defaultView.getComputedStyle)  
            return document.defaultView.getComputedStyle(dom , "").getPropertyValue("height");  
    }
    var resetCSS = function( dom , prop ) {  
        var old = {};  
        for ( var i in prop ) {  
            old[i] = dom.style[i];  
            dom.style[i] = prop[i];  
        }
        return old;  
    }  
    var restoreCSS = function( dom , prop ) {  
        for ( var i in prop )  
            dom.style[i] = prop[i];  
    }
    
    //测量字符用的dom
    var span = null;
    
    var util = {
        globalX: function (dom) {
            return dom.offsetParent ? dom.offsetLeft + util.globalX(dom.offsetParent) : dom.offsetLeft;
        } ,
        globalY: function (dom) {
            return dom.offsetParent ? dom.offsetTop + util.globalY(dom.offsetParent) : dom.offsetTop;
        } ,
        parentX: function (dom) {
            return dom.parentNode == dom.offsetParent ? dom.offsetLeft : util.globalX(dom) - util.globalX(dom.parentNode);
        } ,
        parentY: function (dom) {
            return dom.parentNode == dom.offsetParent ? dom.offsetTop : util.globalY(dom) - util.globalY(dom.parentNode);
        } ,
        size: function (dom) {
            if (dom.style.display != "none"){  
                return {width: dom.offsetWidth , height: dom.offsetHeight} || {width: parseInt(cssWidth(dom)) , height: parseInt(cssHeight(dom))};  
            }
            var old = resetCSS( dom, {  
                display: '',  
                visibility: 'hidden',  
                position: 'absolute'  
            });  
            var size = {width: dom.clientWidth , height: dom.clientHeight} || {width: parseInt(cssWidth(dom)) , height: parseInt(cssHeight(dom))};  
            restoreCSS( dom, old );
            return size;
        } ,
        windowSize: function () {
            var de = document.documentElement;
            var ww = window.innerWidth || ( de && de.clientWidth ) || document.body.clientWidth;
            var hh = window.innerHeight || ( de && de.clientHeight ) || document.body.clientHeight;
            return {width: ww , height: hh};
        } ,
        pageSize: function () {
            return {width: document.body.scrollWidth , height: document.body.scrollHeight};
        } ,
        
        stringSize: function (str , css) {
            if (!str){
                return { width: 0 , height: 0};
            }
            css = css || "";
            if (!span) {
                span = document.createElement("span");
                document.body.appendChild(span);
            }
            span.innerText = str;
            span.setAttribute("style" , "");
            if (typeof css === "string"){
                span.setAttribute("style" , css);
            }else{
                for (var prop in css) {
                    span.style[prop] = css[prop];
                }
            }
            span.style.visibility = "hidden";
            span.style.whiteSpace = "nowrap";
            var size = util.size(span);
            span.style.display = "none";
            return size;
        }
    }
    module.exports = util;
})