define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    
    function returnTrue() { return true; };
	function returnFalse() { return false; };

    var Event = oop.Class.extend({
        constructor: function Event(type , props , cancelable) {
            if ( !(this instanceof Event) ) {
    			return new Event(type , cancelable , props );
    		}
    		if (props){
    			for (var p in props){
    				this[p] = props[p];
    			}
    		}
    		this.type = type;
    		this.cancelable = (cancelable === true);
        } ,
        isDefaultPrevented: returnFalse ,
        preventDefault: function() {
			if (this.cancelable)
				this.isDefaultPrevented = returnTrue;
		} ,
    });

    var eventApi = {
        on: function (type , callback , priority) {
            if (!type || !callback) return this;
            this._events = this._events || {};
            this._events[type] = this._events[type] || [];
			var events = this._events[type];
			var inserted = false , ep , priority = priority == null ? 0 : priority;
			for (var i = 0; i < events.length; i++){
				ep = events[i].priority == null ? 0 : events[i].priority;
				if (ep < priority){
					events.splice(i , 0 , {callback: callback , ctx: this , priority: priority});
					inserted = true;
					break;
				}
			}
			if (!inserted)
				events.push({callback: callback , ctx: this , priority: priority});
			return this;
        } ,
        off: function (type , callback) {
            if (!this._events) return this;
            if (!type && !callback) { this._events = {} ; return this};
            var types , retain , ev , events , i , j;
            if (!type){
                types = [];
                for (var prop in this._events) {
                    types.push(prop);
                }
            }else{
                types = [type];
            }
            for (i = 0; i < types.length; i++) {
                type = types[i];
                events = this._events[type];
                if (events){
                    this._events[type] = retain = [];
                    if (callback){
                        for (var j = 0; j < events.length; j++) {
                            ev = events[j];
                            if (callback !== ev.callback){
                                retain.push(ev);
                            }
                        }
                    }
                    if (!retain.length) delete this._events[type];
                }
            }
            return this;
        } ,
        trigger: function (event) {
			if (!event) return this;
			if (typeof event === "string"){ event = Event(event) };
			event.target = this;
			
			if (!this._events) return this;
            var events = this._events[event.type];
            if (events) {
                var ev , i = -1, l = events.length;
                while (++i < l){
                    ev = events[i];
                    ev.callback.call(ev.ctx , event);
                }
            };
			return this;
		}
    }
    
    var EventTrigger = oop.Class.extend({
        constructor: function EventTrigger() {} ,
        on: eventApi.on ,
        off: eventApi.off , 
        trigger: eventApi.trigger
    });
    
    oop.extendable(Event);
    oop.extendable(EventTrigger);
    
    module.exports = {
        Event: Event ,
        EventTrigger: EventTrigger ,
        eventable: function (obj) {
            if (!obj)
                return;
            return oop.extend(obj , eventApi);
        }
    };
})