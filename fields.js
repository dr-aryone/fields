(function (global, factory) {
    
    var namespace = 'Fields';
    
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(namespace);
    }
    else if (typeof define === 'function' && define.amd) {
        define([], function () {
              return factory(namespace);
        });
    }
    else {
        global[namespace] = factory(namespace);
    }
    
}(typeof window !== 'undefined' ? window : this, function (namespace) {

    "use strict";

    var global = window;
    var doc = global.document;
    var body = doc.body;

    // Types.
    var typeFunction = "function";
    var typeString = "string";
    var typeNumber = "number";

    /**
     * Creates a new Module instance.
     *
     * @public
     * @class
     * @param {Object} [options]
     * @param {String} [options.element]
     * @param {String} [options.email]
     * @param {Array} [options.fields]
     */
    function Module(options) {
        var inst = this;
        var settings;

        settings = inst._settings = mergeSettings(Module.defaultOptions, options);

        if (!settings.email) {
            throw new Error("Email is required when initializing a new Module instance.");
        }

        if (settings.element) {
            settings.element = typeof settings.element === typeString 
                ? doc.querySelector(settings.element) 
                : settings.element;
        }        

        if (settings.fields) {
            settings.fields.push({
                class: "hidden",
                name: "_gotcha",
                type: "text",                
            })
        }

        inst._initialize();
    }

    /**
     * Module - Public properties
     * ************************
     */

    /**
     * Default options for Module instance.
     *
     * @public
     * @memberof Module
     */

    Module.defaultOptions = {
    };    

    /**
     * Module - Private methods
     * ************************
     */

    /**
     * 
     * @private
     */
    Module.prototype._buildField = function(field) {
        var label = doc.createElement("label");
        label.innerText = field.name;

        var input = doc.createElement("input");
        input.name = field.name;
        input.type = field.type;

        var wrapper = doc.createElement("div");
        wrapper.className = "fields-field";
        wrapper.appendChild(label);
        wrapper.appendChild(input);

        if (field.class && field.class.length > 0) {
            wrapper.classList.add(field.class);
        }

        return wrapper;
    }

    /**
     * 
     * @private
     */
    Module.prototype._buildModal = function(email) {
        var form = doc.createElement("form");
        form.action = "https://formspree.io/"+email;
        form.method = "POST";        

        var modal = doc.createElement("div");
        modal.id = "fields-modal"
        modal.appendChild(form);

        return modal;
    }
    
     /**
     * 
     * @private
     */
    Module.prototype._initialize = function() {
        var inst = this;
        var modal;

        modal = inst._modal = inst._buildModal(inst._settings.email);        

        inst._settings.fields.forEach(function (field) {
            var el = Module.prototype._buildField(field);

            inst._modal.appendChild(el);
        });        

        inst._settings.element.onclick = function() {
            console.log("HI");
        }

        body.appendChild(modal);
    }

    /**
     * Merge default settings with user settings. The returned object is a new
     * object with merged values.
     *
     * @private
     * @param {Object} defaultSettings
     * @param {Object} [userSettings]
     * @returns {Object} Returns a new object.
     */
    function mergeSettings(defaultSettings, userSettings) {
        var ret = Object.assign({}, defaultSettings);

        ret = userSettings ? Object.assign(ret, userSettings) : ret;
    
        return ret;    
    }

    return Module;

}));