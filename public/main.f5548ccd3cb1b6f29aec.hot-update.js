/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdatepocasi"]("main",{

/***/ "./js/map.jsx":
/*!********************!*\
  !*** ./js/map.jsx ***!
  \********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! leaflet */ \"./node_modules/leaflet/dist/leaflet-src.js\");\n/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var leaflet_dist_leaflet_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! leaflet/dist/leaflet.css */ \"./node_modules/leaflet/dist/leaflet.css\");\n/* harmony import */ var jimp_browser_lib_jimp__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jimp/browser/lib/jimp */ \"./node_modules/jimp/browser/lib/jimp.js\");\n/* harmony import */ var jimp_browser_lib_jimp__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jimp_browser_lib_jimp__WEBPACK_IMPORTED_MODULE_3__);\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _iterableToArrayLimit(arr, i) { if (typeof Symbol === \"undefined\" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\n\n\n\n\nvar config = {\n  params: {\n    center: [49.20, 16.61],\n    zoomControl: false,\n    zoom: 8,\n    minZoom: 8,\n    scrollwheel: false,\n    infoControl: false,\n    attributionControl: false\n  },\n  tileLayer: {\n    uri: 'https://tile.freemap.sk/X/{z}/{x}/{y}.jpeg',\n    params: {\n      minZoom: 8,\n      maxZoom: 19,\n      id: '',\n      accessToken: ''\n    }\n  }\n};\n\nvar Map = function Map(props) {\n  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(),\n      _useState2 = _slicedToArray(_useState, 2),\n      map = _useState2[0],\n      setMap = _useState2[1];\n\n  var initMap = function initMap() {\n    var m = leaflet__WEBPACK_IMPORTED_MODULE_1___default().map(\"map\", config.params);\n    leaflet__WEBPACK_IMPORTED_MODULE_1___default().control.attribution({\n      prefix: 'Mapa © <a href=\"https://www.freemap.sk\">Freemap</a> Slovakia, dáta © prispievatelia <a href=\"https://osm.org/copyright\" target=\"_blank\">OpenStreetMap</a>',\n      position: 'bottomright'\n    }).addTo(m);\n    leaflet__WEBPACK_IMPORTED_MODULE_1___default().control.scale({\n      position: 'bottomright',\n      imperial: false\n    }).addTo(m);\n    leaflet__WEBPACK_IMPORTED_MODULE_1___default().control.zoom({\n      position: 'bottomright'\n    }).addTo(m);\n    var mapTiles = leaflet__WEBPACK_IMPORTED_MODULE_1___default().tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(m);\n    jimp_browser_lib_jimp__WEBPACK_IMPORTED_MODULE_3___default().read(\"/hranice.png\").then(function (img) {\n      return img.crop(340, 280, 800, 600, function (image) {\n        img.rotate(0, function (err, img) {\n          return img.getBase64Async('image/png').then(function (data) {\n            leaflet__WEBPACK_IMPORTED_MODULE_1___default().imageOverlay(data, [[51.5, 12], [46, 23]], {\n              opacity: 1\n            }).addTo(m);\n          });\n        });\n      });\n    });\n    setMap(m);\n  };\n\n  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {\n    initMap();\n  }, []);\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", {\n    id: \"map\"\n  });\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Map);\n\n//# sourceURL=webpack://pocasi/./js/map.jsx?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "e52decc1da86958f6f15"
/******/ 	})();
/******/ 	
/******/ }
);