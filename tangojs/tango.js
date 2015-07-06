var tango;
(function (tango) {
    "use strict";
    var EVT_SET = "set";
    var EVT_DOM_VALUE = "domValueChanged";
    var EVT_DOM_CHANGE = "domChanged";
    var EVT_UNBIND = "unbind";
    var EVT_DISPOSE = "dispose";
    var EVT_CHANGE = "change";
    var LITERAL_PATTERN = /\((.*)\)/g;
    var NAMESPACE_DELIMITER = ".";
    var EXPRESSION_DELIMITER = "->";
    var PROPERTY_MATCHER = /\${([\w]*)}/g;
    var str;
    (function (str) {
        function contains(value, searchString) {
            return value && value.indexOf(searchString) !== -1;
        }
        str.contains = contains;
        function split(value, delimiter) {
            if (!contains(value, delimiter)) {
                return [value.trim()];
            }
            return value.split(delimiter).map(function (i) { return i.trim(); }).filter(function (i) { return !!i; });
        }
        str.split = split;
        function startsWith(value, searchString, position) {
            if (!position) {
                position = 0;
            }
            return value.lastIndexOf(searchString, position) === position;
        }
        str.startsWith = startsWith;
        function trim(value) {
            return value.replace(/^\s+|\s+$/g, "");
        }
        str.trim = trim;
    })(str = tango.str || (tango.str = {}));
    var obj;
    (function (obj) {
        function isCollection(value) {
            return !!value && typeof value.length === "number";
        }
        obj.isCollection = isCollection;
        function isDefined(value) {
            return value !== undefined && value !== null;
        }
        obj.isDefined = isDefined;
        function isFunction(value) {
            return typeof value === "function";
        }
        obj.isFunction = isFunction;
        function isObject(value) {
            if (!value || value instanceof Date || value instanceof RegExp) {
                return false;
            }
            var typeOfData = typeof value;
            return typeOfData === "object" || typeOfData === "function";
        }
        obj.isObject = isObject;
        function getProperty(root, propertyPath) {
            var match = LITERAL_PATTERN.exec(propertyPath);
            if (match) {
                return match[1];
            }
            var value;
            if (-1 === propertyPath.indexOf(NAMESPACE_DELIMITER)) {
                value = root[propertyPath];
            }
            else {
                var parts = propertyPath.split(NAMESPACE_DELIMITER);
                var ancestor = root;
                for (var i = 0; i < parts.length; i++) {
                    var childName = parts[i];
                    var descendant = ancestor[childName];
                    if (!isDefined(descendant)) {
                        return "";
                    }
                    ancestor = descendant;
                }
                value = ancestor;
            }
            if (!isDefined(value)) {
                return "";
            }
            return value;
        }
        obj.getProperty = getProperty;
        function setProperty(root, propertyPath, value, thisArg) {
            var resolvedValue;
            if (isFunction(root)) {
                resolvedValue = value.call(thisArg || root, value);
            }
            else {
                resolvedValue = value;
            }
            var container = root;
            var path = propertyPath;
            if (-1 !== propertyPath.indexOf(NAMESPACE_DELIMITER)) {
                var parts = propertyPath.split(NAMESPACE_DELIMITER);
                var ancestor = root;
                for (var i = 0; i < parts.length - 1; i++) {
                    var childName = parts[i];
                    var descendant = ancestor[childName];
                    if (!isDefined(ancestor)) {
                        return false;
                    }
                    if (!isDefined(ancestor)) {
                        return false;
                    }
                    ancestor = descendant;
                }
                var lastpropertyPathSegment = parts[parts.length - 1];
                container = ancestor;
                path = lastpropertyPathSegment;
            }
            if (isFunction(container[path])) {
                container[path].call(thisArg || root, resolvedValue);
                return true;
            }
            container[path] = resolvedValue;
            return true;
        }
        obj.setProperty = setProperty;
        function evaluate(root, expression, initialValue) {
            var expressions = str.split(expression, EXPRESSION_DELIMITER);
            var bundle = initialValue;
            for (var i = 0; i < expressions.length; i++) {
                var exp = getProperty(root, expressions[i]);
                if (isFunction(exp)) {
                    bundle = exp.call(this.data, bundle);
                }
                else {
                    bundle = exp;
                }
                if (bundle === undefined) {
                    return undefined;
                }
            }
            return bundle;
        }
        obj.evaluate = evaluate;
    })(obj = tango.obj || (tango.obj = {}));
    var list;
    (function (list) {
        function each(src, callback) {
            for (var i = 0; i < src.length; i++) {
                callback(src[i], i);
            }
        }
        list.each = each;
        function eachRight(src, callback) {
            var start = src.length - 1;
            for (var i = start; i > -1; i--) {
                callback(src[i], i);
            }
        }
        list.eachRight = eachRight;
        function filter(src, condition) {
            var results = [];
            for (var i = 0; i < src.length; i++) {
                if (condition(src[i])) {
                    results.push(src[i]);
                }
            }
            return results;
        }
        list.filter = filter;
        function find(src, condition) {
            for (var i = 0; i < src.length; i++) {
                if (condition(src[i])) {
                    return src[i];
                }
            }
            return undefined;
        }
        list.find = find;
        function has(src, item) {
            for (var i = 0; i < src.length; i++) {
                if (src[i] === item) {
                    return true;
                }
            }
            return false;
        }
        list.has = has;
        function hasAny(src, condition) {
            for (var i = 0; i < src.length; i++) {
                if (condition(src[i])) {
                    return true;
                }
            }
            return false;
        }
        list.hasAny = hasAny;
        function hasEvery(src, condition) {
            for (var i = 0; i < src.length; i++) {
                if (condition(src[i])) {
                    return false;
                }
            }
            return src.length > 0;
        }
        list.hasEvery = hasEvery;
        function merge(src, items) {
            var array = src;
            for (var i = 0; i < items.length; i++) {
                array.push(items[i]);
            }
            return src;
        }
        list.merge = merge;
        function toArray(src) {
            return Array.prototype.slice.call(this.collection, 0);
        }
        list.toArray = toArray;
    })(list = tango.list || (tango.list = {}));
    var dom;
    (function (dom) {
        var INPUT_MODE_SINGLE = 0;
        var INPUT_MODE_MULTI = 1;
        var INPUT_MODE_HTML = 2;
        function getValueMode(el) {
            if (el.contentEditable === "true") {
                return INPUT_MODE_HTML;
            }
            if (el.multiple) {
                return INPUT_MODE_MULTI;
            }
            return INPUT_MODE_SINGLE;
        }
        function setValue(el, value) {
            switch (getValueMode(el)) {
                case INPUT_MODE_HTML:
                    el.innerHTML = value;
                    break;
                case INPUT_MODE_MULTI:
                    var selectEl = el;
                    var values = obj.isCollection(value) ? value : [value];
                    list.each(selectEl.options, function (opt) {
                        opt.selected = list.has(values, opt.value);
                    });
                    break;
                default:
                    var inputEl = el;
                    inputEl.value = String(value);
                    break;
            }
        }
        dom.setValue = setValue;
        function getValue(el) {
            switch (getValueMode(el)) {
                case INPUT_MODE_HTML:
                    return el.innerHTML;
                case INPUT_MODE_MULTI:
                    var selectEl = el;
                    return selectEl.options;
                default:
                    var inputEl = el;
                    return inputEl.value;
            }
        }
        dom.getValue = getValue;
        function setText(el, text) {
            el.textContent = text;
        }
        dom.setText = setText;
        function getText(el) {
            return el.textContent;
        }
        dom.getText = getText;
        function setHtml(el, html) {
            el.innerHTML = html;
        }
        dom.setHtml = setHtml;
        function getHtml(el) {
            return el.innerHTML;
        }
        dom.getHtml = getHtml;
    })(dom = tango.dom || (tango.dom = {}));
    var Observer = (function () {
        function Observer() {
            this.cache = {};
        }
        Observer.prototype.on = function (eventName, listener) {
            var listeners = this.cache[eventName];
            if (!listeners) {
                listeners = [];
                listeners.push(listener);
                this.cache[eventName] = listeners;
                return;
            }
            if (list.has(listeners, listener)) {
                return;
            }
            this.cache[eventName].push(listener);
        };
        Observer.prototype.off = function (eventName, listener) {
            var listeners = this.cache[eventName];
            if (!obj.isCollection(listeners)) {
                return;
            }
            list.eachRight(listeners, function (it, index) {
                if (it === listener) {
                    listeners.splice(index, 1);
                }
            });
        };
        Observer.prototype.trigger = function (eventName, evt, sync) {
            var _this = this;
            var listeners = this.cache[eventName];
            if (!listeners) {
                return;
            }
            if (sync) {
                list.each(listeners, function (listener) {
                    listener.call(_this, evt);
                });
            }
            else {
                list.each(listeners, function (listener) {
                    setTimeout(function () {
                        listener.call(_this, evt);
                    });
                });
            }
        };
        Observer.prototype.dispose = function () {
            if (this.cache) {
                this.cache = null;
            }
        };
        return Observer;
    })();
    tango.Observer = Observer;
    var Observable = (function () {
        function Observable(el, model) {
            var _this = this;
            this._events = new Observer();
            if (typeof el === "string") {
                this.$el = document.querySelector(el);
            }
            else {
                this.$el = el;
            }
            this.$model = model;
            for (var name in this.$model) {
                this._watch(name, this.$model);
            }
            this._bind();
            this._events.on(EVT_DOM_VALUE, function (evt) {
                obj.setProperty(_this.$model, evt.propertyPath, evt.newValue);
            });
        }
        Observable.prototype.$on = function (eventName, listener) {
            this._events.on(eventName, listener);
        };
        Observable.prototype.$off = function (eventName, listener) {
            this._events.off(eventName, listener);
        };
        Observable.prototype.$trigger = function (eventName, evt) {
            this._events.trigger(eventName, evt);
        };
        Observable.prototype.$dispose = function () {
            this._events.dispose();
        };
        Observable.prototype._watch = function (propertyPath, root) {
            var backingData = obj.getProperty(root, propertyPath);
            var self = this;
            Object.defineProperty(root, propertyPath, {
                get: function () {
                    return backingData;
                },
                set: function (newData) {
                    var oldValue = backingData;
                    backingData = newData;
                    self.$trigger(EVT_SET, {
                        propertyPath: propertyPath,
                        newValue: newData
                    });
                    if (oldValue !== newData) {
                        self.$trigger(EVT_CHANGE, {
                            propertyPath: propertyPath,
                            newValue: newData,
                            oldValue: backingData
                        });
                    }
                },
                configurable: true
            });
            if (!obj.isObject(backingData)) {
                return;
            }
            for (var name in backingData) {
                this._watch(name, backingData);
            }
        };
        Observable.prototype._bind = function () {
            var _this = this;
            var observer = this.getMutationObserver(this.$el);
            this._setupNode(this.$el, undefined);
            this._events.on(EVT_UNBIND, function (evt) {
                if (evt.node === _this.$el) {
                    observer.disconnect();
                }
            });
            this.$on(EVT_DISPOSE, function () { return observer.disconnect(); });
        };
        Observable.prototype._unbind = function () {
            this.$trigger(EVT_UNBIND, {
                element: this.$el
            });
        };
        Observable.prototype._setupEvent = function (eventName, el$, evtListener, unregisterPredicate) {
            var eventUnbinder = function () { return el$.removeEventListener(eventName, evtListener); };
            el$.addEventListener(eventName, evtListener);
            this.$on(EVT_UNBIND, function (evt) {
                if (unregisterPredicate(evt)) {
                    eventUnbinder();
                }
            });
            this.$on(EVT_DISPOSE, eventUnbinder);
            return;
        };
        Observable.prototype._setupOnEvent = function (attr$, parent$) {
            var _this = this;
            if (!str.startsWith(attr$.nodeName, "on-")) {
                return;
            }
            var eventName = attr$.nodeName.substr(3);
            var domListener = function (evt) { return obj.evaluate(_this.$model, attr$.nodeValue, evt); };
            this._setupEvent(eventName, parent$, domListener, function (evt) { return evt.node === attr$; });
        };
        Observable.prototype._setupConditionalClasses = function (attr$, parent$) {
            var _this = this;
            if (!str.startsWith(attr$.nodeName, "is-")) {
                return;
            }
            var className = attr$.nodeName.substr(3);
            var isClassOnChange = function () {
                var isTruthy = obj.evaluate(_this.$model, attr$.nodeValue);
                if (isTruthy) {
                    parent$.classList.add(className);
                    return;
                }
                parent$.classList.remove(className);
            };
            isClassOnChange();
            this.$on(EVT_CHANGE, isClassOnChange);
        };
        Observable.prototype._setupValueBindings = function (attr, parent) {
            var _this = this;
            var propertyPath = attr.nodeValue;
            var valueGetter = function () {
                var value = dom.getValue(parent);
                obj.setProperty(_this.$model, propertyPath, value);
            };
            var nodeMatcher = function (evt) { return evt.node === attr; };
            this.$on(EVT_CHANGE, function (evt) {
                if (propertyPath === evt.propertyPath) {
                    var value = obj.evaluate(_this.$model, propertyPath);
                    dom.setValue(parent, value);
                }
            });
            this._setupEvent("input", parent, valueGetter, nodeMatcher);
            this._setupEvent("change", parent, valueGetter, nodeMatcher);
        };
        Observable.prototype._setupTextBindings = function (attr, parent) {
            var _this = this;
            var propertyPath = attr.nodeValue;
            this.$on(EVT_CHANGE, function () {
                var value = dom.getText(parent);
                obj.setProperty(_this.$model, propertyPath, value);
            });
        };
        Observable.prototype._setupHtmlBindings = function (attr, parent) {
            var _this = this;
            var propertyPath = attr.nodeValue;
            this.$on(EVT_CHANGE, function () {
                var value = dom.getHtml(parent);
                obj.setProperty(_this.$model, propertyPath, value);
            });
        };
        Observable.prototype._setupPropertyBindings = function (attr$, parent$) {
            switch (attr$.nodeName) {
                case "bind-value":
                    this._setupValueBindings(attr$, parent$);
                    return;
                case "bind-text":
                    this._setupTextBindings(attr$, parent$);
                    return;
                case "bind-html":
                    this._setupHtmlBindings(attr$, parent$);
                    return;
                case "bind-items":
                    return;
            }
        };
        Observable.prototype._setupTokens = function (node, $parent) {
            var _this = this;
            var properties = PROPERTY_MATCHER.exec(node.nodeValue);
            if (!properties || properties.length < 1) {
                return;
            }
            var propertyPath = properties[1];
            var propertyToken = "${" + propertyPath + "}";
            var originalValue = node.nodeValue;
            var setNewValue = function () {
                var currentValue = obj.evaluate(_this.$model, propertyPath);
                node.nodeValue = originalValue.replace(propertyToken, currentValue);
            };
            this.$on(EVT_CHANGE, function (evt) {
                if (propertyPath === evt.propertyPath) {
                    setNewValue();
                }
            });
            this.$on(EVT_DOM_CHANGE, function (evt) {
                if (evt.node === node) {
                    _this.$trigger(EVT_DOM_VALUE, {
                        propertyPath: propertyPath,
                        newValue: node.nodeValue
                    });
                }
            });
            setNewValue();
        };
        Observable.prototype._setupNode = function (node, parent) {
            var _this = this;
            if (node.nodeType === Node.TEXT_NODE) {
                this._setupTokens(node, parent);
                return;
            }
            if (node.nodeType === Node.ELEMENT_NODE) {
                var el = node;
                list.each(el.attributes, function (attr) { return _this._setupNode(attr, el); });
                list.each(el.childNodes, function (child) { return _this._setupNode(child, el); });
                return;
            }
            if (node.nodeType === Node.ATTRIBUTE_NODE) {
                this._setupOnEvent(node, parent);
                this._setupConditionalClasses(node, parent);
                this._setupTokens(node, parent);
                this._setupPropertyBindings(node, parent);
                return;
            }
        };
        Observable.prototype.getMutationObserver = function (el$) {
            var _this = this;
            if (typeof MutationObserver !== "undefined") {
                var observer = new MutationObserver(function (mutations) {
                    list.each(mutations, function (mutation) {
                        if (mutation.type === "attributes") {
                            var attr$ = mutation.target.getAttributeNode(mutation.attributeName);
                            _this.$trigger(EVT_DOM_CHANGE, {
                                node: attr$
                            });
                        }
                    });
                });
                observer.observe(el$, {
                    attributes: true,
                    childList: true,
                    characterData: false,
                    subtree: true
                });
                return observer;
            }
        };
        return Observable;
    })();
    tango.Observable = Observable;
    function bind(el, model) {
        return new Observable(el, model);
    }
    tango.bind = bind;
})(tango || (tango = {}));
