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
    function Module(email, options) {
        var inst = this;
        var settings;

        settings = inst._settings = mergeSettings(Module.defaultOptions, options);

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

        inst._initialize(email);
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
        fields: [
            {
                label: "Email Address",
                name: "email",
                type: "email"
            },
            {
                label: "Comments",
                name: "comment",
                type: "text"
            }
        ]
    };    

    /**
     * Module - Private methods
     * ************************
     */
    
     /**
     * 
     * @private
     */
    Module.prototype._initialize = function(email) {
        var inst = this;
        var form;

        form = inst._form = new Form(email);        

        inst._settings.fields.forEach(function (fieldSettings) {
            var field = new Field(fieldSettings);
            form.addField(fieldSettings.name, field);
        });        

        inst._settings.element.onclick = () => inst._onOpenClick();

        body.appendChild(form.getRootElement());
    }

    Module.prototype._onOpenClick = function () {
        var inst = this;
        inst._form.show();
    }


    function Form(email) {
        var inst = this;
        
        inst._fields = {};
        inst._formUrl = "https://formspree.io/"+email;

        var cancel = doc.createElement("button");
        cancel.className = "fields-cancel"
        cancel.innerText = "Cancel";
        cancel.type = "button";        
        cancel.onclick = () => inst.hide();

        var submit = doc.createElement("button");
        submit.className = "fields-submit"
        submit.innerText = "Submit";
        submit.type = "button";        
        submit.onclick = () => inst._onSubmitClick();

        var group = inst._fields$ = doc.createElement("group");
        group.className = "fields-group";

        var form = doc.createElement("div");
        form.id = "fields-modal"
        form.appendChild(group);            
        form.appendChild(submit); 
        form.appendChild(cancel);           

        var modal = inst._modal$ = doc.createElement("div");
        modal.id = "fields-modal-wrapper";
        modal.style.display = "none";
        modal.onclick = (evt) => inst._onBackgroundClick(evt);
        modal.appendChild(form);
    }

    Form.prototype.addField = function(key, field) {
        var inst = this;
        inst._fields[key] = field;
        inst._fields$.appendChild(field.getRootElement());
    }

    Form.prototype.getRootElement = function() {
        var inst = this;
        return inst._modal$;
    }

    Form.prototype.hide = function() {
        var inst = this;
        inst.getRootElement().style.display = "none";
    }

    Form.prototype.show = function() {
        var inst = this;
        inst.getRootElement().style.display = "flex";
    }    

    Form.prototype._onBackgroundClick = function(evt) {
        var inst = this;
        if (evt.target !== inst._modal$) return;
        inst.hide();
    }

    Form.prototype._onSubmitClick = function() {
        var inst = this;
        var data = {};
        
        Object.keys(inst._fields).forEach(function (key) {
            data[key] = inst._fields[key].getValue();
        });

        var json = JSON.stringify(data);
        
        var request = new XMLHttpRequest();          
        request.addEventListener('load', () => inst._onResponse());        
        request.open('POST', inst._formUrl);                          
        request.send(json);
    }

    Form.prototype._onResponse = function() {
        console.log(this);
    }


    function Field(settings) {
        var inst = this;
        
        var label = doc.createElement("label");
        label.innerText = settings.label;

        var input = inst._input$ = doc.createElement("input");
        input.name = settings.name;
        input.type = settings.type;

        var control = inst._control$ = doc.createElement("div");
        control.className = "fields-control";
        control.appendChild(label);
        control.appendChild(input);

        if (settings.class && settings.class.length > 0) {
            control.classList.add(settings.class);
        }
    }

    Field.prototype.getRootElement = function() {
        var inst = this;
        return inst._control$;
    }

    Field.prototype.getValue = function() {
        var inst = this;
        return inst._input$.value;
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