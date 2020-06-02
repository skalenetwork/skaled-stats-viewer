/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/codebase/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom = __webpack_require__(20);
exports.el = dom.defineElement;
exports.sv = dom.defineSvgElement;
exports.view = dom.defineView;
exports.create = dom.createView;
exports.inject = dom.injectView;
function disableHelp() {
    dom.DEVMODE.mutations = false;
    dom.DEVMODE.warnings = false;
    dom.DEVMODE.verbose = false;
    dom.DEVMODE.UNKEYED_INPUT = false;
}
exports.disableHelp = disableHelp;
function resizer(handler) {
    return exports.el("iframe", {
        _hooks: {
            didInsert: function (node) {
                var activeHandler = function () {
                    var height = node.el.offsetHeight;
                    var width = node.el.offsetWidth;
                    handler(width, height);
                };
                node.el.contentWindow.onresize = activeHandler;
                activeHandler();
            }
        },
        style: "position:absolute;left:0;top:-100%;width:100%;height:100%;margin:1px 0 0;border:none;opacity:0;visibility:hidden;pointer-events:none;",
    });
}
exports.resizer = resizer;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(7);
exports.DataEvents = types_1.DataEvents;
exports.DragBehaviour = types_1.DragBehaviour;
exports.DragMode = types_1.DragMode;
var TreeFilterType;
(function (TreeFilterType) {
    TreeFilterType[TreeFilterType["all"] = 1] = "all";
    TreeFilterType[TreeFilterType["specific"] = 2] = "specific";
    TreeFilterType[TreeFilterType["leafs"] = 3] = "leafs";
})(TreeFilterType = exports.TreeFilterType || (exports.TreeFilterType = {}));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dataproxy_1 = __webpack_require__(9);
var CsvDriver_1 = __webpack_require__(14);
var JsonDriver_1 = __webpack_require__(15);
function isEqualObj(a, b) {
    for (var key in a) {
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
exports.isEqualObj = isEqualObj;
function naturalCompare(a, b) {
    var ax = [];
    var bx = [];
    a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]); });
    b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]); });
    while (ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if (nn) {
            return nn;
        }
    }
    return ax.length - bx.length;
}
exports.naturalCompare = naturalCompare;
function findByConf(item, conf) {
    if (typeof conf === "function") {
        if (conf.call(this, item)) {
            return item;
        }
    }
    else if (conf.by && conf.match) {
        if (item[conf.by] === conf.match) {
            return item;
        }
    }
}
exports.findByConf = findByConf;
function isDebug() {
    var dhx = window.dhx;
    if (typeof dhx !== "undefined") {
        return typeof (dhx.debug) !== "undefined" && dhx.debug;
    }
    // return typeof DHX_DEBUG_MODE !== "undefined" && DHX_DEBUG_MODE;
}
exports.isDebug = isDebug;
function dhxWarning(msg) {
    // tslint:disable-next-line:no-console
    console.warn(msg);
}
exports.dhxWarning = dhxWarning;
function dhxError(msg) {
    throw new Error(msg);
}
exports.dhxError = dhxError;
function toProxy(proxy) {
    var type = typeof proxy;
    if (type === "string") {
        return new dataproxy_1.DataProxy(proxy);
    }
    else if (type === "object") {
        return proxy;
    }
}
exports.toProxy = toProxy;
function toDataDriver(driver) {
    var type = typeof driver;
    if (type === "string") {
        switch (driver) {
            case "csv":
                return new CsvDriver_1.CsvDriver();
            case "json":
                return new JsonDriver_1.JsonDriver();
            default:
                // tslint:disable-next-line:no-console
                console.warn("incorrect driver type", driver);
                break;
        }
    }
    else if (typeof driver === "object") {
        return driver;
    }
}
exports.toDataDriver = toDataDriver;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventSystem = /** @class */ (function () {
    function EventSystem(context) {
        this.events = {};
        this.context = context || this;
    }
    EventSystem.prototype.on = function (name, callback, context) {
        var event = name.toLowerCase();
        this.events[event] = this.events[event] || [];
        this.events[event].push({ callback: callback, context: context || this.context });
    };
    EventSystem.prototype.detach = function (name, context) {
        var event = name.toLowerCase();
        var eStack = this.events[event];
        if (context) {
            for (var i = eStack.length - 1; i >= 0; i--) {
                if (eStack[i].context === context) {
                    eStack.splice(i, 1);
                }
            }
        }
        else {
            this.events[event] = [];
        }
    };
    EventSystem.prototype.fire = function (name, args) {
        if (typeof args === "undefined") {
            args = [];
        }
        var event = name.toLowerCase();
        if (this.events[event]) {
            var res = this.events[event].map(function (e) { return e.callback.apply(e.context, args); });
            return res.indexOf(false) < 0;
        }
        return true;
    };
    return EventSystem;
}());
exports.EventSystem = EventSystem;
function EventsMixin(obj) {
    obj = obj || {};
    var eventSystem = new EventSystem(obj);
    obj.detachEvent = eventSystem.detach.bind(eventSystem);
    obj.attachEvent = eventSystem.on.bind(eventSystem);
    obj.callEvent = eventSystem.fire.bind(eventSystem);
}
exports.EventsMixin = EventsMixin;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var counter = (new Date()).valueOf();
function uid() {
    return "u" + (counter++);
}
exports.uid = uid;
function extend(target, source) {
    if (source) {
        for (var key in source) {
            var sobj = source[key];
            var tobj = target[key];
            if (typeof tobj === "object" && !(tobj instanceof Date) && !(tobj instanceof Array)) {
                extend(tobj, sobj);
            }
            else {
                target[key] = sobj;
            }
        }
    }
    return target;
}
exports.extend = extend;
function copy(source) {
    var result = {};
    for (var key in source) {
        result[key] = source[key];
    }
    return result;
}
exports.copy = copy;
function naturalSort(arr) {
    return arr.sort(function (a, b) {
        var nn = typeof a === "string" ? a.localeCompare(b) : a - b;
        return nn;
    });
}
exports.naturalSort = naturalSort;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(21);
function toNode(node) {
    if (typeof node === "string") {
        node = (document.getElementById(node) || document.querySelector(node));
    }
    return node || document.body;
}
exports.toNode = toNode;
function eventHandler(prepare, hash) {
    var keys = Object.keys(hash);
    return function (ev) {
        var data = prepare(ev);
        var node = ev.target;
        while (node) {
            var cssstring = node.getAttribute ? (node.getAttribute("class") || "") : "";
            if (cssstring.length) {
                var css = cssstring.split(" ");
                for (var j = 0; j < keys.length; j++) {
                    if (css.indexOf(keys[j]) > -1) {
                        return hash[keys[j]](ev, data);
                    }
                }
            }
            node = node.parentNode;
        }
        return true;
    };
}
exports.eventHandler = eventHandler;
function locate(target, attr) {
    if (attr === void 0) { attr = "dhx_id"; }
    var node = locateNode(target, attr);
    return node ? node.getAttribute(attr) : "";
}
exports.locate = locate;
function locateNode(target, attr) {
    if (attr === void 0) { attr = "dhx_id"; }
    if (target instanceof Event) {
        target = target.target;
    }
    while (target && target.getAttribute) {
        if (target.getAttribute(attr)) {
            return target;
        }
        target = target.parentNode;
    }
}
exports.locateNode = locateNode;
function getBox(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var scrollTop = window.pageYOffset || body.scrollTop;
    var scrollLeft = window.pageXOffset || body.scrollLeft;
    var top = box.top + scrollTop;
    var left = box.left + scrollLeft;
    var right = body.offsetWidth - box.right;
    var bottom = body.offsetHeight - box.bottom;
    var width = box.right - box.left;
    var height = box.bottom - box.top;
    return { top: top, left: left, right: right, bottom: bottom, width: width, height: height };
}
exports.getBox = getBox;
var scrollWidth = -1;
function getScrollbarWidth() {
    if (scrollWidth > -1) {
        return scrollWidth;
    }
    var scrollDiv = document.createElement("div");
    document.body.appendChild(scrollDiv);
    scrollDiv.style.cssText = "position: absolute;left: -99999px;overflow:scroll;width: 100px;height: 100px;";
    scrollWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollWidth;
}
exports.getScrollbarWidth = getScrollbarWidth;
function fitPosition(target, mode, width, height) {
    var right = target.left + target.width;
    var bottom = target.top + target.height;
    if (mode === "bottom") {
        var left = window.innerWidth < target.left + width ? right - width : target.left;
        var top = bottom + height > window.innerHeight ? target.top - height + window.scrollY : bottom + window.scrollY;
        return {
            position: "absolute",
            left: left,
            top: top,
            minWidth: width
        };
    }
    else {
        var overflow = void 0;
        var top = target.top + window.scrollY;
        var left = window.innerWidth < right + width ? target.left - width : right;
        if (bottom + height > window.innerHeight) {
            if (bottom - height > 0) {
                top = bottom - height + window.scrollY;
            }
            else {
                overflow = "scroll";
                height = (window.innerHeight - target.top) * 0.8;
            }
        }
        return {
            position: "absolute",
            left: left,
            top: top,
            minWidth: width,
            overflow: overflow,
            height: height
        };
    }
}
exports.fitPosition = fitPosition;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(7);
exports.DataEvents = types_1.DataEvents;
exports.SelectionEvents = types_1.SelectionEvents;
var DiagramEvents;
(function (DiagramEvents) {
    DiagramEvents["scroll"] = "scroll";
    DiagramEvents["beforeCollapse"] = "beforecollapse";
    DiagramEvents["afterCollapse"] = "aftercollapse";
    DiagramEvents["beforeExpand"] = "beforeexpand";
    DiagramEvents["afterExpand"] = "afterexpand";
    DiagramEvents["shapeMouseDown"] = "shapemousedown";
    DiagramEvents["shapeClick"] = "shapeclick";
    DiagramEvents["shapedDblClick"] = "shapedblclick";
    DiagramEvents["shapeIconClick"] = "shapeiconclick";
    DiagramEvents["beforeRender"] = "beforerender";
    DiagramEvents["shapeHover"] = "shapeHover";
    DiagramEvents["emptyAreaClick"] = "emptyAreaClick";
    DiagramEvents["load"] = "load";
})(DiagramEvents = exports.DiagramEvents || (exports.DiagramEvents = {}));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DataEvents;
(function (DataEvents) {
    DataEvents["add"] = "add";
    DataEvents["afterAdd"] = "afteradd";
    DataEvents["beforeAdd"] = "beforeadd";
    DataEvents["remove"] = "remove";
    DataEvents["removeAll"] = "removeAll";
    DataEvents["beforeRemove"] = "beforeremove";
    DataEvents["afterRemove"] = "afterRemove";
    DataEvents["change"] = "change";
    DataEvents["load"] = "load";
})(DataEvents = exports.DataEvents || (exports.DataEvents = {}));
var DragEvents;
(function (DragEvents) {
    DragEvents["beforeDrag"] = "beforedrag";
    DragEvents["beforeDrop"] = "beforeDrop";
    DragEvents["dragStart"] = "dragstart";
    DragEvents["dragEnd"] = "dragend";
    DragEvents["canDrop"] = "candrop";
    DragEvents["cancelDrop"] = "canceldrop";
    DragEvents["dropComplete"] = "dropcomplete";
    DragEvents["dragOut"] = "dragOut";
    DragEvents["dragIn"] = "dragIn";
})(DragEvents = exports.DragEvents || (exports.DragEvents = {}));
var DragMode;
(function (DragMode) {
    DragMode["target"] = "target";
    DragMode["both"] = "both";
    DragMode["source"] = "source";
})(DragMode = exports.DragMode || (exports.DragMode = {}));
var DragBehaviour;
(function (DragBehaviour) {
    DragBehaviour["child"] = "child";
    DragBehaviour["sibling"] = "sibling";
    DragBehaviour["complex"] = "complex";
})(DragBehaviour = exports.DragBehaviour || (exports.DragBehaviour = {}));
var SelectionEvents;
(function (SelectionEvents) {
    SelectionEvents["beforeUnSelect"] = "beforeunselect";
    SelectionEvents["afterUnSelect"] = "afterunselect";
    SelectionEvents["beforeSelect"] = "beforeselect";
    SelectionEvents["afterSelect"] = "afterselect";
})(SelectionEvents = exports.SelectionEvents || (exports.SelectionEvents = {}));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BaseShape = /** @class */ (function () {
    function BaseShape(config) {
        this.config = this.setDefaults(config);
        this.id = config.id;
        if (config.width) {
            config.width = parseFloat(config.width);
        }
        if (config.height) {
            config.height = parseFloat(config.height);
        }
        if (config.x) {
            config.x = parseFloat(config.x);
        }
        if (config.y) {
            config.y = parseFloat(config.y);
        }
    }
    BaseShape.prototype.isConnector = function () {
        return false;
    };
    BaseShape.prototype.canResize = function () {
        return true;
    };
    BaseShape.prototype.getCenter = function () {
        var conf = this.config;
        return {
            x: Math.abs(conf.width / 2),
            y: Math.abs(conf.height / 2)
        };
    };
    BaseShape.prototype.getBox = function () {
        var conf = this.config;
        var left = conf.x + (conf.dx || 0);
        var right = left + conf.width;
        var top = conf.y + (conf.dy || 0);
        var bottom = top + conf.height;
        return { left: left, right: right, top: top, bottom: bottom };
    };
    BaseShape.prototype.getMetaInfo = function () {
        return [
            { id: "text", label: "Text", type: "text" }
        ];
    };
    BaseShape.prototype.move = function (x, y) {
        this.update({ x: x, y: y });
    };
    BaseShape.prototype.resize = function (width, height) {
        this.update({ width: width, height: height });
    };
    BaseShape.prototype.rotate = function (angle) {
        this.update({ angle: angle });
    };
    BaseShape.prototype.update = function (conf) {
        for (var key in conf) {
            this.config[key] = conf[key];
        }
    };
    BaseShape.prototype.toSVG = function () {
        return "";
    };
    BaseShape.prototype.getPoint = function (x, y) {
        var conf = this.config;
        if (conf.angle) {
            var cx = conf.x + conf.width / 2;
            var cy = conf.y + conf.height / 2;
            var angleRad = conf.angle * (Math.PI / 180); // from degrees to radians
            return {
                x: (x - cx) * Math.cos(angleRad) - (y - cy) * Math.sin(angleRad) + cx,
                y: (x - cx) * Math.sin(angleRad) + (y - cy) * Math.cos(angleRad) + cy
            };
        }
        return { x: x, y: y };
    };
    BaseShape.prototype.setCss = function (value) {
        this.config.css = value;
    };
    BaseShape.prototype.getCss = function () {
        return (this.config.$selected ? "dhx_selected " : "") + (this.config.css || "");
    };
    BaseShape.prototype.setDefaults = function (config) {
        return config;
    };
    BaseShape.prototype.getCoords = function (conf) {
        var x = conf.x, y = conf.y;
        if (conf.dx) {
            x = conf.x + conf.dx;
        }
        if (conf.dy) {
            y = conf.y + conf.dy;
        }
        return { x: x, y: y };
    };
    return BaseShape;
}());
exports.BaseShape = BaseShape;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DataProxy = /** @class */ (function () {
    function DataProxy(url) {
        this.url = url;
    }
    DataProxy.prototype.load = function () {
        return this._ajax(this.url);
    };
    DataProxy.prototype.save = function (data, mode) {
        var modes = {
            insert: "POST",
            delete: "DELETE",
            update: "POST"
        };
        return this._ajax(this.url, data, modes[mode] || "POST");
    };
    DataProxy.prototype._ajax = function (url, data, method) {
        if (method === void 0) { method = "GET"; }
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response || xhr.responseText);
                }
                else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            };
            xhr.open(method, url);
            xhr.setRequestHeader("Content-Type", "application/json");
            switch (method) {
                case "POST":
                case "DELETE":
                case "PUT":
                    xhr.send(JSON.stringify(data));
                    break;
                case "GET":
                    xhr.send();
                    break;
                default:
                    xhr.send();
                    break;
            }
        });
    };
    return DataProxy;
}());
exports.DataProxy = DataProxy;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var Base_1 = __webpack_require__(8);
var templates_1 = __webpack_require__(12);
var DiagramCard = /** @class */ (function (_super) {
    __extends(DiagramCard, _super);
    function DiagramCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DiagramCard.prototype.toSVG = function () {
        var conf = this.config;
        var center = this.getCenter();
        var borderColor = conf.$selected ? conf.color : "#E4E4E4";
        var coords = this.getCoords(conf);
        return dom_1.sv("g", {
            _key: conf.id,
            transform: "translate(" + coords.x + "," + coords.y + ") rotate(" + (conf.angle || 0) + "," + center.x + "," + center.y + ")",
            class: this.getCss(),
            dhx_id: conf.id
        }, [
            dom_1.sv("rect", {
                "class": "dhx_item_shape",
                "id": conf.id,
                "height": conf.height,
                "width": conf.width,
                "rx": 1,
                "ry": 1,
                "stroke": borderColor,
                "stroke-width": 1
            }),
            templates_1.getTextTemplate(conf, this.text()),
            templates_1.getHeaderTpl(conf),
            templates_1.getCircleTpl(conf)
        ]);
    };
    DiagramCard.prototype.getMetaInfo = function () {
        return [
            { id: "text", label: "Text", type: "text" }
        ];
    };
    DiagramCard.prototype.getCss = function () {
        return "dhx_diagram_item " + _super.prototype.getCss.call(this);
    };
    DiagramCard.prototype.setDefaults = function (obj) {
        obj.width = obj.width || 140;
        obj.height = obj.height || 90;
        return obj;
    };
    DiagramCard.prototype.text = function () {
        return this.config.text;
    };
    return DiagramCard;
}(Base_1.BaseShape));
exports.DiagramCard = DiagramCard;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function getConnectionPoint(shape, gap, dir) {
    shape = __assign({}, shape);
    var dirs = {
        top: { x: shape.x + (shape.width / 2), y: shape.y - gap },
        bottom: { x: shape.x + (shape.width / 2), y: shape.y + shape.height + gap },
        left: { x: shape.x - gap, y: shape.y + (shape.height / 2) },
        right: { x: shape.x + shape.width + gap, y: shape.y + (shape.height / 2) }
    };
    if (dir) {
        var d = dirs[dir] || dirs;
        return [d].map(function (p) { return shape.$shape.getPoint(p.x, p.y); });
    }
    return [dirs.top, dirs.bottom, dirs.left, dirs.right].map(function (p) { return shape.$shape.getPoint(p.x, p.y); });
}
function getLength(from, to) {
    var x = to.x - from.x;
    var y = to.y - from.y;
    return Math.sqrt(x * x + y * y);
}
function getRoundedCorners(na, nb, aa, bb, turn, radius) {
    if (radius === void 0) { radius = 10; }
    var bdX = bb.x < turn.x ? -1 : 1;
    var bdY = bb.y < turn.y ? -1 : 1;
    var adX = aa.x > turn.x ? 1 : -1;
    var adY = aa.y > turn.y ? 1 : -1;
    var before = __assign({}, turn);
    var after = __assign({}, bb);
    var curvedTurn = {
        x1: turn.x,
        y1: turn.y,
        x: turn.x,
        y: turn.y + radius * bdY,
    };
    if (aa.x === turn.x) {
        before.y += radius * adY;
        after.x -= radius * bdX;
        curvedTurn = {
            x1: turn.x,
            y1: turn.y,
            x: turn.x + radius * bdX,
            y: turn.y,
        };
    }
    if (aa.y === turn.y) {
        before.x += radius * adX;
        after.y -= radius * bdY;
        curvedTurn = {
            x1: turn.x,
            y1: turn.y,
            x: turn.x,
            y: turn.y + radius * bdY,
        };
    }
    return [
        na,
        aa,
        before,
        curvedTurn,
        after,
        { x1: bb.x, y1: bb.y, x: nb.x, y: nb.y }
    ];
}
function getCurvedLine(na, nb, turn) {
    return [
        na,
        { x1: turn.x, y1: turn.y, x: nb.x, y: nb.y }
    ];
}
function getNearestPoints(link, from, to, gap, fromSide, toSide) {
    if (fromSide === void 0) { fromSide = ""; }
    if (toSide === void 0) { toSide = ""; }
    // start points from shape border
    var na = getConnectionPoint(from, 0, fromSide);
    var nb = getConnectionPoint(to, 0, toSide);
    // points with gap
    var a = getConnectionPoint(from, gap, fromSide);
    var b = getConnectionPoint(to, gap, toSide);
    var min = Infinity; // from bottom to top
    var points;
    for (var i = 0; i < a.length; i++) {
        var aa = a[i];
        for (var j = 0; j < b.length; j++) {
            var bb = b[j];
            var length_1 = getLength(aa, bb);
            if (min > length_1) {
                min = length_1;
                // preffer simple line form
                if (aa.x === bb.x || aa.y === bb.y) {
                    if ((na[i].x === aa.x && aa.x === nb[j].x) ||
                        (na[i].y === aa.y && nb[j].y === aa.y)) {
                        // straight line
                        points = [na[i], nb[j]];
                    }
                    else {
                        // line without centrail turn point
                        points = [na[i], aa, bb, nb[j]];
                    }
                }
                else {
                    // most complex line form, with central turn
                    var isLeftCollision = aa.x < na[i].x && aa.x < bb.x;
                    var isBottomCollision = aa.y > na[i].y && aa.y > bb.y;
                    var turn = (na[i].x !== aa.x && !isLeftCollision) ? { x: bb.x, y: aa.y } : { x: aa.x, y: bb.y };
                    turn = isBottomCollision ? { x: bb.x, y: aa.y } : turn;
                    if (link.connectType === "curved") {
                        points = getCurvedLine(na[i], nb[j], turn);
                    }
                    else if (link.cornersRadius && link.connectType !== "straight") {
                        points = getRoundedCorners(na[i], nb[j], aa, bb, turn, link.cornersRadius);
                    }
                    else {
                        points = [na[i], aa, turn, bb, nb[j]];
                    }
                }
            }
        }
    }
    return points;
}
function nearestLinkPath(link, from, to, config) {
    if (!from || !to) {
        return;
    }
    var points = getNearestPoints(link, from, to, config.lineGap, link.fromSide, link.toSide);
    if (link.connectType === "straight") {
        return link.points = [points[0], points[points.length - 1]];
    }
    if (link.points) {
        // without additional points
        if (link.points.length === points.length) {
            link.points = link.points.map(function (p, i) {
                if (p && points[i] && !p.$custom) {
                    return points[i];
                }
                return p;
            });
        }
        else {
            var custom = link.points.filter(function (p) { return p.$custom; });
            link.points = custom.length ? link.points : points;
        }
        if (!link.$move) {
            link.points[0] = points[0];
            link.points[link.points.length - 1] = points[points.length - 1];
        }
    }
    else {
        link.points = points;
    }
}
exports.nearestLinkPath = nearestLinkPath;
function directLinkPath(link, from, to, config) {
    var x1 = from.x + (from.dx || 0);
    var y1 = from.y + (from.dy || 0);
    var x2 = to.x + (to.dx || 0);
    var y2 = to.y + (to.dy || 0);
    if (from.dir === "vertical") {
        // from right-middle to right middle
        var sx = x1;
        var sy = Math.round(y1 + from.height / 2);
        var ex = x2;
        var ey = Math.round(y2 + to.height / 2);
        var gap = -Math.round(config.margin.itemX / 2) + 0.5;
        link.points = [{ x: sx, y: sy }, { x: sx + gap, y: sy }, { x: sx + gap, y: ey }, { x: ex, y: ey }];
    }
    else {
        // from bottom-center to top-center
        var sx = Math.round(x1 + from.width / 2);
        var sy = y1 + from.height;
        var ex = Math.round(x2 + to.width / 2);
        var ey = y2;
        var gap = Math.round(config.margin.itemY / 2) + 0.5;
        link.points = [{ x: sx, y: sy }, { x: sx, y: sy + gap }, { x: ex, y: sy + gap }, { x: ex, y: ey }];
    }
}
exports.directLinkPath = directLinkPath;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
function getCircleTpl(conf) {
    if (!conf.$count && conf.open !== false) {
        return "";
    }
    var slim = conf.dir === "vertical";
    var hide = conf.open === false;
    var hW = conf.width / 2;
    var hH = conf.height / 2;
    var R = 10;
    var size = R - 5;
    var coords = {
        x: slim ? 0 : hW,
        y: slim ? hH : conf.height
    };
    var hideNodes = hide ?
        dom_1.sv("polyline", {
            "points": coords.x - size + "," + coords.y + "\n\t\t" + coords.x + "," + coords.y + "\n\t\t" + coords.x + "," + (coords.y - size) + "\n\t\t" + coords.x + "," + (coords.y + size) + "\n\t\t" + coords.x + "," + coords.y + "\n\t\t" + (coords.x + size) + "," + coords.y,
            "stroke-width": "2",
            "stroke": "white",
            "fill": "none"
        })
        : dom_1.sv("line", {
            "x1": coords.x - size,
            "y1": coords.y,
            "x2": coords.x + size,
            "y2": coords.y,
            "stroke-width": "2",
            "stroke": "white"
        });
    return dom_1.sv("g", {
        x: coords.x,
        y: coords.y,
        dhx_diagram: "hide",
        class: hide ? "dhx_expand_icon" : "dhx_hide_icon"
    }, [
        dom_1.sv("circle", {
            r: R,
            cx: coords.x,
            cy: coords.y,
            fill: conf.$expandColor
        }),
        hideNodes
    ]);
}
exports.getCircleTpl = getCircleTpl;
function getHeaderTpl(conf) {
    var color = conf.color || "#20b6e2";
    var height = 3.5;
    return dom_1.sv("rect", {
        "height": height,
        "width": conf.width,
        "class": "dhx_item_header",
        "stroke": color,
        "fill": color,
        "stroke-width": 1
    });
}
exports.getHeaderTpl = getHeaderTpl;
function getTextTemplate(conf, text) {
    if (conf.text || conf.title) {
        return dom_1.sv("foreignObject", {
            width: conf.width,
            overflow: "hidden",
            height: conf.height,
            transform: "translate(0 0)",
        }, [
            dom_1.el("div", {
                class: "shape_content",
                style: "width:" + conf.width + "px;height:" + conf.height + "px;"
            }, text)
        ]);
    }
    return null;
}
exports.getTextTemplate = getTextTemplate;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(3);
var loader_1 = __webpack_require__(34);
var sort_1 = __webpack_require__(35);
var dataproxy_1 = __webpack_require__(9);
var helpers_1 = __webpack_require__(2);
var types_1 = __webpack_require__(1);
var core_1 = __webpack_require__(4);
var DataCollection = /** @class */ (function () {
    function DataCollection(config, events) {
        this._order = [];
        this._pull = {};
        this._changes = {
            order: []
        };
        this._initOrder = null;
        this.config = config || {};
        this._sort = new sort_1.Sort();
        this._loader = new loader_1.Loader(this, this._changes);
        this.events = events || new events_1.EventSystem(this);
    }
    DataCollection.prototype.add = function (obj, index) {
        if (!this.events.fire(types_1.DataEvents.beforeAdd, [obj])) {
            return;
        }
        this._addCore(obj, index);
        this._onChange(types_1.DataEvents.add, obj.id, obj);
        this.events.fire(types_1.DataEvents.afterAdd, [obj]);
    };
    DataCollection.prototype.remove = function (id) {
        var obj = this._pull[id];
        if (obj) {
            if (!this.events.fire(types_1.DataEvents.beforeRemove, [obj])) {
                return;
            }
            this._removeCore(obj.id);
            this._onChange(types_1.DataEvents.remove, id, obj);
        }
    };
    DataCollection.prototype.removeAll = function () {
        this._removeAll();
        this.events.fire(types_1.DataEvents.change);
    };
    DataCollection.prototype.exists = function (id) {
        return !!this._pull[id];
    };
    DataCollection.prototype.getNearId = function (id) {
        var item = this._pull[id];
        if (!item) {
            return this._order[0].id || "";
        }
    };
    DataCollection.prototype.getItem = function (id) {
        return this._pull[id];
    };
    DataCollection.prototype.update = function (id, obj, silent) {
        var item = this.getItem(id);
        if (item) {
            if (helpers_1.isEqualObj(obj, item)) {
                return;
            }
            if (obj.id && id !== obj.id) {
                helpers_1.dhxWarning("this method doesn't allow change id");
                if (helpers_1.isDebug()) {
                    // tslint:disable-next-line:no-debugger
                    debugger;
                }
            }
            else {
                core_1.extend(this._pull[id], obj);
                if (this.config.update) {
                    this.config.update(this._pull[id]);
                }
                if (!silent) {
                    this._onChange("update", id, this._pull[id]);
                }
            }
        }
        else {
            helpers_1.dhxWarning("item not found");
        }
    };
    DataCollection.prototype.getIndex = function (id) {
        var res = this._order.findIndex(function (item) { return item.id === id; });
        if (this._pull[id] && res >= 0) {
            return res;
        }
        return -1;
    };
    DataCollection.prototype.getId = function (index) {
        if (!this._order[index]) {
            return;
        }
        return this._order[index].id;
    };
    DataCollection.prototype.filter = function (conf, add) {
        if (!add) {
            this._order = this._initOrder || this._order;
            this._initOrder = null;
        }
        if (conf) {
            var fOrder = this._order.filter(function (item) {
                if (typeof conf === "function") {
                    return conf(item);
                }
                else {
                    return item[conf.by] === conf.match;
                }
            });
            if (!this._initOrder) {
                this._initOrder = this._order;
                this._order = fOrder;
            }
        }
        this.events.fire(types_1.DataEvents.change);
    };
    DataCollection.prototype.find = function (conf) {
        for (var key in this._pull) {
            var res = helpers_1.findByConf(this._pull[key], conf);
            if (res) {
                return res;
            }
        }
        return null;
    };
    DataCollection.prototype.findAll = function (conf) {
        var res = [];
        for (var key in this._pull) {
            var item = helpers_1.findByConf(this._pull[key], conf);
            if (item) {
                res.push(item);
            }
        }
        return res;
    };
    DataCollection.prototype.sort = function (by) {
        this._sort.sort(this._order, by);
        if (this._initOrder && this._initOrder.length) {
            this._sort.sort(this._initOrder, by);
        }
        this.events.fire(types_1.DataEvents.change);
    };
    DataCollection.prototype.copy = function (id, index, target, targetId) {
        if (!this.exists(id)) {
            return null;
        }
        var newid = core_1.uid();
        if (target) {
            if (targetId) {
                target.add(__assign({}, this.getItem(id)), index, targetId);
                return;
            }
            if (target.exists(id)) {
                target.add(__assign({}, this.getItem(id), { id: newid }), index);
                return newid;
            }
            else {
                target.add(this.getItem(id), index);
                return id;
            }
        }
        this.add(__assign({}, this.getItem(id), { id: newid }), index);
        return newid;
    };
    DataCollection.prototype.move = function (id, index, target, targetId) {
        if (target && target !== this && this.exists(id)) {
            var item = this.getItem(id);
            if (target.exists(id)) {
                item.id = core_1.uid();
            }
            if (targetId) {
                item.parent = targetId;
            }
            target.add(item, index);
            // remove data from original collection
            this.remove(item.id);
            return item.id;
        }
        if (this.getIndex(id) === index) {
            return null;
        }
        // move other elements
        var spliced = this._order.splice(this.getIndex(id), 1)[0];
        if (index === -1) {
            index = this._order.length;
        }
        this._order.splice(index, 0, spliced);
        this.events.fire(types_1.DataEvents.change); // if target not this, it trigger add and remove
        return id;
    };
    DataCollection.prototype.load = function (url, driver) {
        if (typeof url === "string") {
            url = new dataproxy_1.DataProxy(url);
        }
        return this._loader.load(url, driver);
    };
    DataCollection.prototype.parse = function (data, driver) {
        this._removeAll();
        return this._loader.parse(data, driver);
    };
    DataCollection.prototype.$parse = function (data) {
        var apx = this.config.approximate;
        if (apx) {
            data = this._approximate(data, apx.value, apx.maxNum);
        }
        this._parse_data(data);
        this.events.fire(types_1.DataEvents.change);
        this.events.fire(types_1.DataEvents.load);
    };
    DataCollection.prototype.save = function (url) {
        this._loader.save(url);
    };
    // todo: loop through the array and check saved statuses
    DataCollection.prototype.isSaved = function () {
        return !this._changes.order.length; // todo: bad solution, errors and holded elments are missed...
    };
    DataCollection.prototype.map = function (cb) {
        var result = [];
        for (var i = 0; i < this._order.length; i++) {
            result.push(cb.call(this, this._order[i], i));
        }
        return result;
    };
    DataCollection.prototype.serialize = function () {
        return this.map(function (item) {
            var newItem = __assign({}, item);
            Object.keys(newItem).forEach(function (key) {
                if (key[0] === "$") {
                    delete newItem[key];
                }
            });
            return newItem;
        });
    };
    DataCollection.prototype._removeAll = function () {
        this._pull = {};
        this._order = [];
        this._changes.order = [];
        this._initOrder = null;
    };
    DataCollection.prototype._addCore = function (obj, index) {
        if (this.config.init) {
            obj = this.config.init(obj);
        }
        obj.id = obj.id ? obj.id.toString() : core_1.uid();
        if (this._pull[obj.id]) {
            helpers_1.dhxError("Item already exist");
        }
        // todo: not ideal solution
        if (this._initOrder && this._initOrder.length) {
            this._addToOrder(this._initOrder, obj, index);
        }
        this._addToOrder(this._order, obj, index);
    };
    DataCollection.prototype._removeCore = function (id) {
        if (this.getIndex(id) >= 0) {
            this._order = this._order.filter(function (el) { return el.id !== id; });
            delete this._pull[id];
        }
        if (this._initOrder && this._initOrder.length) {
            this._initOrder = this._initOrder.filter(function (el) { return el.id !== id; });
        }
    };
    DataCollection.prototype._parse_data = function (data) {
        var index = this._order.length;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var obj = data_1[_i];
            if (this.config.init) {
                obj = this.config.init(obj);
            }
            obj.id = obj.id || core_1.uid();
            this._pull[obj.id] = obj;
            this._order[index++] = obj;
        }
    };
    DataCollection.prototype._approximate = function (data, values, maxNum) {
        var len = data.length;
        var vlen = values.length;
        var rlen = Math.floor(len / maxNum);
        var newData = Array(Math.ceil(len / rlen));
        var index = 0;
        for (var i = 0; i < len; i += rlen) {
            var newItem = core_1.copy(data[i]);
            var end = Math.min(len, i + rlen);
            for (var j = 0; j < vlen; j++) {
                var sum = 0;
                for (var z = i; z < end; z++) {
                    sum += data[z][values[j]];
                }
                newItem[values[j]] = sum / (end - i);
            }
            newData[index++] = newItem;
        }
        return newData;
    };
    DataCollection.prototype._onChange = function (status, id, obj) {
        for (var _i = 0, _a = this._changes.order; _i < _a.length; _i++) {
            var item = _a[_i];
            // update pending item if previous state is "saving" or if item not saved yet
            if (item.id === id && !item.saving) {
                // update item
                if (item.error) {
                    item.error = false;
                }
                item = __assign({}, item, { obj: obj, status: status });
                this.events.fire(types_1.DataEvents.change, [id, status, obj]);
                return;
            }
        }
        this._changes.order.push({ id: id, status: status, obj: __assign({}, obj), saving: false });
        this.events.fire(types_1.DataEvents.change, [id, status, obj]);
    };
    DataCollection.prototype._addToOrder = function (array, obj, index) {
        if (index && array[index]) {
            this._pull[obj.id] = obj;
            array.splice(index, 0, obj);
        }
        else {
            this._pull[obj.id] = obj;
            array.push(obj);
        }
    };
    return DataCollection;
}());
exports.DataCollection = DataCollection;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var CsvDriver = /** @class */ (function () {
    function CsvDriver(config) {
        if (config === void 0) { config = {}; }
        var initConfig = {
            skipHeader: 0,
            nameByHeader: false,
            row: "\n",
            column: ",",
        };
        this.config = __assign({}, initConfig, config);
        if (this.config.nameByHeader) {
            this.config.skipHeader = 1;
        }
    }
    CsvDriver.prototype.getFields = function (row, headers) {
        var parts = row.trim().split(this.config.column);
        var obj = {};
        for (var i = 0; i < parts.length; i++) {
            obj[headers ? headers[i] : i + 1] = parts[i];
        }
        return obj;
    };
    CsvDriver.prototype.getRows = function (data) {
        return data.trim().split(this.config.row);
    };
    CsvDriver.prototype.toJsonArray = function (data) {
        var _this = this;
        var rows = this.getRows(data);
        var names = this.config.names;
        if (this.config.skipHeader) {
            var top = rows.splice(0, this.config.skipHeader);
            if (this.config.nameByHeader) {
                names = top[0].trim().split(this.config.column);
            }
        }
        return rows.map(function (row) { return _this.getFields(row, names); });
    };
    return CsvDriver;
}());
exports.CsvDriver = CsvDriver;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JsonDriver = /** @class */ (function () {
    function JsonDriver() {
    }
    JsonDriver.prototype.toJsonArray = function (data) {
        return this.getRows(data);
    };
    JsonDriver.prototype.getFields = function (row) {
        return row;
    };
    JsonDriver.prototype.getRows = function (data) {
        return typeof data === "string" ? JSON.parse(data) : data;
    };
    return JsonDriver;
}());
exports.JsonDriver = JsonDriver;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(4);
var datacollection_1 = __webpack_require__(13);
var dataproxy_1 = __webpack_require__(9);
var helpers_1 = __webpack_require__(2);
var types_1 = __webpack_require__(1);
function addToOrder(store, obj, parent, index) {
    if (index !== undefined && index !== -1 && store[parent] && store[parent][index]) {
        store[parent].splice(index, 0, obj);
    }
    else {
        if (!store[parent]) {
            store[parent] = [];
        }
        store[parent].push(obj);
    }
}
var TreeCollection = /** @class */ (function (_super) {
    __extends(TreeCollection, _super);
    function TreeCollection(config, events) {
        var _this = _super.call(this, config, events) || this;
        var root = _this._root = "_ROOT_" + core_1.uid();
        _this._childs = (_a = {}, _a[root] = [], _a);
        _this._initChilds = null;
        return _this;
        var _a;
    }
    TreeCollection.prototype.add = function (obj, index, parent) {
        if (index === void 0) { index = -1; }
        if (parent === void 0) { parent = this._root; }
        obj.parent = obj.parent ? obj.parent.toString() : parent;
        _super.prototype.add.call(this, obj, index);
    };
    TreeCollection.prototype.getRoot = function () {
        return this._root;
    };
    TreeCollection.prototype.getParent = function (id, asObj) {
        if (asObj === void 0) { asObj = false; }
        if (!this._pull[id]) {
            return null;
        }
        var parent = this._pull[id].parent;
        return asObj ? this._pull[parent] : parent;
    };
    TreeCollection.prototype.getChilds = function (id) {
        if (this._childs && this._childs[id]) {
            return this._childs[id];
        }
        return [];
    };
    TreeCollection.prototype.getLength = function (id) {
        if (!this._childs[id]) {
            return null;
        }
        return this._childs[id].length;
    };
    TreeCollection.prototype.removeAll = function (id) {
        if (id) {
            var childs = this._childs[id].slice();
            for (var _i = 0, childs_1 = childs; _i < childs_1.length; _i++) {
                var child = childs_1[_i];
                this.remove(child.id);
            }
        }
        else {
            _super.prototype.removeAll.call(this);
            var root = this._root;
            this._initChilds = null;
            this._childs = (_a = {}, _a[root] = [], _a);
        }
        var _a;
    };
    TreeCollection.prototype.getIndex = function (id) {
        var parent = this.getParent(id);
        if (!parent || !this._childs[parent]) {
            return -1;
        }
        return this._childs[parent].findIndex(function (item) { return item.id === id; });
    };
    TreeCollection.prototype.sort = function (conf) {
        var childs = this._childs;
        for (var key in childs) {
            this._sort.sort(childs[key], conf);
        }
        this.events.fire(types_1.DataEvents.change);
    };
    TreeCollection.prototype.map = function (cb, parent, direct) {
        if (parent === void 0) { parent = this._root; }
        if (direct === void 0) { direct = true; }
        var result = [];
        if (!this.haveChilds(parent)) {
            return result;
        }
        for (var i = 0; i < this._childs[parent].length; i++) {
            result.push(cb.call(this, this._childs[parent][i], i));
            if (direct) {
                var childResult = this.map(cb, this._childs[parent][i].id, direct);
                result = result.concat(childResult);
            }
        }
        return result;
    };
    TreeCollection.prototype.filter = function (conf) {
        if (!conf) {
            this.restoreOrder();
            return;
        }
        if (!this._initChilds) {
            this._initChilds = this._childs;
        }
        conf.type = conf.type || types_1.TreeFilterType.all;
        var newChilds = {};
        this._recursiveFilter(conf, this._root, 0, newChilds);
        this._childs = newChilds;
        this.events.fire(types_1.DataEvents.change);
    };
    TreeCollection.prototype.restoreOrder = function () {
        this._childs = this._initChilds;
        this._initChilds = null;
        this.events.fire(types_1.DataEvents.change);
    };
    TreeCollection.prototype.copy = function (id, index, target, targetId) {
        if (target === void 0) { target = this; }
        if (targetId === void 0) { targetId = this._root; }
        if (!this.exists(id)) {
            return null;
        }
        var childs = __assign({}, this._childs);
        var currentChilds = childs[id];
        if (target === this && !this.canCopy(id, targetId)) {
            return null;
        }
        if (!(target instanceof TreeCollection)) {
            target.add(this._pull[id]);
            return;
        }
        if (this.exists(id)) {
            var item = __assign({}, this.getItem(id));
            if (target.exists(id)) {
                item.id = core_1.uid();
            }
            else {
                item.id = id;
            }
            item.parent = targetId;
            target.add(item, index);
            id = item.id;
        }
        if (currentChilds) {
            for (var _i = 0, currentChilds_1 = currentChilds; _i < currentChilds_1.length; _i++) {
                var child = currentChilds_1[_i];
                var childId = child.id;
                var childIndex = this.getIndex(childId);
                this.copy(childId, childIndex, target, id);
            }
        }
        return id;
    };
    TreeCollection.prototype.move = function (id, index, target, targetId) {
        if (target === void 0) { target = this; }
        if (targetId === void 0) { targetId = this._root; }
        if (!this.exists(id)) {
            return null;
        }
        if (target !== this) {
            if (!(target instanceof TreeCollection)) {
                target.add(this._pull[id]);
                this.remove(id);
                return;
            }
            var returnId = this.copy(id, index, target, targetId);
            this.remove(id);
            return returnId;
        }
        // move inside
        if (!this.canCopy(id, targetId)) {
            return null;
        }
        var parent = this.getParent(id);
        var parentIndex = this.getIndex(id);
        // get item from parent array and move to target array
        var spliced = this._childs[parent].splice(parentIndex, 1)[0];
        spliced.parent = targetId; // need for next moving, ... not best solution, may be full method for get item
        if (!this._childs[parent].length) {
            delete this._childs[parent];
        }
        if (!this.haveChilds(targetId)) {
            this._childs[targetId] = [];
        }
        if (index === -1) {
            index = this._childs[targetId].push(spliced);
        }
        else {
            this._childs[targetId].splice(index, 0, spliced);
        }
        this.events.fire(types_1.DataEvents.change);
        return id;
    };
    TreeCollection.prototype.eachChild = function (id, cb, direct) {
        if (direct === void 0) { direct = true; }
        if (!this.haveChilds(id)) {
            return;
        }
        for (var i = 0; i < this._childs[id].length; i++) {
            cb.call(this, this._childs[id][i], i);
            if (direct) {
                this.eachChild(this._childs[id][i].id, cb, direct);
            }
        }
    };
    TreeCollection.prototype.getNearId = function (id) {
        return id; // for selection
    };
    TreeCollection.prototype.loadChilds = function (id, driver) {
        var _this = this;
        if (driver === void 0) { driver = "json"; }
        var url = this.config.autoload + "?id=" + id;
        var proxy = new dataproxy_1.DataProxy(url);
        proxy.load().then(function (data) {
            driver = helpers_1.toDataDriver(driver);
            data = driver.toJsonArray(data);
            _this._parse_data(data, id);
            _this.events.fire(types_1.DataEvents.change);
        });
    };
    TreeCollection.prototype.refreshChilds = function (id, driver) {
        if (driver === void 0) { driver = "json"; }
        this.removeAll(id);
        this.loadChilds(id, driver);
    };
    TreeCollection.prototype.eachParent = function (id, cb, self) {
        if (self === void 0) { self = false; }
        var item = this.getItem(id);
        if (!item) {
            return;
        }
        if (self) {
            cb.call(this, item);
        }
        if (item.parent === this._root) {
            return;
        }
        var parent = this.getItem(item.parent);
        cb.call(this, parent);
        this.eachParent(item.parent, cb);
    };
    TreeCollection.prototype.haveChilds = function (id) {
        return id in this._childs;
    };
    TreeCollection.prototype.canCopy = function (id, target) {
        if (id === target) {
            return false;
        }
        var canCopy = true;
        this.eachParent(target, function (item) { return item.id === id ? canCopy = false : null; }); // locate return string
        return canCopy;
    };
    TreeCollection.prototype._removeCore = function (id) {
        if (this._pull[id]) {
            var parent = this.getParent(id);
            this._childs[parent] = this._childs[parent].filter(function (item) { return item.id !== id; });
            if (parent !== this._root && !this._childs[parent].length) {
                delete this._childs[parent];
            }
            if (this._initChilds && this._initChilds[parent]) {
                this._initChilds[parent] = this._initChilds[parent].filter(function (item) { return item.id !== id; });
                if (parent !== this._root && !this._initChilds[parent].length) {
                    delete this._initChilds[parent];
                }
            }
            this._fastDeleteChilds(this._childs, id);
            if (this._initChilds) {
                this._fastDeleteChilds(this._initChilds, id);
            }
        }
    };
    TreeCollection.prototype._addToOrder = function (_order, obj, index) {
        var childs = this._childs;
        var initChilds = this._initChilds;
        var parent = obj.parent;
        this._pull[obj.id] = obj;
        addToOrder(childs, obj, parent, index);
        if (initChilds) {
            addToOrder(initChilds, obj, parent, index);
        }
    };
    TreeCollection.prototype._parse_data = function (data, parent) {
        if (parent === void 0) { parent = this._root; }
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var obj = data_1[_i];
            if (this.config.init) {
                obj = this.config.init(obj);
            }
            obj.id = obj.id ? obj.id.toString() : core_1.uid();
            obj.parent = obj.parent ? obj.parent.toString() : parent;
            this._pull[obj.id] = obj;
            if (!this._childs[obj.parent]) {
                this._childs[obj.parent] = [];
            }
            this._childs[obj.parent].push(obj);
            if (obj.childs && obj.childs instanceof Object) {
                this._parse_data(obj.childs, obj.id);
            }
        }
    };
    TreeCollection.prototype._fastDeleteChilds = function (target, id) {
        if (this._pull[id]) {
            delete this._pull[id];
        }
        if (!target[id]) {
            return;
        }
        for (var i = 0; i < target[id].length; i++) {
            this._fastDeleteChilds(target, target[id][i].id);
        }
        delete target[id];
    };
    TreeCollection.prototype._recursiveFilter = function (conf, current, level, newChilds) {
        var _this = this;
        var childs = this._childs[current];
        if (!childs) {
            return;
        }
        var condition = function (item) {
            switch (conf.type) {
                case types_1.TreeFilterType.all: {
                    return true;
                }
                case types_1.TreeFilterType.specific: {
                    return level === conf.specific;
                }
                case types_1.TreeFilterType.leafs: {
                    return !_this.haveChilds(item.id);
                }
            }
        };
        if (conf.by && conf.match) {
            var customRule = function (item) { return !condition(item) || item[conf.by].toString().toLowerCase().indexOf(conf.match.toString().toLowerCase()) !== -1; };
            newChilds[current] = childs.filter(customRule);
        }
        else if (conf.rule && typeof conf.rule === "function") {
            var customRule = function (item) { return !condition(item) || conf.rule(item); };
            var filtered = childs.filter(customRule);
            if (filtered.length) {
                newChilds[current] = filtered;
            }
        }
        for (var _i = 0, childs_2 = childs; _i < childs_2.length; _i++) {
            var child = childs_2[_i];
            this._recursiveFilter(conf, child.id, level + 1, newChilds);
        }
    };
    return TreeCollection;
}(datacollection_1.DataCollection));
exports.TreeCollection = TreeCollection;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(18);
var Diagram_1 = __webpack_require__(19);
var en_1 = __webpack_require__(40);
var d = window.dhx = window.dhx || {};
d.i18n = d.i18n || {};
d.i18n.setLocale = function (component, value) {
    var target = d.i18n[component];
    for (var key in value) {
        target[key] = value[key];
    }
};
d.i18n.diagram = d.i18n.diagram || en_1.default;
window.dhx.Diagram = Diagram_1.Diagram;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(3);
var core_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(0);
var html_1 = __webpack_require__(5);
var view_1 = __webpack_require__(22);
var Export_1 = __webpack_require__(23);
var linkPaths_1 = __webpack_require__(11);
var placement_1 = __webpack_require__(24);
var Selection_1 = __webpack_require__(25);
var factory_1 = __webpack_require__(26);
var ShapesCollection_1 = __webpack_require__(32);
var Toolbar_1 = __webpack_require__(39);
var types_1 = __webpack_require__(6);
var Diagram = /** @class */ (function (_super) {
    __extends(Diagram, _super);
    function Diagram(container, config) {
        var _this = _super.call(this, container, config) || this;
        _this.version = "2.0.3";
        _this._set_defaults();
        _this._init_events();
        _this._init_struct();
        if (_this.config.toolbar) {
            _this._toolbar = new Toolbar_1.Toolbar(_this.events, _this.config.toolbar);
        }
        var view = dom_1.create({ render: function (vm) { return _this._render(vm); } }, _this);
        _this.mount(container, view);
        return _this;
    }
    Diagram.prototype.locate = function (ev) {
        var id = html_1.locate(ev, "dhx_id");
        var item = this.data.getItem(id);
        return item ? item.$shape : null;
    };
    Diagram.prototype.collapseItem = function (id) {
        if (this.events.fire(types_1.DiagramEvents.beforeCollapse, [id])) {
            this.data.update(id, { open: false });
            this.events.fire(types_1.DiagramEvents.afterCollapse, [id]);
        }
    };
    Diagram.prototype.expandItem = function (id) {
        if (this.events.fire(types_1.DiagramEvents.beforeExpand, [id])) {
            this.data.update(id, { open: true });
            this.events.fire(types_1.DiagramEvents.afterExpand, [id]);
        }
    };
    Diagram.prototype.getScrollState = function () {
        var wrapper = this.getRootView().node.el;
        return {
            x: wrapper.scrollLeft,
            y: wrapper.scrollTop
        };
    };
    Diagram.prototype.scrollTo = function (x, y) {
        var wrapper = this.getRootView().node.el;
        wrapper.scrollLeft = x;
        wrapper.scrollTop = y;
    };
    Diagram.prototype.showItem = function (id) {
        var wrapper = this.getRootView().node.el;
        var item = this.data.getItem(id);
        if (!item) {
            return;
        }
        var box = item.$shape.getBox();
        var width = wrapper.offsetWidth / 2;
        var height = wrapper.offsetHeight / 2;
        this.scrollTo(box.right + 10 - width, box.bottom + 10 - height);
    };
    Diagram.prototype._render = function (vm) {
        if (this._doNotRepaint && vm.node) {
            return vm.node;
        }
        this._doNotRepaint = true;
        var _a = this._getContent(), size = _a.size, content = _a.content;
        // [todo]
        this.events.fire(types_1.DiagramEvents.beforeRender, [size]);
        var width = size.x - size.left + this.config.margin.x * 2;
        var height = size.y - size.top + this.config.margin.y * 2;
        var css = this.config.type === "org" ? "dhx_org_chart" : "dhx_free_diagram";
        size.left -= this.config.margin.x;
        size.top -= this.config.margin.y;
        var wx = width * this.config.scale;
        var wy = height * this.config.scale;
        var toolbar = null;
        if (this._toolbar) {
            var id = this.selection.getId();
            if (id) {
                toolbar = this._toolbar.toSVG(this.data.getItem(id), size);
            }
        }
        var extra = null;
        if (this.config.$svg) {
            extra = this.config.$svg(size);
        }
        return dom_1.el(".dhx_diagram.dhx_widget", this._htmlevents, [
            dom_1.el(".dhx_wrapper", {
                class: css,
            }, [
                dom_1.sv("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: wx,
                    height: wy,
                    viewBox: size.left + " " + size.top + " " + width + " " + height,
                }, [
                    dom_1.sv("defs", [
                        dom_1.sv("filter", { x: 0, y: 0, width: 1, height: 1, id: "dhx_text_background" }, [
                            dom_1.sv("feFlood", { "flood-color": "white" }),
                            dom_1.sv("feComposite", { in: "SourceGraphic" })
                        ])
                    ]),
                    dom_1.sv("g", {
                        "shape-rendering": (this.config.scale === 1 && this.config.type === "org") ? "crispedges" : "auto"
                    }, content)
                ]),
                toolbar,
                extra
            ])
        ]);
    };
    Diagram.prototype._init_events = function () {
        var _this = this;
        this._htmlevents = {
            onscroll: function () {
                _this.events.fire(types_1.DiagramEvents.scroll, [_this.getScrollState()]);
            },
            onmousedown: html_1.eventHandler(function (ev) { return _this.locate(ev); }, {
                dhx_diagram_item: function (ev, item) {
                    _this.events.fire(types_1.DiagramEvents.shapeMouseDown, [item.id, ev]);
                },
                dhx_diagram_flow_item: function (ev, item) {
                    _this.events.fire(types_1.DiagramEvents.shapeMouseDown, [item.id, ev]);
                },
                dhx_diagram_connector: function (ev, item) {
                    _this.events.fire(types_1.DiagramEvents.shapeMouseDown, [
                        item.id,
                        ev,
                        _this._getPoint(ev.clientX, ev.clientY)
                    ]);
                }
            }),
            onmouseover: html_1.eventHandler(function (ev) { return _this.locate(ev); }, {
                dhx_diagram_item: function (ev, item) {
                    _this.events.fire(types_1.DiagramEvents.shapeHover, [item.id, ev]);
                },
                dhx_diagram_flow_item: function (ev, item) {
                    _this.events.fire(types_1.DiagramEvents.shapeHover, [item.id, ev]);
                },
                dhx_diagram_connector: function (ev, item) {
                    _this.events.fire(types_1.DiagramEvents.shapeHover, [item.id, ev]);
                }
            }),
            onclick: html_1.eventHandler(function (ev) { return _this.locate(ev); }, {
                dhx_expand_icon: function (_ev, item) { return _this.expandItem(item.id); },
                dhx_hide_icon: function (_ev, item) { return _this.collapseItem(item.id); },
                dhx_diagram_item: function (_ev, item) {
                    _this.events.fire(types_1.DiagramEvents.shapeClick, [item.id]);
                    if (_this.config.select) {
                        _this.selection.add(item.id);
                    }
                },
                dhx_diagram: function (ev) {
                    var t = ev.target;
                    var isContainer = t.getAttribute && (t.getAttribute("class") || "").match(/dhx_diagram\b/);
                    var isSvg = t.tagName === "svg";
                    if (isContainer || isSvg) {
                        _this.events.fire(types_1.DiagramEvents.emptyAreaClick, [ev]);
                    }
                }
            }),
            ondblclick: html_1.eventHandler(function (ev) { return _this.locate(ev); }, {
                dhx_diagram_connector: function (_ev, item) {
                    _this.events.fire(types_1.DiagramEvents.shapedDblClick, [item.id, _ev]);
                },
                dhx_diagram_item: function (_ev, item) {
                    _this.events.fire(types_1.DiagramEvents.shapedDblClick, [item.id, _ev]);
                }
            })
        };
    };
    Diagram.prototype._set_defaults = function () {
        this.config = core_1.extend({
            defaultShapeType: "card",
            defaultLinkType: "line",
            lineGap: 10,
            scale: 1,
            margin: {
                x: 40,
                y: 40,
                itemX: 40,
                itemY: 40
            },
            gridStep: 10
        }, this.config);
        if (!window.SVGForeignObjectElement) {
            this.config.defaultShapeType = "svg-card";
        }
    };
    Diagram.prototype._init_struct = function () {
        var _this = this;
        this.events = new events_1.EventSystem(this);
        this.shapes = factory_1.shapes;
        this.data = new ShapesCollection_1.ShapesCollection({
            init: function (item) {
                var defType = "from" in item ?
                    _this.config.defaultLinkType :
                    _this.config.defaultShapeType;
                item.type = item.type || defType;
                item.$shape = factory_1.shapesFactory(item);
                // [dirty]
                if (_this.config.type !== "org" && item.$shape.isConnector()) {
                    item.stroke = "#2196F3";
                }
                return item;
            },
            update: function (item) {
                item.$shape.config = item;
            },
            type: this.config.type
        }, this.events);
        this.selection = new Selection_1.Selection({}, this.data, this.events);
        this.export = new Export_1.Exporter("diagram", this.version, this);
        this.data.events.on(types_1.DataEvents.change, function () { return _this.paint(); });
        this.events.on(types_1.SelectionEvents.afterSelect, function () { return _this.paint(); });
    };
    Diagram.prototype._getContent = function () {
        var _this = this;
        var placed = false;
        if (this.config.type === "org") {
            placement_1.placeOrgonogram(this.data, this.config);
            placed = true;
        }
        var size = { x: 0, y: 0, left: 0, top: 0, scale: this.config.scale };
        var forms = [];
        var links = [];
        this.data.mapVisible(function (obj) {
            if (obj.$shape.isConnector()) {
                if (!placed) {
                    linkPaths_1.nearestLinkPath(obj, _this.data.getItem(obj.from), _this.data.getItem(obj.to), _this.config);
                }
                links.push(obj.$shape.toSVG());
            }
            else {
                forms.push(obj.$shape.toSVG());
            }
            var box = obj.$shape.getBox();
            if (box.right > size.x) {
                size.x = box.right;
            }
            if (box.left < size.left) {
                size.left = box.left;
            }
            if (box.bottom > size.y) {
                size.y = box.bottom;
            }
            if (box.top < size.top) {
                size.top = box.top;
            }
        });
        return { size: size, content: links.concat(forms) };
    };
    Diagram.prototype._getPoint = function (x, y) {
        var diagramRect = this.getRootView().node.el.getBoundingClientRect();
        return {
            x: x - diagramRect.left - this.config.margin.x,
            y: y - diagramRect.top - this.config.margin.y
        };
    };
    return Diagram;
}(view_1.View));
exports.Diagram = Diagram;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/**
* Copyright (c) 2017, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* domvm.js (DOM ViewModel)
* A thin, fast, dependency-free vdom view layer
* @preserve https://github.com/leeoniya/domvm (v3.2.6, micro build)
*/

