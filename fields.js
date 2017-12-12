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
    Module.prototype._initialize = function() {
        var inst = this;
        var form;

        form = inst._form = new Form(inst._settings.email);        

        inst._settings.fields.forEach(function (fieldSettings) {
            var field = new Field(fieldSettings);
            form.addField(field);
        });        

        inst._settings.element.onclick = function() {
            console.log("HI");
        }

        body.appendChild(form);
    }


    function Form(email) {
        var inst = this;
        var form, modal;

        form = inst._form = doc.createElement("form");
        form.action = "https://formspree.io/"+email;
        form.method = "POST";        

        modal = inst._modal = doc.createElement("div");
        modal.id = "fields-modal"
        modal.appendChild(form);

        return modal;
    }

    Form.prototype.addField = function(field) {
        var inst = this;

        inst._form.appendChild(field);
    }


    function Field(settings) {
        var inst = this;
        var label, input, wrapper;

        label = inst._label = doc.createElement("label");
        label.innerText = settings.name;

        input = inst._input = doc.createElement("input");
        input.name = settings.name;
        input.type = settings.type;

        wrapper = inst._wrapper = doc.createElement("div");
        wrapper.className = "fields-field";
        wrapper.appendChild(label);
        wrapper.appendChild(input);

        if (settings.class && settings.class.length > 0) {
            wrapper.classList.add(settings.class);
        }

        return wrapper;
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