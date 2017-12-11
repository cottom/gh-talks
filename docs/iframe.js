var GhTalk =
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 33);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseQuery = parseQuery;
exports.removeCodeInQuery = removeCodeInQuery;
function parseQuery() {
    var searchStr = location.search;
    var search = searchStr[0] === '?' ? searchStr.slice(1) : searchStr;
    return search.split('&').reduce(function (pre, cur) {
        var _a = cur.split('='),
            k = _a[0],
            v = _a[1];
        k && v && (pre[k] = v);
        return pre;
    }, {});
}
function removeCodeInQuery() {
    var query = parseQuery();
    delete query.code;
    return Object.keys(query).reduce(function (pre, k, index) {
        var v = query;
        return pre + (index && '&' || '') + (k + "=" + v);
    }, '');
}
var formatTime = exports.formatTime = function formatTime(dateStr) {
    var date = new Date(dateStr);
    var _a = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getMinutes()].map(function (i) {
        return +i < 10 ? "0" + i : i;
    }),
        year = _a[0],
        month = _a[1],
        day = _a[2],
        hours = _a[3],
        minutes = _a[4],
        seconds = _a[5];
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
};
var createElement = exports.createElement = function createElement(tag, renderProps, content, html) {
    var el = document.createElement(tag);
    var events = renderProps.events,
        attrs = renderProps.attrs;
};
var IFRAME_CLASS = 'gh-talk-iframe__main';
var removeIframeDialog = exports.removeIframeDialog = function removeIframeDialog() {
    var container = document.body.querySelector(IFRAME_CLASS);
    if (container) {
        var parent_1 = container.parentElement;
        if (parent_1) parent_1.removeChild(container);
    }
};
var openIframeDialog = exports.openIframeDialog = function openIframeDialog(url) {
    removeIframeDialog();
    var container = document.createElement('div');
    container.className = IFRAME_CLASS;
    container.innerHTML = "\n    <iframe src=\"" + url + "\"></iframe>\n  ";
    var iframe = container.querySelector('iframe');
    if (iframe) {
        iframe.onerror = removeIframeDialog;
    }
    document.body.appendChild(container);
};

/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _util = __webpack_require__(1);

var init = function init() {
    var searchQuery = (0, _util.parseQuery)();
    var code = searchQuery.code;
    if (window.parent === window) return;
    window.parent.postMessage({ type: 'AUTH', data: code }, '*');
}; // please require in your callback page

init();

/***/ })

/******/ });
//# sourceMappingURL=iframe.js.map