(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.domvm = factory());
}(this, (function () { 'use strict';

// NOTE: if adding a new *VNode* type, make it < COMMENT and renumber rest.
// There are some places that test <= COMMENT to assert if node is a VNode

// VNode types
var ELEMENT	= 1;
var TEXT		= 2;
var COMMENT	= 3;

// placeholder types
var VVIEW		= 4;
var VMODEL		= 5;

var ENV_DOM = typeof window !== "undefined";
var win = ENV_DOM ? window : {};
var rAF = win.requestAnimationFrame;

var emptyObj = {};

function noop() {}

var isArr = Array.isArray;

function isSet(val) {
	return val != null;
}

function isPlainObj(val) {
	return val != null && val.constructor === Object;		//  && typeof val === "object"
}

function insertArr(targ, arr, pos, rem) {
	targ.splice.apply(targ, [pos, rem].concat(arr));
}

function isVal(val) {
	var t = typeof val;
	return t === "string" || t === "number";
}

function isFunc(val) {
	return typeof val === "function";
}

function isProm(val) {
	return typeof val === "object" && isFunc(val.then);
}



function assignObj(targ) {
	var args = arguments;

	for (var i = 1; i < args.length; i++)
		{ for (var k in args[i])
			{ targ[k] = args[i][k]; } }

	return targ;
}

// export const defProp = Object.defineProperty;

function deepSet(targ, path, val) {
	var seg;

	while (seg = path.shift()) {
		if (path.length === 0)
			{ targ[seg] = val; }
		else
			{ targ[seg] = targ = targ[seg] || {}; }
	}
}

/*
export function deepUnset(targ, path) {
	var seg;

	while (seg = path.shift()) {
		if (path.length === 0)
			targ[seg] = val;
		else
			targ[seg] = targ = targ[seg] || {};
	}
}
*/

function sliceArgs(args, offs) {
	var arr = [];
	for (var i = offs; i < args.length; i++)
		{ arr.push(args[i]); }
	return arr;
}

function cmpObj(a, b) {
	for (var i in a)
		{ if (a[i] !== b[i])
			{ return false; } }

	return true;
}

function cmpArr(a, b) {
	var alen = a.length;

	if (b.length !== alen)
		{ return false; }

	for (var i = 0; i < alen; i++)
		{ if (a[i] !== b[i])
			{ return false; } }

	return true;
}

// https://github.com/darsain/raft
// rAF throttler, aggregates multiple repeated redraw calls within single animframe
function raft(fn) {
	if (!rAF)
		{ return fn; }

	var id, ctx, args;

	function call() {
		id = 0;
		fn.apply(ctx, args);
	}

	return function() {
		ctx = this;
		args = arguments;
		if (!id) { id = rAF(call); }
	};
}

function curry(fn, args, ctx) {
	return function() {
		return fn.apply(ctx, args);
	};
}

/*
export function prop(val, cb, ctx, args) {
	return function(newVal, execCb) {
		if (newVal !== undefined && newVal !== val) {
			val = newVal;
			execCb !== false && isFunc(cb) && cb.apply(ctx, args);
		}

		return val;
	};
}
*/

/*
// adapted from https://github.com/Olical/binary-search
export function binaryKeySearch(list, item) {
    var min = 0;
    var max = list.length - 1;
    var guess;

	var bitwise = (max <= 2147483647) ? true : false;
	if (bitwise) {
		while (min <= max) {
			guess = (min + max) >> 1;
			if (list[guess].key === item) { return guess; }
			else {
				if (list[guess].key < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	} else {
		while (min <= max) {
			guess = Math.floor((min + max) / 2);
			if (list[guess].key === item) { return guess; }
			else {
				if (list[guess].key < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	}

    return -1;
}
*/

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
// impl borrowed from https://github.com/ivijs/ivi
function longestIncreasingSubsequence(a) {
	var p = a.slice();
	var result = [];
	result.push(0);
	var u;
	var v;

	for (var i = 0, il = a.length; i < il; ++i) {
		var j = result[result.length - 1];
		if (a[j] < a[i]) {
			p[i] = j;
			result.push(i);
			continue;
		}

		u = 0;
		v = result.length - 1;

		while (u < v) {
			var c = ((u + v) / 2) | 0;
			if (a[result[c]] < a[i]) {
				u = c + 1;
			} else {
				v = c;
			}
		}

		if (a[i] < a[result[u]]) {
			if (u > 0) {
				p[i] = result[u - 1];
			}
			result[u] = i;
		}
	}

	u = result.length;
	v = result[u - 1];

	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}

	return result;
}

// based on https://github.com/Olical/binary-search
function binaryFindLarger(item, list) {
	var min = 0;
	var max = list.length - 1;
	var guess;

	var bitwise = (max <= 2147483647) ? true : false;
	if (bitwise) {
		while (min <= max) {
			guess = (min + max) >> 1;
			if (list[guess] === item) { return guess; }
			else {
				if (list[guess] < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	} else {
		while (min <= max) {
			guess = Math.floor((min + max) / 2);
			if (list[guess] === item) { return guess; }
			else {
				if (list[guess] < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	}

	return (min == list.length) ? null : min;

//	return -1;
}

function isEvProp(name) {
	return name[0] === "o" && name[1] === "n";
}

function isSplProp(name) {
	return name[0] === "_";
}

function isStyleProp(name) {
	return name === "style";
}

function repaint(node) {
	node && node.el && node.el.offsetHeight;
}

function isHydrated(vm) {
	return vm.node != null && vm.node.el != null;
}

// tests interactive props where real val should be compared
function isDynProp(tag, attr) {
//	switch (tag) {
//		case "input":
//		case "textarea":
//		case "select":
//		case "option":
			switch (attr) {
				case "value":
				case "checked":
				case "selected":
//				case "selectedIndex":
					return true;
			}
//	}

	return false;
}

function getVm(n) {
	n = n || emptyObj;
	while (n.vm == null && n.parent)
		{ n = n.parent; }
	return n.vm;
}

function VNode() {}

var VNodeProto = VNode.prototype = {
	constructor: VNode,

	type:	null,

	vm:		null,

	// all this stuff can just live in attrs (as defined) just have getters here for it
	key:	null,
	ref:	null,
	data:	null,
	hooks:	null,
	ns:		null,

	el:		null,

	tag:	null,
	attrs:	null,
	body:	null,

	flags:	0,

	_class:	null,
	_diff:	null,

	// pending removal on promise resolution
	_dead:	false,
	// part of longest increasing subsequence?
	_lis:	false,

	idx:	null,
	parent:	null,

	/*
	// break out into optional fluent module
	key:	function(val) { this.key	= val; return this; },
	ref:	function(val) { this.ref	= val; return this; },		// deep refs
	data:	function(val) { this.data	= val; return this; },
	hooks:	function(val) { this.hooks	= val; return this; },		// h("div").hooks()
	html:	function(val) { this.html	= true; return this.body(val); },

	body:	function(val) { this.body	= val; return this; },
	*/
};

function defineText(body) {
	var node = new VNode;
	node.type = TEXT;
	node.body = body;
	return node;
}

// creates a one-shot self-ending stream that redraws target vm
// TODO: if it's already registered by any parent vm, then ignore to avoid simultaneous parent & child refresh

var tagCache = {};

var RE_ATTRS = /\[(\w+)(?:=(\w+))?\]/g;

function cssTag(raw) {
	{
		var cached = tagCache[raw];

		if (cached == null) {
			var tag, id, cls, attr;

			tagCache[raw] = cached = {
				tag:	(tag	= raw.match( /^[-\w]+/))		?	tag[0]						: "div",
				id:		(id		= raw.match( /#([-\w]+)/))		? 	id[1]						: null,
				class:	(cls	= raw.match(/\.([-\w.]+)/))		?	cls[1].replace(/\./g, " ")	: null,
				attrs:	null,
			};

			while (attr = RE_ATTRS.exec(raw)) {
				if (cached.attrs == null)
					{ cached.attrs = {}; }
				cached.attrs[attr[1]] = attr[2] || "";
			}
		}

		return cached;
	}
}

// (de)optimization flags

// forces slow bottom-up removeChild to fire deep willRemove/willUnmount hooks,
var DEEP_REMOVE = 1;
// prevents inserting/removing/reordering of children
var FIXED_BODY = 2;
// enables fast keyed lookup of children via binary search, expects homogeneous keyed body
var KEYED_LIST = 4;
// indicates an vnode match/diff/recycler function for body
var LAZY_LIST = 8;

function initElementNode(tag, attrs, body, flags) {
	var node = new VNode;

	node.type = ELEMENT;

	if (isSet(flags))
		{ node.flags = flags; }

	node.attrs = attrs;

	var parsed = cssTag(tag);

	node.tag = parsed.tag;

	// meh, weak assertion, will fail for id=0, etc.
	if (parsed.id || parsed.class || parsed.attrs) {
		var p = node.attrs || {};

		if (parsed.id && !isSet(p.id))
			{ p.id = parsed.id; }

		if (parsed.class) {
			node._class = parsed.class;		// static class
			p.class = parsed.class + (isSet(p.class) ? (" " + p.class) : "");
		}
		if (parsed.attrs) {
			for (var key in parsed.attrs)
				{ if (!isSet(p[key]))
					{ p[key] = parsed.attrs[key]; } }
		}

//		if (node.attrs !== p)
			node.attrs = p;
	}

	var mergedAttrs = node.attrs;

	if (isSet(mergedAttrs)) {
		if (isSet(mergedAttrs._key))
			{ node.key = mergedAttrs._key; }

		if (isSet(mergedAttrs._ref))
			{ node.ref = mergedAttrs._ref; }

		if (isSet(mergedAttrs._hooks))
			{ node.hooks = mergedAttrs._hooks; }

		if (isSet(mergedAttrs._data))
			{ node.data = mergedAttrs._data; }

		if (isSet(mergedAttrs._flags))
			{ node.flags = mergedAttrs._flags; }

		if (!isSet(node.key)) {
			if (isSet(node.ref))
				{ node.key = node.ref; }
			else if (isSet(mergedAttrs.id))
				{ node.key = mergedAttrs.id; }
			else if (isSet(mergedAttrs.name))
				{ node.key = mergedAttrs.name + (mergedAttrs.type === "radio" || mergedAttrs.type === "checkbox" ? mergedAttrs.value : ""); }
		}
	}

	if (body != null)
		{ node.body = body; }

	return node;
}

function setRef(vm, name, node) {
	var path = ["refs"].concat(name.split("."));
	deepSet(vm, path, node);
}

function setDeepRemove(node) {
	while (node = node.parent)
		{ node.flags |= DEEP_REMOVE; }
}

// vnew, vold
function preProc(vnew, parent, idx, ownVm) {
	if (vnew.type === VMODEL || vnew.type === VVIEW)
		{ return; }

	vnew.parent = parent;
	vnew.idx = idx;
	vnew.vm = ownVm;

	if (vnew.ref != null)
		{ setRef(getVm(vnew), vnew.ref, vnew); }

	var nh = vnew.hooks,
		vh = ownVm && ownVm.hooks;

	if (nh && (nh.willRemove || nh.didRemove) ||
		vh && (vh.willUnmount || vh.didUnmount))
		{ setDeepRemove(vnew); }

	if (isArr(vnew.body))
		{ preProcBody(vnew); }
	else {}
}

function preProcBody(vnew) {
	var body = vnew.body;

	for (var i = 0; i < body.length; i++) {
		var node2 = body[i];

		// remove false/null/undefined
		if (node2 === false || node2 == null)
			{ body.splice(i--, 1); }
		// flatten arrays
		else if (isArr(node2)) {
			insertArr(body, node2, i--, 1);
		}
		else {
			if (node2.type == null)
				{ body[i] = node2 = defineText(""+node2); }

			if (node2.type === TEXT) {
				// remove empty text nodes
				if (node2.body == null || node2.body === "")
					{ body.splice(i--, 1); }
				// merge with previous text node
				else if (i > 0 && body[i-1].type === TEXT) {
					body[i-1].body += node2.body;
					body.splice(i--, 1);
				}
				else
					{ preProc(node2, vnew, i, null); }
			}
			else
				{ preProc(node2, vnew, i, null); }
		}
	}
}

var unitlessProps = {
	animationIterationCount: true,
	boxFlex: true,
	boxFlexGroup: true,
	boxOrdinalGroup: true,
	columnCount: true,
	flex: true,
	flexGrow: true,
	flexPositive: true,
	flexShrink: true,
	flexNegative: true,
	flexOrder: true,
	gridRow: true,
	gridColumn: true,
	order: true,
	lineClamp: true,

	borderImageOutset: true,
	borderImageSlice: true,
	borderImageWidth: true,
	fontWeight: true,
	lineHeight: true,
	opacity: true,
	orphans: true,
	tabSize: true,
	widows: true,
	zIndex: true,
	zoom: true,

	fillOpacity: true,
	floodOpacity: true,
	stopOpacity: true,
	strokeDasharray: true,
	strokeDashoffset: true,
	strokeMiterlimit: true,
	strokeOpacity: true,
	strokeWidth: true
};

function autoPx(name, val) {
	{
		// typeof val === 'number' is faster but fails for numeric strings
		return !isNaN(val) && !unitlessProps[name] ? (val + "px") : val;
	}
}

// assumes if styles exist both are objects or both are strings
function patchStyle(n, o) {
	var ns =     (n.attrs || emptyObj).style;
	var os = o ? (o.attrs || emptyObj).style : null;

	// replace or remove in full
	if (ns == null || isVal(ns))
		{ n.el.style.cssText = ns; }
	else {
		for (var nn in ns) {
			var nv = ns[nn];

			if (os == null || nv != null && nv !== os[nn])
				{ n.el.style[nn] = autoPx(nn, nv); }
		}

		// clean old
		if (os) {
			for (var on in os) {
				if (ns[on] == null)
					{ n.el.style[on] = ""; }
			}
		}
	}
}

var didQueue = [];

function fireHook(hooks, name, o, n, immediate) {
	if (hooks != null) {
		var fn = o.hooks[name];

		if (fn) {
			if (name[0] === "d" && name[1] === "i" && name[2] === "d") {	// did*
				//	console.log(name + " should queue till repaint", o, n);
				immediate ? repaint(o.parent) && fn(o, n) : didQueue.push([fn, o, n]);
			}
			else {		// will*
				//	console.log(name + " may delay by promise", o, n);
				return fn(o, n);		// or pass  done() resolver
			}
		}
	}
}

function drainDidHooks(vm) {
	if (didQueue.length) {
		repaint(vm.node);

		var item;
		while (item = didQueue.shift())
			{ item[0](item[1], item[2]); }
	}
}

var doc = ENV_DOM ? document : null;

function closestVNode(el) {
	while (el._node == null)
		{ el = el.parentNode; }
	return el._node;
}

function createElement(tag, ns) {
	if (ns != null)
		{ return doc.createElementNS(ns, tag); }
	return doc.createElement(tag);
}

function createTextNode(body) {
	return doc.createTextNode(body);
}

function createComment(body) {
	return doc.createComment(body);
}

// ? removes if !recycled
function nextSib(sib) {
	return sib.nextSibling;
}

// ? removes if !recycled
function prevSib(sib) {
	return sib.previousSibling;
}

// TODO: this should collect all deep proms from all hooks and return Promise.all()
function deepNotifyRemove(node) {
	var vm = node.vm;

	var wuRes = vm != null && fireHook(vm.hooks, "willUnmount", vm, vm.data);

	var wrRes = fireHook(node.hooks, "willRemove", node);

	if ((node.flags & DEEP_REMOVE) === DEEP_REMOVE && isArr(node.body)) {
		for (var i = 0; i < node.body.length; i++)
			{ deepNotifyRemove(node.body[i]); }
	}

	return wuRes || wrRes;
}

function _removeChild(parEl, el, immediate) {
	var node = el._node, vm = node.vm;

	if (isArr(node.body)) {
		if ((node.flags & DEEP_REMOVE) === DEEP_REMOVE) {
			for (var i = 0; i < node.body.length; i++)
				{ _removeChild(el, node.body[i].el); }
		}
		else
			{ deepUnref(node); }
	}

	delete el._node;

	parEl.removeChild(el);

	fireHook(node.hooks, "didRemove", node, null, immediate);

	if (vm != null) {
		fireHook(vm.hooks, "didUnmount", vm, vm.data, immediate);
		vm.node = null;
	}
}

// todo: should delay parent unmount() by returning res prom?
function removeChild(parEl, el) {
	var node = el._node;

	// already marked for removal
	if (node._dead) { return; }

	var res = deepNotifyRemove(node);

	if (res != null && isProm(res)) {
		node._dead = true;
		res.then(curry(_removeChild, [parEl, el, true]));
	}
	else
		{ _removeChild(parEl, el); }
}

function deepUnref(node) {
	var obody = node.body;

	for (var i = 0; i < obody.length; i++) {
		var o2 = obody[i];
		delete o2.el._node;

		if (o2.vm != null)
			{ o2.vm.node = null; }

		if (isArr(o2.body))
			{ deepUnref(o2); }
	}
}

function clearChildren(parent) {
	var parEl = parent.el;

	if ((parent.flags & DEEP_REMOVE) === 0) {
		isArr(parent.body) && deepUnref(parent);
		parEl.textContent = null;
	}
	else {
		var el = parEl.firstChild;

		do {
			var next = nextSib(el);
			removeChild(parEl, el);
		} while (el = next);
	}
}

// todo: hooks
function insertBefore(parEl, el, refEl) {
	var node = el._node, inDom = el.parentNode != null;

	// el === refEl is asserted as a no-op insert called to fire hooks
	var vm = (el === refEl || !inDom) ? node.vm : null;

	if (vm != null)
		{ fireHook(vm.hooks, "willMount", vm, vm.data); }

	fireHook(node.hooks, inDom ? "willReinsert" : "willInsert", node);
	parEl.insertBefore(el, refEl);
	fireHook(node.hooks, inDom ? "didReinsert" : "didInsert", node);

	if (vm != null)
		{ fireHook(vm.hooks, "didMount", vm, vm.data); }
}

function insertAfter(parEl, el, refEl) {
	insertBefore(parEl, el, refEl ? nextSib(refEl) : null);
}

var onemit = {};

function emitCfg(cfg) {
	assignObj(onemit, cfg);
}

function emit(evName) {
	var targ = this,
		src = targ;

	var args = sliceArgs(arguments, 1).concat(src, src.data);

	do {
		var evs = targ.onemit;
		var fn = evs ? evs[evName] : null;

		if (fn) {
			fn.apply(targ, args);
			break;
		}
	} while (targ = targ.parent());

	if (onemit[evName])
		{ onemit[evName].apply(targ, args); }
}

var onevent = noop;

function config(newCfg) {
	onevent = newCfg.onevent || onevent;

	{
		if (newCfg.onemit)
			{ emitCfg(newCfg.onemit); }
	}

	
}

function bindEv(el, type, fn) {
	el[type] = fn;
}

function exec(fn, args, e, node, vm) {
	var out = fn.apply(vm, args.concat([e, node, vm, vm.data]));

	// should these respect out === false?
	vm.onevent(e, node, vm, vm.data, args);
	onevent.call(null, e, node, vm, vm.data, args);

	if (out === false) {
		e.preventDefault();
		e.stopPropagation();
	}
}

function handle(e) {
	var node = closestVNode(e.target);
	var vm = getVm(node);

	var evDef = e.currentTarget._node.attrs["on" + e.type], fn, args;

	if (isArr(evDef)) {
		fn = evDef[0];
		args = evDef.slice(1);
		exec(fn, args, e, node, vm);
	}
	else {
		for (var sel in evDef) {
			if (e.target.matches(sel)) {
				var evDef2 = evDef[sel];

				if (isArr(evDef2)) {
					fn = evDef2[0];
					args = evDef2.slice(1);
				}
				else {
					fn = evDef2;
					args = [];
				}

				exec(fn, args, e, node, vm);
			}
		}
	}
}

function patchEvent(node, name, nval, oval) {
	if (nval === oval)
		{ return; }

	var el = node.el;

	if (nval == null || isFunc(nval))
		{ bindEv(el, name, nval); }
	else if (oval == null)
		{ bindEv(el, name, handle); }
}

function remAttr(node, name, asProp) {
	if (name[0] === ".") {
		name = name.substr(1);
		asProp = true;
	}

	if (asProp)
		{ node.el[name] = ""; }
	else
		{ node.el.removeAttribute(name); }
}

// setAttr
// diff, ".", "on*", bool vals, skip _*, value/checked/selected selectedIndex
function setAttr(node, name, val, asProp, initial) {
	var el = node.el;

	if (val == null)
		{ !initial && remAttr(node, name, false); }		// will also removeAttr of style: null
	else if (node.ns != null)
		{ el.setAttribute(name, val); }
	else if (name === "class")
		{ el.className = val; }
	else if (name === "id" || typeof val === "boolean" || asProp)
		{ el[name] = val; }
	else if (name[0] === ".")
		{ el[name.substr(1)] = val; }
	else
		{ el.setAttribute(name, val); }
}

function patchAttrs(vnode, donor, initial) {
	var nattrs = vnode.attrs || emptyObj;
	var oattrs = donor.attrs || emptyObj;

	if (nattrs === oattrs) {
		
	}
	else {
		for (var key in nattrs) {
			var nval = nattrs[key];
			var isDyn = isDynProp(vnode.tag, key);
			var oval = isDyn ? vnode.el[key] : oattrs[key];

			if (nval === oval) {}
			else if (isStyleProp(key))
				{ patchStyle(vnode, donor); }
			else if (isSplProp(key)) {}
			else if (isEvProp(key))
				{ patchEvent(vnode, key, nval, oval); }
			else
				{ setAttr(vnode, key, nval, isDyn, initial); }
		}

		// TODO: bench style.cssText = "" vs removeAttribute("style")
		for (var key in oattrs) {
			!(key in nattrs) &&
			!isSplProp(key) &&
			remAttr(vnode, key, isDynProp(vnode.tag, key) || isEvProp(key));
		}
	}
}

function createView(view, data, key, opts) {
	if (view.type === VVIEW) {
		data	= view.data;
		key		= view.key;
		opts	= view.opts;
		view	= view.view;
	}

	return new ViewModel(view, data, key, opts);
}

//import { XML_NS, XLINK_NS } from './defineSvgElement';
function hydrateBody(vnode) {
	for (var i = 0; i < vnode.body.length; i++) {
		var vnode2 = vnode.body[i];
		var type2 = vnode2.type;

		// ELEMENT,TEXT,COMMENT
		if (type2 <= COMMENT)
			{ insertBefore(vnode.el, hydrate(vnode2)); }		// vnode.el.appendChild(hydrate(vnode2))
		else if (type2 === VVIEW) {
			var vm = createView(vnode2.view, vnode2.data, vnode2.key, vnode2.opts)._redraw(vnode, i, false);		// todo: handle new data updates
			type2 = vm.node.type;
			insertBefore(vnode.el, hydrate(vm.node));
		}
		else if (type2 === VMODEL) {
			var vm = vnode2.vm;
			vm._redraw(vnode, i);					// , false
			type2 = vm.node.type;
			insertBefore(vnode.el, vm.node.el);		// , hydrate(vm.node)
		}
	}
}

//  TODO: DRY this out. reusing normal patch here negatively affects V8's JIT
function hydrate(vnode, withEl) {
	if (vnode.el == null) {
		if (vnode.type === ELEMENT) {
			vnode.el = withEl || createElement(vnode.tag, vnode.ns);

		//	if (vnode.tag === "svg")
		//		vnode.el.setAttributeNS(XML_NS, 'xmlns:xlink', XLINK_NS);

			if (vnode.attrs != null)
				{ patchAttrs(vnode, emptyObj, true); }

			if ((vnode.flags & LAZY_LIST) === LAZY_LIST)	// vnode.body instanceof LazyList
				{ vnode.body.body(vnode); }

			if (isArr(vnode.body))
				{ hydrateBody(vnode); }
			else if (vnode.body != null && vnode.body !== "")
				{ vnode.el.textContent = vnode.body; }
		}
		else if (vnode.type === TEXT)
			{ vnode.el = withEl || createTextNode(vnode.body); }
		else if (vnode.type === COMMENT)
			{ vnode.el = withEl || createComment(vnode.body); }
	}

	vnode.el._node = vnode;

	return vnode.el;
}

// prevent GCC from inlining some large funcs (which negatively affects Chrome's JIT)
//window.syncChildren = syncChildren;
window.lisMove = lisMove;

function nextNode(node, body) {
	return body[node.idx + 1];
}

function prevNode(node, body) {
	return body[node.idx - 1];
}

function parentNode(node) {
	return node.parent;
}

var BREAK = 1;
var BREAK_ALL = 2;

function syncDir(advSib, advNode, insert, sibName, nodeName, invSibName, invNodeName, invInsert) {
	return function(node, parEl, body, state, convTest, lis) {
		var sibNode, tmpSib;

		if (state[sibName] != null) {
			// skip dom elements not created by domvm
			if ((sibNode = state[sibName]._node) == null) {
				state[sibName] = advSib(state[sibName]);
				return;
			}

			if (parentNode(sibNode) !== node) {
				tmpSib = advSib(state[sibName]);
				sibNode.vm != null ? sibNode.vm.unmount(true) : removeChild(parEl, state[sibName]);
				state[sibName] = tmpSib;
				return;
			}
		}

		if (state[nodeName] == convTest)
			{ return BREAK_ALL; }
		else if (state[nodeName].el == null) {
			insert(parEl, hydrate(state[nodeName]), state[sibName]);	// should lis be updated here?
			state[nodeName] = advNode(state[nodeName], body);		// also need to advance sib?
		}
		else if (state[nodeName].el === state[sibName]) {
			state[nodeName] = advNode(state[nodeName], body);
			state[sibName] = advSib(state[sibName]);
		}
		// head->tail or tail->head
		else if (!lis && sibNode === state[invNodeName]) {
			tmpSib = state[sibName];
			state[sibName] = advSib(tmpSib);
			invInsert(parEl, tmpSib, state[invSibName]);
			state[invSibName] = tmpSib;
		}
		else {
			if (lis && state[sibName] != null)
				{ return lisMove(advSib, advNode, insert, sibName, nodeName, parEl, body, sibNode, state); }

			return BREAK;
		}
	};
}

function lisMove(advSib, advNode, insert, sibName, nodeName, parEl, body, sibNode, state) {
	if (sibNode._lis) {
		insert(parEl, state[nodeName].el, state[sibName]);
		state[nodeName] = advNode(state[nodeName], body);
	}
	else {
		// find closest tomb
		var t = binaryFindLarger(sibNode.idx, state.tombs);
		sibNode._lis = true;
		var tmpSib = advSib(state[sibName]);
		insert(parEl, state[sibName], t != null ? body[state.tombs[t]].el : t);

		if (t == null)
			{ state.tombs.push(sibNode.idx); }
		else
			{ state.tombs.splice(t, 0, sibNode.idx); }

		state[sibName] = tmpSib;
	}
}

var syncLft = syncDir(nextSib, nextNode, insertBefore, "lftSib", "lftNode", "rgtSib", "rgtNode", insertAfter);
var syncRgt = syncDir(prevSib, prevNode, insertAfter, "rgtSib", "rgtNode", "lftSib", "lftNode", insertBefore);

function syncChildren(node, donor) {
	var obody	= donor.body,
		parEl	= node.el,
		body	= node.body,
		state = {
			lftNode:	body[0],
			rgtNode:	body[body.length - 1],
			lftSib:		((obody)[0] || emptyObj).el,
			rgtSib:		(obody[obody.length - 1] || emptyObj).el,
		};

	converge:
	while (1) {
//		from_left:
		while (1) {
			var l = syncLft(node, parEl, body, state, null, false);
			if (l === BREAK) { break; }
			if (l === BREAK_ALL) { break converge; }
		}

//		from_right:
		while (1) {
			var r = syncRgt(node, parEl, body, state, state.lftNode, false);
			if (r === BREAK) { break; }
			if (r === BREAK_ALL) { break converge; }
		}

		sortDOM(node, parEl, body, state);
		break;
	}
}

// TODO: also use the state.rgtSib and state.rgtNode bounds, plus reduce LIS range
function sortDOM(node, parEl, body, state) {
	var kids = Array.prototype.slice.call(parEl.childNodes);
	var domIdxs = [];

	for (var k = 0; k < kids.length; k++) {
		var n = kids[k]._node;

		if (n.parent === node)
			{ domIdxs.push(n.idx); }
	}

	// list of non-movable vnode indices (already in correct order in old dom)
	var tombs = longestIncreasingSubsequence(domIdxs).map(function (i) { return domIdxs[i]; });

	for (var i = 0; i < tombs.length; i++)
		{ body[tombs[i]]._lis = true; }

	state.tombs = tombs;

	while (1) {
		var r = syncLft(node, parEl, body, state, null, true);
		if (r === BREAK_ALL) { break; }
	}
}

function alreadyAdopted(vnode) {
	return vnode.el._node.parent !== vnode.parent;
}

function takeSeqIndex(n, obody, fromIdx) {
	return obody[fromIdx];
}

function findSeqThorough(n, obody, fromIdx) {		// pre-tested isView?
	for (; fromIdx < obody.length; fromIdx++) {
		var o = obody[fromIdx];

		if (o.vm != null) {
			// match by key & viewFn || vm
			if (n.type === VVIEW && o.vm.view === n.view && o.vm.key === n.key || n.type === VMODEL && o.vm === n.vm)
				{ return o; }
		}
		else if (!alreadyAdopted(o) && n.tag === o.tag && n.type === o.type && n.key === o.key && (n.flags & ~DEEP_REMOVE) === (o.flags & ~DEEP_REMOVE))
			{ return o; }
	}

	return null;
}

function findHashKeyed(n, obody, fromIdx) {
	return obody[obody._keys[n.key]];
}

/*
// list must be a sorted list of vnodes by key
function findBinKeyed(n, list) {
	var idx = binaryKeySearch(list, n.key);
	return idx > -1 ? list[idx] : null;
}
*/

// have it handle initial hydrate? !donor?
// types (and tags if ELEM) are assumed the same, and donor exists
function patch(vnode, donor) {
	fireHook(donor.hooks, "willRecycle", donor, vnode);

	var el = vnode.el = donor.el;

	var obody = donor.body;
	var nbody = vnode.body;

	el._node = vnode;

	// "" => ""
	if (vnode.type === TEXT && nbody !== obody) {
		el.nodeValue = nbody;
		return;
	}

	if (vnode.attrs != null || donor.attrs != null)
		{ patchAttrs(vnode, donor, false); }

	// patch events

	var oldIsArr = isArr(obody);
	var newIsArr = isArr(nbody);
	var lazyList = (vnode.flags & LAZY_LIST) === LAZY_LIST;

//	var nonEqNewBody = nbody != null && nbody !== obody;

	if (oldIsArr) {
		// [] => []
		if (newIsArr || lazyList)
			{ patchChildren(vnode, donor); }
		// [] => "" | null
		else if (nbody !== obody) {
			if (nbody != null)
				{ el.textContent = nbody; }
			else
				{ clearChildren(donor); }
		}
	}
	else {
		// "" | null => []
		if (newIsArr) {
			clearChildren(donor);
			hydrateBody(vnode);
		}
		// "" | null => "" | null
		else if (nbody !== obody) {
			if (el.firstChild)
				{ el.firstChild.nodeValue = nbody; }
			else
				{ el.textContent = nbody; }
		}
	}

	fireHook(donor.hooks, "didRecycle", donor, vnode);
}

// larger qtys of KEYED_LIST children will use binary search
//const SEQ_FAILS_MAX = 100;

// TODO: modify vtree matcher to work similar to dom reconciler for keyed from left -> from right -> head/tail -> binary
// fall back to binary if after failing nri - nli > SEQ_FAILS_MAX
// while-advance non-keyed fromIdx
// [] => []
function patchChildren(vnode, donor) {
	var nbody		= vnode.body,
		nlen		= nbody.length,
		obody		= donor.body,
		olen		= obody.length,
		isLazy		= (vnode.flags & LAZY_LIST) === LAZY_LIST,
		isFixed		= (vnode.flags & FIXED_BODY) === FIXED_BODY,
		isKeyed		= (vnode.flags & KEYED_LIST) === KEYED_LIST,
		domSync		= !isFixed && vnode.type === ELEMENT,
		doFind		= true,
		find		= (
			isKeyed ? findHashKeyed :				// keyed lists/lazyLists
			isFixed || isLazy ? takeSeqIndex :		// unkeyed lazyLists and FIXED_BODY
			findSeqThorough							// more complex stuff
		);

	if (isKeyed) {
		var keys = {};
		for (var i = 0; i < obody.length; i++)
			{ keys[obody[i].key] = i; }
		obody._keys = keys;
	}

	if (domSync && nlen === 0) {
		clearChildren(donor);
		if (isLazy)
			{ vnode.body = []; }	// nbody.tpl(all);
		return;
	}

	var donor2,
		node2,
		foundIdx,
		patched = 0,
		everNonseq = false,
		fromIdx = 0;		// first unrecycled node (search head)

	if (isLazy) {
		var fnode2 = {key: null};
		var nbodyNew = Array(nlen);
	}

	for (var i = 0; i < nlen; i++) {
		if (isLazy) {
			var remake = false;
			var diffRes = null;

			if (doFind) {
				if (isKeyed)
					{ fnode2.key = nbody.key(i); }

				donor2 = find(fnode2, obody, fromIdx);
			}

			if (donor2 != null) {
                foundIdx = donor2.idx;
				diffRes = nbody.diff(i, donor2);

				// diff returns same, so cheaply adopt vnode without patching
				if (diffRes === true) {
					node2 = donor2;
					node2.parent = vnode;
					node2.idx = i;
					node2._lis = false;
				}
				// diff returns new diffVals, so generate new vnode & patch
				else
					{ remake = true; }
			}
			else
				{ remake = true; }

			if (remake) {
				node2 = nbody.tpl(i);			// what if this is a VVIEW, VMODEL, injected element?
				preProc(node2, vnode, i);

				node2._diff = diffRes != null ? diffRes : nbody.diff(i);

				if (donor2 != null)
					{ patch(node2, donor2); }
			}
			else {
				// TODO: flag tmp FIXED_BODY on unchanged nodes?

				// domSync = true;		if any idx changes or new nodes added/removed
			}

			nbodyNew[i] = node2;
		}
		else {
			var node2 = nbody[i];
			var type2 = node2.type;

			// ELEMENT,TEXT,COMMENT
			if (type2 <= COMMENT) {
				if (donor2 = doFind && find(node2, obody, fromIdx)) {
					patch(node2, donor2);
					foundIdx = donor2.idx;
				}
			}
			else if (type2 === VVIEW) {
				if (donor2 = doFind && find(node2, obody, fromIdx)) {		// update/moveTo
					foundIdx = donor2.idx;
					var vm = donor2.vm._update(node2.data, vnode, i);		// withDOM
				}
				else
					{ var vm = createView(node2.view, node2.data, node2.key, node2.opts)._redraw(vnode, i, false); }	// createView, no dom (will be handled by sync below)

				type2 = vm.node.type;
			}
			else if (type2 === VMODEL) {
				// if the injected vm has never been rendered, this vm._update() serves as the
				// initial vtree creator, but must avoid hydrating (creating .el) because syncChildren()
				// which is responsible for mounting below (and optionally hydrating), tests .el presence
				// to determine if hydration & mounting are needed
				var withDOM = isHydrated(node2.vm);

				var vm = node2.vm._update(node2.data, vnode, i, withDOM);
				type2 = vm.node.type;
			}
		}

		// found donor & during a sequential search ...at search head
		if (!isKeyed && donor2 != null) {
			if (foundIdx === fromIdx) {
				// advance head
				fromIdx++;
				// if all old vnodes adopted and more exist, stop searching
				if (fromIdx === olen && nlen > olen) {
					// short-circuit find, allow loop just create/init rest
					donor2 = null;
					doFind = false;
				}
			}
			else
				{ everNonseq = true; }

			if (olen > 100 && everNonseq && ++patched % 10 === 0)
				{ while (fromIdx < olen && alreadyAdopted(obody[fromIdx]))
					{ fromIdx++; } }
		}
	}

	// replace List w/ new body
	if (isLazy)
		{ vnode.body = nbodyNew; }

	domSync && syncChildren(vnode, donor);
}

// view + key serve as the vm's unique identity
function ViewModel(view, data, key, opts) {
	var vm = this;

	vm.view = view;
	vm.data = data;
	vm.key = key;

	if (opts) {
		vm.opts = opts;
		vm.config(opts);
	}

	var out = isPlainObj(view) ? view : view.call(vm, vm, data, key, opts);

	if (isFunc(out))
		{ vm.render = out; }
	else {
		vm.render = out.render;
		vm.config(out);
	}

	// these must be wrapped here since they're debounced per view
	vm._redrawAsync = raft(function (_) { return vm.redraw(true); });
	vm._updateAsync = raft(function (newData) { return vm.update(newData, true); });

	vm.init && vm.init.call(vm, vm, vm.data, vm.key, opts);
}

var ViewModelProto = ViewModel.prototype = {
	constructor: ViewModel,

	_diff:	null,	// diff cache

	init:	null,
	view:	null,
	key:	null,
	data:	null,
	state:	null,
	api:	null,
	opts:	null,
	node:	null,
	hooks:	null,
	onevent: noop,
	refs:	null,
	render:	null,

	mount: mount,
	unmount: unmount,
	config: function(opts) {
		var t = this;

		if (opts.init)
			{ t.init = opts.init; }
		if (opts.diff)
			{ t.diff = opts.diff; }
		if (opts.onevent)
			{ t.onevent = opts.onevent; }

		// maybe invert assignment order?
		if (opts.hooks)
			{ t.hooks = assignObj(t.hooks || {}, opts.hooks); }

		{
			if (opts.onemit)
				{ t.onemit = assignObj(t.onemit || {}, opts.onemit); }
		}
	},
	parent: function() {
		return getVm(this.node.parent);
	},
	root: function() {
		var p = this.node;

		while (p.parent)
			{ p = p.parent; }

		return p.vm;
	},
	redraw: function(sync) {
		var vm = this;
		sync ? vm._redraw(null, null, isHydrated(vm)) : vm._redrawAsync();
		return vm;
	},
	update: function(newData, sync) {
		var vm = this;
		sync ? vm._update(newData, null, null, isHydrated(vm)) : vm._updateAsync(newData);
		return vm;
	},

	_update: updateSync,
	_redraw: redrawSync,
	_redrawAsync: null,
	_updateAsync: null,
};

function mount(el, isRoot) {
	var vm = this;

	if (isRoot) {
		clearChildren({el: el, flags: 0});

		vm._redraw(null, null, false);

		// if placeholder node doesnt match root tag
		if (el.nodeName.toLowerCase() !== vm.node.tag) {
			hydrate(vm.node);
			insertBefore(el.parentNode, vm.node.el, el);
			el.parentNode.removeChild(el);
		}
		else
			{ insertBefore(el.parentNode, hydrate(vm.node, el), el); }
	}
	else {
		vm._redraw(null, null);

		if (el)
			{ insertBefore(el, vm.node.el); }
	}

	if (el)
		{ drainDidHooks(vm); }

	return vm;
}

// asSub means this was called from a sub-routine, so don't drain did* hook queue
function unmount(asSub) {
	var vm = this;

	var node = vm.node;
	var parEl = node.el.parentNode;

	// edge bug: this could also be willRemove promise-delayed; should .then() or something to make sure hooks fire in order
	removeChild(parEl, node.el);

	if (!asSub)
		{ drainDidHooks(vm); }
}

function reParent(vm, vold, newParent, newIdx) {
	if (newParent != null) {
		newParent.body[newIdx] = vold;
		vold.idx = newIdx;
		vold.parent = newParent;
		vold._lis = false;
	}
	return vm;
}

function redrawSync(newParent, newIdx, withDOM) {
	var isRedrawRoot = newParent == null;
	var vm = this;
	var isMounted = vm.node && vm.node.el && vm.node.el.parentNode;

	var vold = vm.node, oldDiff, newDiff;

	if (vm.diff != null) {
		oldDiff = vm._diff;
		vm._diff = newDiff = vm.diff(vm, vm.data);

		if (vold != null) {
			var cmpFn = isArr(oldDiff) ? cmpArr : cmpObj;
			var isSame = oldDiff === newDiff || cmpFn(oldDiff, newDiff);

			if (isSame)
				{ return reParent(vm, vold, newParent, newIdx); }
		}
	}

	isMounted && fireHook(vm.hooks, "willRedraw", vm, vm.data);

	var vnew = vm.render.call(vm, vm, vm.data, oldDiff, newDiff);

	if (vnew === vold)
		{ return reParent(vm, vold, newParent, newIdx); }

	// todo: test result of willRedraw hooks before clearing refs
	vm.refs = null;

	// always assign vm key to root vnode (this is a de-opt)
	if (vm.key != null && vnew.key !== vm.key)
		{ vnew.key = vm.key; }

	vm.node = vnew;

	if (newParent) {
		preProc(vnew, newParent, newIdx, vm);
		newParent.body[newIdx] = vnew;
	}
	else if (vold && vold.parent) {
		preProc(vnew, vold.parent, vold.idx, vm);
		vold.parent.body[vold.idx] = vnew;
	}
	else
		{ preProc(vnew, null, null, vm); }

	if (withDOM !== false) {
		if (vold) {
			// root node replacement
			if (vold.tag !== vnew.tag || vold.key !== vnew.key) {
				// hack to prevent the replacement from triggering mount/unmount
				vold.vm = vnew.vm = null;

				var parEl = vold.el.parentNode;
				var refEl = nextSib(vold.el);
				removeChild(parEl, vold.el);
				insertBefore(parEl, hydrate(vnew), refEl);

				// another hack that allows any higher-level syncChildren to set
				// reconciliation bounds using a live node
				vold.el = vnew.el;

				// restore
				vnew.vm = vm;
			}
			else
				{ patch(vnew, vold); }
		}
		else
			{ hydrate(vnew); }
	}

	isMounted && fireHook(vm.hooks, "didRedraw", vm, vm.data);

	if (isRedrawRoot && isMounted)
		{ drainDidHooks(vm); }

	return vm;
}

// this also doubles as moveTo
// TODO? @withRedraw (prevent redraw from firing)
function updateSync(newData, newParent, newIdx, withDOM) {
	var vm = this;

	if (newData != null) {
		if (vm.data !== newData) {
			fireHook(vm.hooks, "willUpdate", vm, newData);
			vm.data = newData;

			
		}
	}

	return vm._redraw(newParent, newIdx, withDOM);
}

function defineElement(tag, arg1, arg2, flags) {
	var attrs, body;

	if (arg2 == null) {
		if (isPlainObj(arg1))
			{ attrs = arg1; }
		else
			{ body = arg1; }
	}
	else {
		attrs = arg1;
		body = arg2;
	}

	return initElementNode(tag, attrs, body, flags);
}

//export const XML_NS = "http://www.w3.org/2000/xmlns/";
var SVG_NS = "http://www.w3.org/2000/svg";

function defineSvgElement(tag, arg1, arg2, flags) {
	var n = defineElement(tag, arg1, arg2, flags);
	n.ns = SVG_NS;
	return n;
}

function defineComment(body) {
	var node = new VNode;
	node.type = COMMENT;
	node.body = body;
	return node;
}

// placeholder for declared views
function VView(view, data, key, opts) {
	this.view = view;
	this.data = data;
	this.key = key;
	this.opts = opts;
}

VView.prototype = {
	constructor: VView,

	type: VVIEW,
	view: null,
	data: null,
	key: null,
	opts: null,
};

function defineView(view, data, key, opts) {
	return new VView(view, data, key, opts);
}

// placeholder for injected ViewModels
function VModel(vm) {
	this.vm = vm;
}

VModel.prototype = {
	constructor: VModel,

	type: VMODEL,
	vm: null,
};

function injectView(vm) {
//	if (vm.node == null)
//		vm._redraw(null, null, false);

//	return vm.node;

	return new VModel(vm);
}

function injectElement(el) {
	var node = new VNode;
	node.type = ELEMENT;
	node.el = node.key = el;
	return node;
}

function lazyList(items, cfg) {
	var len = items.length;

	var self = {
		items: items,
		length: len,
		// defaults to returning item identity (or position?)
		key: function(i) {
			return cfg.key(items[i], i);
		},
		// default returns 0?
		diff: function(i, donor) {
			var newVals = cfg.diff(items[i], i);
			if (donor == null)
				{ return newVals; }
			var oldVals = donor._diff;
			var same = newVals === oldVals || isArr(oldVals) ? cmpArr(newVals, oldVals) : cmpObj(newVals, oldVals);
			return same || newVals;
		},
		tpl: function(i) {
			return cfg.tpl(items[i], i);
		},
		map: function(tpl) {
			cfg.tpl = tpl;
			return self;
		},
		body: function(vnode) {
			var nbody = Array(len);

			for (var i = 0; i < len; i++) {
				var vnode2 = self.tpl(i);

			//	if ((vnode.flags & KEYED_LIST) === KEYED_LIST && self. != null)
			//		vnode2.key = getKey(item);

				vnode2._diff = self.diff(i);			// holds oldVals for cmp

				nbody[i] = vnode2;

				// run preproc pass (should this be just preProc in above loop?) bench
				preProc(vnode2, vnode, i);
			}

			// replace List with generated body
			vnode.body = nbody;
		}
	};

	return self;
}

var nano = {
	config: config,

	ViewModel: ViewModel,
	VNode: VNode,

	createView: createView,

	defineElement: defineElement,
	defineSvgElement: defineSvgElement,
	defineText: defineText,
	defineComment: defineComment,
	defineView: defineView,

	injectView: injectView,
	injectElement: injectElement,

	lazyList: lazyList,

	FIXED_BODY: FIXED_BODY,
	DEEP_REMOVE: DEEP_REMOVE,
	KEYED_LIST: KEYED_LIST,
	LAZY_LIST: LAZY_LIST,
};

function protoPatch(n, doRepaint) {
	patch$1(this, n, doRepaint);
}

// newNode can be either {class: style: } or full new VNode
// will/didPatch hooks?
function patch$1(o, n, doRepaint) {
	if (n.type != null) {
		// no full patching of view roots, just use redraw!
		if (o.vm != null)
			{ return; }

		preProc(n, o.parent, o.idx, null);
		o.parent.body[o.idx] = n;
		patch(n, o);
		doRepaint && repaint(n);
		drainDidHooks(getVm(n));
	}
	else {
		// TODO: re-establish refs

		// shallow-clone target
		var donor = Object.create(o);
		// fixate orig attrs
		donor.attrs = assignObj({}, o.attrs);
		// assign new attrs into live targ node
		var oattrs = assignObj(o.attrs, n);
		// prepend any fixed shorthand class
		if (o._class != null) {
			var aclass = oattrs.class;
			oattrs.class = aclass != null && aclass !== "" ? o._class + " " + aclass : o._class;
		}

		patchAttrs(o, donor);

		doRepaint && repaint(o);
	}
}

VNodeProto.patch = protoPatch;

function nextSubVms(n, accum) {
	var body = n.body;

	if (isArr(body)) {
		for (var i = 0; i < body.length; i++) {
			var n2 = body[i];

			if (n2.vm != null)
				{ accum.push(n2.vm); }
			else
				{ nextSubVms(n2, accum); }
		}
	}

	return accum;
}

function defineElementSpread(tag) {
	var args = arguments;
	var len = args.length;
	var body, attrs;

	if (len > 1) {
		var bodyIdx = 1;

		if (isPlainObj(args[1])) {
			attrs = args[1];
			bodyIdx = 2;
		}

		if (len === bodyIdx + 1 && (isVal(args[bodyIdx]) || isArr(args[bodyIdx]) || attrs && (attrs._flags & LAZY_LIST) === LAZY_LIST))
			{ body = args[bodyIdx]; }
		else
			{ body = sliceArgs(args, bodyIdx); }
	}

	return initElementNode(tag, attrs, body);
}

function defineSvgElementSpread() {
	var n = defineElementSpread.apply(null, arguments);
	n.ns = SVG_NS;
	return n;
}

ViewModelProto.emit = emit;
ViewModelProto.onemit = null;

ViewModelProto.body = function() {
	return nextSubVms(this.node, []);
};

nano.defineElementSpread = defineElementSpread;
nano.defineSvgElementSpread = defineSvgElementSpread;

return nano;

})));
//# sourceMappingURL=domvm.micro.js.map


/***/ }),
/* 21 */
/***/ (function(module, exports) {

if (Element && !Element.prototype.matches) {
    var proto = Element.prototype;
    proto.matches = proto.matchesSelector ||
        proto.mozMatchesSelector || proto.msMatchesSelector ||
        proto.oMatchesSelector || proto.webkitMatchesSelector;
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(4);
var html_1 = __webpack_require__(5);
var View = /** @class */ (function () {
    function View(_container, config) {
        this._uid = core_1.uid();
        this.config = config || {};
    }
    View.prototype.mount = function (container, vnode) {
        this._view = vnode;
        if (container && vnode.mount) {
            // init view inside of HTML container
            this._container = html_1.toNode(container);
            vnode.mount(this._container);
        }
    };
    View.prototype.getRootView = function () {
        return this._view;
    };
    View.prototype.paint = function () {
        if (this._view && (this._view.node || // already rendered node
            this._container || // not rendered, but has container
            !this._view.mount)) {
            this._doNotRepaint = false;
            this._view.redraw();
        }
    };
    return View;
}());
exports.View = View;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Exporter = /** @class */ (function () {
    function Exporter(_name, _version, _view) {
        this._name = _name;
        this._version = _version;
        this._view = _view;
    }
    Exporter.prototype.pdf = function (config) {
        this._rawExport(config, "pdf", this._view);
    };
    Exporter.prototype.png = function (config) {
        this._rawExport(config, "png", this._view);
    };
    Exporter.prototype._rawExport = function (config, mode, view) {
        config = config || {};
        config.url = config.url || "https://export.dhtmlx.ru/" + this._name + "/" + mode;
        config.url += "/" + this._version;
        var html = view.getRootView().node.el.innerHTML;
        var t = document.createElement("form");
        t.style.cssText = "position:absolute; left:-1000px; visibility:hidden;";
        t.setAttribute("method", "POST");
        t.setAttribute("action", config.url);
        t.innerHTML = "<input type='hidden' name='raw'><input type='hidden' name='config'>";
        t.childNodes[0].value = html;
        t.childNodes[1].value = JSON.stringify(config);
        document.body.appendChild(t);
        t.submit();
        setTimeout(function () {
            t.parentNode.removeChild(t);
        }, 100);
    };
    return Exporter;
}());
exports.Exporter = Exporter;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var linkPaths_1 = __webpack_require__(11);
var colors = ["#FF9800", "#607D8B", "#00C7B5", "#03A9F4", "#9575CD", "#F06292"];
function placeOrgonogram(data, config) {
    var roots = data.getRoots();
    if (roots.length !== 1) {
        return;
    }
    var root = data.getItem(roots[0]);
    setLocalSizes(data, root, config, 0, 0);
    setGlobalSizes(data, root, 0, 0, config, 0);
}
exports.placeOrgonogram = placeOrgonogram;
function setLocalSizes(data, shape, config, vbranch, extra) {
    var kids = shape.$kids;
    var vertical = shape.dir === "vertical";
    var correction = (vertical ? config.margin.itemX / 2 : 0);
    var kidsWidth = 0;
    if (shape.open !== false && kids) {
        var count = 0;
        for (var i = 0; i < kids.length; i++) {
            var sub = data.getItem(kids[i][1]);
            if (!sub.hidden) {
                var dx = setLocalSizes(data, sub, config, vbranch + correction, correction);
                if (vertical) {
                    kidsWidth = Math.max(kidsWidth, dx);
                }
                else {
                    kidsWidth += dx;
                }
                count++;
            }
        }
        if (count && !vertical) {
            kidsWidth += (count - 1) * config.margin.itemX;
        }
        shape.$count = count;
    }
    kidsWidth = Math.max(shape.width, kidsWidth);
    if (!vertical) {
        var gridStep = config.gridStep || 1;
        var width = (kidsWidth - shape.width) / 2 + vbranch;
        shape.x = Math.ceil(width / gridStep) * gridStep;
    }
    else {
        shape.x = vbranch;
    }
    shape.y = 0;
    shape.$width = kidsWidth;
    return kidsWidth + extra;
}
function setGlobalSizes(data, shape, left, top, config, level) {
    var kids = shape.$kids;
    var vertical = shape.dir === "vertical";
    var localtop = 0;
    shape.x += left;
    shape.y += top;
    if (config.gridStep) {
        shape.y = Math.ceil(shape.y / config.gridStep) * config.gridStep;
    }
    top += shape.height + config.margin.itemY;
    if (shape.open !== false && kids) {
        var sub = void 0;
        for (var i = 0; i < kids.length; i++) {
            sub = data.getItem(kids[i][1]);
            if (!sub.hidden) {
                var pos = setGlobalSizes(data, sub, left, top, config, level + 1);
                if (vertical) {
                    top += pos + config.margin.itemY;
                    localtop += pos + config.margin.itemY;
                }
                else {
                    localtop = Math.max(localtop, pos + config.margin.itemY);
                    left += sub.$width + config.margin.itemX;
                }
                linkPaths_1.directLinkPath(data.getItem(kids[i][0]), shape, sub, config);
            }
        }
    }
    if (kids) {
        var firstChildColor = data.getItem(kids[0][1]).color;
        shape.$expandColor = firstChildColor || colors[(level + 1) % (colors.length)];
    }
    shape.color = shape.color || colors[level % (colors.length)];
    return shape.height + localtop;
}


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(3);
var types_1 = __webpack_require__(6);
var Selection = /** @class */ (function () {
    function Selection(_config, data, events) {
        var _this = this;
        this.events = events || (new events_1.EventSystem());
        this._data = data;
        this._data.events.on(types_1.DataEvents.removeAll, function () {
            _this._selected = null;
        });
        this._data.events.on(types_1.DataEvents.change, function () {
            if (_this._selected) {
                var near = _this._data.getNearId(_this._selected);
                if (near !== _this._selected) {
                    var old = _this._data.getItem(_this._selected);
                    if (old) {
                        old.$selected = false;
                    }
                    _this._selected = null;
                    if (near) {
                        _this.add(near);
                    }
                }
            }
        });
    }
    Selection.prototype.getId = function () {
        return this._selected;
    };
    Selection.prototype.getItem = function () {
        if (this._selected) {
            return this._data.getItem(this._selected);
        }
        return null;
    };
    Selection.prototype.remove = function (id) {
        id = id || this._selected;
        if (!id) {
            return true;
        }
        if (this.events.fire(types_1.SelectionEvents.beforeUnSelect, [id])) {
            this._data.update(id, { $selected: false }, true);
            this._selected = null;
            this.events.fire(types_1.SelectionEvents.afterUnSelect, [id]);
            return true;
        }
        return false;
    };
    Selection.prototype.add = function (id) {
        if (this._selected === id) {
            return;
        }
        this.remove();
        if (this.events.fire(types_1.SelectionEvents.beforeSelect, [id])) {
            this._selected = id;
            this._data.update(id, { $selected: true }, true);
            this.events.fire(types_1.SelectionEvents.afterSelect, [id]);
        }
    };
    return Selection;
}());
exports.Selection = Selection;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Line_1 = __webpack_require__(27);
var DiagramCard_1 = __webpack_require__(10);
var DiagramImgCard_1 = __webpack_require__(28);
var DiagramSvgCard_1 = __webpack_require__(29);
var FlowShape_1 = __webpack_require__(30);
var TextShape_1 = __webpack_require__(31);
exports.shapes = {
    "line": Line_1.Line,
    "dash": Line_1.Line,
    "card": DiagramCard_1.DiagramCard,
    "img-card": DiagramImgCard_1.DiagramImgCard,
    "svg-card": DiagramSvgCard_1.DiagramSvgCard,
    "text": TextShape_1.TextShape
};
for (var key in FlowShape_1.renders) {
    exports.shapes[key] = FlowShape_1.FlowShape;
}
function shapesFactory(config) {
    var comp = exports.shapes[config.type];
    if (!comp) {
        comp = exports.shapes.card;
    }
    return new comp(config);
}
exports.shapesFactory = shapesFactory;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var Base_1 = __webpack_require__(8);
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(config) {
        return _super.call(this, config) || this;
    }
    Line.prototype.isConnector = function () {
        return true;
    };
    Line.prototype.getMetaInfo = function () {
        return [
            { id: "strokeProps", type: "stroke", label: "Stroke", connector: true }
        ];
    };
    Line.prototype.setDefaults = function (config) {
        config.connectType = config.connectType || "elbow";
        config.stroke = config.stroke || "#CCC";
        config.strokeWidth = config.strokeWidth || 2;
        config.cornersRadius = config.cornersRadius || 0;
        return config;
    };
    Line.prototype.toSVG = function () {
        var isSelected = this.config.$selected;
        return dom_1.sv("g", { dhx_id: this.config.id || "", _key: this.config.id, class: "dhx_diagram_connector " + this.getCss() }, [
            dom_1.sv("path", {
                "d": this._getPoints(),
                "fill": "none",
                "class": "dhx_diagram_line " + (isSelected ? "dhx_diagram_line--selected" : ""),
                "stroke-dasharray": this._getType(),
                "stroke-linejoin": "round",
                "stroke": this.config.stroke,
                "stroke-width": this.config.strokeWidth
            })
        ].concat(this._getArrowLine()));
    };
    Line.prototype.getBox = function () {
        var conf = __assign({}, this.config);
        var max = conf.points.reduce(function (m, p) {
            m.x = Math.max(m.x, p.x);
            m.y = Math.max(m.y, p.y);
            return m;
        }, { x: 0, y: 0 });
        var width = max.x - conf.x;
        var height = max.y - conf.y;
        var left = conf.x;
        var right = left + width;
        var top = conf.y;
        var bottom = top + height;
        return { left: left, right: right, top: top, bottom: bottom };
    };
    Line.prototype._getType = function () {
        if (this.config.strokeType) {
            this.config.type = this.config.strokeType;
        }
        if (this.config.type) {
            switch (this.config.type) {
                case "line":
                    return "";
                case "dash":
                    return "5, 5";
                default:
                    return "";
            }
        }
    };
    Line.prototype._getPoints = function () {
        return this._getStringPoints();
    };
    Line.prototype._getStringPoints = function () {
        this.config.width = Math.abs(this.config.points[this.config.points.length - 1].x - this.config.points[0].x);
        this.config.height = Math.abs(this.config.points[this.config.points.length - 1].y - this.config.points[0].y);
        this.config.x = this.config.points[0].x;
        this.config.y = this.config.points[0].y;
        return "M " + this.config.x + "," + this.config.y + this.config.points.map(function (a) {
            if (a.x1 && a.y1) {
                return "Q" + a.x1 + "," + a.y1 + " " + a.x + "," + a.y;
            }
            else {
                return "L " + a.x + "," + a.y;
            }
        }).join(" ");
    };
    Line.prototype._getArrowLine = function () {
        var p = this.config.points;
        var startArrow = this.config.backArrow;
        var endArrow = this.config.forwardArrow;
        if (startArrow || endArrow) {
            return [
                startArrow ? this._arrow(p[1], p[0]) : null,
                endArrow ? this._arrow(p[p.length - 2], p[p.length - 1]) : null
            ];
        }
    };
    Line.prototype._arrow = function (from, to) {
        var vx = from.x !== to.x;
        var rtl = (vx ? from.x < to.x : from.y < to.y) ? 1 : -1;
        var center = {
            x: to.x - (vx ? rtl : 0),
            y: to.y - (vx ? 0 : rtl)
        };
        var w = 7;
        var h = 5;
        var r1x = to.x - (vx ? w * rtl : h * rtl);
        var r1y = to.y - (vx ? h : w * rtl);
        var r2x = to.x + (vx ? -w * rtl : h * rtl);
        var r2y = to.y - (vx ? -h : w * rtl);
        return dom_1.sv("path", {
            "d": "M" + r1x + "," + r1y + " L" + center.x + "," + center.y + " L" + r2x + "," + r2y + " Z",
            "class": "dhx_diagram_arrow",
            "shape-rendering": "auto",
            "stroke": this.config.stroke,
            "fill": this.config.stroke
        });
    };
    return Line;
}(Base_1.BaseShape));
exports.Line = Line;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var DiagramCard_1 = __webpack_require__(10);
var DiagramImgCard = /** @class */ (function (_super) {
    __extends(DiagramImgCard, _super);
    function DiagramImgCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DiagramImgCard.prototype.getMetaInfo = function () {
        return [
            { id: "title", label: "Title", type: "text" },
            { id: "text", label: "Text", type: "text" },
            { id: "img", label: "Image", type: "image" }
        ];
    };
    DiagramImgCard.prototype.setDefaults = function (obj) {
        obj.width = obj.width || 210;
        obj.height = obj.height || 90;
        return obj;
    };
    DiagramImgCard.prototype.getCss = function () {
        return "dhx_diagram_image " + _super.prototype.getCss.call(this);
    };
    DiagramImgCard.prototype.text = function () {
        var conf = this.config;
        return [
            dom_1.el("div", {
                class: "dhx_content_img",
                style: "background-image:url(" + (conf.img || "") + ");background-color:" + conf.color + ";"
            }),
            dom_1.el("div", {
                class: "dhx_content_title"
            }, [conf.title || null]),
            dom_1.el("div", {
                class: "dhx_content_text " + (conf.title ? "" : "dhx_content_text-alone"),
            }, [conf.text || null])
        ];
    };
    return DiagramImgCard;
}(DiagramCard_1.DiagramCard));
exports.DiagramImgCard = DiagramImgCard;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var DiagramCard_1 = __webpack_require__(10);
var templates_1 = __webpack_require__(12);
var DiagramSvgCard = /** @class */ (function (_super) {
    __extends(DiagramSvgCard, _super);
    function DiagramSvgCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DiagramSvgCard.prototype.toSVG = function () {
        var conf = this.config;
        var center = this.getCenter();
        var borderColor = conf.$selected ? conf.color : "#E4E4E4";
        var coords = this.getCoords(conf);
        return dom_1.sv("g", {
            transform: "translate(" + coords.x + "," + coords.y + ") rotate(" + (conf.angle || 0) + "," + center.x + "," + center.y + ")",
            class: this.getCss(),
            dhx_id: conf.id
        }, [
            dom_1.sv("rect", {
                "class": "dhx_item_shape",
                "id": conf.id,
                "height": conf.height,
                "width": conf.width,
                "rx": 1,
                "ry": 1,
                "stroke": borderColor,
                "stroke-width": 1
            }),
            dom_1.sv("text", {
                "y": conf.height / 2,
                "dy": "-5",
                "x": conf.width / 2,
                "text-anchor": "middle"
            }, [
                conf.title ? dom_1.sv("tspan", {
                    class: "dhx_content_title"
                }, [conf.title || ""]) : null,
                dom_1.sv("tspan", {
                    class: "dhx_content_text",
                    x: conf.width / 2,
                    dy: conf.title ? "1.5em" : ".5em"
                }, [conf.text || ""])
            ]),
            templates_1.getHeaderTpl(conf),
            templates_1.getCircleTpl(conf)
        ]);
    };
    DiagramSvgCard.prototype.getMetaInfo = function () {
        return [
            { id: "title", label: "Title", type: "text" },
            { id: "text", label: "Text", type: "text" }
        ];
    };
    DiagramSvgCard.prototype.getCss = function () {
        return "dhx_diagram_svg-card " + (_super.prototype.getCss.call(this) || "");
    };
    return DiagramSvgCard;
}(DiagramCard_1.DiagramCard));
exports.DiagramSvgCard = DiagramSvgCard;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// /* tslint:disable:no-unused-variable */
var dom_1 = __webpack_require__(0);
var Base_1 = __webpack_require__(8);
var FlowShape = /** @class */ (function (_super) {
    __extends(FlowShape, _super);
    function FlowShape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlowShape.prototype.getMetaInfo = function () {
        return [
            { id: "fill", type: "color", label: "Fill", hint: "Top line", value: "#FFDDFF" },
            { id: "text", label: "Content", type: "text" },
            { id: "strokeProps", type: "stroke", label: "Stroke" },
            { id: "textProps", type: "textProps", label: "Text" }
        ];
    };
    FlowShape.prototype.toSVG = function () {
        if (this.config.strokeType) {
            if (this.config.strokeType === "dash") {
                this.config.strokeDash = "5,5";
            }
            if (this.config.strokeType === "none") {
                this.config.stroke = "none";
            }
        }
        var conf = this.config;
        var center = this.getCenter();
        var coords = this.getCoords(conf);
        return dom_1.sv("g", {
            _key: conf.id,
            transform: "translate(" + coords.x + "," + coords.y + ") rotate(" + (conf.angle || 0) + "," + center.x + "," + center.y + ")",
            class: "dhx_diagram_flow_item " + this.getCss(),
            dhx_id: conf.id
        }, [
            this._shapeLine(),
            this._getExtraLines(),
            this._getText()
        ]);
    };
    FlowShape.prototype.setDefaults = function (obj) {
        // [todo]
        var circularShapes = ["circle", "or", "junction"];
        var isCircular = circularShapes.indexOf(obj.type) >= 0;
        obj.width = obj.width || (isCircular ? 90 : 140);
        obj.height = obj.height || 90;
        obj.stroke = obj.stroke || "#DEDEDE";
        obj.extraLinesStroke = obj.extraLinesStroke || "#FFF";
        obj.fill = obj.fill || "#DEDEDE";
        obj.strokeWidth = obj.strokeWidth || 1;
        obj.fontColor = obj.fontColor || "#4C4C4C";
        obj.fontSize = obj.fontSize || 14;
        obj.textAlign = obj.textAlign || "center";
        obj.lineHeight = obj.lineHeight || 14;
        obj.fontStyle = obj.fontStyle || "normal";
        obj.textVerticalAlign = obj.textVerticalAlign || "center";
        return obj;
    };
    FlowShape.prototype._shapeLine = function () {
        return dom_1.sv("path", {
            "d": this._getPoints(),
            "class": "dhx_diagram_flow_shape dhx_item_shape ",
            "stroke": this.config.stroke,
            "fill": this.config.fill,
            "stroke-width": this.config.strokeWidth,
            "stroke-dasharray": this.config.strokeDash || ""
        });
    };
    FlowShape.prototype._getPoints = function () {
        var render = exports.renders[this.config.type];
        return render(this.config.width, this.config.height, Math.round(this.config.width / 12));
    };
    FlowShape.prototype._getExtraLines = function () {
        if (exports.extraLines[this.config.type]) {
            return exports.extraLines[this.config.type](this.config.width, this.config.height, Math.round(this.config.width / 12), this.config);
        }
    };
    FlowShape.prototype._getText = function () {
        var conf = this.config;
        var align = conf.textVerticalAlign;
        if (conf.text) {
            var a = conf.text.split(/\r?\n/).filter(function (el) { return el.trim(); });
            var w_1 = a.length === 1 ? 0.35 : 0.6;
            var horizontal_1 = {
                left: 10,
                center: conf.width / 2,
                right: conf.width - 10
            };
            var spans = a.map(function (el) {
                var span = dom_1.sv("tspan", {
                    class: "dhx_content_text",
                    x: horizontal_1[conf.textAlign],
                    dy: w_1 + "em"
                }, el.trim());
                w_1 = 1.2 * (conf.lineHeight / 14);
                return span;
            });
            var veritcal = {
                top: 10,
                center: conf.height / (a.length + 1),
                bottom: conf.height - (a.length) * 17
            };
            var anchor = {
                left: "start",
                center: "middle",
                right: "end"
            };
            return dom_1.sv("text", {
                "y": veritcal[align],
                "x": conf.width / 2,
                "text-anchor": anchor[conf.textAlign],
                "font-size": conf.fontSize,
                "font-style": conf.fontStyle,
                "font-weight": conf.fontWeight,
                "fill": conf.fontColor
            }, spans);
        }
    };
    return FlowShape;
}(Base_1.BaseShape));
exports.FlowShape = FlowShape;
exports.extraLines = {
    database: function (width, _height, part, config) {
        return dom_1.sv("path", {
            d: "M 0 " + part + " A " + width / 2 + "," + part + " 0 1 0 " + width + "," + part,
            fill: "none",
            stroke: config.extraLinesStroke,
            class: "dhx_diagram_extra_lines"
        });
    },
    internal: function (width, height, part, config) {
        return dom_1.sv("path", {
            d: "M " + part + " 0 V " + height + " M 0 " + part + " H " + width,
            stroke: config.extraLinesStroke,
            class: "dhx_diagram_extra_lines"
        });
    },
    offline: function (width, height, part, config) {
        var hypotenuse = Math.sqrt(Math.pow((width / 2), 2) + Math.pow(height, 2));
        var coef = height / hypotenuse;
        var cathet = Math.sqrt(Math.pow((part / coef), 2) - Math.pow(part, 2));
        return dom_1.sv("path", {
            d: "M " + (width / 2 - cathet) + " " + (height - part) + " h " + 2 * cathet,
            stroke: config.extraLinesStroke,
            class: "dhx_diagram_extra_lines"
        });
    },
    subroutine: function (width, height, part, config) {
        return dom_1.sv("path", {
            d: "M " + part + " 0 V " + height + " M " + (width - part) + " 0 V " + height,
            stroke: config.extraLinesStroke,
            class: "dhx_diagram_extra_lines"
        });
    },
    or: function (width, height, _part, config) {
        return dom_1.sv("path", {
            d: "\n\t\t\t\tM" + (width - height) / 2 + " " + height / 2 + " " + (width - (width - height) / 2) + " " + height / 2 + "\n\t\t\t\tM" + width / 2 + " " + 0 + " " + width / 2 + " " + height,
            stroke: config.extraLinesStroke,
            class: "dhx_diagram_extra_lines"
        });
    },
    junction: function (width, height, _part, config) {
        return dom_1.sv("path", {
            d: "\n\t\t\tM " + (width / 2 - height * Math.SQRT2 / 4) + " " + (height / 2 - height * Math.SQRT2 / 4) + " L " + (width / 2 + height * Math.SQRT2 / 4) + " " + (height / 2 + height * Math.SQRT2 / 4) + "\n\t\t\tM " + (width / 2 - height * Math.SQRT2 / 4) + " " + (height / 2 + height * Math.SQRT2 / 4) + " L " + (width / 2 + height * Math.SQRT2 / 4) + " " + (height / 2 - height * Math.SQRT2 / 4),
            stroke: config.extraLinesStroke,
            class: "dhx_diagram_extra_lines"
        });
    },
    roll: function (width, height, _part, config) {
        return dom_1.sv("path", {
            "d": "M " + width / 2 + " " + height + " H " + width,
            "stroke": config.stroke,
            "stroke-width": "2px",
            "class": "dhx_item_shape "
        });
    }
};
exports.renders = {
    circle: circle,
    rectangle: rectangle,
    triangle: triangle,
    start: start,
    end: start,
    process: rectangle,
    output: output,
    decision: decision,
    display: display,
    document: document,
    data: data,
    database: database,
    internal: rectangle,
    offline: storage,
    delay: delay,
    page: page,
    input: input,
    operation: operation,
    punchcard: punchcard,
    subroutine: rectangle,
    comment: comment,
    storage: storage,
    extract: extract,
    collate: collate,
    or: circle,
    junction: circle,
    keyring: keyring,
    tape: tape,
    preparation: preparation,
    endpoint: endpoint,
    roll: circle
};
function display(width, height) {
    return "\n\tM 0 " + height / 2 + " L " + width / 4 + " 0 H " + width * 3 / 4 + "\n\tA " + width / 4 + "," + height / 2 + " 0 1 1 " + width * 3 / 4 + "," + height + "\n\tH " + width / 4 + " Z";
}
function circle(width, height) {
    return "\n\tM " + width / 2 + " 0 A " + height / 2 + "," + height / 2 + " 0 1 0 " + width / 2 + "," + height + "\n\tA " + height / 2 + "," + height / 2 + " 0 1 0 " + width / 2 + ",0 Z";
}
function triangle(width, height) {
    return "M " + width / 2 + " 0 L" + width + " " + height + " L 0 " + height + " z";
}
function document(width, height) {
    return "M0 " + height + " C\n\t" + width / 6 + " " + height * 10 / 9 + ",\n\t" + width / 3 + " " + height * 10 / 9 + ",\n\t" + width / 2 + " " + height + " S\n\t" + width * 5 / 6 + " " + height * 8 / 9 + ",\n\t" + width + " " + height + "\n\tV 0 H 0 Z";
}
function data(width, height, part) {
    return "M " + part + " 0 Q\n\t" + -part + " " + height / 2 + ",\n\t" + part + " " + height + " H " + width + " Q\n\t" + (width - part * 2) + " " + height / 2 + ",\n\t" + width + " 0 Z";
}
function database(width, height, part) {
    return "M 0 " + part + " A " + width / 2 + "," + part + " 0 1 0 " + width + "," + part + "\n\tA " + width / 2 + "," + part + " 0 1 0 0," + part + "\n\tV " + height + " H " + width + " V " + part;
}
function delay(width, height) {
    return "\n\tM 0 0 H " + width * 3 / 4 + "\n\tA " + width / 4 + "," + height / 2 + " 0 1 1 " + width * 3 / 4 + "," + height + "\n\tH 0 Z";
}
function output(width, height, part) {
    return "\n\tM " + part * 2 + ",0\n\t" + width + ",0\n\t" + (width - part * 2) + "," + height + "\n\t0," + height + " Z";
}
function page(width, height) {
    return "\n\tM 0,0\n\t" + width + ",0\n\t" + width + "," + height / 2 + "\n\t" + width / 2 + "," + height + "\n\t0," + height / 2 + " Z";
}
function input(width, height) {
    return "\n\tM 0," + height / 3 + "\n\t" + width + "," + 0 + "\n\t" + width + "," + height + "\n\t0," + height + " Z";
}
function operation(width, height) {
    return "\n\tM 0,0\n\t" + width + ",0\n\t" + width * 3 / 4 + "," + height + "\n\t" + width / 4 + "," + height + " Z";
}
function punchcard(width, height) {
    return "\n\tM 0," + height / 4 + "\n\t" + width / 4 + ",0\n\t" + width + ",0\n\t" + width + "," + height + "\n\t0," + height + " Z";
}
function comment(width, height) {
    var w = 4;
    return "M " + width + " 0 H 0 V " + height + " H" + width + " V" + (height - w) + " H" + w + " V" + w + " H" + width;
}
function storage(width, height) {
    return "\n\tM 0,0\n\t" + width + ",0\n\t" + width / 2 + "," + height + " Z";
}
function extract(width, height) {
    return "\n\tM 0," + height + "\n\t" + width + "," + height + "\n\t" + width / 2 + ",0 Z";
}
function decision(width, height) {
    return "M 0 " + height / 2 + " L " + width / 2 + " 0 L " + width + " " + height / 2 + " L " + width / 2 + " " + height + " Z";
}
function collate(width, height) {
    return "M " + width / 2 + " " + height / 2 + " L 0 0 H " + width + " L 0 " + height + " H " + width + " Z";
}
function keyring(width, height, part) {
    return "\n\tM " + part + " 0 A " + part + "," + height / 2 + " 0 1 0 " + part + "," + height + "\n\tH " + (width - part) + " A " + part + "," + height / 2 + " 0 1 0 " + (width - part) + ",0 H " + part + " Z";
}
function start(width, height) {
    return "\n\tM " + height / 2 + " 0 A " + height / 2 + "," + height / 2 + " 0 1 0 " + height / 2 + "," + height + "\n\tH " + (width - height / 2) + " A " + height / 2 + "," + height / 2 + " 0 1 0 " + (width - height / 2) + ",0 H " + height / 2 + " Z";
}
function rectangle(width, height) {
    return "M 0,0 L 0," + height + " L " + width + "," + height + " L " + width + ",0 Z";
}
function tape(width, height) {
    return "\n\tM0 " + height + " C\n\t" + width / 6 + " " + height * 10 / 9 + ",\n\t" + width / 3 + " " + height * 10 / 9 + ",\n\t" + width / 2 + " " + height + " S\n\t" + width * 5 / 6 + " " + height * 8 / 9 + ",\n\t" + width + " " + height + "\n\tV 0 C\n\t" + width * 5 / 6 + " " + -height / 9 + ",\n\t" + width * 2 / 3 + " " + -height / 9 + ",\n\t" + width / 2 + " 0 S\n\t" + width * 1 / 6 + " " + height / 9 + ",\n\t0 0 Z";
}
function preparation(width, height) {
    var w = 20;
    return "M 0," + height / 2 + " L" + w + " " + 0 + " L" + (width - w) + " 0 L" + width + " " + height / 2 + " L" + (width - w) + " " + height + " L" + w + " " + height;
}
function endpoint(width, height) {
    return "M0 " + height / 2 + "  L" + width / 2 + " " + 0 + " L " + width / 2 + " " + height + " z";
}


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var Base_1 = __webpack_require__(8);
var TextShape = /** @class */ (function (_super) {
    __extends(TextShape, _super);
    function TextShape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextShape.prototype.toSVG = function () {
        var conf = this.config;
        var coords = this.getCoords(conf);
        return dom_1.sv("g", {
            "_key": conf.id,
            "transform": "translate(" + coords.x + "," + coords.y + ") ",
            "text-anchor": "middle",
            "class": "dhx_item_shape dhx_diagram_flow_item " + this.getCss(),
            "dhx_id": conf.id
        }, [
            this._getText()
        ]);
    };
    TextShape.prototype.getMetaInfo = function () {
        return [
            { id: "text", label: "Content", type: "text" },
        ];
    };
    TextShape.prototype.canResize = function () {
        return false;
    };
    TextShape.prototype.setDefaults = function (obj) {
        obj.width = 0;
        obj.height = 0;
        obj.fontColor = "#4C4C4C";
        obj.fontSize = 14;
        obj.textAlign = "center";
        obj.lineHeight = 14;
        obj.fontStyle = "normal";
        obj.textVerticalAlign = "center";
        return obj;
    };
    TextShape.prototype._getText = function () {
        var conf = this.config;
        if (conf.text) {
            var a = conf.text.split(/\r?\n/).filter(function (el) { return el.trim(); });
            var w_1 = a.length === 1 ? 0 : 0.6;
            var spans = a.map(function (el) {
                var span = dom_1.sv("tspan", {
                    x: 0,
                    dy: w_1 + "em"
                }, el.trim());
                w_1 = 1.2;
                return span;
            });
            return dom_1.sv("text", {
                "y": conf.height,
                "x": conf.width,
                "text-anchor": "middle",
                "class": "dhx_item_text",
                "font-size": conf.fontSize,
                "font-style": conf.fontStyle,
                "fill": conf.fontColor
            }, spans);
        }
    };
    return TextShape;
}(Base_1.BaseShape));
exports.TextShape = TextShape;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts_data_1 = __webpack_require__(33);
var types_1 = __webpack_require__(6);
var ShapesCollection = /** @class */ (function (_super) {
    __extends(ShapesCollection, _super);
    function ShapesCollection(config, events) {
        var _this = _super.call(this, config, events) || this;
        _this._roots = [];
        _this._orgMode = config.type === "org";
        _this.events.on(types_1.DataEvents.change, function (_id, mode, obj) {
            if (mode === "remove") {
                _this._removeNested(obj);
                _this._removeCore(obj.$parent); // [FIXME] multiple parents case is not supported
            }
            if (mode === "add" && obj.parent) {
                _this._addCore({ from: obj.parent, to: obj.id }, -1);
            }
            _this._mark_chains();
        });
        return _this;
    }
    ShapesCollection.prototype.getNearId = function (id) {
        var item = this._pull[id];
        if (!item) {
            if (!this._order.length) {
                return "";
            }
            return this._order[0].id;
        }
        var test = item;
        while (this._orgMode && test.$parent) {
            test = this._pull[this._pull[test.$parent].from];
            if (test.open === false) {
                return test.id;
            }
        }
        return item.id;
    };
    ShapesCollection.prototype.mapVisible = function (handler) {
        var _this = this;
        var result = [];
        if (this._orgMode) {
            var roots = this.getRoots();
            for (var i = 0; i < roots.length; i++) {
                this._eachBranch(this.getItem(roots[i]), handler, result);
            }
        }
        else {
            this.map(function (obj) {
                if (obj.hidden) {
                    return;
                }
                if (obj.$shape.isConnector()) {
                    var from = _this.getItem(obj.from) || {};
                    var to = _this.getItem(obj.to) || {};
                    if (from.hidden || to.hidden) {
                        return;
                    }
                }
                result.push(handler(obj));
            });
        }
        return result;
    };
    ShapesCollection.prototype.getRoots = function () {
        return this._roots;
    };
    ShapesCollection.prototype._removeNested = function (obj) {
        var kids = obj.$kids;
        if (kids) {
            for (var i = 0; i < kids.length; i++) {
                if (this._orgMode) {
                    this._removeNested(this.getItem(kids[i][1]));
                    this._removeCore(kids[i][1]);
                }
                this._removeCore(kids[i][0]);
            }
        }
    };
    ShapesCollection.prototype._eachBranch = function (item, handler, stack) {
        if (item.hidden) {
            return;
        }
        stack.push(handler(item)); // master item
        if (item.open !== false) {
            var kids = item.$kids;
            if (kids) {
                for (var i = 0; i < kids.length; i++) {
                    var child = this.getItem(kids[i][1]);
                    if (!child.hidden) {
                        stack.push(handler(this.getItem(kids[i][0]))); // link
                        this._eachBranch(child, handler, stack);
                    }
                }
            }
        }
    };
    ShapesCollection.prototype._parse_data = function (data) {
        var links = [];
        var linksInData = false;
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            if (obj.parent && !linksInData) {
                links.push({ from: obj.parent, to: obj.id });
            }
            if (obj.from) {
                linksInData = true;
            }
        }
        if (links.length && !linksInData) {
            data = data.concat(links);
        }
        _super.prototype._parse_data.call(this, data);
    };
    ShapesCollection.prototype._mark_chains = function () {
        var _this = this;
        this._roots = [];
        var hash = {};
        var parents = {};
        this.map(function (obj) {
            if (obj.$shape.isConnector()) {
                var link = obj;
                parents[link.to] = link.id;
                var kids = hash[link.from] = hash[link.from] || [];
                kids.push([obj.id, link.to]);
            }
        });
        this.map(function (obj) {
            if (!obj.$shape.isConnector()) {
                obj.$parent = parents[obj.id];
                obj.$kids = hash[obj.id];
                if (!obj.$parent) {
                    _this._roots.push(obj.id);
                }
            }
        });
    };
    return ShapesCollection;
}(ts_data_1.DataCollection));
exports.ShapesCollection = ShapesCollection;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1));
__export(__webpack_require__(13));
__export(__webpack_require__(16));
__export(__webpack_require__(36));
__export(__webpack_require__(9));
__export(__webpack_require__(2));
__export(__webpack_require__(14));
__export(__webpack_require__(15));
__export(__webpack_require__(38));


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(2);
var Loader = /** @class */ (function () {
    function Loader(parent, changes) {
        this._parent = parent;
        this._changes = changes; // todo: [dirty] mutation
    }
    Loader.prototype.load = function (url, driver) {
        var _this = this;
        return this._parent.loadData = url.load().then(function (data) {
            _this._parent.removeAll();
            _this.parse(data, driver);
        });
    };
    Loader.prototype.parse = function (data, driver) {
        if (driver === void 0) { driver = "json"; }
        driver = helpers_1.toDataDriver(driver);
        data = driver.toJsonArray(data);
        this._parent.$parse(data);
    };
    Loader.prototype.save = function (url) {
        var _this = this;
        var _loop_1 = function (el) {
            if (el.saving || el.pending) {
                helpers_1.dhxWarning("item is saving");
            }
            else {
                var prevEl_1 = this_1._findPrevState(el.id);
                if (prevEl_1 && prevEl_1.saving) {
                    var pending = new Promise(function (res, rej) {
                        prevEl_1.promise.then(function () {
                            el.pending = false;
                            res(_this._setPromise(el, url));
                        }).catch(function (err) {
                            _this._removeFromOrder(prevEl_1);
                            _this._setPromise(el, url);
                            helpers_1.dhxWarning(err);
                            rej(err);
                        });
                    });
                    this_1._addToChain(pending);
                    el.pending = true;
                }
                else {
                    this_1._setPromise(el, url);
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this._changes.order; _i < _a.length; _i++) {
            var el = _a[_i];
            _loop_1(el);
        }
        this._parent.saveData.then(function () {
            _this._saving = false;
        });
    };
    Loader.prototype._setPromise = function (el, url) {
        var _this = this;
        el.promise = url.save(el.obj, el.status);
        el.promise.then(function () {
            _this._removeFromOrder(el);
        }).catch(function (err) {
            el.saving = false;
            el.error = true;
            helpers_1.dhxError(err);
        });
        el.saving = true;
        this._saving = true;
        this._addToChain(el.promise);
        return el.promise;
    };
    Loader.prototype._addToChain = function (promise) {
        // tslint:disable-next-line:prefer-conditional-expression
        if (this._parent.saveData && this._saving) {
            this._parent.saveData = this._parent.saveData.then(function () { return promise; });
        }
        else {
            this._parent.saveData = promise;
        }
    };
    Loader.prototype._findPrevState = function (id) {
        for (var _i = 0, _a = this._changes.order; _i < _a.length; _i++) {
            var el = _a[_i];
            if (el.id === id) {
                return el;
            }
        }
        return null;
    };
    Loader.prototype._removeFromOrder = function (el) {
        this._changes.order = this._changes.order.filter(function (item) { return !helpers_1.isEqualObj(item, el); });
    };
    return Loader;
}());
exports.Loader = Loader;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(2);
var Sort = /** @class */ (function () {
    function Sort() {
    }
    Sort.prototype.sort = function (array, by) {
        var _this = this;
        if (by.rule && typeof by.rule === "function") {
            this._sort(array, by);
        }
        else if (by.by) {
            by.rule = function (a, b) {
                var aa = _this._checkVal(by.as, a[by.by]);
                var bb = _this._checkVal(by.as, b[by.by]);
                return helpers_1.naturalCompare(aa.toString(), bb.toString()); // didnt work with numbers
            };
            this._sort(array, by);
        }
    };
    Sort.prototype._checkVal = function (method, val) {
        return method ? method.call(this, val) : val;
    };
    Sort.prototype._sort = function (arr, conf) {
        var _this = this;
        var dir = {
            asc: 1,
            desc: -1
        };
        return arr.sort(function (a, b) {
            return conf.rule.call(_this, a, b) * (dir[conf.dir] || dir.asc);
        });
    };
    return Sort;
}());
exports.Sort = Sort;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = __webpack_require__(5);
var types_1 = __webpack_require__(7);
var CollectionStore_1 = __webpack_require__(37);
var treecollection_1 = __webpack_require__(16);
var types_2 = __webpack_require__(1);
var DropPosition;
(function (DropPosition) {
    DropPosition[DropPosition["top"] = 0] = "top";
    DropPosition[DropPosition["bot"] = 1] = "bot";
    DropPosition[DropPosition["in"] = 2] = "in";
})(DropPosition || (DropPosition = {}));
function getParentElement(target) {
    if (target instanceof Event) {
        target = target.target;
    }
    while (target && target.getAttribute) {
        var id = target.getAttribute("dhx_id");
        if (id) {
            return target;
        }
        target = target.parentNode;
    }
}
function getPosition(ev) {
    var y = ev.y;
    var element = getParentElement(ev); // may be use domvm refs
    if (!element) {
        return null;
    }
    var treeLine = element.childNodes[0];
    var _a = treeLine.getBoundingClientRect(), top = _a.top, height = _a.height;
    return (y - top) / height;
}
function dragEventContent(item) {
    var ghost = document.createElement("div");
    ghost.textContent = item.value || item.text;
    ghost.className = "drag-ghost"; // need pointer-events: none
    return ghost;
}
var DragManager = /** @class */ (function () {
    function DragManager() {
        var _this = this;
        this._transferData = {};
        this._canMove = true;
        this._ghostTopPadding = -17;
        document.addEventListener("mousemove", function (e) { return _this._onMouseMove(e); });
        document.addEventListener("mouseup", function () { return _this._onMouseUp(); });
    }
    DragManager.prototype.setItem = function (id, item, config) {
        // const collection = document.querySelector(`[dhx_collection_id=${id}]`); // use it for add onmousedown here
        CollectionStore_1.collectionStore.setItem(id, item, config);
    };
    DragManager.prototype.onMouseDown = function (e) {
        if (e.which !== 1) {
            return;
        }
        var id = html_1.locate(e, "dhx_id");
        var targetId = html_1.locate(e, "dhx_collection_id");
        if (id && targetId) {
            this._transferData.x = e.x;
            this._transferData.y = e.y;
            this._transferData.targetId = targetId;
            this._transferData.id = id;
        }
    };
    DragManager.prototype._onMouseMove = function (e) {
        if (!this._transferData.id) {
            return;
        }
        var pageX = e.pageX, pageY = e.pageY;
        if (!this._transferData.ghost) {
            if (Math.abs(this._transferData.x - pageX) < 3 && Math.abs(this._transferData.y - pageY) < 3) {
                return;
            }
            else {
                var ghost = this._onDragStart(this._transferData.id, this._transferData.targetId);
                if (!ghost) {
                    this._endDrop();
                    return;
                }
                else {
                    this._transferData.ghost = ghost;
                    document.body.appendChild(this._transferData.ghost);
                }
            }
        }
        this._moveGhost(pageX, pageY);
        this._onDrag(e);
    };
    DragManager.prototype._onMouseUp = function () {
        if (!this._transferData.x) {
            return;
        }
        if (this._transferData.ghost) {
            this._removeGhost();
            this._onDrop();
        }
        else {
            this._endDrop();
        }
    };
    DragManager.prototype._moveGhost = function (x, y) {
        if (this._transferData.ghost) {
            var width = this._transferData.ghost.offsetWidth / 2;
            this._transferData.ghost.style.left = x - width + "px";
            this._transferData.ghost.style.top = y + this._ghostTopPadding + "px";
        }
    };
    DragManager.prototype._removeGhost = function () {
        document.body.removeChild(this._transferData.ghost);
    };
    DragManager.prototype._onDrop = function () {
        if (!this._canMove) {
            this._endDrop();
            return;
        }
        var target = CollectionStore_1.collectionStore.getItem(this._lastCollectionId);
        var config = CollectionStore_1.collectionStore.getItemConfig(this._lastCollectionId);
        if (!target || config.mode === types_2.DragMode.source) {
            this._endDrop();
            return;
        }
        var to = {
            id: this._lastId,
            target: target
        };
        var from = {
            id: this._transferData.id,
            target: this._transferData.target
        };
        if (from.target.events.fire(types_1.DragEvents.beforeDrop, [from, to])) {
            this._move(from, to);
            to.target.events.fire(types_1.DragEvents.dropComplete, [to.id, this._transferData.dropPosition]);
        }
        this._endDrop();
    };
    DragManager.prototype._onDragStart = function (id, targetId) {
        var target = CollectionStore_1.collectionStore.getItem(targetId);
        var config = CollectionStore_1.collectionStore.getItemConfig(targetId);
        if (config.dragMode === types_2.DragMode.target) {
            return null;
        }
        var item = target.data.getItem(id);
        target.events.fire(types_1.DragEvents.dragStart); // we need it for cancel selection
        var ghost = dragEventContent(item);
        var ans = target.events.fire(types_1.DragEvents.beforeDrag, [item, ghost]);
        if (!ans || !id) {
            return null;
        }
        this._toggleTextSelection(true);
        this._transferData.target = target;
        this._transferData.dragConfig = config;
        return ghost;
    };
    DragManager.prototype._onDrag = function (e) {
        var x = e.x, y = e.y;
        var element = document.elementFromPoint(x, y);
        var id = html_1.locate(element, "dhx_id");
        if (!id) {
            this._cancelCanDrop();
            return;
        }
        var collectionId = html_1.locate(element, "dhx_collection_id");
        if (this._transferData.dragConfig.behaviour === types_2.DragBehaviour.complex) {
            var pos = getPosition(e);
            if (pos <= 0.25) {
                this._transferData.dropPosition = DropPosition.top;
            }
            else if (pos >= 0.75) {
                this._transferData.dropPosition = DropPosition.bot;
            }
            else {
                this._transferData.dropPosition = DropPosition.in;
            }
        }
        else if (this._lastId === id && this._lastCollectionId === collectionId) {
            return;
        }
        var eventArgs;
        var from;
        var targetTo;
        if ((!id || !collectionId) && this._canMove) {
            this._cancelCanDrop();
            return;
        }
        else {
            from = {
                id: this._transferData.id,
                target: this._transferData.target
            };
            targetTo = CollectionStore_1.collectionStore.getItem(collectionId);
            eventArgs = [from, {
                    id: id,
                    target: targetTo
                }];
            from.target.events.fire(types_1.DragEvents.dragOut, eventArgs);
        }
        if (collectionId !== this._transferData.targetId || !(from.target.data instanceof treecollection_1.TreeCollection) ||
            (from.target.data instanceof treecollection_1.TreeCollection && from.target.data.canCopy(from.id, id))) {
            // handle cursor or something, can drop
            this._cancelCanDrop(); // clear last
            this._lastId = id;
            this._lastCollectionId = collectionId;
            var canMove = from.target.events.fire(types_1.DragEvents.dragIn, eventArgs);
            if (canMove) {
                this._canDrop();
            }
        }
        else {
            this._cancelCanDrop();
        }
    };
    DragManager.prototype._move = function (from, to) {
        var fromData = from.target.data;
        var toData = to.target.data;
        var index = 0;
        var targetId = to.id;
        var behaviour = this._transferData.dragConfig.behaviour;
        switch (behaviour) {
            case types_2.DragBehaviour.child:
                break;
            case types_2.DragBehaviour.sibling:
                targetId = toData.getParent(targetId);
                index = toData.getIndex(to.id) + 1;
                break;
            case types_2.DragBehaviour.complex:
                var dropPosition = this._transferData.dropPosition;
                if (dropPosition === DropPosition.top) {
                    targetId = toData.getParent(targetId);
                    index = toData.getIndex(to.id);
                }
                else if (dropPosition === DropPosition.bot) {
                    targetId = toData.getParent(targetId);
                    index = toData.getIndex(to.id) + 1;
                }
                break;
        }
        fromData.move(from.id, index, toData, targetId);
    };
    DragManager.prototype._endDrop = function () {
        this._toggleTextSelection(false);
        if (this._transferData.target) {
            this._transferData.target.events.fire(types_1.DragEvents.dragEnd);
        }
        this._cancelCanDrop();
        this._canMove = true;
        this._transferData = {};
        this._lastId = null;
        this._lastCollectionId = null;
    };
    DragManager.prototype._cancelCanDrop = function () {
        this._canMove = false;
        var collection = CollectionStore_1.collectionStore.getItem(this._lastCollectionId);
        if (collection && this._lastId) {
            collection.events.fire(types_1.DragEvents.cancelDrop, [this._lastId]);
        }
    };
    DragManager.prototype._canDrop = function () {
        this._canMove = true;
        var collection = CollectionStore_1.collectionStore.getItem(this._lastCollectionId);
        if (collection && this._lastId) {
            collection.events.fire(types_1.DragEvents.canDrop, [this._lastId, this._transferData.dropPosition]);
        }
    };
    DragManager.prototype._toggleTextSelection = function (add) {
        if (add) {
            document.body.classList.add("dhx-no-select");
        }
        else {
            document.body.classList.remove("dhx-no-select");
        }
    };
    return DragManager;
}());
exports.dragManager = new DragManager();


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CollectionStore = /** @class */ (function () {
    function CollectionStore() {
        this._store = {};
    }
    CollectionStore.prototype.setItem = function (id, target, config) {
        this._store[id] = {
            target: target,
            config: config
        };
    };
    CollectionStore.prototype.getItem = function (id) {
        if (!this._store[id]) {
            return null;
        }
        return this._store[id].target;
    };
    CollectionStore.prototype.getItemConfig = function (id) {
        if (!this._store[id]) {
            return null;
        }
        return this._store[id].config;
    };
    return CollectionStore;
}());
exports.collectionStore = new CollectionStore();


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(3);
var types_1 = __webpack_require__(7);
var types_2 = __webpack_require__(1);
var Selection = /** @class */ (function () {
    function Selection(_config, data, events) {
        var _this = this;
        this.events = events || (new events_1.EventSystem());
        this._data = data;
        this._data.events.on(types_2.DataEvents.removeAll, function () {
            _this._selected = null;
        });
        this._data.events.on(types_2.DataEvents.change, function () {
            if (_this._selected) {
                var near = _this._data.getNearId(_this._selected);
                if (near !== _this._selected) {
                    _this._selected = null;
                    if (near) {
                        _this.add(near);
                    }
                }
            }
        });
    }
    Selection.prototype.getId = function () {
        return this._selected;
    };
    Selection.prototype.getItem = function () {
        if (this._selected) {
            return this._data.getItem(this._selected);
        }
        return null;
    };
    Selection.prototype.remove = function (id) {
        id = id || this._selected;
        if (!id) {
            return true;
        }
        if (this.events.fire(types_1.SelectionEvents.beforeUnSelect, [id])) {
            this._data.update(id, { $selected: false });
            this._selected = null;
            this.events.fire(types_1.SelectionEvents.afterUnSelect, [id]);
            return true;
        }
        return false;
    };
    Selection.prototype.add = function (id) {
        if (this._selected === id) {
            return;
        }
        this.remove();
        if (this.events.fire(types_1.SelectionEvents.beforeSelect, [id])) {
            this._selected = id;
            this._data.update(id, { $selected: true });
            this.events.fire(types_1.SelectionEvents.afterSelect, [id]);
        }
    };
    return Selection;
}());
exports.Selection = Selection;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var html_1 = __webpack_require__(5);
var types_1 = __webpack_require__(6);
var Toolbar = /** @class */ (function () {
    function Toolbar(events, icons) {
        var _this = this;
        this.config = {
            height: 50,
            iconWidth: 30,
            gap: 20,
            icons: icons
        };
        this.events = events;
        this._handlers = {
            onclick: html_1.eventHandler(function (ev) { return html_1.locate(ev); }, {
                dhx_icon: function (_ev, id) {
                    _this.events.fire(types_1.DiagramEvents.shapeIconClick, [id]);
                }
            })
        };
        this.events.on(types_1.DiagramEvents.shapeMouseDown, function (_id, _e, coords) {
            _this._pressCoords = coords;
        });
    }
    Toolbar.prototype.toSVG = function (item, size) {
        var config = this.config;
        var icons = this._getIcons(item, config.icons);
        var width = config.iconWidth * icons.length + config.gap;
        var pos = this._getCoords(item, width, config.height, size.scale);
        return dom_1.el("div", {
            class: "dhx_popup_toolbar",
            style: "\n\t\t\t\tmax-height:" + this.config.height + "px;\n\t\t\t\twidth:" + this.config.width + "px;\n\t\t\t\ttop:" + (pos.y - (size.top * size.scale)) + "px;\n\t\t\t\tleft:" + (pos.x - (size.left * size.scale)) + "px;",
            onclick: this._handlers.onclick
        }, [dom_1.el("div", {
                class: "dhx_item_toolbar"
            }, icons)]);
    };
    Toolbar.prototype._getIcons = function (item, icons) {
        var tags = [];
        for (var i = 0; i < icons.length; i++) {
            var obj = icons[i];
            if (!obj.check || obj.check(item)) {
                var css = obj.css ? obj.css(item) : "";
                var tag = {
                    _key: obj.id,
                    class: "dhx_icon " + css,
                    dhx_id: obj.id
                };
                var content = (typeof obj.content === "function") ? obj.content(item) : obj.content;
                if (typeof content === "string") {
                    tag[".innerHTML"] = content;
                    tags.push(dom_1.el("div", tag));
                }
                else {
                    tags.push(dom_1.el("div", tag, [content]));
                }
            }
        }
        return tags;
    };
    Toolbar.prototype._getCoords = function (target, width, height, scale) {
        if (target.$shape.isConnector()) {
            if (this._pressCoords) {
                return {
                    x: (this._pressCoords.x * scale) - 50,
                    y: (this._pressCoords.y * scale) - 50
                };
            }
            else {
                return {
                    x: target.points[0].x * scale,
                    y: (target.points[0].y * scale)
                };
            }
        }
        var box = target.$shape.getBox();
        var center = box.right / 2 + box.left / 2;
        var gap = 10;
        return {
            x: (center * scale) - width / 2,
            y: (box.top * scale) - height - gap
        };
    };
    return Toolbar;
}());
exports.Toolbar = Toolbar;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var en = {
    applyAll: "Apply all",
    resetChanges: "Reset Changes",
    editCard: "Edit Card",
    color: "Color",
    position: "Position",
    size: "Size"
};
exports.default = en;


/***/ })
/******/ ]);