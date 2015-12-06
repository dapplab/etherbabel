webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(195);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};
	
	exports.__esModule = true;

/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$create = __webpack_require__(210)["default"];
	
	var _Object$setPrototypeOf = __webpack_require__(212)["default"];
	
	exports["default"] = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }
	
	  subClass.prototype = _Object$create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};
	
	exports.__esModule = true;

/***/ },
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$assign = __webpack_require__(209)["default"];
	
	exports["default"] = _Object$assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};
	
	exports.__esModule = true;

/***/ },
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 16 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 17 */,
/* 18 */,
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(241)('wks')
	  , uid    = __webpack_require__(244)
	  , Symbol = __webpack_require__(77).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequire = __webpack_require__(215)['default'];
	
	exports.__esModule = true;
	
	var _squashClickEvent = __webpack_require__(388);
	
	exports.SquashClickEventMixin = _interopRequire(_squashClickEvent);
	
	var _expandedStateHandler = __webpack_require__(387);
	
	exports.ExpandedStateHandlerMixin = _interopRequire(_expandedStateHandler);

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var mixin = __webpack_require__(392);
	var assign = __webpack_require__(391);
	
	var mixinProto = mixin({
	  // lifecycle stuff is as you'd expect
	  componentDidMount: mixin.MANY,
	  componentWillMount: mixin.MANY,
	  componentWillReceiveProps: mixin.MANY,
	  shouldComponentUpdate: mixin.ONCE,
	  componentWillUpdate: mixin.MANY,
	  componentDidUpdate: mixin.MANY,
	  componentWillUnmount: mixin.MANY,
	  getChildContext: mixin.MANY_MERGED
	});
	
	function setDefaultProps(reactMixin) {
	  var getDefaultProps = reactMixin.getDefaultProps;
	
	  if (getDefaultProps) {
	    reactMixin.defaultProps = getDefaultProps();
	
	    delete reactMixin.getDefaultProps;
	  }
	}
	
	function setInitialState(reactMixin) {
	  var getInitialState = reactMixin.getInitialState;
	  var componentWillMount = reactMixin.componentWillMount;
	
	  function applyInitialState(instance) {
	    var state = instance.state || {};
	    assign(state, getInitialState.call(instance));
	    instance.state = state;
	  }
	
	  if (getInitialState) {
	    if (!componentWillMount) {
	      reactMixin.componentWillMount = function() {
	        applyInitialState(this);
	      };
	    } else {
	      reactMixin.componentWillMount = function() {
	        applyInitialState(this);
	        componentWillMount.call(this);
	      };
	    }
	
	    delete reactMixin.getInitialState;
	  }
	}
	
	function mixinClass(reactClass, reactMixin) {
	  setDefaultProps(reactMixin);
	  setInitialState(reactMixin);
	
	  var prototypeMethods = {};
	  var staticProps = {};
	
	  Object.keys(reactMixin).forEach(function(key) {
	    if (key === 'mixins') {
	      return; // Handled below to ensure proper order regardless of property iteration order
	    }
	    if (key === 'statics') {
	      return; // gets special handling
	    } else if (typeof reactMixin[key] === 'function') {
	      prototypeMethods[key] = reactMixin[key];
	    } else {
	      staticProps[key] = reactMixin[key];
	    }
	  });
	
	  mixinProto(reactClass.prototype, prototypeMethods);
	
	  var mergePropTypes = function(left, right, key) {
	    if (!left) return right;
	    if (!right) return left;
	
	    var result = {};
	    Object.keys(left).forEach(function(leftKey) {
	      if (!right[leftKey]) {
	        result[leftKey] = left[leftKey];
	      }
	    });
	
	    Object.keys(right).forEach(function(rightKey) {
	      if (left[rightKey]) {
	        result[rightKey] = function checkBothContextTypes() {
	          return right[rightKey].apply(this, arguments) && left[rightKey].apply(this, arguments);
	        };
	      } else {
	        result[rightKey] = right[rightKey];
	      }
	    });
	
	    return result;
	  };
	
	  mixin({
	    childContextTypes: mergePropTypes,
	    contextTypes: mergePropTypes,
	    propTypes: mixin.MANY_MERGED_LOOSE,
	    defaultProps: mixin.MANY_MERGED_LOOSE
	  })(reactClass, staticProps);
	
	  // statics is a special case because it merges directly onto the class
	  if (reactMixin.statics) {
	    Object.getOwnPropertyNames(reactMixin.statics).forEach(function(key) {
	      var left = reactClass[key];
	      var right = reactMixin.statics[key];
	
	      if (left !== undefined && right !== undefined) {
	        throw new TypeError('Cannot mixin statics because statics.' + key + ' and Component.' + key + ' are defined.');
	      }
	
	      reactClass[key] = left !== undefined ? left : right;
	    });
	  }
	
	  // If more mixins are defined, they need to run. This emulate's react's behavior.
	  // See behavior in code at:
	  // https://github.com/facebook/react/blob/41aa3496aa632634f650edbe10d617799922d265/src/isomorphic/classic/class/ReactClass.js#L468
	  // Note the .reverse(). In React, a fresh constructor is created, then all mixins are mixed in recursively,
	  // then the actual spec is mixed in last.
	  //
	  // With ES6 classes, the properties are already there, so smart-mixin mixes functions (a, b) -> b()a(), which is
	  // the opposite of how React does it. If we reverse this array, we basically do the whole logic in reverse,
	  // which makes the result the same. See the test for more.
	  // See also:
	  // https://github.com/facebook/react/blob/41aa3496aa632634f650edbe10d617799922d265/src/isomorphic/classic/class/ReactClass.js#L853
	  if (reactMixin.mixins) {
	    reactMixin.mixins.reverse().forEach(mixinClass.bind(null, reactClass));
	  }
	
	  return reactClass;
	}
	
	module.exports = (function() {
	  var reactMixin = mixinProto;
	
	  reactMixin.onClass = function(reactClass, mixin) {
	    return mixinClass(reactClass, mixin);
	  };
	
	  reactMixin.decorate = function(mixin) {
	    return function(reactClass) {
	      return reactMixin.onClass(reactClass, mixin);
	    };
	  };
	
	  return reactMixin;
	})();


/***/ },
/* 26 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(26);
	
	/**
	 * Converts `value` to an object if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}
	
	module.exports = toObject;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(69),
	    isLength = __webpack_require__(52),
	    isObjectLike = __webpack_require__(32);
	
	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};
	
	module.exports = isArray;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperty = __webpack_require__(115)["default"];
	
	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	
	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();
	
	exports.__esModule = true;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(77)
	  , core      = __webpack_require__(15)
	  , ctx       = __webpack_require__(74)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$getOwnPropertyDescriptor = __webpack_require__(211)["default"];
	
	exports["default"] = function get(_x, _x2, _x3) {
	  var _again = true;
	
	  _function: while (_again) {
	    var object = _x,
	        property = _x2,
	        receiver = _x3;
	    _again = false;
	    if (object === null) object = Function.prototype;
	
	    var desc = _Object$getOwnPropertyDescriptor(object, property);
	
	    if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);
	
	      if (parent === null) {
	        return undefined;
	      } else {
	        _x = parent;
	        _x2 = property;
	        _x3 = receiver;
	        _again = true;
	        desc = parent = undefined;
	        continue _function;
	      }
	    } else if ("value" in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;
	
	      if (getter === undefined) {
	        return undefined;
	      }
	
	      return getter.call(receiver);
	    }
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports["default"] = function (hex) {
	  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	  return result ? {
	    r: parseInt(result[1], 16),
	    g: parseInt(result[2], 16),
	    b: parseInt(result[3], 16)
	  } : null;
	};
	
	module.exports = exports["default"];

/***/ },
/* 52 */
/***/ function(module, exports) {

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = catchErrors;
	
	function catchErrors(_ref) {
	  var filename = _ref.filename;
	  var components = _ref.components;
	  var imports = _ref.imports;
	
	  var _imports = _slicedToArray(imports, 3);
	
	  var React = _imports[0];
	  var ErrorReporter = _imports[1];
	  var reporterOptions = _imports[2];
	
	  if (!React || !React.Component) {
	    throw new Error('imports[0] for react-transform-catch-errors does not look like React.');
	  }
	  if (typeof ErrorReporter !== 'function') {
	    throw new Error('imports[1] for react-transform-catch-errors does not look like a React component.');
	  }
	
	  return function wrapToCatchErrors(ReactClass, componentId) {
	    var originalRender = ReactClass.prototype.render;
	
	    ReactClass.prototype.render = function tryRender() {
	      try {
	        return originalRender.apply(this, arguments);
	      } catch (err) {
	        if (console.reportErrorsAsExceptions) {
	          // Stop react-native from triggering its own error handler
	          console.reportErrorsAsExceptions = false;
	          console.error(err);
	          // Reactivate it so other errors are still handled
	          console.reportErrorsAsExceptions = true;
	        } else {
	          console.error(err);
	        }
	
	        return React.createElement(ErrorReporter, _extends({
	          error: err,
	          filename: filename
	        }, reporterOptions));
	      }
	    };
	
	    return ReactClass;
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styleJs = __webpack_require__(360);
	
	var _styleJs2 = _interopRequireDefault(_styleJs);
	
	var _errorStackParser = __webpack_require__(361);
	
	var _errorStackParser2 = _interopRequireDefault(_errorStackParser);
	
	var _objectAssign = __webpack_require__(363);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	var _lib = __webpack_require__(359);
	
	var __$Getters__ = [];
	var __$Setters__ = [];
	var __$Resetters__ = [];
	
	function __GetDependency__(name) {
	  return __$Getters__[name]();
	}
	
	function __Rewire__(name, value) {
	  __$Setters__[name](value);
	}
	
	function __ResetDependency__(name) {
	  __$Resetters__[name]();
	}
	
	var __RewireAPI__ = {
	  '__GetDependency__': __GetDependency__,
	  '__get__': __GetDependency__,
	  '__Rewire__': __Rewire__,
	  '__set__': __Rewire__,
	  '__ResetDependency__': __ResetDependency__
	};
	var React = _react2['default'];
	var Component = _react.Component;
	var PropTypes = _react.PropTypes;
	
	__$Getters__['React'] = function () {
	  return React;
	};
	
	__$Setters__['React'] = function (value) {
	  React = value;
	};
	
	__$Resetters__['React'] = function () {
	  React = _react2['default'];
	};
	
	__$Getters__['Component'] = function () {
	  return Component;
	};
	
	__$Setters__['Component'] = function (value) {
	  Component = value;
	};
	
	__$Resetters__['Component'] = function () {
	  Component = _react.Component;
	};
	
	__$Getters__['PropTypes'] = function () {
	  return PropTypes;
	};
	
	__$Setters__['PropTypes'] = function (value) {
	  PropTypes = value;
	};
	
	__$Resetters__['PropTypes'] = function () {
	  PropTypes = _react.PropTypes;
	};
	
	var style = _styleJs2['default'];
	
	__$Getters__['style'] = function () {
	  return style;
	};
	
	__$Setters__['style'] = function (value) {
	  style = value;
	};
	
	__$Resetters__['style'] = function () {
	  style = _styleJs2['default'];
	};
	
	var ErrorStackParser = _errorStackParser2['default'];
	
	__$Getters__['ErrorStackParser'] = function () {
	  return ErrorStackParser;
	};
	
	__$Setters__['ErrorStackParser'] = function (value) {
	  ErrorStackParser = value;
	};
	
	__$Resetters__['ErrorStackParser'] = function () {
	  ErrorStackParser = _errorStackParser2['default'];
	};
	
	var assign = _objectAssign2['default'];
	
	__$Getters__['assign'] = function () {
	  return assign;
	};
	
	__$Setters__['assign'] = function (value) {
	  assign = value;
	};
	
	__$Resetters__['assign'] = function () {
	  assign = _objectAssign2['default'];
	};
	
	var isFilenameAbsolute = _lib.isFilenameAbsolute;
	var makeUrl = _lib.makeUrl;
	var makeLinkText = _lib.makeLinkText;
	
	__$Getters__['isFilenameAbsolute'] = function () {
	  return isFilenameAbsolute;
	};
	
	__$Setters__['isFilenameAbsolute'] = function (value) {
	  isFilenameAbsolute = value;
	};
	
	__$Resetters__['isFilenameAbsolute'] = function () {
	  isFilenameAbsolute = _lib.isFilenameAbsolute;
	};
	
	__$Getters__['makeUrl'] = function () {
	  return makeUrl;
	};
	
	__$Setters__['makeUrl'] = function (value) {
	  makeUrl = value;
	};
	
	__$Resetters__['makeUrl'] = function () {
	  makeUrl = _lib.makeUrl;
	};
	
	__$Getters__['makeLinkText'] = function () {
	  return makeLinkText;
	};
	
	__$Setters__['makeLinkText'] = function (value) {
	  makeLinkText = value;
	};
	
	__$Resetters__['makeLinkText'] = function () {
	  makeLinkText = _lib.makeLinkText;
	};
	
	var RedBox = (function (_Component) {
	  _inherits(RedBox, _Component);
	
	  function RedBox() {
	    _classCallCheck(this, RedBox);
	
	    _Component.apply(this, arguments);
	  }
	
	  RedBox.prototype.render = function render() {
	    var _props = this.props;
	    var error = _props.error;
	    var filename = _props.filename;
	    var editorScheme = _props.editorScheme;
	    var useLines = _props.useLines;
	    var useColumns = _props.useColumns;
	
	    var _assign = assign({}, style, this.props.style);
	
	    var redbox = _assign.redbox;
	    var message = _assign.message;
	    var stack = _assign.stack;
	    var frame = _assign.frame;
	    var file = _assign.file;
	    var linkToFile = _assign.linkToFile;
	
	    var frames = ErrorStackParser.parse(error).map(function (f, index) {
	      var text = undefined;
	      var url = undefined;
	
	      if (index === 0 && filename && !isFilenameAbsolute(f.fileName)) {
	        url = makeUrl(filename, editorScheme);
	        text = makeLinkText(filename);
	      } else {
	        var lines = useLines ? f.lineNumber : null;
	        var columns = useColumns ? f.columnNumber : null;
	        url = makeUrl(f.fileName, editorScheme, lines, columns);
	        text = makeLinkText(f.fileName, lines, columns);
	      }
	
	      return React.createElement(
	        'div',
	        { style: frame, key: index },
	        React.createElement(
	          'div',
	          null,
	          f.functionName
	        ),
	        React.createElement(
	          'div',
	          { style: file },
	          React.createElement(
	            'a',
	            { href: url, style: linkToFile },
	            text
	          )
	        )
	      );
	    });
	    return React.createElement(
	      'div',
	      { style: redbox },
	      React.createElement(
	        'div',
	        { style: message },
	        error.name,
	        ': ',
	        error.message
	      ),
	      React.createElement(
	        'div',
	        { style: stack },
	        frames
	      )
	    );
	  };
	
	  _createClass(RedBox, null, [{
	    key: 'propTypes',
	    value: {
	      error: PropTypes.instanceOf(Error).isRequired,
	      filename: PropTypes.string,
	      editorScheme: PropTypes.string,
	      useLines: PropTypes.bool,
	      useColumns: PropTypes.bool
	    },
	    enumerable: true
	  }, {
	    key: 'displayName',
	    value: 'RedBox',
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      useLines: true,
	      useColumns: true
	    },
	    enumerable: true
	  }]);
	
	  return RedBox;
	})(Component);
	
	var _defaultExport = RedBox;
	
	if (typeof _defaultExport === 'object' || typeof _defaultExport === 'function') {
	  Object.defineProperty(_defaultExport, '__Rewire__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__set__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__ResetDependency__', {
	    'value': __ResetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__GetDependency__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__get__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__RewireAPI__', {
	    'value': __RewireAPI__,
	    'enumberable': false
	  });
	}
	
	exports['default'] = _defaultExport;
	exports.__GetDependency__ = __GetDependency__;
	exports.__get__ = __GetDependency__;
	exports.__Rewire__ = __Rewire__;
	exports.__set__ = __Rewire__;
	exports.__ResetDependency__ = __ResetDependency__;
	exports.__RewireAPI__ = __RewireAPI__;
	module.exports = exports['default'];

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _objType = __webpack_require__(389);
	
	var _objType2 = _interopRequireDefault(_objType);
	
	var _JSONObjectNode = __webpack_require__(385);
	
	var _JSONObjectNode2 = _interopRequireDefault(_JSONObjectNode);
	
	var _JSONArrayNode = __webpack_require__(379);
	
	var _JSONArrayNode2 = _interopRequireDefault(_JSONArrayNode);
	
	var _JSONIterableNode = __webpack_require__(382);
	
	var _JSONIterableNode2 = _interopRequireDefault(_JSONIterableNode);
	
	var _JSONStringNode = __webpack_require__(386);
	
	var _JSONStringNode2 = _interopRequireDefault(_JSONStringNode);
	
	var _JSONNumberNode = __webpack_require__(384);
	
	var _JSONNumberNode2 = _interopRequireDefault(_JSONNumberNode);
	
	var _JSONBooleanNode = __webpack_require__(380);
	
	var _JSONBooleanNode2 = _interopRequireDefault(_JSONBooleanNode);
	
	var _JSONNullNode = __webpack_require__(383);
	
	var _JSONNullNode2 = _interopRequireDefault(_JSONNullNode);
	
	var _JSONDateNode = __webpack_require__(381);
	
	var _JSONDateNode2 = _interopRequireDefault(_JSONDateNode);
	
	exports['default'] = function (key, value, prevValue, theme, styles, getItemString) {
	  var initialExpanded = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];
	
	  var nodeType = _objType2['default'](value);
	  if (nodeType === 'Object') {
	    return _react2['default'].createElement(_JSONObjectNode2['default'], { data: value, previousData: prevValue, theme: theme, initialExpanded: initialExpanded, keyName: key, key: key, styles: styles, getItemString: getItemString });
	  } else if (nodeType === 'Array') {
	    return _react2['default'].createElement(_JSONArrayNode2['default'], { data: value, previousData: prevValue, theme: theme, initialExpanded: initialExpanded, keyName: key, key: key, styles: styles, getItemString: getItemString });
	  } else if (nodeType === 'Iterable') {
	    return _react2['default'].createElement(_JSONIterableNode2['default'], { data: value, previousData: prevValue, theme: theme, initialExpanded: initialExpanded, keyName: key, key: key, styles: styles, getItemString: getItemString });
	  } else if (nodeType === 'String') {
	    return _react2['default'].createElement(_JSONStringNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  } else if (nodeType === 'Number') {
	    return _react2['default'].createElement(_JSONNumberNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  } else if (nodeType === 'Boolean') {
	    return _react2['default'].createElement(_JSONBooleanNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  } else if (nodeType === 'Date') {
	    return _react2['default'].createElement(_JSONDateNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  } else if (nodeType === 'Null') {
	    return _react2['default'].createElement(_JSONNullNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  }
	  return false;
	};
	
	module.exports = exports['default'];

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(469);
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}
	
	module.exports = getNative;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(464),
	    isLength = __webpack_require__(52);
	
	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}
	
	module.exports = isArrayLike;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.createConstants = createConstants;
	exports.createReducer = createReducer;
	exports.createDevToolsWindow = createDevToolsWindow;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(138);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _reactRedux = __webpack_require__(43);
	
	var _containersDevToolsWindow = __webpack_require__(196);
	
	var _containersDevToolsWindow2 = _interopRequireDefault(_containersDevToolsWindow);
	
	function createConstants() {
	  for (var _len = arguments.length, constants = Array(_len), _key = 0; _key < _len; _key++) {
	    constants[_key] = arguments[_key];
	  }
	
	  return constants.reduce(function (acc, constant) {
	    acc[constant] = constant;
	    return acc;
	  }, {});
	}
	
	function createReducer(initialState, fnMap) {
	  return function (state, _ref) {
	    if (state === undefined) state = initialState;
	    var type = _ref.type;
	    var payload = _ref.payload;
	
	    var handler = fnMap[type];
	
	    return handler ? handler(state, payload) : state;
	  };
	}
	
	function createDevToolsWindow(store) {
	  var win = window.open(null, 'redux-devtools', // give it a name so it reuses the same window
	  'width=400,height=' + window.outerHeight + ',menubar=no,location=no,resizable=yes,scrollbars=no,status=no');
	
	  // reload in case it's reusing the same window with the old content
	  win.location.reload();
	
	  // wait a little bit for it to reload, then render
	  setTimeout(function () {
	    // Wait for the reload to prevent:
	    // "Uncaught Error: Invariant Violation: _registerComponent(...): Target container is not a DOM element."
	    win.document.write('<div id="react-devtools-root"></div>');
	    win.document.body.style.margin = '0';
	
	    _reactDom2['default'].render(_react2['default'].createElement(
	      _reactRedux.Provider,
	      { store: store },
	      _react2['default'].createElement(_containersDevToolsWindow2['default'], null)
	    ), win.document.getElementById('react-devtools-root'));
	  }, 10);
	}

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(224), __esModule: true };

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(79);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(227);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 75 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 77 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(16)
	  , createDesc = __webpack_require__(121);
	module.exports = __webpack_require__(230) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(75);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(242)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(119)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	var _extends = __webpack_require__(11)['default'];
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var styles = {
	  base: {
	    display: 'inline-block',
	    marginLeft: 0,
	    marginTop: 8,
	    marginRight: 5,
	    'float': 'left',
	    transition: '150ms',
	    WebkitTransition: '150ms',
	    MozTransition: '150ms',
	    borderLeft: '5px solid transparent',
	    borderRight: '5px solid transparent',
	    borderTopWidth: 5,
	    borderTopStyle: 'solid',
	    WebkitTransform: 'rotateZ(-90deg)',
	    MozTransform: 'rotateZ(-90deg)',
	    transform: 'rotateZ(-90deg)'
	  },
	  open: {
	    WebkitTransform: 'rotateZ(0deg)',
	    MozTransform: 'rotateZ(0deg)',
	    transform: 'rotateZ(0deg)'
	  }
	};
	
	var JSONArrow = (function (_React$Component) {
	  _inherits(JSONArrow, _React$Component);
	
	  function JSONArrow() {
	    _classCallCheck(this, JSONArrow);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONArrow.prototype.render = function render() {
	    var style = _extends({}, styles.base, {
	      borderTopColor: this.props.theme.base0D
	    });
	    if (this.props.open) {
	      style = _extends({}, style, styles.open);
	    }
	    style = _extends({}, style, this.props.style);
	    return _react2['default'].createElement('div', { style: style, onClick: this.props.onClick });
	  };
	
	  return JSONArrow;
	})(_react2['default'].Component);
	
	exports['default'] = JSONArrow;
	module.exports = exports['default'];

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = shouldPureComponentUpdate;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _shallowEqual = __webpack_require__(393);
	
	var _shallowEqual2 = _interopRequireDefault(_shallowEqual);
	
	function shouldPureComponentUpdate(nextProps, nextState) {
	  return !(0, _shallowEqual2['default'])(this.props, nextProps) || !(0, _shallowEqual2['default'])(this.state, nextState);
	}
	
	module.exports = exports['default'];

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	var _instrument = __webpack_require__(182);
	
	exports.instrument = _interopRequire(_instrument);
	exports.ActionCreators = _instrument.ActionCreators;
	exports.ActionTypes = _instrument.ActionTypes;
	
	var _persistState = __webpack_require__(435);
	
	exports.persistState = _interopRequire(_persistState);
	
	var _createDevTools = __webpack_require__(434);
	
	exports.createDevTools = _interopRequire(_createDevTools);

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(70),
	    isObjectLike = __webpack_require__(32);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) &&
	    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	}
	
	module.exports = isArguments;


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(69),
	    isArrayLike = __webpack_require__(70),
	    isObject = __webpack_require__(26),
	    shimKeys = __webpack_require__(467);
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = getNative(Object, 'keys');
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  var Ctor = object == null ? undefined : object.constructor;
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && isArrayLike(object))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};
	
	module.exports = keys;


/***/ },
/* 111 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 112 */,
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _utils = __webpack_require__(71);
	
	exports['default'] = (0, _utils.createConstants)('COUNTER_INCREMENT');
	module.exports = exports['default'];

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reduxDevtools = __webpack_require__(108);
	
	var _reduxDevtoolsLogMonitor = __webpack_require__(180);
	
	var _reduxDevtoolsLogMonitor2 = _interopRequireDefault(_reduxDevtoolsLogMonitor);
	
	var _reduxDevtoolsDockMonitor = __webpack_require__(365);
	
	var _reduxDevtoolsDockMonitor2 = _interopRequireDefault(_reduxDevtoolsDockMonitor);
	
	exports['default'] = (0, _reduxDevtools.createDevTools)(_react2['default'].createElement(
	  _reduxDevtoolsDockMonitor2['default'],
	  { toggleVisibilityKey: 'H',
	    changePositionKey: 'Q' },
	  _react2['default'].createElement(_reduxDevtoolsLogMonitor2['default'], null)
	));
	module.exports = exports['default'];

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(222), __esModule: true };

/***/ },
/* 116 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 117 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(116);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(237)
	  , $export        = __webpack_require__(36)
	  , redefine       = __webpack_require__(239)
	  , hide           = __webpack_require__(78)
	  , has            = __webpack_require__(117)
	  , Iterators      = __webpack_require__(41)
	  , $iterCreate    = __webpack_require__(234)
	  , setToStringTag = __webpack_require__(122)
	  , getProto       = __webpack_require__(16).getProto
	  , ITERATOR       = __webpack_require__(19)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if($native){
	    var IteratorPrototype = getProto($default.call(new Base));
	    // Set @@toStringTag to native iterators
	    setToStringTag(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    // fix Array#{values, @@iterator}.name in V8 / FF
	    if(DEF_VALUES && $native.name !== VALUES){
	      VALUES_BUG = true;
	      $default = function values(){ return $native.call(this); };
	    }
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES  ? $default : getMethod(VALUES),
	      keys:    IS_SET      ? $default : getMethod(KEYS),
	      entries: !DEF_VALUES ? $default : getMethod('entries')
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(36)
	  , core    = __webpack_require__(15)
	  , fails   = __webpack_require__(76);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 121 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(16).setDesc
	  , has = __webpack_require__(117)
	  , TAG = __webpack_require__(19)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 123 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(118)
	  , defined = __webpack_require__(75);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(229)
	  , ITERATOR  = __webpack_require__(19)('iterator')
	  , Iterators = __webpack_require__(41);
	module.exports = __webpack_require__(15).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(247);
	var Iterators = __webpack_require__(41);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(149);


/***/ },
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports.toggleVisibility = toggleVisibility;
	exports.changePosition = changePosition;
	exports.changeSize = changeSize;
	var TOGGLE_VISIBILITY = '@@redux-devtools-log-monitor/TOGGLE_VISIBILITY';
	exports.TOGGLE_VISIBILITY = TOGGLE_VISIBILITY;
	
	function toggleVisibility() {
	  return { type: TOGGLE_VISIBILITY };
	}
	
	var CHANGE_POSITION = '@@redux-devtools-log-monitor/CHANGE_POSITION';
	exports.CHANGE_POSITION = CHANGE_POSITION;
	
	function changePosition() {
	  return { type: CHANGE_POSITION };
	}
	
	var CHANGE_SIZE = '@@redux-devtools-log-monitor/CHANGE_SIZE';
	exports.CHANGE_SIZE = CHANGE_SIZE;
	
	function changeSize(size) {
	  return { type: CHANGE_SIZE, size: size };
	}

/***/ },
/* 178 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var POSITIONS = ['left', 'top', 'right', 'bottom'];
	exports.POSITIONS = POSITIONS;

/***/ },
/* 179 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports.updateScrollTop = updateScrollTop;
	var UPDATE_SCROLL_TOP = '@@redux-devtools-log-monitor/UPDATE_SCROLL_TOP';
	exports.UPDATE_SCROLL_TOP = UPDATE_SCROLL_TOP;
	
	function updateScrollTop(scrollTop) {
	  return { type: UPDATE_SCROLL_TOP, scrollTop: scrollTop };
	}

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _LogMonitor = __webpack_require__(373);
	
	var _LogMonitor2 = _interopRequireDefault(_LogMonitor);
	
	exports['default'] = _LogMonitor2['default'];
	module.exports = exports['default'];

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	// ES6 + inline style port of JSONViewer https://bitbucket.org/davevedder/react-json-viewer/
	// all credits and original code to the author
	// Dave Vedder <veddermatic@gmail.com> http://www.eskimospy.com/
	// port by Daniele Zannotti http://www.github.com/dzannotti <dzannotti@me.com>
	
	'use strict';
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _createClass = __webpack_require__(35)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	var _extends = __webpack_require__(11)['default'];
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _grabNode = __webpack_require__(68);
	
	var _grabNode2 = _interopRequireDefault(_grabNode);
	
	var _themesSolarized = __webpack_require__(390);
	
	var _themesSolarized2 = _interopRequireDefault(_themesSolarized);
	
	var styles = {
	  tree: {
	    border: 0,
	    padding: 0,
	    marginTop: 8,
	    marginBottom: 8,
	    marginLeft: 2,
	    marginRight: 0,
	    fontSize: '0.90em',
	    listStyle: 'none',
	    MozUserSelect: 'none',
	    WebkitUserSelect: 'none'
	  }
	};
	
	var getEmptyStyle = function getEmptyStyle() {
	  return {};
	};
	
	var JSONTree = (function (_React$Component) {
	  _inherits(JSONTree, _React$Component);
	
	  _createClass(JSONTree, null, [{
	    key: 'propTypes',
	    value: {
	      data: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.array, _react2['default'].PropTypes.object]).isRequired
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      theme: _themesSolarized2['default'],
	      getArrowStyle: getEmptyStyle,
	      getListStyle: getEmptyStyle,
	      getItemStringStyle: getEmptyStyle,
	      getLabelStyle: getEmptyStyle,
	      getValueStyle: getEmptyStyle,
	      getItemString: function getItemString(type, data, itemType, itemString) {
	        return _react2['default'].createElement(
	          'span',
	          null,
	          itemType,
	          ' ',
	          itemString
	        );
	      }
	    },
	    enumerable: true
	  }]);
	
	  function JSONTree(props) {
	    _classCallCheck(this, JSONTree);
	
	    _React$Component.call(this, props);
	  }
	
	  JSONTree.prototype.render = function render() {
	    var keyName = this.props.keyName || 'root';
	    var getStyles = {
	      getArrowStyle: this.props.getArrowStyle,
	      getListStyle: this.props.getListStyle,
	      getItemStringStyle: this.props.getItemStringStyle,
	      getLabelStyle: this.props.getLabelStyle,
	      getValueStyle: this.props.getValueStyle
	    };
	    var rootNode = _grabNode2['default'](keyName, this.props.data, this.props.previousData, this.props.theme, getStyles, this.props.getItemString, true);
	    return _react2['default'].createElement(
	      'ul',
	      { style: _extends({}, styles.tree, this.props.style) },
	      rootNode
	    );
	  };
	
	  return JSONTree;
	})(_react2['default'].Component);
	
	exports['default'] = JSONTree;
	module.exports = exports['default'];

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = instrument;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodashArrayDifference = __webpack_require__(436);
	
	var _lodashArrayDifference2 = _interopRequireDefault(_lodashArrayDifference);
	
	var ActionTypes = {
	  PERFORM_ACTION: 'PERFORM_ACTION',
	  RESET: 'RESET',
	  ROLLBACK: 'ROLLBACK',
	  COMMIT: 'COMMIT',
	  SWEEP: 'SWEEP',
	  TOGGLE_ACTION: 'TOGGLE_ACTION',
	  JUMP_TO_STATE: 'JUMP_TO_STATE',
	  IMPORT_STATE: 'IMPORT_STATE'
	};
	
	exports.ActionTypes = ActionTypes;
	/**
	 * Action creators to change the History state.
	 */
	var ActionCreators = {
	  performAction: function performAction(action) {
	    return { type: ActionTypes.PERFORM_ACTION, action: action, timestamp: Date.now() };
	  },
	
	  reset: function reset() {
	    return { type: ActionTypes.RESET, timestamp: Date.now() };
	  },
	
	  rollback: function rollback() {
	    return { type: ActionTypes.ROLLBACK, timestamp: Date.now() };
	  },
	
	  commit: function commit() {
	    return { type: ActionTypes.COMMIT, timestamp: Date.now() };
	  },
	
	  sweep: function sweep() {
	    return { type: ActionTypes.SWEEP };
	  },
	
	  toggleAction: function toggleAction(id) {
	    return { type: ActionTypes.TOGGLE_ACTION, id: id };
	  },
	
	  jumpToState: function jumpToState(index) {
	    return { type: ActionTypes.JUMP_TO_STATE, index: index };
	  },
	
	  importState: function importState(nextLiftedState) {
	    return { type: ActionTypes.IMPORT_STATE, nextLiftedState: nextLiftedState };
	  }
	};
	
	exports.ActionCreators = ActionCreators;
	var INIT_ACTION = { type: '@@INIT' };
	
	/**
	 * Computes the next entry in the log by applying an action.
	 */
	function computeNextEntry(reducer, action, state, error) {
	  if (error) {
	    return {
	      state: state,
	      error: 'Interrupted by an error up the chain'
	    };
	  }
	
	  var nextState = state;
	  var nextError = undefined;
	  try {
	    nextState = reducer(state, action);
	  } catch (err) {
	    nextError = err.toString();
	    console.error(err.stack || err);
	  }
	
	  return {
	    state: nextState,
	    error: nextError
	  };
	}
	
	/**
	 * Runs the reducer on invalidated actions to get a fresh computation log.
	 */
	function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds) {
	  // Optimization: exit early and return the same reference
	  // if we know nothing could have changed.
	  if (minInvalidatedStateIndex >= computedStates.length && computedStates.length === stagedActionIds.length) {
	    return computedStates;
	  }
	
	  var nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
	  for (var i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
	    var actionId = stagedActionIds[i];
	    var action = actionsById[actionId].action;
	
	    var previousEntry = nextComputedStates[i - 1];
	    var previousState = previousEntry ? previousEntry.state : committedState;
	    var previousError = previousEntry ? previousEntry.error : undefined;
	
	    var shouldSkip = skippedActionIds.indexOf(actionId) > -1;
	    var entry = shouldSkip ? previousEntry : computeNextEntry(reducer, action, previousState, previousError);
	
	    nextComputedStates.push(entry);
	  }
	
	  return nextComputedStates;
	}
	
	/**
	 * Lifts an app's action into an action on the lifted store.
	 */
	function liftAction(action) {
	  return ActionCreators.performAction(action);
	}
	
	/**
	 * Creates a history state reducer from an app's reducer.
	 */
	function liftReducerWith(reducer, initialCommittedState, monitorReducer) {
	  var initialLiftedState = {
	    monitorState: monitorReducer(undefined, {}),
	    nextActionId: 1,
	    actionsById: {
	      0: liftAction(INIT_ACTION)
	    },
	    stagedActionIds: [0],
	    skippedActionIds: [],
	    committedState: initialCommittedState,
	    currentStateIndex: 0,
	    computedStates: []
	  };
	
	  /**
	   * Manages how the history actions modify the history state.
	   */
	  return function (liftedState, liftedAction) {
	    if (liftedState === undefined) liftedState = initialLiftedState;
	    var monitorState = liftedState.monitorState;
	    var actionsById = liftedState.actionsById;
	    var nextActionId = liftedState.nextActionId;
	    var stagedActionIds = liftedState.stagedActionIds;
	    var skippedActionIds = liftedState.skippedActionIds;
	    var committedState = liftedState.committedState;
	    var currentStateIndex = liftedState.currentStateIndex;
	    var computedStates = liftedState.computedStates;
	
	    // By default, agressively recompute every state whatever happens.
	    // This has O(n) performance, so we'll override this to a sensible
	    // value whenever we feel like we don't have to recompute the states.
	    var minInvalidatedStateIndex = 0;
	
	    switch (liftedAction.type) {
	      case ActionTypes.RESET:
	        {
	          // Get back to the state the store was created with.
	          actionsById = { 0: liftAction(INIT_ACTION) };
	          nextActionId = 1;
	          stagedActionIds = [0];
	          skippedActionIds = [];
	          committedState = initialCommittedState;
	          currentStateIndex = 0;
	          computedStates = [];
	          break;
	        }
	      case ActionTypes.COMMIT:
	        {
	          // Consider the last committed state the new starting point.
	          // Squash any staged actions into a single committed state.
	          actionsById = { 0: liftAction(INIT_ACTION) };
	          nextActionId = 1;
	          stagedActionIds = [0];
	          skippedActionIds = [];
	          committedState = computedStates[currentStateIndex].state;
	          currentStateIndex = 0;
	          computedStates = [];
	          break;
	        }
	      case ActionTypes.ROLLBACK:
	        {
	          // Forget about any staged actions.
	          // Start again from the last committed state.
	          actionsById = { 0: liftAction(INIT_ACTION) };
	          nextActionId = 1;
	          stagedActionIds = [0];
	          skippedActionIds = [];
	          currentStateIndex = 0;
	          computedStates = [];
	          break;
	        }
	      case ActionTypes.TOGGLE_ACTION:
	        {
	          var _ret = (function () {
	            // Toggle whether an action with given ID is skipped.
	            // Being skipped means it is a no-op during the computation.
	            var actionId = liftedAction.id;
	
	            var index = skippedActionIds.indexOf(actionId);
	            if (index === -1) {
	              skippedActionIds = [actionId].concat(skippedActionIds);
	            } else {
	              skippedActionIds = skippedActionIds.filter(function (id) {
	                return id !== actionId;
	              });
	            }
	            // Optimization: we know history before this action hasn't changed
	            minInvalidatedStateIndex = stagedActionIds.indexOf(actionId);
	            return 'break';
	          })();
	
	          if (_ret === 'break') break;
	        }
	      case ActionTypes.JUMP_TO_STATE:
	        {
	          // Without recomputing anything, move the pointer that tell us
	          // which state is considered the current one. Useful for sliders.
	          currentStateIndex = liftedAction.index;
	          // Optimization: we know the history has not changed.
	          minInvalidatedStateIndex = Infinity;
	          break;
	        }
	      case ActionTypes.SWEEP:
	        {
	          // Forget any actions that are currently being skipped.
	          stagedActionIds = _lodashArrayDifference2['default'](stagedActionIds, skippedActionIds);
	          skippedActionIds = [];
	          currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
	          break;
	        }
	      case ActionTypes.PERFORM_ACTION:
	        {
	          if (currentStateIndex === stagedActionIds.length - 1) {
	            currentStateIndex++;
	          }
	          var actionId = nextActionId++;
	          // Mutation! This is the hottest path, and we optimize on purpose.
	          // It is safe because we set a new key in a cache dictionary.
	          actionsById[actionId] = liftedAction;
	          stagedActionIds = [].concat(stagedActionIds, [actionId]);
	          // Optimization: we know that only the new action needs computing.
	          minInvalidatedStateIndex = stagedActionIds.length - 1;
	          break;
	        }
	      case ActionTypes.IMPORT_STATE:
	        {
	          var _liftedAction$nextLiftedState = liftedAction.nextLiftedState;
	
	          // Completely replace everything.
	          monitorState = _liftedAction$nextLiftedState.monitorState;
	          actionsById = _liftedAction$nextLiftedState.actionsById;
	          nextActionId = _liftedAction$nextLiftedState.nextActionId;
	          stagedActionIds = _liftedAction$nextLiftedState.stagedActionIds;
	          skippedActionIds = _liftedAction$nextLiftedState.skippedActionIds;
	          committedState = _liftedAction$nextLiftedState.committedState;
	          currentStateIndex = _liftedAction$nextLiftedState.currentStateIndex;
	          computedStates = _liftedAction$nextLiftedState.computedStates;
	
	          break;
	        }
	      case '@@redux/INIT':
	        {
	          // Always recompute states on hot reload and init.
	          minInvalidatedStateIndex = 0;
	          break;
	        }
	      default:
	        {
	          // If the action is not recognized, it's a monitor action.
	          // Optimization: a monitor action can't change history.
	          minInvalidatedStateIndex = Infinity;
	          break;
	        }
	    }
	
	    computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds);
	    monitorState = monitorReducer(monitorState, liftedAction);
	    return {
	      monitorState: monitorState,
	      actionsById: actionsById,
	      nextActionId: nextActionId,
	      stagedActionIds: stagedActionIds,
	      skippedActionIds: skippedActionIds,
	      committedState: committedState,
	      currentStateIndex: currentStateIndex,
	      computedStates: computedStates
	    };
	  };
	}
	
	/**
	 * Provides an app's view into the state of the lifted store.
	 */
	function unliftState(liftedState) {
	  var computedStates = liftedState.computedStates;
	  var currentStateIndex = liftedState.currentStateIndex;
	  var state = computedStates[currentStateIndex].state;
	
	  return state;
	}
	
	/**
	 * Provides an app's view into the lifted store.
	 */
	function unliftStore(liftedStore, liftReducer) {
	  var lastDefinedState = undefined;
	
	  return _extends({}, liftedStore, {
	
	    liftedStore: liftedStore,
	
	    dispatch: function dispatch(action) {
	      liftedStore.dispatch(liftAction(action));
	      return action;
	    },
	
	    getState: function getState() {
	      var state = unliftState(liftedStore.getState());
	      if (state !== undefined) {
	        lastDefinedState = state;
	      }
	      return lastDefinedState;
	    },
	
	    replaceReducer: function replaceReducer(nextReducer) {
	      liftedStore.replaceReducer(liftReducer(nextReducer));
	    }
	  });
	}
	
	/**
	 * Redux instrumentation store enhancer.
	 */
	
	function instrument() {
	  var monitorReducer = arguments.length <= 0 || arguments[0] === undefined ? function () {
	    return null;
	  } : arguments[0];
	
	  return function (createStore) {
	    return function (reducer, initialState) {
	      function liftReducer(r) {
	        return liftReducerWith(r, initialState, monitorReducer);
	      }
	
	      var liftedStore = createStore(liftReducer(reducer));
	      return unliftStore(liftedStore, liftReducer);
	    };
	  };
	}

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(33);
	
	/**
	 * The base implementation of `get` without support for string paths
	 * and default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} path The path of the property to get.
	 * @param {string} [pathKey] The key representation of path.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path, pathKey) {
	  if (object == null) {
	    return;
	  }
	  if (pathKey !== undefined && pathKey in toObject(object)) {
	    path = [pathKey];
	  }
	  var index = 0,
	      length = path.length;
	
	  while (object != null && index < length) {
	    object = object[path[index++]];
	  }
	  return (index && index == length) ? object : undefined;
	}
	
	module.exports = baseGet;


/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(448),
	    isObject = __webpack_require__(26),
	    isObjectLike = __webpack_require__(32);
	
	/**
	 * The base implementation of `_.isEqual` without support for `this` binding
	 * `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
	}
	
	module.exports = baseIsEqual;


/***/ },
/* 185 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	module.exports = baseProperty;


/***/ },
/* 186 */
/***/ function(module, exports) {

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;
	
	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}
	
	module.exports = isIndex;


/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(34),
	    toObject = __webpack_require__(33);
	
	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;
	
	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  var type = typeof value;
	  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
	    return true;
	  }
	  if (isArray(value)) {
	    return false;
	  }
	  var result = !reIsDeepProp.test(value);
	  return result || (object != null && value in toObject(object));
	}
	
	module.exports = isKey;


/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(26);
	
	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}
	
	module.exports = isStrictComparable;


/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(454),
	    isArray = __webpack_require__(34);
	
	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
	
	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;
	
	/**
	 * Converts `value` to property path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Array} Returns the property path array.
	 */
	function toPath(value) {
	  if (isArray(value)) {
	    return value;
	  }
	  var result = [];
	  baseToString(value).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	}
	
	module.exports = toPath;


/***/ },
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _constantsCounter = __webpack_require__(113);
	
	exports['default'] = {
	  increment: function increment() {
	    return { type: _constantsCounter.COUNTER_INCREMENT };
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(138);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _historyLibCreateBrowserHistory = __webpack_require__(128);
	
	var _historyLibCreateBrowserHistory2 = _interopRequireDefault(_historyLibCreateBrowserHistory);
	
	var _reduxSimpleRouter = __webpack_require__(112);
	
	var _containersRoot = __webpack_require__(198);
	
	var _containersRoot2 = _interopRequireDefault(_containersRoot);
	
	var _storeConfigureStore = __webpack_require__(203);
	
	var _storeConfigureStore2 = _interopRequireDefault(_storeConfigureStore);
	
	var target = document.getElementById('root');
	var history = (0, _historyLibCreateBrowserHistory2['default'])();
	var store = (0, _storeConfigureStore2['default'])(window.__INITIAL_STATE__, (true));
	
	(0, _reduxSimpleRouter.syncReduxAndRouter)(history, store);
	
	var node = _react2['default'].createElement(_containersRoot2['default'], {
	  history: history,
	  store: store,
	  debug: (true),
	  debugExternal: (false)
	});
	
	_reactDom2['default'].render(node, target);

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reduxDevtools = __webpack_require__(108);
	
	var _reduxDevtoolsLogMonitor = __webpack_require__(180);
	
	var _reduxDevtoolsLogMonitor2 = _interopRequireDefault(_reduxDevtoolsLogMonitor);
	
	exports['default'] = (0, _reduxDevtools.createDevTools)(_react2['default'].createElement(_reduxDevtoolsLogMonitor2['default'], null));
	module.exports = exports['default'];

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _reactTransformCatchErrors2 = __webpack_require__(57);
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	var _reactTransformCatchErrors3 = _interopRequireDefault(_reactTransformCatchErrors2);
	
	var _react = __webpack_require__(1);
	
	var _redboxReact = __webpack_require__(67);
	
	var _get = __webpack_require__(40)['default'];
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _createClass = __webpack_require__(35)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react2 = _interopRequireDefault(_react);
	
	var _matterJs = __webpack_require__(265);
	
	var _matterJs2 = _interopRequireDefault(_matterJs);
	
	var _components = {
	  _$GameCanvas: {
	    displayName: 'GameCanvas'
	  }
	};
	
	var _reactComponentWrapper = (0, _reactTransformCatchErrors3['default'])({
	  filename: '/Users/Ben/Projects/dapplab/etherbabel/dapp/app/src/containers/GameCanvas.js',
	  components: _components,
	  locals: [],
	  imports: [_react, _redboxReact]
	});
	
	function _wrapComponent(uniqueId) {
	  return function (ReactClass) {
	    return _reactComponentWrapper(ReactClass, uniqueId);
	  };
	}
	
	var Engine = _matterJs2['default'].Engine,
	    World = _matterJs2['default'].World,
	    Bodies = _matterJs2['default'].Bodies,
	    Body = _matterJs2['default'].Body,
	    Common = _matterJs2['default'].Common,
	    Events = _matterJs2['default'].Events;
	
	// create a Matter.js engine
	var engine = Engine.create(document.body);
	var renderOptions = engine.render.options;
	renderOptions.wireframes = false;
	
	// create two boxes and a ground
	var boxA = Bodies.rectangle(100, 20, 80, 80);
	var boxB = Bodies.rectangle(100, 50, 80, 80);
	var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, friction: 1 });
	
	// add all of the bodies to the world
	// World.add(engine.world, [boxA, boxB, ground]);
	
	var offset = 5;
	World.add(engine.world, [Bodies.rectangle(290, 455, 100, 20, { isStatic: true, friction: 1 }), Bodies.rectangle(300, 475, 100, 20, { isStatic: true, friction: 1 }), Bodies.rectangle(300 - offset * 2, 495, 100, 20, { isStatic: true, friction: 1 }), Bodies.rectangle(300 + offset * 5, 515, 100, 20, { isStatic: true, friction: 1 }),
	// Bodies.rectangle(100, 100 + offset, 100.5 + 2 * offset, 50.5),
	// Bodies.rectangle(100 + offset, 100, 50.5, 600.5 + 2 * offset),
	// Bodies.rectangle(-offset, 100, 50.5, 100.5 + 2 * offset),
	ground]);
	
	// run the engine
	Engine.run(engine);
	Events.on(engine, 'collisionActive', function (event) {
	  var pairs = event.pairs;
	
	  // change object colours to show those ending a collision
	  for (var i = 0; i < pairs.length; i++) {
	    var pair = pairs[i];
	    pair.bodyA.render.fillStyle = '#979797';
	    pair.bodyB.render.fillStyle = '#cff498';
	  }
	  Body.setStatic(pairs[0].bodyA, true);
	  Body.setStatic(pairs[0].bodyB, true);
	});
	
	var GameCanvas = (function (_React$Component) {
	  _inherits(GameCanvas, _React$Component);
	
	  function GameCanvas() {
	    _classCallCheck(this, _GameCanvas);
	
	    _get(Object.getPrototypeOf(_GameCanvas.prototype), 'constructor', this).apply(this, arguments);
	  }
	
	  _createClass(GameCanvas, [{
	    key: 'handleClick',
	    value: function handleClick(e) {
	      var offset = 10;
	      var newBody = Bodies.rectangle(300 - offset * Common.random(0, 1) * Common.choose([1, -1]), 5, 100, 20, { friction: 1, frictionStatic: 50 });
	
	      World.add(engine.world, [newBody, ground]);
	      setTimeout(function () {
	        // this.frozenBricks([newBody]);
	      }, 3000);
	      // World.clear(engine.world);
	      // World.remove(engine.world, engine.world.bodies)
	      // console.log(engine.world.bodies);
	    }
	  }, {
	    key: 'frozenBricks',
	    value: function frozenBricks() {
	      var bricks = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	
	      if (bricks.length == 0) return;
	      bricks.forEach(function (brick) {
	        Body.setStatic(brick, true);
	      });
	    }
	  }, {
	    key: 'collapseBricks',
	    value: function collapseBricks(from) {
	      var bricks = engine.world.bodies;
	
	      for (var j = from + 1; j < bricks.length; j++) {
	        Body.setStatic(bricks[j], false);
	        console.log(bricks.length, bricks[j]);
	      }
	
	      Body.setVelocity(bricks[4], { x: 100, y: 0 });
	      Body.setPosition(bricks[4], { x: 100, y: 0 });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this = this;
	
	      return _react2['default'].createElement(
	        'div',
	        { id: 'game-canvas' },
	        _react2['default'].createElement(
	          'a',
	          { className: 'btn btn-primary', onClick: function (e) {
	              return _this.handleClick(e);
	            } },
	          'Insert Coin'
	        ),
	        _react2['default'].createElement(
	          'a',
	          { className: 'btn btn-danger', onClick: function (e) {
	              return _this.collapseBricks(15);
	            } },
	          'Collapse from 5'
	        )
	      );
	    }
	  }]);
	
	  var _GameCanvas = GameCanvas;
	  GameCanvas = _wrapComponent('_$GameCanvas')(GameCanvas) || GameCanvas;
	  return GameCanvas;
	})(_react2['default'].Component);
	
	exports['default'] = GameCanvas;
	module.exports = exports['default'];

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _reactTransformCatchErrors2 = __webpack_require__(57);
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	var _reactTransformCatchErrors3 = _interopRequireDefault(_reactTransformCatchErrors2);
	
	var _react = __webpack_require__(1);
	
	var _redboxReact = __webpack_require__(67);
	
	var _get = __webpack_require__(40)['default'];
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _createClass = __webpack_require__(35)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRedux = __webpack_require__(43);
	
	var _reactRouter = __webpack_require__(45);
	
	var _routes = __webpack_require__(202);
	
	var _routes2 = _interopRequireDefault(_routes);
	
	var _DevTools = __webpack_require__(114);
	
	var _DevTools2 = _interopRequireDefault(_DevTools);
	
	var _utils = __webpack_require__(71);
	
	var _GameCanvas = __webpack_require__(197);
	
	var _GameCanvas2 = _interopRequireDefault(_GameCanvas);
	
	var _components = {
	  _$Root: {
	    displayName: 'Root'
	  }
	};
	
	var _reactComponentWrapper = (0, _reactTransformCatchErrors3['default'])({
	  filename: '/Users/Ben/Projects/dapplab/etherbabel/dapp/app/src/containers/Root.js',
	  components: _components,
	  locals: [],
	  imports: [_react, _redboxReact]
	});
	
	function _wrapComponent(uniqueId) {
	  return function (ReactClass) {
	    return _reactComponentWrapper(ReactClass, uniqueId);
	  };
	}
	
	var Root = (function (_React$Component) {
	  _inherits(Root, _React$Component);
	
	  function Root() {
	    _classCallCheck(this, _Root);
	
	    _get(Object.getPrototypeOf(_Root.prototype), 'constructor', this).apply(this, arguments);
	  }
	
	  _createClass(Root, [{
	    key: 'renderDevTools',
	    value: function renderDevTools() {
	      if (!this.props.debug) {
	        return null;
	      }
	
	      return this.props.debugExternal ? (0, _utils.createDevToolsWindow)(this.props.store) : _react2['default'].createElement(_DevTools2['default'], null);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2['default'].createElement(
	        _reactRedux.Provider,
	        { store: this.props.store },
	        _react2['default'].createElement(
	          'div',
	          null,
	          _react2['default'].createElement(
	            _reactRouter.Router,
	            { history: this.props.history },
	            _routes2['default']
	          ),
	          this.renderDevTools(),
	          _react2['default'].createElement(_GameCanvas2['default'], null)
	        )
	      );
	    }
	  }], [{
	    key: 'propTypes',
	    value: {
	      history: _react2['default'].PropTypes.object.isRequired,
	      store: _react2['default'].PropTypes.object.isRequired,
	      debug: _react2['default'].PropTypes.bool,
	      debugExternal: _react2['default'].PropTypes.bool
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      debug: false,
	      debugExternal: false
	    },
	    enumerable: true
	  }]);
	
	  var _Root = Root;
	  Root = _wrapComponent('_$Root')(Root) || Root;
	  return Root;
	})(_react2['default'].Component);
	
	exports['default'] = Root;
	module.exports = exports['default'];

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _reactTransformCatchErrors2 = __webpack_require__(57);
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	var _reactTransformCatchErrors3 = _interopRequireDefault(_reactTransformCatchErrors2);
	
	var _react = __webpack_require__(1);
	
	var _redboxReact = __webpack_require__(67);
	
	var _get = __webpack_require__(40)['default'];
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _createClass = __webpack_require__(35)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(481);
	
	var _components = {
	  _$CoreLayout: {
	    displayName: 'CoreLayout'
	  }
	};
	
	var _reactComponentWrapper = (0, _reactTransformCatchErrors3['default'])({
	  filename: '/Users/Ben/Projects/dapplab/etherbabel/dapp/app/src/layouts/CoreLayout.js',
	  components: _components,
	  locals: [],
	  imports: [_react, _redboxReact]
	});
	
	function _wrapComponent(uniqueId) {
	  return function (ReactClass) {
	    return _reactComponentWrapper(ReactClass, uniqueId);
	  };
	}
	
	var CoreLayout = (function (_React$Component) {
	  _inherits(CoreLayout, _React$Component);
	
	  function CoreLayout() {
	    _classCallCheck(this, _CoreLayout);
	
	    _get(Object.getPrototypeOf(_CoreLayout.prototype), 'constructor', this).apply(this, arguments);
	  }
	
	  _createClass(CoreLayout, [{
	    key: 'render',
	    value: function render() {
	      return _react2['default'].createElement(
	        'div',
	        { className: 'page-container' },
	        _react2['default'].createElement(
	          'div',
	          { className: 'view-container' },
	          this.props.children
	        )
	      );
	    }
	  }], [{
	    key: 'propTypes',
	    value: {
	      children: _react2['default'].PropTypes.element
	    },
	    enumerable: true
	  }]);
	
	  var _CoreLayout = CoreLayout;
	  CoreLayout = _wrapComponent('_$CoreLayout')(CoreLayout) || CoreLayout;
	  return CoreLayout;
	})(_react2['default'].Component);
	
	exports['default'] = CoreLayout;
	module.exports = exports['default'];

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _defineProperty = __webpack_require__(214)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _utils = __webpack_require__(71);
	
	var _constantsCounter = __webpack_require__(113);
	
	var initialState = 0;
	exports['default'] = (0, _utils.createReducer)(initialState, _defineProperty({}, _constantsCounter.COUNTER_INCREMENT, function (state) {
	  return state + 1;
	}));
	module.exports = exports['default'];

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _redux = __webpack_require__(53);
	
	var _reduxSimpleRouter = __webpack_require__(112);
	
	var _counter = __webpack_require__(200);
	
	var _counter2 = _interopRequireDefault(_counter);
	
	exports['default'] = (0, _redux.combineReducers)({
	  counter: _counter2['default'],
	  routing: _reduxSimpleRouter.routeReducer
	});
	module.exports = exports['default'];

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(45);
	
	var _layoutsCoreLayout = __webpack_require__(199);
	
	var _layoutsCoreLayout2 = _interopRequireDefault(_layoutsCoreLayout);
	
	var _viewsHomeView = __webpack_require__(205);
	
	var _viewsHomeView2 = _interopRequireDefault(_viewsHomeView);
	
	var _viewsAboutView = __webpack_require__(204);
	
	var _viewsAboutView2 = _interopRequireDefault(_viewsAboutView);
	
	exports['default'] = _react2['default'].createElement(
	  _reactRouter.Route,
	  { component: _layoutsCoreLayout2['default'], path: '/' },
	  _react2['default'].createElement(_reactRouter.IndexRoute, { component: _viewsHomeView2['default'] }),
	  _react2['default'].createElement(_reactRouter.Route, { component: _viewsAboutView2['default'], path: '/about' })
	);
	module.exports = exports['default'];

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = configureStore;
	
	var _reducers = __webpack_require__(201);
	
	var _reducers2 = _interopRequireDefault(_reducers);
	
	var _reduxThunk = __webpack_require__(475);
	
	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);
	
	var _containersDevTools = __webpack_require__(114);
	
	var _containersDevTools2 = _interopRequireDefault(_containersDevTools);
	
	var _redux = __webpack_require__(53);
	
	function configureStore(initialState) {
	  var debug = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	  var createStoreWithMiddleware = undefined;
	
	  var middleware = (0, _redux.applyMiddleware)(_reduxThunk2['default']);
	
	  if (debug) {
	    createStoreWithMiddleware = (0, _redux.compose)(middleware, _containersDevTools2['default'].instrument());
	  } else {
	    createStoreWithMiddleware = (0, _redux.compose)(middleware);
	  }
	
	  var store = createStoreWithMiddleware(_redux.createStore)(_reducers2['default'], initialState);
	  if (false) {
	    module.hot.accept('../reducers', function () {
	      var nextRootReducer = require('../reducers/index');
	
	      store.replaceReducer(nextRootReducer);
	    });
	  }
	  return store;
	}
	
	module.exports = exports['default'];

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(45);
	
	var AboutView = function AboutView() {
	  return _react2['default'].createElement(
	    'div',
	    { className: 'container text-center' },
	    _react2['default'].createElement(
	      'h1',
	      null,
	      'This is the about view!'
	    ),
	    _react2['default'].createElement('hr', null),
	    _react2['default'].createElement(
	      _reactRouter.Link,
	      { to: '/' },
	      'Back To Home View'
	    )
	  );
	};
	
	exports['default'] = AboutView;
	module.exports = exports['default'];

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _reactTransformCatchErrors2 = __webpack_require__(57);
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	var _reactTransformCatchErrors3 = _interopRequireDefault(_reactTransformCatchErrors2);
	
	var _react = __webpack_require__(1);
	
	var _redboxReact = __webpack_require__(67);
	
	var _get = __webpack_require__(40)['default'];
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _createClass = __webpack_require__(35)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react2 = _interopRequireDefault(_react);
	
	var _redux = __webpack_require__(53);
	
	var _reactRedux = __webpack_require__(43);
	
	var _actionsCounter = __webpack_require__(194);
	
	var _actionsCounter2 = _interopRequireDefault(_actionsCounter);
	
	var _reactRouter = __webpack_require__(45);
	
	// We define mapStateToProps and mapDispatchToProps where we'd normally use
	// the @connect decorator so the data requirements are clear upfront, but then
	// export the decorated component after the main class definition so
	// the component can be tested w/ and w/o being connected.
	// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
	var _components = {
	  _$HomeView: {
	    displayName: 'HomeView'
	  }
	};
	
	var _reactComponentWrapper = (0, _reactTransformCatchErrors3['default'])({
	  filename: '/Users/Ben/Projects/dapplab/etherbabel/dapp/app/src/views/HomeView.js',
	  components: _components,
	  locals: [],
	  imports: [_react, _redboxReact]
	});
	
	function _wrapComponent(uniqueId) {
	  return function (ReactClass) {
	    return _reactComponentWrapper(ReactClass, uniqueId);
	  };
	}
	
	var mapStateToProps = function mapStateToProps(state) {
	  return {
	    counter: state.counter,
	    routerState: state.router
	  };
	};
	var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	  return {
	    actions: (0, _redux.bindActionCreators)(_actionsCounter2['default'], dispatch)
	  };
	};
	
	var HomeView = (function (_React$Component) {
	  _inherits(HomeView, _React$Component);
	
	  function HomeView() {
	    _classCallCheck(this, _HomeView);
	
	    _get(Object.getPrototypeOf(_HomeView.prototype), 'constructor', this).apply(this, arguments);
	  }
	
	  _createClass(HomeView, [{
	    key: 'render',
	    value: function render() {
	      return _react2['default'].createElement(
	        'div',
	        { className: 'container text-center' },
	        _react2['default'].createElement(
	          'h1',
	          null,
	          'Welcome to the React Redux Starter Kit'
	        ),
	        _react2['default'].createElement(
	          'h2',
	          null,
	          'Sample Counter: ',
	          this.props.counter
	        ),
	        _react2['default'].createElement(
	          'button',
	          { className: 'btn btn-default',
	            onClick: this.props.actions.increment },
	          'Increment'
	        ),
	        _react2['default'].createElement('hr', null),
	        _react2['default'].createElement(
	          _reactRouter.Link,
	          { to: '/about' },
	          'Go To About View'
	        )
	      );
	    }
	  }], [{
	    key: 'propTypes',
	    value: {
	      actions: _react2['default'].PropTypes.object,
	      counter: _react2['default'].PropTypes.number
	    },
	    enumerable: true
	  }]);
	
	  var _HomeView = HomeView;
	  HomeView = _wrapComponent('_$HomeView')(HomeView) || HomeView;
	  return HomeView;
	})(_react2['default'].Component);
	
	exports.HomeView = HomeView;
	exports['default'] = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(HomeView);

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(217), __esModule: true };

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(218), __esModule: true };

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(219), __esModule: true };

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(220), __esModule: true };

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(221), __esModule: true };

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(223), __esModule: true };

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(225), __esModule: true };

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(226), __esModule: true };

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperty = __webpack_require__(115)["default"];
	
	exports["default"] = function (obj, key, value) {
	  if (key in obj) {
	    _Object$defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }
	
	  return obj;
	};
	
	exports.__esModule = true;

/***/ },
/* 215 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj["default"] : obj;
	};
	
	exports.__esModule = true;

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Array$from = __webpack_require__(206)["default"];
	
	exports["default"] = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
	
	    return arr2;
	  } else {
	    return _Array$from(arr);
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(81);
	__webpack_require__(246);
	module.exports = __webpack_require__(15).Array.from;

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(126);
	__webpack_require__(81);
	module.exports = __webpack_require__(245);

/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(248);
	module.exports = __webpack_require__(15).Number.isSafeInteger;

/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(249);
	module.exports = __webpack_require__(15).Object.assign;

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(16);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(16);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(16);
	__webpack_require__(250);
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $.getDesc(it, key);
	};

/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(251);
	module.exports = __webpack_require__(15).Object.keys;

/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(252);
	module.exports = __webpack_require__(15).Object.setPrototypeOf;

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(81);
	__webpack_require__(126);
	module.exports = __webpack_require__(19)('iterator');

/***/ },
/* 227 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 228 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(116)
	  , TAG = __webpack_require__(19)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(76)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(41)
	  , ITERATOR   = __webpack_require__(19)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(79)
	  , floor    = Math.floor;
	module.exports = function isInteger(it){
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};

/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(73);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(16)
	  , descriptor     = __webpack_require__(121)
	  , setToStringTag = __webpack_require__(122)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(78)(IteratorPrototype, __webpack_require__(19)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(19)('iterator')
	  , SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	
	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 236 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 237 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(16)
	  , toObject = __webpack_require__(80)
	  , IObject  = __webpack_require__(118);
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(76)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(78);

/***/ },
/* 240 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(16).getDesc
	  , isObject = __webpack_require__(79)
	  , anObject = __webpack_require__(73);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(74)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(77)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(123)
	  , defined   = __webpack_require__(75);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(123)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 244 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(73)
	  , get      = __webpack_require__(125);
	module.exports = __webpack_require__(15).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 246 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx         = __webpack_require__(74)
	  , $export     = __webpack_require__(36)
	  , toObject    = __webpack_require__(80)
	  , call        = __webpack_require__(233)
	  , isArrayIter = __webpack_require__(231)
	  , toLength    = __webpack_require__(243)
	  , getIterFn   = __webpack_require__(125);
	$export($export.S + $export.F * !__webpack_require__(235)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , $$      = arguments
	      , $$len   = $$.length
	      , mapfn   = $$len > 1 ? $$[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        result[index] = mapping ? mapfn(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 247 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(228)
	  , step             = __webpack_require__(236)
	  , Iterators        = __webpack_require__(41)
	  , toIObject        = __webpack_require__(124);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(119)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.5 Number.isSafeInteger(number)
	var $export   = __webpack_require__(36)
	  , isInteger = __webpack_require__(232)
	  , abs       = Math.abs;
	
	$export($export.S, 'Number', {
	  isSafeInteger: function isSafeInteger(number){
	    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
	  }
	});

/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(36);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(238)});

/***/ },
/* 250 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(124);
	
	__webpack_require__(120)('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(80);
	
	__webpack_require__(120)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(36);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(240).set});

/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(254)();
	// imports
	
	
	// module
	exports.push([module.id, "/*! normalize.css v3.0.2 | MIT License | git.io/normalize */\n/**\n * 1. Set default font family to sans-serif.\n * 2. Prevent iOS text size adjust after orientation change, without disabling\n *    user zoom.\n */\nhtml {\n  font-family: sans-serif;\n  /* 1 */\n  -ms-text-size-adjust: 100%;\n  /* 2 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/**\n * Remove default margin.\n */\nbody {\n  margin: 0; }\n\n/* HTML5 display definitions\n   ========================================================================== */\n/**\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\n * and Firefox.\n * Correct `block` display not defined for `main` in IE 11.\n */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\n/**\n * 1. Correct `inline-block` display not defined in IE 8/9.\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\n */\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */ }\n\n/**\n * Prevent modern browsers from displaying `audio` without controls.\n * Remove excess height in iOS 5 devices.\n */\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n/**\n * Address `[hidden]` styling not present in IE 8/9/10.\n * Hide the `template` element in IE 8/9/11, Safari, and Firefox < 22.\n */\n[hidden],\ntemplate {\n  display: none; }\n\n/* Links\n   ========================================================================== */\n/**\n * Remove the gray background color from active links in IE 10.\n */\na {\n  background-color: transparent; }\n\n/**\n * Improve readability when focused and also mouse hovered in all browsers.\n */\na:active,\na:hover {\n  outline: 0; }\n\n/* Text-level semantics\n   ========================================================================== */\n/**\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\n */\nabbr[title] {\n  border-bottom: 1px dotted; }\n\n/**\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\n */\nb,\nstrong {\n  font-weight: bold; }\n\n/**\n * Address styling not present in Safari and Chrome.\n */\ndfn {\n  font-style: italic; }\n\n/**\n * Address variable `h1` font-size and margin within `section` and `article`\n * contexts in Firefox 4+, Safari, and Chrome.\n */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/**\n * Address styling not present in IE 8/9.\n */\nmark {\n  background: #ff0;\n  color: #000; }\n\n/**\n * Address inconsistent and variable font size in all browsers.\n */\nsmall {\n  font-size: 80%; }\n\n/**\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\n */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\n/* Embedded content\n   ========================================================================== */\n/**\n * Remove border when inside `a` element in IE 8/9/10.\n */\nimg {\n  border: 0; }\n\n/**\n * Correct overflow not hidden in IE 9/10/11.\n */\nsvg:not(:root) {\n  overflow: hidden; }\n\n/* Grouping content\n   ========================================================================== */\n/**\n * Address margin not present in IE 8/9 and Safari.\n */\nfigure {\n  margin: 1em 40px; }\n\n/**\n * Address differences between Firefox and other browsers.\n */\nhr {\n  box-sizing: content-box;\n  height: 0; }\n\n/**\n * Contain overflow in all browsers.\n */\npre {\n  overflow: auto; }\n\n/**\n * Address odd `em`-unit font size rendering in all browsers.\n */\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\n/* Forms\n   ========================================================================== */\n/**\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\n * styling of `select`, unless a `border` property is set.\n */\n/**\n * 1. Correct color not being inherited.\n *    Known issue: affects color of disabled elements.\n * 2. Correct font properties not being inherited.\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\n */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n  margin: 0;\n  /* 3 */ }\n\n/**\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\n */\nbutton {\n  overflow: visible; }\n\n/**\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\n * All other form control elements do not inherit `text-transform` values.\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\n * Correct `select` style inheritance in Firefox.\n */\nbutton,\nselect {\n  text-transform: none; }\n\n/**\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n *    and `video` controls.\n * 2. Correct inability to style clickable `input` types in iOS.\n * 3. Improve usability and consistency of cursor style between image-type\n *    `input` and others.\n */\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n  cursor: pointer;\n  /* 3 */ }\n\n/**\n * Re-set default cursor for disabled elements.\n */\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default; }\n\n/**\n * Remove inner padding and border in Firefox 4+.\n */\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\n/**\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\n * the UA stylesheet.\n */\ninput {\n  line-height: normal; }\n\n/**\n * It's recommended that you don't attempt to style these elements.\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\n *\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\n * 2. Remove excess padding in IE 8/9/10.\n */\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\n * `font-size` values of the `input`, it causes the cursor style of the\n * decrement button to change from `default` to `text`.\n */\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome\n *    (include `-moz` to future-proof).\n */\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  /* 2 */\n  box-sizing: content-box; }\n\n/**\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\n * Safari (but not Chrome) clips the cancel button when the search input has\n * padding (and `textfield` appearance).\n */\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n * Define consistent border, margin, and padding.\n */\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\n/**\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\n */\nlegend {\n  border: 0;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Remove default vertical scrollbar in IE 8/9/10/11.\n */\ntextarea {\n  overflow: auto; }\n\n/**\n * Don't inherit the `font-weight` (applied by a rule above).\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\n */\noptgroup {\n  font-weight: bold; }\n\n/* Tables\n   ========================================================================== */\n/**\n * Remove most spacing between table cells.\n */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n", ""]);
	
	// exports


/***/ },
/* 254 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	* matter-0.8.0.min.js 0.8.0-alpha 2014-05-04
	* http://brm.io/matter-js/
	* License: MIT
	*/
	
	!function(){var a={},b={};!function(){var a=1;b.create=function(a){var b={id:o.nextId(),type:"body",label:"Body",angle:0,vertices:z.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),position:{x:0,y:0},force:{x:0,y:0},torque:0,positionImpulse:{x:0,y:0},constraintImpulse:{x:0,y:0,angle:0},speed:0,angularSpeed:0,velocity:{x:0,y:0},angularVelocity:0,isStatic:!1,isSleeping:!1,motion:0,sleepThreshold:60,density:.001,restitution:0,friction:.1,frictionAir:.01,groupId:0,slop:.05,timeScale:1,render:{visible:!0,sprite:{xScale:1,yScale:1},lineWidth:1.5}},d=o.extend(b,a);return c(d),d},b.nextGroupId=function(){return a++};var c=function(a){a.axes=a.axes||w.fromVertices(a.vertices),a.area=z.area(a.vertices),a.bounds=x.create(a.vertices),a.mass=a.mass||a.density*a.area,a.inverseMass=1/a.mass,a.inertia=a.inertia||z.inertia(a.vertices,a.mass),a.inverseInertia=1/a.inertia,a.positionPrev=a.positionPrev||{x:a.position.x,y:a.position.y},a.anglePrev=a.anglePrev||a.angle,a.render.fillStyle=a.render.fillStyle||(a.isStatic?"#eeeeee":o.choose(["#556270","#4ECDC4","#C7F464","#FF6B6B","#C44D58"])),a.render.strokeStyle=a.render.strokeStyle||o.shadeColor(a.render.fillStyle,-20),z.create(a.vertices,a);var c=z.centre(a.vertices);z.translate(a.vertices,a.position),z.translate(a.vertices,c,-1),z.rotate(a.vertices,a.angle,a.position),w.rotate(a.axes,a.angle),x.update(a.bounds,a.vertices,a.velocity),b.setStatic(a,a.isStatic),t.set(a,a.isSleeping)};b.setStatic=function(a,b){a.isStatic=b,b&&(a.restitution=0,a.friction=1,a.mass=a.inertia=a.density=1/0,a.inverseMass=a.inverseInertia=0,a.render.lineWidth=1,a.positionPrev.x=a.position.x,a.positionPrev.y=a.position.y,a.anglePrev=a.angle,a.angularVelocity=0,a.speed=0,a.angularSpeed=0,a.motion=0)},b.resetForcesAll=function(a){for(var b=0;b<a.length;b++){var c=a[b];c.force.x=0,c.force.y=0,c.torque=0}},b.applyGravityAll=function(a,b){for(var c=0;c<a.length;c++){var d=a[c];d.isStatic||d.isSleeping||(d.force.y+=d.mass*b.y*.001,d.force.x+=d.mass*b.x*.001)}},b.updateAll=function(a,c,d,e,f){for(var g=0;g<a.length;g++){var h=a[g];h.isStatic||h.isSleeping||h.bounds.max.x<f.min.x||h.bounds.min.x>f.max.x||h.bounds.max.y<f.min.y||h.bounds.min.y>f.max.y||b.update(h,c,d,e)}},b.update=function(a,b,c,d){var e=Math.pow(b*c*a.timeScale,2),f=1-a.frictionAir*c*a.timeScale,g=a.position.x-a.positionPrev.x,h=a.position.y-a.positionPrev.y;a.velocity.x=g*f*d+a.force.x/a.mass*e,a.velocity.y=h*f*d+a.force.y/a.mass*e,a.positionPrev.x=a.position.x,a.positionPrev.y=a.position.y,a.position.x+=a.velocity.x,a.position.y+=a.velocity.y,a.angularVelocity=(a.angle-a.anglePrev)*f*d+a.torque/a.inertia*e,a.anglePrev=a.angle,a.angle+=a.angularVelocity,a.speed=y.magnitude(a.velocity),a.angularSpeed=Math.abs(a.angularVelocity),z.translate(a.vertices,a.velocity),0!==a.angularVelocity&&(z.rotate(a.vertices,a.angularVelocity,a.position),w.rotate(a.axes,a.angularVelocity)),x.update(a.bounds,a.vertices,a.velocity)},b.applyForce=function(a,b,c){a.force.x+=c.x,a.force.y+=c.y;var d={x:b.x-a.position.x,y:b.y-a.position.y};a.torque+=(d.x*c.y-d.y*c.x)*a.inverseInertia},b.translate=function(a,b){a.positionPrev.x+=b.x,a.positionPrev.y+=b.y,a.position.x+=b.x,a.position.y+=b.y,z.translate(a.vertices,b),x.update(a.bounds,a.vertices,a.velocity)},b.rotate=function(a,b){a.anglePrev+=b,a.angle+=b,z.rotate(a.vertices,b,a.position),w.rotate(a.axes,b),x.update(a.bounds,a.vertices,a.velocity)},b.scale=function(a,b,c,d){z.scale(a.vertices,b,c,d),a.axes=w.fromVertices(a.vertices),a.area=z.area(a.vertices),a.mass=a.density*a.area,a.inverseMass=1/a.mass,z.translate(a.vertices,{x:-a.position.x,y:-a.position.y}),a.inertia=z.inertia(a.vertices,a.mass),a.inverseInertia=1/a.inertia,z.translate(a.vertices,{x:a.position.x,y:a.position.y}),x.update(a.bounds,a.vertices,a.velocity)}}();var c={};!function(){c.create=function(a){return o.extend({id:o.nextId(),type:"composite",parent:null,isModified:!1,bodies:[],constraints:[],composites:[],label:"Composite"},a)},c.setModified=function(a,b,d,e){if(a.isModified=b,d&&a.parent&&c.setModified(a.parent,b,d,e),e)for(var f=0;f<a.composites.length;f++){var g=a.composites[f];c.setModified(g,b,d,e)}},c.add=function(a,b){for(var d=[].concat(b),e=0;e<d.length;e++){var f=d[e];switch(f.type){case"body":c.addBody(a,f);break;case"constraint":c.addConstraint(a,f);break;case"composite":c.addComposite(a,f);break;case"mouseConstraint":c.addConstraint(a,f.constraint)}}return a},c.remove=function(a,b,d){for(var e=[].concat(b),f=0;f<e.length;f++){var g=e[f];switch(g.type){case"body":c.removeBody(a,g,d);break;case"constraint":c.removeConstraint(a,g,d);break;case"composite":c.removeComposite(a,g,d);break;case"mouseConstraint":c.removeConstraint(a,g.constraint)}}return a},c.addComposite=function(a,b){return a.composites.push(b),b.parent=a,c.setModified(a,!0,!0,!1),a},c.removeComposite=function(a,b,d){var e=a.composites.indexOf(b);if(-1!==e&&(c.removeCompositeAt(a,e),c.setModified(a,!0,!0,!1)),d)for(var f=0;f<a.composites.length;f++)c.removeComposite(a.composites[f],b,!0);return a},c.removeCompositeAt=function(a,b){return a.composites.splice(b,1),c.setModified(a,!0,!0,!1),a},c.addBody=function(a,b){return a.bodies.push(b),c.setModified(a,!0,!0,!1),a},c.removeBody=function(a,b,d){var e=a.bodies.indexOf(b);if(-1!==e&&(c.removeBodyAt(a,e),c.setModified(a,!0,!0,!1)),d)for(var f=0;f<a.composites.length;f++)c.removeBody(a.composites[f],b,!0);return a},c.removeBodyAt=function(a,b){return a.bodies.splice(b,1),c.setModified(a,!0,!0,!1),a},c.addConstraint=function(a,b){return a.constraints.push(b),c.setModified(a,!0,!0,!1),a},c.removeConstraint=function(a,b,d){var e=a.constraints.indexOf(b);if(-1!==e&&c.removeConstraintAt(a,e),d)for(var f=0;f<a.composites.length;f++)c.removeConstraint(a.composites[f],b,!0);return a},c.removeConstraintAt=function(a,b){return a.constraints.splice(b,1),c.setModified(a,!0,!0,!1),a},c.clear=function(a,b,d){if(d)for(var e=0;e<a.composites.length;e++)c.clear(a.composites[e],b,!0);return b?a.bodies=a.bodies.filter(function(a){return a.isStatic}):a.bodies.length=0,a.constraints.length=0,a.composites.length=0,c.setModified(a,!0,!0,!1),a},c.allBodies=function(a){for(var b=[].concat(a.bodies),d=0;d<a.composites.length;d++)b=b.concat(c.allBodies(a.composites[d]));return b},c.allConstraints=function(a){for(var b=[].concat(a.constraints),d=0;d<a.composites.length;d++)b=b.concat(c.allConstraints(a.composites[d]));return b},c.allComposites=function(a){for(var b=[].concat(a.composites),d=0;d<a.composites.length;d++)b=b.concat(c.allComposites(a.composites[d]));return b},c.get=function(a,b,d){var e,f;switch(d){case"body":e=c.allBodies(a);break;case"constraint":e=c.allConstraints(a);break;case"composite":e=c.allComposites(a).concat(a)}return e?(f=e.filter(function(a){return a.id.toString()===b.toString()}),0===f.length?null:f[0]):null},c.move=function(a,b,d){return c.remove(a,b),c.add(d,b),a},c.rebase=function(a){for(var b=c.allBodies(a).concat(c.allConstraints(a)).concat(c.allComposites(a)),d=0;d<b.length;d++)b[d].id=o.nextId();return c.setModified(a,!0,!0,!1),a}}();var d={};!function(){d.create=function(a){var b=c.create(),d={label:"World",gravity:{x:0,y:1},bounds:{min:{x:0,y:0},max:{x:800,y:600}}};return o.extend(b,d,a)}}();var e={};!function(){e.create=function(a){return{id:e.id(a),vertex:a,normalImpulse:0,tangentImpulse:0}},e.id=function(a){return a.body.id+"_"+a.index}}();var f={};!function(){f.collisions=function(a,b){for(var c=[],d=b.metrics,e=b.pairs.table,f=0;f<a.length;f++){var g=a[f][0],i=a[f][1];if(!(g.groupId&&i.groupId&&g.groupId===i.groupId||(g.isStatic||g.isSleeping)&&(i.isStatic||i.isSleeping)||(d.midphaseTests+=1,!x.overlaps(g.bounds,i.bounds)))){var j,k=h.id(g,i),m=e[k];j=m&&m.isActive?m.collision:null;var n=l.collides(g,i,j);d.narrowphaseTests+=1,n.reused&&(d.narrowReuseCount+=1),n.collided&&(c.push(n),d.narrowDetections+=1)}}return c},f.bruteForce=function(a,b){for(var c=[],d=b.metrics,e=b.pairs.table,f=0;f<a.length;f++)for(var g=f+1;g<a.length;g++){var i=a[f],j=a[g];if(!(i.groupId&&j.groupId&&i.groupId===j.groupId||(i.isStatic||i.isSleeping)&&(j.isStatic||j.isSleeping)||(d.midphaseTests+=1,!x.overlaps(i.bounds,j.bounds)))){var k,m=h.id(i,j),n=e[m];k=n&&n.isActive?n.collision:null;var o=l.collides(i,j,k);d.narrowphaseTests+=1,o.reused&&(d.narrowReuseCount+=1),o.collided&&(c.push(o),d.narrowDetections+=1)}}return c}}();var g={};!function(){g.create=function(a,b){return{buckets:{},pairs:{},pairsList:[],bucketWidth:a||48,bucketHeight:b||48}},g.update=function(c,g,h,k){var l,m,n,o,p,q=h.world,r=c.buckets,s=h.metrics,t=!1;for(s.broadphaseTests=0,l=0;l<g.length;l++){var u=g[l];if((!u.isSleeping||k)&&!(u.bounds.max.x<0||u.bounds.min.x>q.bounds.width||u.bounds.max.y<0||u.bounds.min.y>q.bounds.height)){var v=b(c,u);if(!u.region||v.id!==u.region.id||k){s.broadphaseTests+=1,(!u.region||k)&&(u.region=v);var w=a(v,u.region);for(m=w.startCol;m<=w.endCol;m++)for(n=w.startRow;n<=w.endRow;n++){p=d(m,n),o=r[p];var x=m>=v.startCol&&m<=v.endCol&&n>=v.startRow&&n<=v.endRow,y=m>=u.region.startCol&&m<=u.region.endCol&&n>=u.region.startRow&&n<=u.region.endRow;!x&&y&&y&&o&&i(c,o,u),(u.region===v||x&&!y||k)&&(o||(o=e(r,p)),f(c,o,u))}u.region=v,t=!0}}}t&&(c.pairsList=j(c))},g.clear=function(a){a.buckets={},a.pairs={},a.pairsList=[]};var a=function(a,b){var d=Math.min(a.startCol,b.startCol),e=Math.max(a.endCol,b.endCol),f=Math.min(a.startRow,b.startRow),g=Math.max(a.endRow,b.endRow);return c(d,e,f,g)},b=function(a,b){var d=b.bounds,e=Math.floor(d.min.x/a.bucketWidth),f=Math.floor(d.max.x/a.bucketWidth),g=Math.floor(d.min.y/a.bucketHeight),h=Math.floor(d.max.y/a.bucketHeight);return c(e,f,g,h)},c=function(a,b,c,d){return{id:a+","+b+","+c+","+d,startCol:a,endCol:b,startRow:c,endRow:d}},d=function(a,b){return a+","+b},e=function(a,b){var c=a[b]=[];return c},f=function(a,b,c){for(var d=0;d<b.length;d++){var e=b[d];if(!(c.id===e.id||c.isStatic&&e.isStatic)){var f=h.id(c,e),g=a.pairs[f];g?g[2]+=1:a.pairs[f]=[c,e,1]}}b.push(c)},i=function(a,b,c){b.splice(b.indexOf(c),1);for(var d=0;d<b.length;d++){var e=b[d],f=h.id(c,e),g=a.pairs[f];g&&(g[2]-=1)}},j=function(a){var b,c,d=[];b=o.keys(a.pairs);for(var e=0;e<b.length;e++)c=a.pairs[b[e]],c[2]>0?d.push(c):delete a.pairs[b[e]];return d}}();var h={};!function(){h.create=function(a,b){var c=a.bodyA,d=a.bodyB,e={id:h.id(c,d),bodyA:c,bodyB:d,contacts:{},activeContacts:[],separation:0,isActive:!0,timeCreated:b,timeUpdated:b,inverseMass:c.inverseMass+d.inverseMass,friction:Math.min(c.friction,d.friction),restitution:Math.max(c.restitution,d.restitution),slop:Math.max(c.slop,d.slop)};return h.update(e,a,b),e},h.update=function(a,b,c){var d=a.contacts,f=b.supports,g=a.activeContacts;if(a.collision=b,g.length=0,b.collided){for(var i=0;i<f.length;i++){var j=f[i],k=e.id(j),l=d[k];g.push(l?l:d[k]=e.create(j))}a.separation=b.depth,h.setActive(a,!0,c)}else a.isActive===!0&&h.setActive(a,!1,c)},h.setActive=function(a,b,c){b?(a.isActive=!0,a.timeUpdated=c):(a.isActive=!1,a.activeContacts.length=0)},h.id=function(a,b){return a.id<b.id?a.id+"_"+b.id:b.id+"_"+a.id}}();var i={};!function(){var a=1e3;i.create=function(a){return o.extend({table:{},list:[],collisionStart:[],collisionActive:[],collisionEnd:[]},a)},i.update=function(a,b,c){var d,e,f,g,i=a.list,j=a.table,k=a.collisionStart,l=a.collisionEnd,m=a.collisionActive,n=[];for(k.length=0,l.length=0,m.length=0,g=0;g<b.length;g++)d=b[g],d.collided&&(e=h.id(d.bodyA,d.bodyB),n.push(e),f=j[e],f?(f.isActive?m.push(f):k.push(f),h.update(f,d,c)):(f=h.create(d,c),j[e]=f,k.push(f),i.push(f)));for(g=0;g<i.length;g++)f=i[g],f.isActive&&-1===n.indexOf(f.id)&&(h.setActive(f,!1,c),l.push(f))},i.removeOld=function(b,c){var d,e,f,g,h=b.list,i=b.table,j=[];for(g=0;g<h.length;g++)d=h[g],e=d.collision,e.bodyA.isSleeping||e.bodyB.isSleeping?d.timeUpdated=c:c-d.timeUpdated>a&&j.push(g);for(g=0;g<j.length;g++)f=j[g]-g,d=h[f],delete i[d.id],h.splice(f,1)},i.clear=function(a){return a.table={},a.list.length=0,a.collisionStart.length=0,a.collisionActive.length=0,a.collisionEnd.length=0,a}}();var j={};!function(){j.ray=function(a,b,c,d){d=d||Number.MIN_VALUE;for(var e=y.angle(b,c),f=y.magnitude(y.sub(b,c)),g=.5*(c.x+b.x),h=.5*(c.y+b.y),i=u.rectangle(g,h,f,d,{angle:e}),j=[],k=0;k<a.length;k++){var m=a[k];if(x.overlaps(m.bounds,i.bounds)){var n=l.collides(m,i);n.collided&&(n.body=n.bodyA=n.bodyB=m,j.push(n))}}return j},j.region=function(a,b,c){for(var d=[],e=0;e<a.length;e++){var f=a[e],g=x.overlaps(f.bounds,b);(g&&!c||!g&&c)&&d.push(f)}return d}}();var k={};!function(){var a=4,b=.2,c=.6;k.solvePosition=function(a,c){var d,e,f,g,h,i,j,k,l;for(d=0;d<a.length;d++)e=a[d],e.isActive&&(f=e.collision,g=f.bodyA,h=f.bodyB,i=f.supports[0],j=f.supportCorrected,k=f.normal,l=y.sub(y.add(h.positionImpulse,i),y.add(g.positionImpulse,j)),e.separation=y.dot(k,l));for(d=0;d<a.length;d++)e=a[d],e.isActive&&(f=e.collision,g=f.bodyA,h=f.bodyB,k=f.normal,positionImpulse=(e.separation*b-e.slop)*c,(g.isStatic||h.isStatic)&&(positionImpulse*=2),g.isStatic||g.isSleeping||(g.positionImpulse.x+=k.x*positionImpulse,g.positionImpulse.y+=k.y*positionImpulse),h.isStatic||h.isSleeping||(h.positionImpulse.x-=k.x*positionImpulse,h.positionImpulse.y-=k.y*positionImpulse))},k.postSolvePosition=function(a){for(var b=0;b<a.length;b++){var d=a[b];(0!==d.positionImpulse.x||0!==d.positionImpulse.y)&&(d.position.x+=d.positionImpulse.x,d.position.y+=d.positionImpulse.y,d.positionPrev.x+=d.positionImpulse.x,d.positionPrev.y+=d.positionImpulse.y,z.translate(d.vertices,d.positionImpulse),x.update(d.bounds,d.vertices,d.velocity),d.positionImpulse.x*=c,d.positionImpulse.y*=c)}},k.preSolveVelocity=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p={};for(b=0;b<a.length;b++)if(d=a[b],d.isActive)for(e=d.activeContacts,f=d.collision,g=f.bodyA,h=f.bodyB,i=f.normal,j=f.tangent,c=0;c<e.length;c++)k=e[c],l=k.vertex,m=k.normalImpulse,n=k.tangentImpulse,p.x=i.x*m+j.x*n,p.y=i.y*m+j.y*n,g.isStatic||g.isSleeping||(o=y.sub(l,g.position),g.positionPrev.x+=p.x*g.inverseMass,g.positionPrev.y+=p.y*g.inverseMass,g.anglePrev+=y.cross(o,p)*g.inverseInertia),h.isStatic||h.isSleeping||(o=y.sub(l,h.position),h.positionPrev.x-=p.x*h.inverseMass,h.positionPrev.y-=p.y*h.inverseMass,h.anglePrev-=y.cross(o,p)*h.inverseInertia)},k.solveVelocity=function(b,c){for(var d={},e=c*c,f=0;f<b.length;f++){var g=b[f];if(g.isActive){var h=g.collision,i=h.bodyA,j=h.bodyB,k=h.normal,l=h.tangent,m=g.activeContacts,n=1/m.length;i.velocity.x=i.position.x-i.positionPrev.x,i.velocity.y=i.position.y-i.positionPrev.y,j.velocity.x=j.position.x-j.positionPrev.x,j.velocity.y=j.position.y-j.positionPrev.y,i.angularVelocity=i.angle-i.anglePrev,j.angularVelocity=j.angle-j.anglePrev;for(var p=0;p<m.length;p++){var q=m[p],r=q.vertex,s=y.sub(r,i.position),t=y.sub(r,j.position),u=y.add(i.velocity,y.mult(y.perp(s),i.angularVelocity)),v=y.add(j.velocity,y.mult(y.perp(t),j.angularVelocity)),w=y.sub(u,v),x=y.dot(k,w),z=y.dot(l,w),A=Math.abs(z),B=o.sign(z),C=(1+g.restitution)*x,D=o.clamp(g.separation+x,0,1),E=z;A>D*g.friction*e&&(E=D*g.friction*e*B);var F=y.cross(s,k),G=y.cross(t,k),H=n/(g.inverseMass+i.inverseInertia*F*F+j.inverseInertia*G*G);if(C*=H,E*=H,0>x&&x*x>a*e)q.normalImpulse=0,q.tangentImpulse=0;else{var I=q.normalImpulse;q.normalImpulse=Math.min(q.normalImpulse+C,0),C=q.normalImpulse-I;var J=q.tangentImpulse;q.tangentImpulse=o.clamp(q.tangentImpulse+E,-A,A),E=q.tangentImpulse-J}d.x=k.x*C+l.x*E,d.y=k.y*C+l.y*E,i.isStatic||i.isSleeping||(i.positionPrev.x+=d.x*i.inverseMass,i.positionPrev.y+=d.y*i.inverseMass,i.anglePrev+=y.cross(s,d)*i.inverseInertia),j.isStatic||j.isSleeping||(j.positionPrev.x-=d.x*j.inverseMass,j.positionPrev.y-=d.y*j.inverseMass,j.anglePrev-=y.cross(t,d)*j.inverseInertia)}}}}}();var l={};!function(){l.collides=function(b,d,e){var f,g,h,i,j=e,k=!1;if(j){var l=b.speed*b.speed+b.angularSpeed*b.angularSpeed+d.speed*d.speed+d.angularSpeed*d.angularSpeed;k=j&&j.collided&&.2>l,i=j}else i={collided:!1,bodyA:b,bodyB:d};if(j&&k){var m=[j.bodyA.axes[j.axisNumber]];if(h=a(j.bodyA.vertices,j.bodyB.vertices,m),i.reused=!0,h.overlap<=0)return i.collided=!1,i}else{if(f=a(b.vertices,d.vertices,b.axes),f.overlap<=0)return i.collided=!1,i;if(g=a(d.vertices,b.vertices,d.axes),g.overlap<=0)return i.collided=!1,i;f.overlap<g.overlap?(h=f,i.bodyA=b,i.bodyB=d):(h=g,i.bodyA=d,i.bodyB=b),i.axisNumber=h.axisNumber}i.collided=!0,i.normal=h.axis,i.depth=h.overlap,b=i.bodyA,d=i.bodyB,y.dot(i.normal,y.sub(d.position,b.position))>0&&(i.normal=y.neg(i.normal)),i.tangent=y.perp(i.normal),i.penetration={x:i.normal.x*i.depth,y:i.normal.y*i.depth};var n=c(b,d,i.normal),o=[n[0]];if(z.contains(b.vertices,n[1]))o.push(n[1]);else{var p=c(d,b,y.neg(i.normal));z.contains(d.vertices,p[0])&&o.push(p[0]),o.length<2&&z.contains(d.vertices,p[1])&&o.push(p[1])}return i.supports=o,i.supportCorrected=y.sub(n[0],i.penetration),i};var a=function(a,c,d){for(var e,f,g={},h={},i={overlap:Number.MAX_VALUE},j=0;j<d.length;j++){if(f=d[j],b(g,a,f),b(h,c,f),e=g.min<h.min?g.max-h.min:h.max-g.min,0>=e)return i.overlap=e,i;e<i.overlap&&(i.overlap=e,i.axis=f,i.axisNumber=j)}return i},b=function(a,b,c){for(var d=y.dot(b[0],c),e=d,f=1;f<b.length;f+=1){var g=y.dot(b[f],c);g>e?e=g:d>g&&(d=g)}a.min=d,a.max=e},c=function(a,b,c){for(var d,e,f=Number.MAX_VALUE,g={x:0,y:0},h=b.vertices,i=a.position,j=h[0],k=h[1],l=0;l<h.length;l++)e=h[l],g.x=e.x-i.x,g.y=e.y-i.y,d=-y.dot(c,g),f>d&&(f=d,j=e);var m=j.index-1>=0?j.index-1:h.length-1;e=h[m],g.x=e.x-i.x,g.y=e.y-i.y,f=-y.dot(c,g),k=e;var n=(j.index+1)%h.length;return e=h[n],g.x=e.x-i.x,g.y=e.y-i.y,d=-y.dot(c,g),f>d&&(f=d,k=e),[j,k]}}();var m={};!function(){var a=1e-6,b=.001;m.create=function(b){var c=b;c.bodyA&&!c.pointA&&(c.pointA={x:0,y:0}),c.bodyB&&!c.pointB&&(c.pointB={x:0,y:0});var d=c.bodyA?y.add(c.bodyA.position,c.pointA):c.pointA,e=c.bodyB?y.add(c.bodyB.position,c.pointB):c.pointB,f=y.magnitude(y.sub(d,e));c.length=c.length||f||a;var g={visible:!0,lineWidth:2,strokeStyle:"#666"};return c.render=o.extend(g,c.render),c.id=c.id||o.nextId(),c.label=c.label||"Constraint",c.type="constraint",c.stiffness=c.stiffness||1,c.angularStiffness=c.angularStiffness||0,c.angleA=c.bodyA?c.bodyA.angle:c.angleA,c.angleB=c.bodyB?c.bodyB.angle:c.angleB,c},m.solveAll=function(a,b){for(var c=0;c<a.length;c++)m.solve(a[c],b)},m.solve=function(c,d){var e=c.bodyA,f=c.bodyB,g=c.pointA,h=c.pointB;e&&!e.isStatic&&(c.pointA=y.rotate(g,e.angle-c.angleA),c.angleA=e.angle),f&&!f.isStatic&&(c.pointB=y.rotate(h,f.angle-c.angleB),c.angleB=f.angle);var i=g,j=h;if(e&&(i=y.add(e.position,g)),f&&(j=y.add(f.position,h)),i&&j){var k=y.sub(i,j),l=y.magnitude(k);0===l&&(l=a);var m=(l-c.length)/l,n=y.div(k,l),p=y.mult(k,.5*m*c.stiffness*d*d);if(!(Math.abs(1-l/c.length)<b*d)){var q,r,s,u,v,w,x,z;e&&!e.isStatic?(s={x:i.x-e.position.x+p.x,y:i.y-e.position.y+p.y},e.velocity.x=e.position.x-e.positionPrev.x,e.velocity.y=e.position.y-e.positionPrev.y,e.angularVelocity=e.angle-e.anglePrev,q=y.add(e.velocity,y.mult(y.perp(s),e.angularVelocity)),v=y.dot(s,n),x=e.inverseMass+e.inverseInertia*v*v):(q={x:0,y:0},x=e?e.inverseMass:0),f&&!f.isStatic?(u={x:j.x-f.position.x-p.x,y:j.y-f.position.y-p.y},f.velocity.x=f.position.x-f.positionPrev.x,f.velocity.y=f.position.y-f.positionPrev.y,f.angularVelocity=f.angle-f.anglePrev,r=y.add(f.velocity,y.mult(y.perp(u),f.angularVelocity)),w=y.dot(u,n),z=f.inverseMass+f.inverseInertia*w*w):(r={x:0,y:0},z=f?f.inverseMass:0);var A=y.sub(r,q),B=y.dot(n,A)/(x+z);B>0&&(B=0);var C,D={x:n.x*B,y:n.y*B};e&&!e.isStatic&&(C=y.cross(s,D)*e.inverseInertia*(1-c.angularStiffness),t.set(e,!1),C=o.clamp(C,-.01,.01),e.constraintImpulse.x-=p.x,e.constraintImpulse.y-=p.y,e.constraintImpulse.angle+=C,e.position.x-=p.x,e.position.y-=p.y,e.angle+=C),f&&!f.isStatic&&(C=y.cross(u,D)*f.inverseInertia*(1-c.angularStiffness),t.set(f,!1),C=o.clamp(C,-.01,.01),f.constraintImpulse.x+=p.x,f.constraintImpulse.y+=p.y,f.constraintImpulse.angle-=C,f.position.x+=p.x,f.position.y+=p.y,f.angle-=C)}}},m.postSolveAll=function(a){for(var b=0;b<a.length;b++){var c=a[b],d=c.constraintImpulse;z.translate(c.vertices,d),0!==d.angle&&(z.rotate(c.vertices,d.angle,c.position),w.rotate(c.axes,d.angle),d.angle=0),x.update(c.bounds,c.vertices),d.x=0,d.y=0}}}();var n={};!function(){n.create=function(a,b){var d=a.input.mouse,e=m.create({label:"Mouse Constraint",pointA:d.position,pointB:{x:0,y:0},length:.01,stiffness:.1,angularStiffness:1,render:{strokeStyle:"#90EE90",lineWidth:3}}),f={type:"mouseConstraint",mouse:d,dragBody:null,dragPoint:null,constraint:e},g=o.extend(f,b);return q.on(a,"tick",function(){var b=c.allBodies(a.world);n.update(g,b)}),g},n.update=function(a,b){var c=a.mouse,d=a.constraint;if(0===c.button){if(!d.bodyB)for(var e=0;e<b.length;e++){var f=b[e];x.contains(f.bounds,c.position)&&z.contains(f.vertices,c.position)&&(d.pointA=c.position,d.bodyB=f,d.pointB={x:c.position.x-f.position.x,y:c.position.y-f.position.y},d.angleB=f.angle,t.set(f,!1))}}else d.bodyB=null,d.pointB=null;d.bodyB&&(t.set(d.bodyB,!1),d.pointA=c.position)}}();var o={};!function(){o._nextId=0,o.extend=function(a,b){var c,d,e;"boolean"==typeof b?(c=2,e=b):(c=1,e=!0),d=Array.prototype.slice.call(arguments,c);for(var f=0;f<d.length;f++){var g=d[f];if(g)for(var h in g)e&&g[h]&&g[h].constructor===Object?a[h]&&a[h].constructor!==Object?a[h]=g[h]:(a[h]=a[h]||{},o.extend(a[h],e,g[h])):a[h]=g[h]}return a},o.clone=function(a,b){return o.extend({},b,a)},o.keys=function(a){if(Object.keys)return Object.keys(a);var b=[];for(var c in a)b.push(c);return b},o.values=function(a){var b=[];if(Object.keys){for(var c=Object.keys(a),d=0;d<c.length;d++)b.push(a[c[d]]);return b}for(var e in a)b.push(a[e]);return b},o.shadeColor=function(a,b){var c=parseInt(a.slice(1),16),d=Math.round(2.55*b),e=(c>>16)+d,f=(c>>8&255)+d,g=(255&c)+d;return"#"+(16777216+65536*(255>e?1>e?0:e:255)+256*(255>f?1>f?0:f:255)+(255>g?1>g?0:g:255)).toString(16).slice(1)},o.shuffle=function(a){for(var b=a.length-1;b>0;b--){var c=Math.floor(Math.random()*(b+1)),d=a[b];a[b]=a[c],a[c]=d}return a},o.choose=function(a){return a[Math.floor(Math.random()*a.length)]},o.isElement=function(a){try{return a instanceof HTMLElement}catch(b){return"object"==typeof a&&1===a.nodeType&&"object"==typeof a.style&&"object"==typeof a.ownerDocument}},o.clamp=function(a,b,c){return b>a?b:a>c?c:a},o.sign=function(a){return 0>a?-1:1},o.now=function(){var a=window.performance;return a?(a.now=a.now||a.webkitNow||a.msNow||a.oNow||a.mozNow,+a.now()):+new Date},o.random=function(a,b){return a+Math.random()*(b-a)},o.colorToNumber=function(a){return a=a.replace("#",""),3==a.length&&(a=a.charAt(0)+a.charAt(0)+a.charAt(1)+a.charAt(1)+a.charAt(2)+a.charAt(2)),parseInt(a,16)},o.log=function(a,b){if(console&&console.log){var c;switch(b){case"warn":c="color: coral";break;case"error":c="color: red"}console.log("%c [Matter] "+b+": "+a,c)}},o.nextId=function(){return o._nextId++}}();var p={};!function(){var a=60,e=a,h=1e3/a,j=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(function(){a(o.now())},h)};p.create=function(b,c){c=o.isElement(b)?c:b,b=o.isElement(b)?b:null;var e={enabled:!0,positionIterations:6,velocityIterations:4,constraintIterations:2,enableSleeping:!1,timeScale:1,input:{},events:[],timing:{fps:a,timestamp:0,delta:h,correction:1,deltaMin:1e3/a,deltaMax:1e3/(.5*a),timeScale:1,isFixed:!1},render:{element:b,controller:A}},j=o.extend(e,c);return j.render=j.render.controller.create(j.render),j.world=d.create(j.world),j.pairs=i.create(),j.metrics=j.metrics||r.create(),j.input.mouse=j.input.mouse||s.create(j.render.canvas),j.broadphase=j.broadphase||{current:"grid",grid:{controller:g,instance:g.create(),detector:f.collisions},bruteForce:{detector:f.bruteForce}},j},p.run=function(a){var b,c=0,d=0,f=[],g=1;!function h(i){if(j(h),a.enabled){var k,m,o=a.timing,r={timestamp:i};q.trigger(a,"beforeTick",r),o.isFixed?k=o.delta:(k=i-b||o.delta,b=i,f.push(k),f=f.slice(-e),k=Math.min.apply(null,f),k=k<o.deltaMin?o.deltaMin:k,k=k>o.deltaMax?o.deltaMax:k,m=k/o.delta,o.delta=k),0!==g&&(m*=o.timeScale/g),0===o.timeScale&&(m=0),g=o.timeScale,d+=1,i-c>=1e3&&(o.fps=d*((i-c)/1e3),c=i,d=0),q.trigger(a,"tick",r),a.world.isModified&&a.render.controller.clear(a.render),p.update(a,k,m),n(a),l(a),p.render(a),q.trigger(a,"afterTick",r)}}()},p.update=function(a,d,e){e="undefined"!=typeof e?e:1;var f,g=a.world,h=a.timing,j=a.broadphase[a.broadphase.current],l=[];h.timestamp+=d*h.timeScale,h.correction=e;var n={timestamp:a.timing.timestamp};q.trigger(a,"beforeUpdate",n);var o=c.allBodies(g),p=c.allConstraints(g);for(r.reset(a.metrics),a.enableSleeping&&t.update(o),b.applyGravityAll(o,g.gravity),b.updateAll(o,d,h.timeScale,e,g.bounds),f=0;f<a.constraintIterations;f++)m.solveAll(p,h.timeScale);m.postSolveAll(o),j.controller?(g.isModified&&j.controller.clear(j.instance),j.controller.update(j.instance,o,a,g.isModified),l=j.instance.pairsList):l=o;var s=j.detector(l,a),u=a.pairs,v=h.timestamp;for(i.update(u,s,v),i.removeOld(u,v),a.enableSleeping&&t.afterCollisions(u.list),k.preSolveVelocity(u.list),f=0;f<a.velocityIterations;f++)k.solveVelocity(u.list,h.timeScale);for(f=0;f<a.positionIterations;f++)k.solvePosition(u.list,h.timeScale);return k.postSolvePosition(o),r.update(a.metrics,a),b.resetForcesAll(o),g.isModified&&c.setModified(g,!1,!1,!0),q.trigger(a,"afterUpdate",n),a},p.render=function(a){var b={timestamp:a.timing.timestamp};q.trigger(a,"beforeRender",b),a.render.controller.world(a),q.trigger(a,"afterRender",b)},p.merge=function(a,b){if(o.extend(a,b),b.world){a.world=b.world,p.clear(a);for(var d=c.allBodies(a.world),e=0;e<d.length;e++){var f=d[e];t.set(f,!1),f.id=o.nextId()}}},p.clear=function(a){var b=a.world;i.clear(a.pairs);var d=a.broadphase[a.broadphase.current];if(d.controller){var e=c.allBodies(b);d.controller.clear(d.instance),d.controller.update(d.instance,e,a,!0)}};var l=function(a){var b=a.input.mouse,c=b.sourceEvents;c.mousemove&&q.trigger(a,"mousemove",{mouse:b}),c.mousedown&&q.trigger(a,"mousedown",{mouse:b}),c.mouseup&&q.trigger(a,"mouseup",{mouse:b}),s.clearSourceEvents(b)},n=function(a){var b=a.pairs;b.collisionStart.length>0&&q.trigger(a,"collisionStart",{pairs:b.collisionStart}),b.collisionActive.length>0&&q.trigger(a,"collisionActive",{pairs:b.collisionActive}),b.collisionEnd.length>0&&q.trigger(a,"collisionEnd",{pairs:b.collisionEnd})}}();var q={};!function(){q.on=function(a,b,c){for(var d,e=b.split(" "),f=0;f<e.length;f++)d=e[f],a.events=a.events||{},a.events[d]=a.events[d]||[],a.events[d].push(c);return c},q.off=function(a,b,c){if(!b)return void(a.events={});"function"==typeof b&&(c=b,b=o.keys(a.events).join(" "));for(var d=b.split(" "),e=0;e<d.length;e++){var f=a.events[d[e]],g=[];if(c)for(var h=0;h<f.length;h++)f[h]!==c&&g.push(f[h]);a.events[d[e]]=g}},q.trigger=function(a,b,c){var d,e,f,g;if(a.events){c||(c={}),d=b.split(" ");for(var h=0;h<d.length;h++)if(e=d[h],f=a.events[e]){g=o.clone(c,!1),g.name=e,g.source=a;for(var i=0;i<f.length;i++)f[i].apply(a,[g])}}}}();var r={};!function(){r.create=function(){return{extended:!1,narrowDetections:0,narrowphaseTests:0,narrowReuse:0,narrowReuseCount:0,midphaseTests:0,broadphaseTests:0,narrowEff:1e-4,midEff:1e-4,broadEff:1e-4,collisions:0,buckets:0,bodies:0,pairs:0}},r.reset=function(a){a.extended&&(a.narrowDetections=0,a.narrowphaseTests=0,a.narrowReuse=0,a.narrowReuseCount=0,a.midphaseTests=0,a.broadphaseTests=0,a.narrowEff=0,a.midEff=0,a.broadEff=0,a.collisions=0,a.buckets=0,a.pairs=0,a.bodies=0)},r.update=function(a,b){if(a.extended){var d=b.world,e=(b.broadphase[b.broadphase.current],c.allBodies(d));a.collisions=a.narrowDetections,a.pairs=b.pairs.list.length,a.bodies=e.length,a.midEff=(a.narrowDetections/(a.midphaseTests||1)).toFixed(2),a.narrowEff=(a.narrowDetections/(a.narrowphaseTests||1)).toFixed(2),a.broadEff=(1-a.broadphaseTests/(e.length||1)).toFixed(2),a.narrowReuse=(a.narrowReuseCount/(a.narrowphaseTests||1)).toFixed(2)}}}();var s;!function(){s=function(b){var c=this;this.element=b||document.body,this.absolute={x:0,y:0},this.position={x:0,y:0},this.mousedownPosition={x:0,y:0},this.mouseupPosition={x:0,y:0},this.offset={x:0,y:0},this.scale={x:1,y:1},this.wheelDelta=0,this.button=-1,this.sourceEvents={mousemove:null,mousedown:null,mouseup:null,mousewheel:null},this.mousemove=function(b){var d=a(b,c.element),e=b.changedTouches;e&&(c.button=0,b.preventDefault()),c.absolute.x=d.x,c.absolute.y=d.y,c.position.x=c.absolute.x*c.scale.x+c.offset.x,c.position.y=c.absolute.y*c.scale.y+c.offset.y,c.sourceEvents.mousemove=b},this.mousedown=function(b){var d=a(b,c.element),e=b.changedTouches;e?(c.button=0,b.preventDefault()):c.button=b.button,c.absolute.x=d.x,c.absolute.y=d.y,c.position.x=c.absolute.x*c.scale.x+c.offset.x,c.position.y=c.absolute.y*c.scale.y+c.offset.y,c.mousedownPosition.x=c.position.x,c.mousedownPosition.y=c.position.y,c.sourceEvents.mousedown=b},this.mouseup=function(b){var d=a(b,c.element),e=b.changedTouches;e&&b.preventDefault(),c.button=-1,c.absolute.x=d.x,c.absolute.y=d.y,c.position.x=c.absolute.x*c.scale.x+c.offset.x,c.position.y=c.absolute.y*c.scale.y+c.offset.y,c.mouseupPosition.x=c.position.x,c.mouseupPosition.y=c.position.y,c.sourceEvents.mouseup=b},this.mousewheel=function(a){c.wheelDelta=Math.max(-1,Math.min(1,a.wheelDelta||-a.detail)),a.preventDefault()},s.setElement(c,c.element)},s.create=function(a){return new s(a)},s.setElement=function(a,b){a.element=b,b.addEventListener("mousemove",a.mousemove),b.addEventListener("mousedown",a.mousedown),b.addEventListener("mouseup",a.mouseup),b.addEventListener("mousewheel",a.mousewheel),b.addEventListener("DOMMouseScroll",a.mousewheel),b.addEventListener("touchmove",a.mousemove),b.addEventListener("touchstart",a.mousedown),b.addEventListener("touchend",a.mouseup)},s.clearSourceEvents=function(a){a.sourceEvents.mousemove=null,a.sourceEvents.mousedown=null,a.sourceEvents.mouseup=null,a.sourceEvents.mousewheel=null,a.wheelDelta=0},s.setOffset=function(a,b){a.offset.x=b.x,a.offset.y=b.y,a.position.x=a.absolute.x*a.scale.x+a.offset.x,a.position.y=a.absolute.y*a.scale.y+a.offset.y},s.setScale=function(a,b){a.scale.x=b.x,a.scale.y=b.y,a.position.x=a.absolute.x*a.scale.x+a.offset.x,a.position.y=a.absolute.y*a.scale.y+a.offset.y};var a=function(a,b){var c,d,e=b.getBoundingClientRect(),f=document.documentElement||document.body.parentNode||document.body,g=void 0!==window.pageXOffset?window.pageXOffset:f.scrollLeft,h=void 0!==window.pageYOffset?window.pageYOffset:f.scrollTop,i=a.changedTouches;return i?(c=i[0].pageX-e.left-g,d=i[0].pageY-e.top-h):(c=a.pageX-e.left-g,d=a.pageY-e.top-h),{x:c/(b.clientWidth/b.width),y:d/(b.clientHeight/b.height)}}}();var t={};!function(){var a=.18,b=.08,c=.9;t.update=function(a){for(var d=0;d<a.length;d++){var e=a[d],f=e.speed*e.speed+e.angularSpeed*e.angularSpeed;if(e.force.x>0||e.force.y>0)t.set(e,!1);else{var g=Math.min(e.motion,f),h=Math.max(e.motion,f);e.motion=c*g+(1-c)*h,e.sleepThreshold>0&&e.motion<b?(e.sleepCounter+=1,e.sleepCounter>=e.sleepThreshold&&t.set(e,!0)):e.sleepCounter>0&&(e.sleepCounter-=1)}}},t.afterCollisions=function(b){for(var c=0;c<b.length;c++){var d=b[c];if(d.isActive){var e=d.collision,f=e.bodyA,g=e.bodyB;if(!(f.isSleeping&&g.isSleeping||f.isStatic||g.isStatic)&&(f.isSleeping||g.isSleeping)){var h=f.isSleeping&&!f.isStatic?f:g,i=h===f?g:f;!h.isStatic&&i.motion>a&&t.set(h,!1)}}}},t.set=function(a,b){b?(a.isSleeping=!0,a.sleepCounter=a.sleepThreshold,a.positionImpulse.x=0,a.positionImpulse.y=0,a.positionPrev.x=a.position.x,a.positionPrev.y=a.position.y,a.anglePrev=a.angle,a.speed=0,a.angularSpeed=0,a.motion=0):(a.isSleeping=!1,a.sleepCounter=0)}}();var u={};!function(){u.rectangle=function(a,c,d,e,f){f=f||{};var g={label:"Rectangle Body",position:{x:a,y:c},vertices:z.fromPath("L 0 0 L "+d+" 0 L "+d+" "+e+" L 0 "+e)};if(f.chamfer){var h=f.chamfer;g.vertices=z.chamfer(g.vertices,h.radius,h.quality,h.qualityMin,h.qualityMax),delete f.chamfer}return b.create(o.extend({},g,f))},u.trapezoid=function(a,c,d,e,f,g){g=g||{},f*=.5;var h=(1-2*f)*d,i=d*f,j=i+h,k=j+i,l={label:"Trapezoid Body",position:{x:a,y:c},vertices:z.fromPath("L 0 0 L "+i+" "+-e+" L "+j+" "+-e+" L "+k+" 0")};
	if(g.chamfer){var m=g.chamfer;l.vertices=z.chamfer(l.vertices,m.radius,m.quality,m.qualityMin,m.qualityMax),delete g.chamfer}return b.create(o.extend({},l,g))},u.circle=function(a,b,c,d,e){d=d||{},d.label="Circle Body",e=e||25;var f=Math.ceil(Math.max(10,Math.min(e,c)));return f%2===1&&(f+=1),d.circleRadius=c,u.polygon(a,b,f,c,d)},u.polygon=function(a,c,d,e,f){if(f=f||{},3>d)return u.circle(a,c,e,f);for(var g=2*Math.PI/d,h="",i=.5*g,j=0;d>j;j+=1){var k=i+j*g,l=Math.cos(k)*e,m=Math.sin(k)*e;h+="L "+l.toFixed(3)+" "+m.toFixed(3)+" "}var n={label:"Polygon Body",position:{x:a,y:c},vertices:z.fromPath(h)};if(f.chamfer){var p=f.chamfer;n.vertices=z.chamfer(n.vertices,p.radius,p.quality,p.qualityMin,p.qualityMax),delete f.chamfer}return b.create(o.extend({},n,f))}}();var v={};!function(){v.stack=function(a,d,e,f,g,h,i){for(var j,k=c.create({label:"Stack"}),l=a,m=d,n=0,o=0;f>o;o++){for(var p=0,q=0;e>q;q++){var r=i(l,m,q,o,j,n);if(r){var s=r.bounds.max.y-r.bounds.min.y,t=r.bounds.max.x-r.bounds.min.x;s>p&&(p=s),b.translate(r,{x:.5*t,y:.5*s}),l=r.bounds.max.x+g,c.addBody(k,r),j=r,n+=1}}m+=p+h,l=a}return k},v.chain=function(a,b,d,e,f,g){for(var h=a.bodies,i=1;i<h.length;i++){var j=h[i-1],k=h[i],l=j.bounds.max.y-j.bounds.min.y,n=j.bounds.max.x-j.bounds.min.x,p=k.bounds.max.y-k.bounds.min.y,q=k.bounds.max.x-k.bounds.min.x,r={bodyA:j,pointA:{x:n*b,y:l*d},bodyB:k,pointB:{x:q*e,y:p*f}},s=o.extend(r,g);c.addConstraint(a,m.create(s))}return a.label+=" Chain",a},v.mesh=function(a,b,d,e,f){var g,h,i,j,k,l=a.bodies;for(g=0;d>g;g++){for(h=0;b>h;h++)h>0&&(i=l[h-1+g*b],j=l[h+g*b],c.addConstraint(a,m.create(o.extend({bodyA:i,bodyB:j},f))));for(h=0;b>h;h++)g>0&&(i=l[h+(g-1)*b],j=l[h+g*b],c.addConstraint(a,m.create(o.extend({bodyA:i,bodyB:j},f))),e&&h>0&&(k=l[h-1+(g-1)*b],c.addConstraint(a,m.create(o.extend({bodyA:k,bodyB:j},f)))),e&&b-1>h&&(k=l[h+1+(g-1)*b],c.addConstraint(a,m.create(o.extend({bodyA:k,bodyB:j},f)))))}return a.label+=" Mesh",a},v.pyramid=function(a,c,d,e,f,g,h){return v.stack(a,c,d,e,f,g,function(c,g,i,j,k,l){var m=Math.min(e,Math.ceil(d/2)),n=k?k.bounds.max.x-k.bounds.min.x:0;if(!(j>m)){j=m-j;var o=j,p=d-1-j;if(!(o>i||i>p)){1===l&&b.translate(k,{x:(i+(d%2===1?1:-1))*n,y:0});var q=k?i*n:0;return h(a+q+i*f,g,i,j,k,l)}}})},v.newtonsCradle=function(a,b,d,e,f){for(var g=c.create({label:"Newtons Cradle"}),h=0;d>h;h++){var i=1.9,j=u.circle(a+h*e*i,b+f,e,{inertia:99999,restitution:1,friction:0,frictionAir:1e-4,slop:.01}),k=m.create({pointA:{x:a+h*e*i,y:b},bodyB:j});c.addBody(g,j),c.addConstraint(g,k)}return g},v.car=function(a,d,e,f,g){var h=b.nextGroupId(),i=-20,j=.5*-e+i,k=.5*e-i,l=0,n=c.create({label:"Car"}),o=u.trapezoid(a,d,e,f,.3,{groupId:h,friction:.01,chamfer:{radius:10}}),p=u.circle(a+j,d+l,g,{groupId:h,restitution:.5,friction:.9,density:.01}),q=u.circle(a+k,d+l,g,{groupId:h,restitution:.5,friction:.9,density:.01}),r=m.create({bodyA:o,pointA:{x:j,y:l},bodyB:p,stiffness:.5}),s=m.create({bodyA:o,pointA:{x:k,y:l},bodyB:q,stiffness:.5});return c.addBody(n,o),c.addBody(n,p),c.addBody(n,q),c.addConstraint(n,r),c.addConstraint(n,s),n},v.softBody=function(a,b,c,d,e,f,g,h,i,j){i=o.extend({inertia:1/0},i),j=o.extend({stiffness:.4},j);var k=v.stack(a,b,c,d,e,f,function(a,b){return u.circle(a,b,h,i)});return v.mesh(k,c,d,g,j),k.label="Soft Body",k}}();var w={};!function(){w.fromVertices=function(a){for(var b={},c=0;c<a.length;c++){var d=(c+1)%a.length,e=y.normalise({x:a[d].y-a[c].y,y:a[c].x-a[d].x}),f=0===e.y?1/0:e.x/e.y;f=f.toFixed(3).toString(),b[f]=e}return o.values(b)},w.rotate=function(a,b){if(0!==b)for(var c=Math.cos(b),d=Math.sin(b),e=0;e<a.length;e++){var f,g=a[e];f=g.x*c-g.y*d,g.y=g.x*d+g.y*c,g.x=f}}}();var x={};!function(){x.create=function(a){var b={min:{x:0,y:0},max:{x:0,y:0}};return a&&x.update(b,a),b},x.update=function(a,b,c){a.min.x=Number.MAX_VALUE,a.max.x=Number.MIN_VALUE,a.min.y=Number.MAX_VALUE,a.max.y=Number.MIN_VALUE;for(var d=0;d<b.length;d++){var e=b[d];e.x>a.max.x&&(a.max.x=e.x),e.x<a.min.x&&(a.min.x=e.x),e.y>a.max.y&&(a.max.y=e.y),e.y<a.min.y&&(a.min.y=e.y)}c&&(c.x>0?a.max.x+=c.x:a.min.x+=c.x,c.y>0?a.max.y+=c.y:a.min.y+=c.y)},x.contains=function(a,b){return b.x>=a.min.x&&b.x<=a.max.x&&b.y>=a.min.y&&b.y<=a.max.y},x.overlaps=function(a,b){return a.min.x<=b.max.x&&a.max.x>=b.min.x&&a.max.y>=b.min.y&&a.min.y<=b.max.y},x.translate=function(a,b){a.min.x+=b.x,a.max.x+=b.x,a.min.y+=b.y,a.max.y+=b.y},x.shift=function(a,b){var c=a.max.x-a.min.x,d=a.max.y-a.min.y;a.min.x=b.x,a.max.x=b.x+c,a.min.y=b.y,a.max.y=b.y+d}}();var y={};!function(){y.magnitude=function(a){return Math.sqrt(a.x*a.x+a.y*a.y)},y.magnitudeSquared=function(a){return a.x*a.x+a.y*a.y},y.rotate=function(a,b){var c=Math.cos(b),d=Math.sin(b);return{x:a.x*c-a.y*d,y:a.x*d+a.y*c}},y.rotateAbout=function(a,b,c){var d=Math.cos(b),e=Math.sin(b);return{x:c.x+((a.x-c.x)*d-(a.y-c.y)*e),y:c.y+((a.x-c.x)*e+(a.y-c.y)*d)}},y.normalise=function(a){var b=y.magnitude(a);return 0===b?{x:0,y:0}:{x:a.x/b,y:a.y/b}},y.dot=function(a,b){return a.x*b.x+a.y*b.y},y.cross=function(a,b){return a.x*b.y-a.y*b.x},y.add=function(a,b){return{x:a.x+b.x,y:a.y+b.y}},y.sub=function(a,b){return{x:a.x-b.x,y:a.y-b.y}},y.mult=function(a,b){return{x:a.x*b,y:a.y*b}},y.div=function(a,b){return{x:a.x/b,y:a.y/b}},y.perp=function(a,b){return b=b===!0?-1:1,{x:b*-a.y,y:b*a.x}},y.neg=function(a){return{x:-a.x,y:-a.y}},y.angle=function(a,b){return Math.atan2(b.y-a.y,b.x-a.x)}}();var z={};!function(){z.create=function(a,b){for(var c=0;c<a.length;c++)a[c].index=c,a[c].body=b},z.fromPath=function(a){var b=/L\s*([\-\d\.]*)\s*([\-\d\.]*)/gi,c=[];return a.replace(b,function(a,b,d){c.push({x:parseFloat(b,10),y:parseFloat(d,10)})}),c},z.centre=function(a){for(var b,c,d,e=z.area(a,!0),f={x:0,y:0},g=0;g<a.length;g++)d=(g+1)%a.length,b=y.cross(a[g],a[d]),c=y.mult(y.add(a[g],a[d]),b),f=y.add(f,c);return y.div(f,6*e)},z.area=function(a,b){for(var c=0,d=a.length-1,e=0;e<a.length;e++)c+=(a[d].x-a[e].x)*(a[d].y+a[e].y),d=e;return b?c/2:Math.abs(c)/2},z.inertia=function(a,b){for(var c,d,e=0,f=0,g=a,h=0;h<g.length;h++)d=(h+1)%g.length,c=Math.abs(y.cross(g[d],g[h])),e+=c*(y.dot(g[d],g[d])+y.dot(g[d],g[h])+y.dot(g[h],g[h])),f+=c;return b/6*(e/f)},z.translate=function(a,b,c){var d;if(c)for(d=0;d<a.length;d++)a[d].x+=b.x*c,a[d].y+=b.y*c;else for(d=0;d<a.length;d++)a[d].x+=b.x,a[d].y+=b.y},z.rotate=function(a,b,c){if(0!==b)for(var d=Math.cos(b),e=Math.sin(b),f=0;f<a.length;f++){var g=a[f],h=g.x-c.x,i=g.y-c.y;g.x=c.x+(h*d-i*e),g.y=c.y+(h*e+i*d)}},z.contains=function(a,b){for(var c=0;c<a.length;c++){var d=a[c],e=a[(c+1)%a.length];if((b.x-d.x)*(e.y-d.y)+(b.y-d.y)*(d.x-e.x)>0)return!1}return!0},z.scale=function(a,b,c,d){if(1===b&&1===c)return a;d=d||z.centre(a);for(var e,f,g=0;g<a.length;g++)e=a[g],f=y.sub(e,d),a[g].x=d.x+f.x*b,a[g].y=d.y+f.y*c;return a},z.chamfer=function(a,b,c,d,e){b=b||[8],b.length||(b=[b]),c="undefined"!=typeof c?c:-1,d=d||2,e=e||14;for(var f=(z.centre(a),[]),g=0;g<a.length;g++){var h=a[g-1>=0?g-1:a.length-1],i=a[g],j=a[(g+1)%a.length],k=b[g<b.length?g:b.length-1];if(0!==k){var l=y.normalise({x:i.y-h.y,y:h.x-i.x}),m=y.normalise({x:j.y-i.y,y:i.x-j.x}),n=Math.sqrt(2*Math.pow(k,2)),p=y.mult(o.clone(l),k),q=y.normalise(y.mult(y.add(l,m),.5)),r=y.sub(i,y.mult(q,n)),s=c;-1===c&&(s=1.75*Math.pow(k,.32)),s=o.clamp(s,d,e),s%2===1&&(s+=1);for(var t=Math.acos(y.dot(l,m)),u=t/s,v=0;s>v;v++)f.push(y.add(y.rotate(p,u*v),r))}else f.push(i)}return f}}();var A={};!function(){A.create=function(b){var c={controller:A,element:null,canvas:null,options:{width:800,height:600,background:"#fafafa",wireframeBackground:"#222",hasBounds:!1,enabled:!0,wireframes:!0,showSleeping:!0,showDebug:!1,showBroadphase:!1,showBounds:!1,showVelocity:!1,showCollisions:!1,showAxes:!1,showPositions:!1,showAngleIndicator:!1,showIds:!1,showShadows:!1}},d=o.extend(c,b);return d.canvas=d.canvas||a(d.options.width,d.options.height),d.context=d.canvas.getContext("2d"),d.textures={},d.bounds=d.bounds||{min:{x:0,y:0},max:{x:d.options.width,y:d.options.height}},A.setBackground(d,d.options.background),o.isElement(d.element)?d.element.appendChild(d.canvas):o.log('No "render.element" passed, "render.canvas" was not inserted into document.',"warn"),d},A.clear=function(){},A.setBackground=function(a,b){if(a.currentBackground!==b){var c=b;/(jpg|gif|png)$/.test(b)&&(c="url("+b+")"),a.canvas.style.background=c,a.canvas.style.backgroundSize="contain",a.currentBackground=b}},A.world=function(a){var b,d=a.render,e=a.world,f=d.canvas,g=d.context,h=d.options,i=c.allBodies(e),j=c.allConstraints(e),k=[],l=[];h.wireframes?A.setBackground(d,h.wireframeBackground):A.setBackground(d,h.background),g.globalCompositeOperation="source-in",g.fillStyle="transparent",g.fillRect(0,0,f.width,f.height),g.globalCompositeOperation="source-over";var m=d.bounds.max.x-d.bounds.min.x,n=d.bounds.max.y-d.bounds.min.y,o=m/d.options.width,p=n/d.options.height;if(h.hasBounds){for(b=0;b<i.length;b++){var q=i[b];x.overlaps(q.bounds,d.bounds)&&k.push(q)}for(b=0;b<j.length;b++){var r=j[b],s=r.bodyA,t=r.bodyB,u=r.pointA,v=r.pointB;s&&(u=y.add(s.position,r.pointA)),t&&(v=y.add(t.position,r.pointB)),u&&v&&(x.contains(d.bounds,u)||x.contains(d.bounds,v))&&l.push(r)}g.scale(1/o,1/p),g.translate(-d.bounds.min.x,-d.bounds.min.y)}else l=j,k=i;!h.wireframes||a.enableSleeping&&h.showSleeping?A.bodies(a,k,g):A.bodyWireframes(a,k,g),h.showBounds&&A.bodyBounds(a,k,g),(h.showAxes||h.showAngleIndicator)&&A.bodyAxes(a,k,g),h.showPositions&&A.bodyPositions(a,k,g),h.showVelocity&&A.bodyVelocity(a,k,g),h.showIds&&A.bodyIds(a,k,g),h.showCollisions&&A.collisions(a,a.pairs.list,g),A.constraints(l,g),h.showBroadphase&&"grid"===a.broadphase.current&&A.grid(a,a.broadphase[a.broadphase.current].instance,g),h.showDebug&&A.debug(a,g),h.hasBounds&&g.setTransform(1,0,0,1,0,0)},A.debug=function(a,b){var d=b,e=a.world,f=a.render,h=f.options,i=c.allBodies(e),j="    ";if(a.timing.timestamp-(f.debugTimestamp||0)>=500){var k="";k+="fps: "+Math.round(a.timing.fps)+j,a.metrics.extended&&(k+="delta: "+a.timing.delta.toFixed(3)+j,k+="correction: "+a.timing.correction.toFixed(3)+j,k+="bodies: "+i.length+j,a.broadphase.controller===g&&(k+="buckets: "+a.metrics.buckets+j),k+="\n",k+="collisions: "+a.metrics.collisions+j,k+="pairs: "+a.pairs.list.length+j,k+="broad: "+a.metrics.broadEff+j,k+="mid: "+a.metrics.midEff+j,k+="narrow: "+a.metrics.narrowEff+j),f.debugString=k,f.debugTimestamp=a.timing.timestamp}if(f.debugString){d.font="12px Arial",d.fillStyle=h.wireframes?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.5)";for(var l=f.debugString.split("\n"),m=0;m<l.length;m++)d.fillText(l[m],50,50+18*m)}},A.constraints=function(a,b){for(var c=b,d=0;d<a.length;d++){var e=a[d];if(e.render.visible&&e.pointA&&e.pointB){var f=e.bodyA,g=e.bodyB;f?(c.beginPath(),c.moveTo(f.position.x+e.pointA.x,f.position.y+e.pointA.y)):(c.beginPath(),c.moveTo(e.pointA.x,e.pointA.y)),g?c.lineTo(g.position.x+e.pointB.x,g.position.y+e.pointB.y):c.lineTo(e.pointB.x,e.pointB.y),c.lineWidth=e.render.lineWidth,c.strokeStyle=e.render.strokeStyle,c.stroke()}}},A.bodyShadows=function(a,b,c){for(var d=c,e=a.render,f=(e.options,0);f<b.length;f++){var g=b[f];if(g.render.visible){if(g.circleRadius)d.beginPath(),d.arc(g.position.x,g.position.y,g.circleRadius,0,2*Math.PI),d.closePath();else{d.beginPath(),d.moveTo(g.vertices[0].x,g.vertices[0].y);for(var h=1;h<g.vertices.length;h++)d.lineTo(g.vertices[h].x,g.vertices[h].y);d.closePath()}var i=g.position.x-.5*e.options.width,j=g.position.y-.2*e.options.height,k=Math.abs(i)+Math.abs(j);d.shadowColor="rgba(0,0,0,0.15)",d.shadowOffsetX=.05*i,d.shadowOffsetY=.05*j,d.shadowBlur=1+12*Math.min(1,k/1e3),d.fill(),d.shadowColor=null,d.shadowOffsetX=null,d.shadowOffsetY=null,d.shadowBlur=null}}},A.bodies=function(a,c,d){var e,f=d,g=a.render,h=g.options;for(e=0;e<c.length;e++){var i=c[e];if(i.render.visible)if(i.render.sprite&&i.render.sprite.texture&&!h.wireframes){var j=i.render.sprite,k=b(g,j.texture);h.showSleeping&&i.isSleeping&&(f.globalAlpha=.5),f.translate(i.position.x,i.position.y),f.rotate(i.angle),f.drawImage(k,k.width*-.5*j.xScale,k.height*-.5*j.yScale,k.width*j.xScale,k.height*j.yScale),f.rotate(-i.angle),f.translate(-i.position.x,-i.position.y),h.showSleeping&&i.isSleeping&&(f.globalAlpha=1)}else{if(i.circleRadius)f.beginPath(),f.arc(i.position.x,i.position.y,i.circleRadius,0,2*Math.PI);else{f.beginPath(),f.moveTo(i.vertices[0].x,i.vertices[0].y);for(var l=1;l<i.vertices.length;l++)f.lineTo(i.vertices[l].x,i.vertices[l].y);f.closePath()}h.wireframes?(f.lineWidth=1,f.strokeStyle="#bbb",h.showSleeping&&i.isSleeping&&(f.strokeStyle="rgba(255,255,255,0.2)"),f.stroke()):(f.fillStyle=h.showSleeping&&i.isSleeping?o.shadeColor(i.render.fillStyle,50):i.render.fillStyle,f.lineWidth=i.render.lineWidth,f.strokeStyle=i.render.strokeStyle,f.fill(),f.stroke())}}},A.bodyWireframes=function(a,b,c){var d,e,f=c;for(f.beginPath(),d=0;d<b.length;d++){var g=b[d];if(g.render.visible){for(f.moveTo(g.vertices[0].x,g.vertices[0].y),e=1;e<g.vertices.length;e++)f.lineTo(g.vertices[e].x,g.vertices[e].y);f.lineTo(g.vertices[0].x,g.vertices[0].y)}}f.lineWidth=1,f.strokeStyle="#bbb",f.stroke()},A.bodyBounds=function(a,b,c){var d=c,e=a.render,f=e.options;d.beginPath();for(var g=0;g<b.length;g++){var h=b[g];h.render.visible&&d.rect(h.bounds.min.x,h.bounds.min.y,h.bounds.max.x-h.bounds.min.x,h.bounds.max.y-h.bounds.min.y)}d.strokeStyle=f.wireframes?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.1)",d.lineWidth=1,d.stroke()},A.bodyAxes=function(a,b,c){var d,e,f=c,g=a.render,h=g.options;for(f.beginPath(),d=0;d<b.length;d++){var i=b[d];if(i.render.visible)if(h.showAxes)for(e=0;e<i.axes.length;e++){var j=i.axes[e];f.moveTo(i.position.x,i.position.y),f.lineTo(i.position.x+20*j.x,i.position.y+20*j.y)}else f.moveTo(i.position.x,i.position.y),f.lineTo((i.vertices[0].x+i.vertices[i.vertices.length-1].x)/2,(i.vertices[0].y+i.vertices[i.vertices.length-1].y)/2)}f.strokeStyle=h.wireframes?"indianred":"rgba(0,0,0,0.3)",f.lineWidth=1,f.stroke()},A.bodyPositions=function(a,b,c){var d,e,f=c,g=a.render,h=g.options;for(f.beginPath(),e=0;e<b.length;e++)d=b[e],d.render.visible&&(f.arc(d.position.x,d.position.y,3,0,2*Math.PI,!1),f.closePath());for(f.fillStyle=h.wireframes?"indianred":"rgba(0,0,0,0.5)",f.fill(),f.beginPath(),e=0;e<b.length;e++)d=b[e],d.render.visible&&(f.arc(d.positionPrev.x,d.positionPrev.y,2,0,2*Math.PI,!1),f.closePath());f.fillStyle="rgba(255,165,0,0.8)",f.fill()},A.bodyVelocity=function(a,b,c){{var d=c,e=a.render;e.options}d.beginPath();for(var f=0;f<b.length;f++){var g=b[f];g.render.visible&&(d.moveTo(g.position.x,g.position.y),d.lineTo(g.position.x+2*(g.position.x-g.positionPrev.x),g.position.y+2*(g.position.y-g.positionPrev.y)))}d.lineWidth=3,d.strokeStyle="cornflowerblue",d.stroke()},A.bodyIds=function(a,b,c){for(var d=c,e=0;e<b.length;e++){var f=b[e];f.render.visible&&(d.font="12px Arial",d.fillStyle="rgba(255,255,255,0.5)",d.fillText(f.id,f.position.x+10,f.position.y-10))}},A.collisions=function(a,b,c){var d,e,f,g,h=c,i=a.render.options;for(h.beginPath(),f=0;f<b.length;f++)for(d=b[f],e=d.collision,g=0;g<d.activeContacts.length;g++){var j=d.activeContacts[g],k=j.vertex;h.rect(k.x-1.5,k.y-1.5,3.5,3.5)}for(h.fillStyle=i.wireframes?"rgba(255,255,255,0.7)":"orange",h.fill(),h.beginPath(),f=0;f<b.length;f++)if(d=b[f],e=d.collision,d.activeContacts.length>0){var l=d.activeContacts[0].vertex.x,m=d.activeContacts[0].vertex.y;2===d.activeContacts.length&&(l=(d.activeContacts[0].vertex.x+d.activeContacts[1].vertex.x)/2,m=(d.activeContacts[0].vertex.y+d.activeContacts[1].vertex.y)/2),h.moveTo(l-8*e.normal.x,m-8*e.normal.y),h.lineTo(l,m)}h.strokeStyle=i.wireframes?"rgba(255,165,0,0.7)":"orange",h.lineWidth=1,h.stroke()},A.grid=function(a,b,c){var d=c,e=a.render.options;d.strokeStyle=e.wireframes?"rgba(255,180,0,0.1)":"rgba(255,180,0,0.5)",d.beginPath();for(var f=o.keys(b.buckets),g=0;g<f.length;g++){var h=f[g];if(!(b.buckets[h].length<2)){var i=h.split(",");d.rect(.5+parseInt(i[0],10)*b.bucketWidth,.5+parseInt(i[1],10)*b.bucketHeight,b.bucketWidth,b.bucketHeight)}}d.lineWidth=1,d.stroke()},A.inspector=function(a,b){var c,d=a.engine,e=(d.input.mouse,a.selected),f=d.render,g=f.options;if(g.hasBounds){var h=f.bounds.max.x-f.bounds.min.x,i=f.bounds.max.y-f.bounds.min.y,j=h/f.options.width,k=i/f.options.height;b.scale(1/j,1/k),b.translate(-f.bounds.min.x,-f.bounds.min.y)}for(var l=0;l<e.length;l++){var m=e[l].data;switch(b.translate(.5,.5),b.lineWidth=1,b.strokeStyle="rgba(255,165,0,0.9)",b.setLineDash([1,2]),m.type){case"body":c=m.bounds,b.beginPath(),b.rect(Math.floor(c.min.x-3),Math.floor(c.min.y-3),Math.floor(c.max.x-c.min.x+6),Math.floor(c.max.y-c.min.y+6)),b.closePath(),b.stroke();break;case"constraint":var n=m.pointA;m.bodyA&&(n=m.pointB),b.beginPath(),b.arc(n.x,n.y,10,0,2*Math.PI),b.closePath(),b.stroke()}b.setLineDash([0]),b.translate(-.5,-.5)}null!==a.selectStart&&(b.translate(.5,.5),b.lineWidth=1,b.strokeStyle="rgba(255,165,0,0.6)",b.fillStyle="rgba(255,165,0,0.1)",c=a.selectBounds,b.beginPath(),b.rect(Math.floor(c.min.x),Math.floor(c.min.y),Math.floor(c.max.x-c.min.x),Math.floor(c.max.y-c.min.y)),b.closePath(),b.stroke(),b.fill(),b.translate(-.5,-.5)),g.hasBounds&&b.setTransform(1,0,0,1,0,0)};var a=function(a,b){var c=document.createElement("canvas");return c.width=a,c.height=b,c.oncontextmenu=function(){return!1},c.onselectstart=function(){return!1},c},b=function(a,b){var c=a.textures[b];return c?c:(c=a.textures[b]=new Image,c.src=b,c)}}();var B={};!function(){B.create=function(a){var b={controller:B,element:null,canvas:null,options:{width:800,height:600,background:"#fafafa",wireframeBackground:"#222",enabled:!0,wireframes:!0,showSleeping:!0,showDebug:!1,showBroadphase:!1,showBounds:!1,showVelocity:!1,showCollisions:!1,showAxes:!1,showPositions:!1,showAngleIndicator:!1,showIds:!1,showShadows:!1}},c=o.extend(b,a);return c.context=new PIXI.WebGLRenderer(800,600,c.canvas,!1,!0),c.canvas=c.context.view,c.stage=new PIXI.Stage,c.textures={},c.sprites={},c.primitives={},c.spriteBatch=new PIXI.SpriteBatch,c.stage.addChild(c.spriteBatch),o.isElement(c.element)?c.element.appendChild(c.canvas):o.log('No "render.element" passed, "render.canvas" was not inserted into document.',"warn"),c.canvas.oncontextmenu=function(){return!1},c.canvas.onselectstart=function(){return!1},c},B.clear=function(a){for(var b=a.stage,c=a.spriteBatch;b.children[0];)b.removeChild(b.children[0]);for(;c.children[0];)c.removeChild(c.children[0]);var d=a.sprites["bg-0"];a.textures={},a.sprites={},a.primitives={},a.sprites["bg-0"]=d,d&&c.addChildAt(d,0),a.stage.addChild(a.spriteBatch),a.currentBackground=null},B.setBackground=function(a,b){if(a.currentBackground!==b){var c=b.indexOf&&-1!==b.indexOf("#"),e=a.sprites["bg-0"];if(c){var f=o.colorToNumber(b);a.stage.setBackgroundColor(f),e&&a.spriteBatch.removeChild(e)}else if(!e){var g=d(a,b);e=a.sprites["bg-0"]=new PIXI.Sprite(g),e.position.x=0,e.position.y=0,a.spriteBatch.addChildAt(e,0)}a.currentBackground=b}},B.world=function(a){var b,d=a.render,e=a.world,f=d.context,g=d.stage,h=d.options,i=c.allBodies(e),j=c.allConstraints(e);for(h.wireframes?B.setBackground(d,h.wireframeBackground):B.setBackground(d,h.background),b=0;b<i.length;b++)B.body(a,i[b]);for(b=0;b<j.length;b++)B.constraint(a,j[b]);f.render(g)},B.constraint=function(a,b){var c=a.render,d=b.bodyA,e=b.bodyB,f=b.pointA,g=b.pointB,h=c.stage,i=b.render,j="c-"+b.id,k=c.primitives[j];return k||(k=c.primitives[j]=new PIXI.Graphics),i.visible&&b.pointA&&b.pointB?(-1===h.children.indexOf(k)&&h.addChild(k),k.clear(),k.beginFill(0,0),k.lineStyle(i.lineWidth,o.colorToNumber(i.strokeStyle),1),d?k.moveTo(d.position.x+f.x,d.position.y+f.y):k.moveTo(f.x,f.y),e?k.lineTo(e.position.x+g.x,e.position.y+g.y):k.lineTo(g.x,g.y),void k.endFill()):void k.clear()},B.body=function(c,d){var e=c.render,f=d.render;if(f.visible)if(f.sprite&&f.sprite.texture){var g="b-"+d.id,h=e.sprites[g],i=e.spriteBatch;h||(h=e.sprites[g]=a(e,d)),-1===i.children.indexOf(h)&&i.addChild(h),h.position.x=d.position.x,h.position.y=d.position.y,h.rotation=d.angle}else{var j="b-"+d.id,k=e.primitives[j],l=e.stage;k||(k=e.primitives[j]=b(e,d),k.initialAngle=d.angle),-1===l.children.indexOf(k)&&l.addChild(k),k.position.x=d.position.x,k.position.y=d.position.y,k.rotation=d.angle-k.initialAngle}};var a=function(a,b){var c=b.render,e=c.sprite.texture,f=d(a,e),g=new PIXI.Sprite(f);return g.anchor.x=.5,g.anchor.y=.5,g},b=function(a,b){var c=b.render,d=a.options,e=new PIXI.Graphics;e.clear(),d.wireframes?(e.beginFill(0,0),e.lineStyle(1,o.colorToNumber("#bbb"),1)):(e.beginFill(o.colorToNumber(c.fillStyle),1),e.lineStyle(b.render.lineWidth,o.colorToNumber(c.strokeStyle),1)),e.moveTo(b.vertices[0].x-b.position.x,b.vertices[0].y-b.position.y);for(var f=1;f<b.vertices.length;f++)e.lineTo(b.vertices[f].x-b.position.x,b.vertices[f].y-b.position.y);return e.lineTo(b.vertices[0].x-b.position.x,b.vertices[0].y-b.position.y),e.endFill(),(d.showAngleIndicator||d.showAxes)&&(e.beginFill(0,0),d.wireframes?e.lineStyle(1,o.colorToNumber("#CD5C5C"),1):e.lineStyle(1,o.colorToNumber(b.render.strokeStyle)),e.moveTo(0,0),e.lineTo((b.vertices[0].x+b.vertices[b.vertices.length-1].x)/2-b.position.x,(b.vertices[0].y+b.vertices[b.vertices.length-1].y)/2-b.position.y),e.endFill()),e},d=function(a,b){var c=a.textures[b];return c||(c=a.textures[b]=PIXI.Texture.fromImage(b)),c}}(),d.add=c.add,d.remove=c.remove,d.addComposite=c.addComposite,d.addBody=c.addBody,d.addConstraint=c.addConstraint,d.clear=c.clear,a.Body=b,a.Composite=c,a.World=d,a.Contact=e,a.Detector=f,a.Grid=g,a.Pairs=i,a.Pair=h,a.Resolver=k,a.SAT=l,a.Constraint=m,a.MouseConstraint=n,a.Common=o,a.Engine=p,a.Metrics=r,a.Mouse=s,a.Sleeping=t,a.Bodies=u,a.Composites=v,a.Axes=w,a.Bounds=x,a.Vector=y,a.Vertices=z,a.Render=A,a.RenderPixi=B,a.Events=q,a.Query=j,"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=a),exports.Matter=a),"function"=="function"&&__webpack_require__(482)&&!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){return a}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)),"object"==typeof window&&"object"==typeof window.document&&(window.Matter=a)}();

/***/ },
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var __$Getters__ = [];
	var __$Setters__ = [];
	var __$Resetters__ = [];
	
	function __GetDependency__(name) {
	  return __$Getters__[name]();
	}
	
	function __Rewire__(name, value) {
	  __$Setters__[name](value);
	}
	
	function __ResetDependency__(name) {
	  __$Resetters__[name]();
	}
	
	var __RewireAPI__ = {
	  '__GetDependency__': __GetDependency__,
	  '__get__': __GetDependency__,
	  '__Rewire__': __Rewire__,
	  '__set__': __Rewire__,
	  '__ResetDependency__': __ResetDependency__
	};
	var filenameWithoutLoaders = function filenameWithoutLoaders(filename) {
	  var index = filename.lastIndexOf('!');
	
	  return index < 0 ? filename : filename.substr(index + 1);
	};
	
	var _filenameWithoutLoaders = filenameWithoutLoaders;
	
	__$Getters__['filenameWithoutLoaders'] = function () {
	  return filenameWithoutLoaders;
	};
	
	__$Setters__['filenameWithoutLoaders'] = function (value) {
	  exports.filenameWithoutLoaders = filenameWithoutLoaders = value;
	};
	
	__$Resetters__['filenameWithoutLoaders'] = function () {
	  exports.filenameWithoutLoaders = filenameWithoutLoaders = _filenameWithoutLoaders;
	};
	
	exports.filenameWithoutLoaders = _filenameWithoutLoaders;
	var filenameHasLoaders = function filenameHasLoaders(filename) {
	  var actualFilename = filenameWithoutLoaders(filename);
	
	  return actualFilename !== filename;
	};
	
	var _filenameHasLoaders = filenameHasLoaders;
	
	__$Getters__['filenameHasLoaders'] = function () {
	  return filenameHasLoaders;
	};
	
	__$Setters__['filenameHasLoaders'] = function (value) {
	  exports.filenameHasLoaders = filenameHasLoaders = value;
	};
	
	__$Resetters__['filenameHasLoaders'] = function () {
	  exports.filenameHasLoaders = filenameHasLoaders = _filenameHasLoaders;
	};
	
	exports.filenameHasLoaders = _filenameHasLoaders;
	var filenameHasSchema = function filenameHasSchema(filename) {
	  return /^[\w]+\:/.test(filename);
	};
	
	var _filenameHasSchema = filenameHasSchema;
	
	__$Getters__['filenameHasSchema'] = function () {
	  return filenameHasSchema;
	};
	
	__$Setters__['filenameHasSchema'] = function (value) {
	  exports.filenameHasSchema = filenameHasSchema = value;
	};
	
	__$Resetters__['filenameHasSchema'] = function () {
	  exports.filenameHasSchema = filenameHasSchema = _filenameHasSchema;
	};
	
	exports.filenameHasSchema = _filenameHasSchema;
	var isFilenameAbsolute = function isFilenameAbsolute(filename) {
	  var actualFilename = filenameWithoutLoaders(filename);
	
	  if (actualFilename.indexOf('/') === 0) {
	    return true;
	  }
	
	  return false;
	};
	
	var _isFilenameAbsolute = isFilenameAbsolute;
	
	__$Getters__['isFilenameAbsolute'] = function () {
	  return isFilenameAbsolute;
	};
	
	__$Setters__['isFilenameAbsolute'] = function (value) {
	  exports.isFilenameAbsolute = isFilenameAbsolute = value;
	};
	
	__$Resetters__['isFilenameAbsolute'] = function () {
	  exports.isFilenameAbsolute = isFilenameAbsolute = _isFilenameAbsolute;
	};
	
	exports.isFilenameAbsolute = _isFilenameAbsolute;
	var makeUrl = function makeUrl(filename, scheme, line, column) {
	  var actualFilename = filenameWithoutLoaders(filename);
	
	  if (filenameHasSchema(filename)) {
	    return actualFilename;
	  }
	
	  var url = 'file://' + actualFilename;
	
	  if (scheme) {
	    url = scheme + '://open?url=' + url;
	
	    if (line && actualFilename === filename) {
	      url = url + '&line=' + line;
	
	      if (column) {
	        url = url + '&column=' + column;
	      }
	    }
	  }
	
	  return url;
	};
	
	var _makeUrl = makeUrl;
	
	__$Getters__['makeUrl'] = function () {
	  return makeUrl;
	};
	
	__$Setters__['makeUrl'] = function (value) {
	  exports.makeUrl = makeUrl = value;
	};
	
	__$Resetters__['makeUrl'] = function () {
	  exports.makeUrl = makeUrl = _makeUrl;
	};
	
	exports.makeUrl = _makeUrl;
	var makeLinkText = function makeLinkText(filename, line, column) {
	  var text = filenameWithoutLoaders(filename);
	
	  if (line && text === filename) {
	    text = text + ':' + line;
	
	    if (column) {
	      text = text + ':' + column;
	    }
	  }
	
	  return text;
	};
	var _makeLinkText = makeLinkText;
	
	__$Getters__['makeLinkText'] = function () {
	  return makeLinkText;
	};
	
	__$Setters__['makeLinkText'] = function (value) {
	  exports.makeLinkText = makeLinkText = value;
	};
	
	__$Resetters__['makeLinkText'] = function () {
	  exports.makeLinkText = makeLinkText = _makeLinkText;
	};
	
	exports.makeLinkText = _makeLinkText;
	exports.__GetDependency__ = __GetDependency__;
	exports.__get__ = __GetDependency__;
	exports.__Rewire__ = __Rewire__;
	exports.__set__ = __Rewire__;
	exports.__ResetDependency__ = __ResetDependency__;
	exports.__RewireAPI__ = __RewireAPI__;
	exports['default'] = __RewireAPI__;

/***/ },
/* 360 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var __$Getters__ = [];
	var __$Setters__ = [];
	var __$Resetters__ = [];
	
	function __GetDependency__(name) {
	  return __$Getters__[name]();
	}
	
	function __Rewire__(name, value) {
	  __$Setters__[name](value);
	}
	
	function __ResetDependency__(name) {
	  __$Resetters__[name]();
	}
	
	var __RewireAPI__ = {
	  '__GetDependency__': __GetDependency__,
	  '__get__': __GetDependency__,
	  '__Rewire__': __Rewire__,
	  '__set__': __Rewire__,
	  '__ResetDependency__': __ResetDependency__
	};
	var _defaultExport = {
	  redbox: {
	    boxSizing: 'border-box',
	    fontFamily: 'sans-serif',
	    position: 'fixed',
	    padding: 10,
	    top: 0,
	    left: 0,
	    bottom: 0,
	    right: 0,
	    width: '100%',
	    background: 'rgb(204, 0, 0)',
	    color: 'white',
	    zIndex: 9999,
	    textAlign: 'left',
	    fontSize: '16px',
	    lineHeight: 1.2
	  },
	  message: {
	    fontWeight: 'bold'
	  },
	  stack: {
	    fontFamily: 'monospace',
	    marginTop: '2em'
	  },
	  frame: {
	    marginTop: '1em'
	  },
	  file: {
	    fontSize: '0.8em',
	    color: 'rgba(255, 255, 255, 0.7)'
	  },
	  linkToFile: {
	    textDecoration: 'none',
	    color: 'rgba(255, 255, 255, 0.7)'
	  }
	};
	
	if (typeof _defaultExport === 'object' || typeof _defaultExport === 'function') {
	  Object.defineProperty(_defaultExport, '__Rewire__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__set__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__ResetDependency__', {
	    'value': __ResetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__GetDependency__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__get__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__RewireAPI__', {
	    'value': __RewireAPI__,
	    'enumberable': false
	  });
	}
	
	exports['default'] = _defaultExport;
	exports.__GetDependency__ = __GetDependency__;
	exports.__get__ = __GetDependency__;
	exports.__Rewire__ = __Rewire__;
	exports.__set__ = __Rewire__;
	exports.__ResetDependency__ = __ResetDependency__;
	exports.__RewireAPI__ = __RewireAPI__;
	module.exports = exports['default'];

/***/ },
/* 361 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	    'use strict';
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
	
	    /* istanbul ignore next */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(362)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('stackframe'));
	    } else {
	        root.ErrorStackParser = factory(root.StackFrame);
	    }
	}(this, function ErrorStackParser(StackFrame) {
	    'use strict';
	
	    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
	    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
	    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;
	
	    return {
	        /**
	         * Given an Error object, extract the most information from it.
	         * @param error {Error}
	         * @return Array[StackFrame]
	         */
	        parse: function ErrorStackParser$$parse(error) {
	            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
	                return this.parseOpera(error);
	            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
	                return this.parseV8OrIE(error);
	            } else if (error.stack && error.stack.match(FIREFOX_SAFARI_STACK_REGEXP)) {
	                return this.parseFFOrSafari(error);
	            } else {
	                throw new Error('Cannot parse given Error object');
	            }
	        },
	
	        /**
	         * Separate line and column numbers from a URL-like string.
	         * @param urlLike String
	         * @return Array[String]
	         */
	        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
	            // Fail-fast but return locations like "(native)"
	            if (urlLike.indexOf(':') === -1) {
	                return [urlLike];
	            }
	
	            var locationParts = urlLike.replace(/[\(\)\s]/g, '').split(':');
	            var lastNumber = locationParts.pop();
	            var possibleNumber = locationParts[locationParts.length - 1];
	            if (!isNaN(parseFloat(possibleNumber)) && isFinite(possibleNumber)) {
	                var lineNumber = locationParts.pop();
	                return [locationParts.join(':'), lineNumber, lastNumber];
	            } else {
	                return [locationParts.join(':'), lastNumber, undefined];
	            }
	        },
	
	        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
	            return error.stack.split('\n').filter(function (line) {
	                return !!line.match(CHROME_IE_STACK_REGEXP);
	            }, this).map(function (line) {
	                if (line.indexOf('(eval ') > -1) {
	                    // Throw away eval information until we implement stacktrace.js/stackframe#8
	                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
	                }
	                var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
	                var locationParts = this.extractLocation(tokens.pop());
	                var functionName = tokens.join(' ') || undefined;
	                var fileName = locationParts[0] === 'eval' ? undefined : locationParts[0];
	
	                return new StackFrame(functionName, undefined, fileName, locationParts[1], locationParts[2], line);
	            }, this);
	        },
	
	        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
	            return error.stack.split('\n').filter(function (line) {
	                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
	            }, this).map(function (line) {
	                // Throw away eval information until we implement stacktrace.js/stackframe#8
	                if (line.indexOf(' > eval') > -1) {
	                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
	                }
	
	                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
	                    // Safari eval frames only have function names and nothing else
	                    return new StackFrame(line);
	                } else {
	                    var tokens = line.split('@');
	                    var locationParts = this.extractLocation(tokens.pop());
	                    var functionName = tokens.shift() || undefined;
	                    return new StackFrame(functionName, undefined, locationParts[0], locationParts[1], locationParts[2], line);
	                }
	            }, this);
	        },
	
	        parseOpera: function ErrorStackParser$$parseOpera(e) {
	            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
	                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
	                return this.parseOpera9(e);
	            } else if (!e.stack) {
	                return this.parseOpera10(e);
	            } else {
	                return this.parseOpera11(e);
	            }
	        },
	
	        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
	            var lines = e.message.split('\n');
	            var result = [];
	
	            for (var i = 2, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(new StackFrame(undefined, undefined, match[2], match[1], undefined, lines[i]));
	                }
	            }
	
	            return result;
	        },
	
	        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
	            var lines = e.stacktrace.split('\n');
	            var result = [];
	
	            for (var i = 0, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(new StackFrame(match[3] || undefined, undefined, match[2], match[1], undefined, lines[i]));
	                }
	            }
	
	            return result;
	        },
	
	        // Opera 10.65+ Error.stack very similar to FF/Safari
	        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
	            return error.stack.split('\n').filter(function (line) {
	                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) &&
	                    !line.match(/^Error created at/);
	            }, this).map(function (line) {
	                var tokens = line.split('@');
	                var locationParts = this.extractLocation(tokens.pop());
	                var functionCall = (tokens.shift() || '');
	                var functionName = functionCall
	                        .replace(/<anonymous function(: (\w+))?>/, '$2')
	                        .replace(/\([^\)]*\)/g, '') || undefined;
	                var argsRaw;
	                if (functionCall.match(/\(([^\)]*)\)/)) {
	                    argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
	                }
	                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ? undefined : argsRaw.split(',');
	                return new StackFrame(functionName, args, locationParts[0], locationParts[1], locationParts[2], line);
	            }, this);
	        }
	    };
	}));
	


/***/ },
/* 362 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	    'use strict';
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
	
	    /* istanbul ignore next */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        module.exports = factory();
	    } else {
	        root.StackFrame = factory();
	    }
	}(this, function () {
	    'use strict';
	    function _isNumber(n) {
	        return !isNaN(parseFloat(n)) && isFinite(n);
	    }
	
	    function StackFrame(functionName, args, fileName, lineNumber, columnNumber, source) {
	        if (functionName !== undefined) {
	            this.setFunctionName(functionName);
	        }
	        if (args !== undefined) {
	            this.setArgs(args);
	        }
	        if (fileName !== undefined) {
	            this.setFileName(fileName);
	        }
	        if (lineNumber !== undefined) {
	            this.setLineNumber(lineNumber);
	        }
	        if (columnNumber !== undefined) {
	            this.setColumnNumber(columnNumber);
	        }
	        if (source !== undefined) {
	            this.setSource(source);
	        }
	    }
	
	    StackFrame.prototype = {
	        getFunctionName: function () {
	            return this.functionName;
	        },
	        setFunctionName: function (v) {
	            this.functionName = String(v);
	        },
	
	        getArgs: function () {
	            return this.args;
	        },
	        setArgs: function (v) {
	            if (Object.prototype.toString.call(v) !== '[object Array]') {
	                throw new TypeError('Args must be an Array');
	            }
	            this.args = v;
	        },
	
	        // NOTE: Property name may be misleading as it includes the path,
	        // but it somewhat mirrors V8's JavaScriptStackTraceApi
	        // https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi and Gecko's
	        // http://mxr.mozilla.org/mozilla-central/source/xpcom/base/nsIException.idl#14
	        getFileName: function () {
	            return this.fileName;
	        },
	        setFileName: function (v) {
	            this.fileName = String(v);
	        },
	
	        getLineNumber: function () {
	            return this.lineNumber;
	        },
	        setLineNumber: function (v) {
	            if (!_isNumber(v)) {
	                throw new TypeError('Line Number must be a Number');
	            }
	            this.lineNumber = Number(v);
	        },
	
	        getColumnNumber: function () {
	            return this.columnNumber;
	        },
	        setColumnNumber: function (v) {
	            if (!_isNumber(v)) {
	                throw new TypeError('Column Number must be a Number');
	            }
	            this.columnNumber = Number(v);
	        },
	
	        getSource: function () {
	            return this.source;
	        },
	        setSource: function (v) {
	            this.source = String(v);
	        },
	
	        toString: function() {
	            var functionName = this.getFunctionName() || '{anonymous}';
	            var args = '(' + (this.getArgs() || []).join(',') + ')';
	            var fileName = this.getFileName() ? ('@' + this.getFileName()) : '';
	            var lineNumber = _isNumber(this.getLineNumber()) ? (':' + this.getLineNumber()) : '';
	            var columnNumber = _isNumber(this.getColumnNumber()) ? (':' + this.getColumnNumber()) : '';
	            return functionName + args + fileName + lineNumber + columnNumber;
	        }
	    };
	
	    return StackFrame;
	}));


/***/ },
/* 363 */
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;
	
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
	
			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}
	
			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}
	
		return to;
	};


/***/ },
/* 364 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDock = __webpack_require__(369);
	
	var _reactDock2 = _interopRequireDefault(_reactDock);
	
	var _constants = __webpack_require__(178);
	
	var _actions = __webpack_require__(177);
	
	var _reducers = __webpack_require__(366);
	
	var _reducers2 = _interopRequireDefault(_reducers);
	
	var DockMonitor = (function (_Component) {
	  _inherits(DockMonitor, _Component);
	
	  _createClass(DockMonitor, null, [{
	    key: 'reducer',
	    value: _reducers2['default'],
	    enumerable: true
	  }, {
	    key: 'propTypes',
	    value: {
	      defaultPosition: _react.PropTypes.oneOf(_constants.POSITIONS).isRequired,
	      defaultIsVisible: _react.PropTypes.bool.isRequired,
	      defaultSize: _react.PropTypes.number.isRequired,
	      toggleVisibilityKey: _react.PropTypes.string.isRequired,
	      changePositionKey: _react.PropTypes.string.isRequired,
	      children: _react.PropTypes.element,
	
	      dispatch: _react.PropTypes.func,
	      monitorState: _react.PropTypes.shape({
	        position: _react.PropTypes.oneOf(_constants.POSITIONS).isRequired,
	        size: _react.PropTypes.number.isRequired,
	        isVisible: _react.PropTypes.bool.isRequired,
	        childMonitorState: _react.PropTypes.any
	      })
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      defaultIsVisible: true,
	      defaultPosition: 'right',
	      defaultSize: 0.3
	    },
	    enumerable: true
	  }]);
	
	  function DockMonitor(props) {
	    _classCallCheck(this, DockMonitor);
	
	    _Component.call(this, props);
	    this.handleKeyDown = this.handleKeyDown.bind(this);
	    this.handleSizeChange = this.handleSizeChange.bind(this);
	  }
	
	  DockMonitor.prototype.componentDidMount = function componentDidMount() {
	    window.addEventListener('keydown', this.handleKeyDown);
	  };
	
	  DockMonitor.prototype.componentWillUnmount = function componentWillUnmount() {
	    window.removeEventListener('keydown', this.handleKeyDown);
	  };
	
	  DockMonitor.prototype.handleKeyDown = function handleKeyDown(e) {
	    if (!e.ctrlKey) {
	      return;
	    }
	    e.preventDefault();
	
	    var key = event.keyCode || event.which;
	    var char = String.fromCharCode(key);
	    switch (char.toUpperCase()) {
	      case this.props.toggleVisibilityKey.toUpperCase():
	        this.props.dispatch(_actions.toggleVisibility());
	        break;
	      case this.props.changePositionKey.toUpperCase():
	        this.props.dispatch(_actions.changePosition());
	        break;
	      default:
	        break;
	    }
	  };
	
	  DockMonitor.prototype.handleSizeChange = function handleSizeChange(requestedSize) {
	    this.props.dispatch(_actions.changeSize(requestedSize));
	  };
	
	  DockMonitor.prototype.render = function render() {
	    var _props = this.props;
	    var monitorState = _props.monitorState;
	    var children = _props.children;
	
	    var rest = _objectWithoutProperties(_props, ['monitorState', 'children']);
	
	    var position = monitorState.position;
	    var isVisible = monitorState.isVisible;
	    var size = monitorState.size;
	
	    var childProps = _extends({}, rest, {
	      monitorState: monitorState.childMonitorState
	    });
	
	    return _react2['default'].createElement(
	      _reactDock2['default'],
	      { position: position,
	        isVisible: isVisible,
	        size: size,
	        onSizeChange: this.handleSizeChange,
	        dimMode: 'none' },
	      _react.cloneElement(children, childProps)
	    );
	  };
	
	  return DockMonitor;
	})(_react.Component);
	
	exports['default'] = DockMonitor;
	module.exports = exports['default'];

/***/ },
/* 365 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _DockMonitor = __webpack_require__(364);
	
	var _DockMonitor2 = _interopRequireDefault(_DockMonitor);
	
	exports['default'] = _DockMonitor2['default'];
	module.exports = exports['default'];

/***/ },
/* 366 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = reducer;
	
	var _actions = __webpack_require__(177);
	
	var _constants = __webpack_require__(178);
	
	function position(state, action, props) {
	  if (state === undefined) state = props.defaultPosition;
	  return (function () {
	    return action.type === _actions.CHANGE_POSITION ? _constants.POSITIONS[(_constants.POSITIONS.indexOf(state) + 1) % _constants.POSITIONS.length] : state;
	  })();
	}
	
	function size(state, action, props) {
	  if (state === undefined) state = props.defaultSize;
	  return (function () {
	    return action.type === _actions.CHANGE_SIZE ? action.size : state;
	  })();
	}
	
	function isVisible(state, action, props) {
	  if (state === undefined) state = props.defaultIsVisible;
	  return (function () {
	    return action.type === _actions.TOGGLE_VISIBILITY ? !state : state;
	  })();
	}
	
	function childMonitorState(state, action, props) {
	  var child = props.children;
	  return child.type.reducer(state, action, child.props);
	}
	
	function reducer(state, action, props) {
	  if (state === undefined) state = {};
	
	  return {
	    position: position(state.position, action, props),
	    isVisible: isVisible(state.isVisible, action, props),
	    size: size(state.size, action, props),
	    childMonitorState: childMonitorState(state.childMonitorState, action, props)
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 367 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _get = __webpack_require__(40)['default'];
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _createClass = __webpack_require__(35)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	var _extends = __webpack_require__(11)['default'];
	
	var _toConsumableArray = __webpack_require__(216)['default'];
	
	var _Object$keys = __webpack_require__(72)['default'];
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _lodashDebounce = __webpack_require__(370);
	
	var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);
	
	var _objectAssign = __webpack_require__(372);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	var _autoprefix = __webpack_require__(368);
	
	var _autoprefix2 = _interopRequireDefault(_autoprefix);
	
	function autoprefixes(styles) {
	  return _Object$keys(styles).reduce(function (obj, key) {
	    return (obj[key] = (0, _autoprefix2['default'])(styles[key]), obj);
	  }, {});
	}
	
	var styles = autoprefixes({
	  wrapper: {
	    position: 'fixed',
	    width: 0,
	    height: 0,
	    top: 0,
	    left: 0
	  },
	
	  dim: {
	    position: 'fixed',
	    left: 0,
	    right: 0,
	    top: 0,
	    bottom: 0,
	    zIndex: 0,
	    background: 'rgba(0, 0, 0, 0.2)',
	    opacity: 1
	  },
	
	  dimAppear: {
	    opacity: 0
	  },
	
	  dimTransparent: {
	    pointerEvents: 'none'
	  },
	
	  dimHidden: {
	    opacity: 0
	  },
	
	  dock: {
	    position: 'fixed',
	    zIndex: 1,
	    boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)',
	    background: 'white',
	    left: 0,
	    top: 0,
	    width: '100%',
	    height: '100%'
	  },
	
	  dockHidden: {
	    opacity: 0
	  },
	
	  dockResizing: {
	    transition: 'none'
	  },
	
	  dockContent: {
	    width: '100%',
	    height: '100%',
	    overflow: 'auto'
	  },
	
	  resizer: {
	    position: 'absolute',
	    zIndex: 2,
	    opacity: 0
	  }
	});
	
	function getTransitions(duration) {
	  return ['left', 'top', 'width', 'height'].map(function (p) {
	    return p + ' ' + duration / 1000 + 's ease-out';
	  });
	}
	
	function getDockStyles(_ref, _ref2) {
	  var fluid = _ref.fluid;
	  var dockStyle = _ref.dockStyle;
	  var dockHiddenStyle = _ref.dockHiddenStyle;
	  var duration = _ref.duration;
	  var position = _ref.position;
	  var isVisible = _ref.isVisible;
	  var size = _ref2.size;
	  var isResizing = _ref2.isResizing;
	  var fullWidth = _ref2.fullWidth;
	  var fullHeight = _ref2.fullHeight;
	
	  var posStyle = undefined;
	  var absSize = fluid ? size * 100 + '%' : size + 'px';
	
	  function getRestSize(fullSize) {
	    return fluid ? 100 - size * 100 + '%' : fullSize - size + 'px';
	  }
	
	  switch (position) {
	    case 'left':
	      posStyle = {
	        width: absSize,
	        left: isVisible ? 0 : '-' + absSize
	      };
	      break;
	    case 'right':
	      posStyle = {
	        left: isVisible ? getRestSize(fullWidth) : fullWidth,
	        width: absSize
	      };
	      break;
	    case 'top':
	      posStyle = {
	        top: isVisible ? 0 : '-' + absSize,
	        height: absSize
	      };
	      break;
	    case 'bottom':
	      posStyle = {
	        top: isVisible ? getRestSize(fullHeight) : fullHeight,
	        height: absSize
	      };
	      break;
	  }
	
	  var transitions = getTransitions(duration);
	
	  return [styles.dock, (0, _autoprefix2['default'])({
	    transition: [].concat(_toConsumableArray(transitions), [!isVisible && 'opacity 0.01s linear ' + duration / 1000 + 's']).filter(function (t) {
	      return t;
	    }).join(',')
	  }), dockStyle, (0, _autoprefix2['default'])(posStyle), isResizing && styles.dockResizing, !isVisible && styles.dockHidden, !isVisible && dockHiddenStyle];
	}
	
	function getDimStyles(_ref3, _ref4) {
	  var dimMode = _ref3.dimMode;
	  var dimStyle = _ref3.dimStyle;
	  var duration = _ref3.duration;
	  var isVisible = _ref3.isVisible;
	  var isTransitionStarted = _ref4.isTransitionStarted;
	
	  return [styles.dim, (0, _autoprefix2['default'])({
	    transition: 'opacity ' + duration / 1000 + 's ease-out'
	  }), dimStyle, dimMode === 'transparent' && styles.dimTransparent, !isVisible && styles.dimHidden, isTransitionStarted && isVisible && styles.dimAppear, isTransitionStarted && !isVisible && styles.dimDisappear];
	}
	
	function getResizerStyles(position) {
	  var resizerStyle = undefined;
	  var size = 10;
	
	  switch (position) {
	    case 'left':
	      resizerStyle = {
	        right: -size / 2,
	        width: size,
	        top: 0,
	        height: '100%',
	        cursor: 'col-resize'
	      };
	      break;
	    case 'right':
	      resizerStyle = {
	        left: -size / 2,
	        width: size,
	        top: 0,
	        height: '100%',
	        cursor: 'col-resize'
	      };
	      break;
	    case 'top':
	      resizerStyle = {
	        bottom: -size / 2,
	        height: size,
	        left: 0,
	        width: '100%',
	        cursor: 'row-resize'
	      };
	      break;
	    case 'bottom':
	      resizerStyle = {
	        top: -size / 2,
	        height: size,
	        left: 0,
	        width: '100%',
	        cursor: 'row-resize'
	      };
	      break;
	  }
	
	  return [styles.resizer, (0, _autoprefix2['default'])(resizerStyle)];
	}
	
	function getFullSize(position, fullWidth, fullHeight) {
	  return position === 'left' || position === 'right' ? fullWidth : fullHeight;
	}
	
	var Dock = (function (_Component) {
	  _inherits(Dock, _Component);
	
	  function Dock(props) {
	    var _this = this;
	
	    _classCallCheck(this, Dock);
	
	    _get(Object.getPrototypeOf(Dock.prototype), 'constructor', this).call(this, props);
	
	    this.transitionEnd = function () {
	      _this.setState({ isTransitionStarted: false });
	    };
	
	    this.hideDim = function () {
	      if (!_this.props.isVisible) {
	        _this.setState({ isDimHidden: true });
	      }
	    };
	
	    this.handleDimClick = function () {
	      if (_this.props.dimMode === 'opaque') {
	        _this.props.onVisibleChange && _this.props.onVisibleChange(false);
	      }
	    };
	
	    this.handleResize = function () {
	      if (window.requestAnimationFrame) {
	        window.requestAnimationFrame(_this.updateWindowSize.bind(_this, true));
	      } else {
	        _this.updateWindowSize(true);
	      }
	    };
	
	    this.updateWindowSize = function (windowResize) {
	      var sizeState = {
	        fullWidth: window.innerWidth,
	        fullHeight: window.innerHeight
	      };
	
	      if (windowResize) {
	        _this.setState(_extends({}, sizeState, {
	          isResizing: true,
	          isWindowResizing: windowResize
	        }));
	
	        _this.debouncedUpdateWindowSizeEnd();
	      } else {
	        _this.setState(sizeState);
	      }
	    };
	
	    this.updateWindowSizeEnd = function () {
	      _this.setState({
	        isResizing: false,
	        isWindowResizing: false
	      });
	    };
	
	    this.debouncedUpdateWindowSizeEnd = (0, _lodashDebounce2['default'])(this.updateWindowSizeEnd, 30);
	
	    this.handleWrapperLeave = function () {
	      _this.setState({ isResizing: false });
	    };
	
	    this.handleMouseDown = function () {
	      _this.setState({ isResizing: true });
	    };
	
	    this.handleMouseUp = function () {
	      _this.setState({ isResizing: false });
	    };
	
	    this.handleMouseMove = function (e) {
	      if (!_this.state.isResizing || _this.state.isWindowResizing) return;
	      e.preventDefault();
	
	      var _props = _this.props;
	      var position = _props.position;
	      var fluid = _props.fluid;
	      var _state = _this.state;
	      var fullWidth = _state.fullWidth;
	      var fullHeight = _state.fullHeight;
	      var isControlled = _state.isControlled;
	      var x = e.clientX;
	      var y = e.clientY;
	
	      var size = undefined;
	
	      switch (position) {
	        case 'left':
	          size = fluid ? x / fullWidth : x;
	          break;
	        case 'right':
	          size = fluid ? (fullWidth - x) / fullWidth : fullWidth - x;
	          break;
	        case 'top':
	          size = fluid ? y / fullHeight : y;
	          break;
	        case 'bottom':
	          size = fluid ? (fullHeight - y) / fullHeight : fullHeight - y;
	          break;
	      }
	
	      _this.props.onSizeChange && _this.props.onSizeChange(size);
	
	      if (!isControlled) {
	        _this.setState({ size: size });
	      }
	    };
	
	    this.state = {
	      isControlled: typeof props.size !== 'undefined',
	      size: props.size || props.defaultSize,
	      isDimHidden: !props.isVisible,
	      fullWidth: typeof window !== 'undefined' && window.innerWidth,
	      fullHeight: typeof window !== 'undefined' && window.innerHeight,
	      isTransitionStarted: false,
	      isWindowResizing: false
	    };
	  }
	
	  _createClass(Dock, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      window.addEventListener('mouseup', this.handleMouseUp);
	      window.addEventListener('mousemove', this.handleMouseMove);
	      window.addEventListener('resize', this.handleResize);
	
	      if (!window.fullWidth) {
	        this.updateWindowSize();
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      window.removeEventListener('mouseup', this.handleMouseUp);
	      window.removeEventListener('mousemove', this.handleMouseMove);
	      window.removeEventListener('resize', this.handleResize);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var isControlled = typeof nextProps.size !== 'undefined';
	
	      this.setState({ isControlled: isControlled });
	
	      if (isControlled && this.props.size !== nextProps.size) {
	        this.setState({ size: nextProps.size });
	      } else if (this.props.fluid !== nextProps.fluid) {
	        this.updateSize(nextProps);
	      }
	
	      if (this.props.isVisible !== nextProps.isVisible) {
	        this.setState({
	          isTransitionStarted: true
	        });
	      }
	    }
	  }, {
	    key: 'updateSize',
	    value: function updateSize(props) {
	      var _state2 = this.state;
	      var fullWidth = _state2.fullWidth;
	      var fullHeight = _state2.fullHeight;
	
	      this.setState({
	        size: props.fluid ? this.state.size / getFullSize(props.position, fullWidth, fullHeight) : getFullSize(props.position, fullWidth, fullHeight) * this.state.size
	      });
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps) {
	      var _this2 = this;
	
	      if (this.props.isVisible !== prevProps.isVisible) {
	        if (!this.props.isVisible) {
	          window.setTimeout(function () {
	            return _this2.hideDim();
	          }, this.props.duration);
	        } else {
	          this.setState({ isDimHidden: false });
	        }
	
	        window.setTimeout(function () {
	          return _this2.setState({ isTransitionStarted: false });
	        }, 0);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props2 = this.props;
	      var children = _props2.children;
	      var zIndex = _props2.zIndex;
	      var dimMode = _props2.dimMode;
	      var position = _props2.position;
	      var isVisible = _props2.isVisible;
	      var _state3 = this.state;
	      var isResizing = _state3.isResizing;
	      var size = _state3.size;
	      var isDimHidden = _state3.isDimHidden;
	
	      var dimStyles = _objectAssign2['default'].apply(undefined, [{}].concat(_toConsumableArray(getDimStyles(this.props, this.state))));
	      var dockStyles = _objectAssign2['default'].apply(undefined, [{}].concat(_toConsumableArray(getDockStyles(this.props, this.state))));
	      var resizerStyles = _objectAssign2['default'].apply(undefined, [{}].concat(_toConsumableArray(getResizerStyles(position))));
	
	      return _react2['default'].createElement(
	        'div',
	        { style: (0, _objectAssign2['default'])({}, styles.wrapper, { zIndex: zIndex }) },
	        dimMode !== 'none' && !isDimHidden && _react2['default'].createElement('div', { style: dimStyles, onClick: this.handleDimClick }),
	        _react2['default'].createElement(
	          'div',
	          { style: dockStyles },
	          _react2['default'].createElement('div', { style: resizerStyles,
	            onMouseDown: this.handleMouseDown }),
	          _react2['default'].createElement(
	            'div',
	            { style: styles.dockContent },
	            typeof children === 'function' ? children({
	              position: position,
	              isResizing: isResizing,
	              size: size,
	              isVisible: isVisible
	            }) : children
	          )
	        )
	      );
	    }
	  }], [{
	    key: 'propTypes',
	    value: {
	      position: _react.PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
	      zIndex: _react.PropTypes.number,
	      fluid: _react.PropTypes.bool,
	      size: _react.PropTypes.number,
	      defaultSize: _react.PropTypes.number,
	      dimMode: _react.PropTypes.oneOf(['none', 'transparent', 'opaque']),
	      isVisible: _react.PropTypes.bool,
	      onVisibleChange: _react.PropTypes.func,
	      onSizeChange: _react.PropTypes.func,
	      dimStyle: _react.PropTypes.object,
	      dockStyle: _react.PropTypes.object,
	      duration: _react.PropTypes.number
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      position: 'left',
	      zIndex: 99999999,
	      fluid: true,
	      defaultSize: 0.3,
	      dimMode: 'opaque',
	      duration: 200
	    },
	    enumerable: true
	  }]);
	
	  return Dock;
	})(_react.Component);
	
	exports['default'] = Dock;
	module.exports = exports['default'];

/***/ },
/* 368 */
/***/ function(module, exports, __webpack_require__) {

	// Same as https://github.com/SimenB/react-vendor-prefixes/blob/master/src/index.js,
	// but dumber
	
	'use strict';
	
	var _extends = __webpack_require__(11)['default'];
	
	var _Object$keys = __webpack_require__(72)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = autoprefix;
	var vendorSpecificProperties = ['animation', 'animationDelay', 'animationDirection', 'animationDuration', 'animationFillMode', 'animationIterationCount', 'animationName', 'animationPlayState', 'animationTimingFunction', 'appearance', 'backfaceVisibility', 'backgroundClip', 'borderImage', 'borderImageSlice', 'boxSizing', 'boxShadow', 'contentColumns', 'transform', 'transformOrigin', 'transformStyle', 'transition', 'transitionDelay', 'transitionDuration', 'transitionProperty', 'transitionTimingFunction', 'perspective', 'perspectiveOrigin', 'userSelect'];
	
	var prefixes = ['Moz', 'Webkit', 'ms', 'O'];
	
	function prefixProp(key, value) {
	  return prefixes.reduce(function (obj, pre) {
	    return (obj[pre + key[0].toUpperCase() + key.substr(1)] = value, obj);
	  }, {});
	}
	
	function autoprefix(style) {
	  return _Object$keys(style).reduce(function (obj, key) {
	    return vendorSpecificProperties.indexOf(key) !== -1 ? _extends({}, obj, prefixProp(key, style[key])) : obj;
	  }, style);
	}
	
	module.exports = exports['default'];

/***/ },
/* 369 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _Dock = __webpack_require__(367);
	
	var _Dock2 = _interopRequireDefault(_Dock);
	
	exports['default'] = _Dock2['default'];
	module.exports = exports['default'];

/***/ },
/* 370 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var getNative = __webpack_require__(371);
	
	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeNow = getNative(Date, 'now');
	
	/**
	 * Gets the number of milliseconds that have elapsed since the Unix epoch
	 * (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @category Date
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => logs the number of milliseconds it took for the deferred function to be invoked
	 */
	var now = nativeNow || function() {
	  return new Date().getTime();
	};
	
	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed invocations. Provide an options object to indicate that `func`
	 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
	 * Subsequent calls to the debounced function return the result of the last
	 * `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	 * on the trailing edge of the timeout only if the the debounced function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options] The options object.
	 * @param {boolean} [options.leading=false] Specify invoking on the leading
	 *  edge of the timeout.
	 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
	 *  delayed before it is invoked.
	 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	 *  edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // avoid costly calculations while the window size is in flux
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
	 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // ensure `batchLog` is invoked once after 1 second of debounced calls
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', _.debounce(batchLog, 250, {
	 *   'maxWait': 1000
	 * }));
	 *
	 * // cancel a debounced call
	 * var todoChanges = _.debounce(batchLog, 1000);
	 * Object.observe(models.todo, todoChanges);
	 *
	 * Object.observe(models, function(changes) {
	 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
	 *     todoChanges.cancel();
	 *   }
	 * }, ['delete']);
	 *
	 * // ...at some point `models.todo` is changed
	 * models.todo.completed = true;
	 *
	 * // ...before 1 second has passed `models.todo` is deleted
	 * // which cancels the debounced `todoChanges` call
	 * delete models.todo;
	 */
	function debounce(func, wait, options) {
	  var args,
	      maxTimeoutId,
	      result,
	      stamp,
	      thisArg,
	      timeoutId,
	      trailingCall,
	      lastCalled = 0,
	      maxWait = false,
	      trailing = true;
	
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = wait < 0 ? 0 : (+wait || 0);
	  if (options === true) {
	    var leading = true;
	    trailing = false;
	  } else if (isObject(options)) {
	    leading = !!options.leading;
	    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }
	
	  function cancel() {
	    if (timeoutId) {
	      clearTimeout(timeoutId);
	    }
	    if (maxTimeoutId) {
	      clearTimeout(maxTimeoutId);
	    }
	    lastCalled = 0;
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	  }
	
	  function complete(isCalled, id) {
	    if (id) {
	      clearTimeout(id);
	    }
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	    if (isCalled) {
	      lastCalled = now();
	      result = func.apply(thisArg, args);
	      if (!timeoutId && !maxTimeoutId) {
	        args = thisArg = undefined;
	      }
	    }
	  }
	
	  function delayed() {
	    var remaining = wait - (now() - stamp);
	    if (remaining <= 0 || remaining > wait) {
	      complete(trailingCall, maxTimeoutId);
	    } else {
	      timeoutId = setTimeout(delayed, remaining);
	    }
	  }
	
	  function maxDelayed() {
	    complete(trailing, timeoutId);
	  }
	
	  function debounced() {
	    args = arguments;
	    stamp = now();
	    thisArg = this;
	    trailingCall = trailing && (timeoutId || !leading);
	
	    if (maxWait === false) {
	      var leadingCall = leading && !timeoutId;
	    } else {
	      if (!maxTimeoutId && !leading) {
	        lastCalled = stamp;
	      }
	      var remaining = maxWait - (stamp - lastCalled),
	          isCalled = remaining <= 0 || remaining > maxWait;
	
	      if (isCalled) {
	        if (maxTimeoutId) {
	          maxTimeoutId = clearTimeout(maxTimeoutId);
	        }
	        lastCalled = stamp;
	        result = func.apply(thisArg, args);
	      }
	      else if (!maxTimeoutId) {
	        maxTimeoutId = setTimeout(maxDelayed, remaining);
	      }
	    }
	    if (isCalled && timeoutId) {
	      timeoutId = clearTimeout(timeoutId);
	    }
	    else if (!timeoutId && wait !== maxWait) {
	      timeoutId = setTimeout(delayed, wait);
	    }
	    if (leadingCall) {
	      isCalled = true;
	      result = func.apply(thisArg, args);
	    }
	    if (isCalled && !timeoutId && !maxTimeoutId) {
	      args = thisArg = undefined;
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  return debounced;
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = debounce;


/***/ },
/* 371 */
/***/ function(module, exports) {

	/**
	 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]';
	
	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}
	
	module.exports = getNative;


/***/ },
/* 372 */
363,
/* 373 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _LogMonitorEntry = __webpack_require__(375);
	
	var _LogMonitorEntry2 = _interopRequireDefault(_LogMonitorEntry);
	
	var _LogMonitorButton = __webpack_require__(374);
	
	var _LogMonitorButton2 = _interopRequireDefault(_LogMonitorButton);
	
	var _reactPureRenderFunction = __webpack_require__(107);
	
	var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);
	
	var _reduxDevtoolsThemes = __webpack_require__(394);
	
	var themes = _interopRequireWildcard(_reduxDevtoolsThemes);
	
	var _reduxDevtools = __webpack_require__(108);
	
	var _actions = __webpack_require__(179);
	
	var _reducers = __webpack_require__(378);
	
	var _reducers2 = _interopRequireDefault(_reducers);
	
	var reset = _reduxDevtools.ActionCreators.reset;
	var rollback = _reduxDevtools.ActionCreators.rollback;
	var commit = _reduxDevtools.ActionCreators.commit;
	var sweep = _reduxDevtools.ActionCreators.sweep;
	var toggleAction = _reduxDevtools.ActionCreators.toggleAction;
	
	var styles = {
	  container: {
	    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
	    position: 'relative',
	    overflowY: 'hidden',
	    width: '100%',
	    height: '100%',
	    minWidth: 300
	  },
	  buttonBar: {
	    textAlign: 'center',
	    borderBottomWidth: 1,
	    borderBottomStyle: 'solid',
	    borderColor: 'transparent',
	    zIndex: 1,
	    display: 'flex',
	    flexDirection: 'row'
	  },
	  elements: {
	    position: 'absolute',
	    left: 0,
	    right: 0,
	    top: 38,
	    bottom: 0,
	    overflowX: 'hidden',
	    overflowY: 'auto'
	  }
	};
	
	var LogMonitor = (function (_Component) {
	  _inherits(LogMonitor, _Component);
	
	  _createClass(LogMonitor, null, [{
	    key: 'reducer',
	    value: _reducers2['default'],
	    enumerable: true
	  }, {
	    key: 'propTypes',
	    value: {
	      dispatch: _react.PropTypes.func,
	      computedStates: _react.PropTypes.array,
	      actionsByIds: _react.PropTypes.object,
	      stagedActionIds: _react.PropTypes.array,
	      skippedActionIds: _react.PropTypes.array,
	      monitorState: _react.PropTypes.shape({
	        initialScrollTop: _react.PropTypes.number
	      }),
	
	      preserveScrollTop: _react.PropTypes.bool,
	      select: _react.PropTypes.func.isRequired,
	      theme: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string])
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      select: function select(state) {
	        return state;
	      },
	      theme: 'nicinabox',
	      preserveScrollTop: true
	    },
	    enumerable: true
	  }]);
	
	  function LogMonitor(props) {
	    _classCallCheck(this, LogMonitor);
	
	    _Component.call(this, props);
	    this.shouldComponentUpdate = _reactPureRenderFunction2['default'];
	    this.handleToggleAction = this.handleToggleAction.bind(this);
	    this.handleReset = this.handleReset.bind(this);
	    this.handleRollback = this.handleRollback.bind(this);
	    this.handleSweep = this.handleSweep.bind(this);
	    this.handleCommit = this.handleCommit.bind(this);
	  }
	
	  LogMonitor.prototype.componentDidMount = function componentDidMount() {
	    var node = this.refs.container;
	    if (!node) {
	      return;
	    }
	
	    node.scrollTop = this.props.monitorState.initialScrollTop;
	    this.interval = setInterval(this.updateScrollTop.bind(this), 1000);
	  };
	
	  LogMonitor.prototype.componentWillUnmount = function componentWillUnmount() {
	    clearInterval(this.setInterval);
	  };
	
	  LogMonitor.prototype.updateScrollTop = function updateScrollTop() {
	    var node = this.refs.container;
	    this.props.dispatch(_actions.updateScrollTop(node ? node.scrollTop : 0));
	  };
	
	  LogMonitor.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    var node = this.refs.container;
	    if (!node) {
	      this.scrollDown = true;
	    } else if (this.props.stagedActionIds.length < nextProps.stagedActionIds.length) {
	      var scrollTop = node.scrollTop;
	      var offsetHeight = node.offsetHeight;
	      var scrollHeight = node.scrollHeight;
	
	      this.scrollDown = Math.abs(scrollHeight - (scrollTop + offsetHeight)) < 20;
	    } else {
	      this.scrollDown = false;
	    }
	  };
	
	  LogMonitor.prototype.componentDidUpdate = function componentDidUpdate() {
	    var node = this.refs.container;
	    if (!node) {
	      return;
	    }
	    if (this.scrollDown) {
	      var offsetHeight = node.offsetHeight;
	      var scrollHeight = node.scrollHeight;
	
	      node.scrollTop = scrollHeight - offsetHeight;
	      this.scrollDown = false;
	    }
	  };
	
	  LogMonitor.prototype.handleRollback = function handleRollback() {
	    this.props.dispatch(rollback());
	  };
	
	  LogMonitor.prototype.handleSweep = function handleSweep() {
	    this.props.dispatch(sweep());
	  };
	
	  LogMonitor.prototype.handleCommit = function handleCommit() {
	    this.props.dispatch(commit());
	  };
	
	  LogMonitor.prototype.handleToggleAction = function handleToggleAction(id) {
	    this.props.dispatch(toggleAction(id));
	  };
	
	  LogMonitor.prototype.handleReset = function handleReset() {
	    this.props.dispatch(reset());
	  };
	
	  LogMonitor.prototype.getTheme = function getTheme() {
	    var theme = this.props.theme;
	
	    if (typeof theme !== 'string') {
	      return theme;
	    }
	
	    if (typeof themes[theme] !== 'undefined') {
	      return themes[theme];
	    }
	
	    console.warn('DevTools theme ' + theme + ' not found, defaulting to nicinabox');
	    return themes.nicinabox;
	  };
	
	  LogMonitor.prototype.render = function render() {
	    var elements = [];
	    var theme = this.getTheme();
	    var _props = this.props;
	    var actionsById = _props.actionsById;
	    var skippedActionIds = _props.skippedActionIds;
	    var stagedActionIds = _props.stagedActionIds;
	    var computedStates = _props.computedStates;
	    var select = _props.select;
	
	    for (var i = 0; i < stagedActionIds.length; i++) {
	      var actionId = stagedActionIds[i];
	      var action = actionsById[actionId].action;
	      var _computedStates$i = computedStates[i];
	      var state = _computedStates$i.state;
	      var error = _computedStates$i.error;
	
	      var previousState = undefined;
	      if (i > 0) {
	        previousState = computedStates[i - 1].state;
	      }
	      elements.push(_react2['default'].createElement(_LogMonitorEntry2['default'], { key: actionId,
	        theme: theme,
	        select: select,
	        action: action,
	        actionId: actionId,
	        state: state,
	        previousState: previousState,
	        collapsed: skippedActionIds.indexOf(actionId) > -1,
	        error: error,
	        onActionClick: this.handleToggleAction }));
	    }
	
	    return _react2['default'].createElement(
	      'div',
	      { style: _extends({}, styles.container, { backgroundColor: theme.base00 }) },
	      _react2['default'].createElement(
	        'div',
	        { style: _extends({}, styles.buttonBar, { borderColor: theme.base02 }) },
	        _react2['default'].createElement(
	          _LogMonitorButton2['default'],
	          {
	            theme: theme,
	            onClick: this.handleReset,
	            enabled: true },
	          'Reset'
	        ),
	        _react2['default'].createElement(
	          _LogMonitorButton2['default'],
	          {
	            theme: theme,
	            onClick: this.handleRollback,
	            enabled: computedStates.length > 1 },
	          'Revert'
	        ),
	        _react2['default'].createElement(
	          _LogMonitorButton2['default'],
	          {
	            theme: theme,
	            onClick: this.handleSweep,
	            enabled: skippedActionIds.length > 0 },
	          'Sweep'
	        ),
	        _react2['default'].createElement(
	          _LogMonitorButton2['default'],
	          {
	            theme: theme,
	            onClick: this.handleCommit,
	            enabled: computedStates.length > 1 },
	          'Commit'
	        )
	      ),
	      _react2['default'].createElement(
	        'div',
	        { style: styles.elements, ref: 'container' },
	        elements
	      )
	    );
	  };
	
	  return LogMonitor;
	})(_react.Component);
	
	exports['default'] = LogMonitor;
	module.exports = exports['default'];

/***/ },
/* 374 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _brighten = __webpack_require__(377);
	
	var _brighten2 = _interopRequireDefault(_brighten);
	
	var _reactPureRenderFunction = __webpack_require__(107);
	
	var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);
	
	var styles = {
	  base: {
	    cursor: 'pointer',
	    fontWeight: 'bold',
	    borderRadius: 3,
	    padding: 4,
	    marginLeft: 3,
	    marginRight: 3,
	    marginTop: 5,
	    marginBottom: 5,
	    flexGrow: 1,
	    display: 'inline-block',
	    fontSize: '0.8em',
	    color: 'white',
	    textDecoration: 'none'
	  }
	};
	
	var LogMonitorButton = (function (_React$Component) {
	  _inherits(LogMonitorButton, _React$Component);
	
	  function LogMonitorButton(props) {
	    _classCallCheck(this, LogMonitorButton);
	
	    _React$Component.call(this, props);
	
	    this.shouldComponentUpdate = _reactPureRenderFunction2['default'];
	    this.handleMouseEnter = this.handleMouseEnter.bind(this);
	    this.handleMouseLeave = this.handleMouseLeave.bind(this);
	    this.handleMouseDown = this.handleMouseDown.bind(this);
	    this.handleMouseUp = this.handleMouseUp.bind(this);
	    this.onClick = this.onClick.bind(this);
	
	    this.state = {
	      hovered: false,
	      active: false
	    };
	  }
	
	  LogMonitorButton.prototype.handleMouseEnter = function handleMouseEnter() {
	    this.setState({ hovered: true });
	  };
	
	  LogMonitorButton.prototype.handleMouseLeave = function handleMouseLeave() {
	    this.setState({ hovered: false });
	  };
	
	  LogMonitorButton.prototype.handleMouseDown = function handleMouseDown() {
	    this.setState({ active: true });
	  };
	
	  LogMonitorButton.prototype.handleMouseUp = function handleMouseUp() {
	    this.setState({ active: false });
	  };
	
	  LogMonitorButton.prototype.onClick = function onClick() {
	    if (!this.props.enabled) {
	      return;
	    }
	    if (this.props.onClick) {
	      this.props.onClick();
	    }
	  };
	
	  LogMonitorButton.prototype.render = function render() {
	    var style = _extends({}, styles.base, {
	      backgroundColor: this.props.theme.base02
	    });
	    if (this.props.enabled && this.state.hovered) {
	      style = _extends({}, style, {
	        backgroundColor: _brighten2['default'](this.props.theme.base02, 0.2)
	      });
	    }
	    if (!this.props.enabled) {
	      style = _extends({}, style, {
	        opacity: 0.2,
	        cursor: 'text',
	        backgroundColor: 'transparent'
	      });
	    }
	    return _react2['default'].createElement(
	      'a',
	      { onMouseEnter: this.handleMouseEnter,
	        onMouseLeave: this.handleMouseLeave,
	        onMouseDown: this.handleMouseDown,
	        onMouseUp: this.handleMouseUp,
	        onClick: this.onClick,
	        style: style },
	      this.props.children
	    );
	  };
	
	  return LogMonitorButton;
	})(_react2['default'].Component);
	
	exports['default'] = LogMonitorButton;
	module.exports = exports['default'];

/***/ },
/* 375 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactJsonTree = __webpack_require__(181);
	
	var _reactJsonTree2 = _interopRequireDefault(_reactJsonTree);
	
	var _LogMonitorEntryAction = __webpack_require__(376);
	
	var _LogMonitorEntryAction2 = _interopRequireDefault(_LogMonitorEntryAction);
	
	var _reactPureRenderFunction = __webpack_require__(107);
	
	var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);
	
	var styles = {
	  entry: {
	    display: 'block',
	    WebkitUserSelect: 'none'
	  },
	  tree: {
	    paddingLeft: 0
	  }
	};
	
	var LogMonitorEntry = (function (_Component) {
	  _inherits(LogMonitorEntry, _Component);
	
	  _createClass(LogMonitorEntry, null, [{
	    key: 'propTypes',
	    value: {
	      state: _react.PropTypes.object.isRequired,
	      action: _react.PropTypes.object.isRequired,
	      actionId: _react.PropTypes.number.isRequired,
	      select: _react.PropTypes.func.isRequired,
	      error: _react.PropTypes.string,
	      onActionClick: _react.PropTypes.func.isRequired,
	      collapsed: _react.PropTypes.bool
	    },
	    enumerable: true
	  }]);
	
	  function LogMonitorEntry(props) {
	    _classCallCheck(this, LogMonitorEntry);
	
	    _Component.call(this, props);
	    this.shouldComponentUpdate = _reactPureRenderFunction2['default'];
	    this.handleActionClick = this.handleActionClick.bind(this);
	  }
	
	  LogMonitorEntry.prototype.printState = function printState(state, error) {
	    var errorText = error;
	    if (!errorText) {
	      try {
	        return _react2['default'].createElement(_reactJsonTree2['default'], {
	          theme: this.props.theme,
	          keyName: 'state',
	          data: this.props.select(state),
	          previousData: this.props.select(this.props.previousState),
	          style: styles.tree });
	      } catch (err) {
	        errorText = 'Error selecting state.';
	      }
	    }
	
	    return _react2['default'].createElement(
	      'div',
	      { style: {
	          color: this.props.theme.base08,
	          paddingTop: 20,
	          paddingLeft: 30,
	          paddingRight: 30,
	          paddingBottom: 35
	        } },
	      errorText
	    );
	  };
	
	  LogMonitorEntry.prototype.handleActionClick = function handleActionClick() {
	    var _props = this.props;
	    var actionId = _props.actionId;
	    var onActionClick = _props.onActionClick;
	
	    if (actionId > 0) {
	      onActionClick(actionId);
	    }
	  };
	
	  LogMonitorEntry.prototype.render = function render() {
	    var _props2 = this.props;
	    var actionId = _props2.actionId;
	    var error = _props2.error;
	    var action = _props2.action;
	    var state = _props2.state;
	    var collapsed = _props2.collapsed;
	
	    var styleEntry = {
	      opacity: collapsed ? 0.5 : 1,
	      cursor: actionId > 0 ? 'pointer' : 'default'
	    };
	
	    return _react2['default'].createElement(
	      'div',
	      { style: {
	          textDecoration: collapsed ? 'line-through' : 'none',
	          color: this.props.theme.base06
	        } },
	      _react2['default'].createElement(_LogMonitorEntryAction2['default'], {
	        theme: this.props.theme,
	        collapsed: collapsed,
	        action: action,
	        onClick: this.handleActionClick,
	        style: _extends({}, styles.entry, styleEntry) }),
	      !collapsed && _react2['default'].createElement(
	        'div',
	        null,
	        this.printState(state, error)
	      )
	    );
	  };
	
	  return LogMonitorEntry;
	})(_react.Component);
	
	exports['default'] = LogMonitorEntry;
	module.exports = exports['default'];

/***/ },
/* 376 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactJsonTree = __webpack_require__(181);
	
	var _reactJsonTree2 = _interopRequireDefault(_reactJsonTree);
	
	var styles = {
	  actionBar: {
	    paddingTop: 8,
	    paddingBottom: 7,
	    paddingLeft: 16
	  },
	  payload: {
	    margin: 0,
	    overflow: 'auto'
	  }
	};
	
	var LogMonitorAction = (function (_React$Component) {
	  _inherits(LogMonitorAction, _React$Component);
	
	  function LogMonitorAction() {
	    _classCallCheck(this, LogMonitorAction);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  LogMonitorAction.prototype.renderPayload = function renderPayload(payload) {
	    return _react2['default'].createElement(
	      'div',
	      { style: _extends({}, styles.payload, {
	          backgroundColor: this.props.theme.base00
	        }) },
	      Object.keys(payload).length > 0 ? _react2['default'].createElement(_reactJsonTree2['default'], { theme: this.props.theme, keyName: 'action', data: payload }) : ''
	    );
	  };
	
	  LogMonitorAction.prototype.render = function render() {
	    var _props$action = this.props.action;
	    var type = _props$action.type;
	
	    var payload = _objectWithoutProperties(_props$action, ['type']);
	
	    return _react2['default'].createElement(
	      'div',
	      { style: _extends({
	          backgroundColor: this.props.theme.base02,
	          color: this.props.theme.base06
	        }, this.props.style) },
	      _react2['default'].createElement(
	        'div',
	        { style: styles.actionBar,
	          onClick: this.props.onClick },
	        type
	      ),
	      !this.props.collapsed ? this.renderPayload(payload) : ''
	    );
	  };
	
	  return LogMonitorAction;
	})(_react2['default'].Component);
	
	exports['default'] = LogMonitorAction;
	module.exports = exports['default'];

/***/ },
/* 377 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	exports['default'] = function (hexColor, lightness) {
	  var hex = String(hexColor).replace(/[^0-9a-f]/gi, '');
	  if (hex.length < 6) {
	    hex = hex.replace(/(.)/g, '$1$1');
	  }
	  var lum = lightness || 0;
	
	  var rgb = '#';
	  var c = undefined;
	  for (var i = 0; i < 3; ++i) {
	    c = parseInt(hex.substr(i * 2, 2), 16);
	    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
	    rgb += ('00' + c).substr(c.length);
	  }
	  return rgb;
	};
	
	module.exports = exports['default'];

/***/ },
/* 378 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = reducer;
	
	var _actions = __webpack_require__(179);
	
	function initialScrollTop(state, action, props) {
	  if (state === undefined) state = 0;
	
	  if (!props.preserveScrollTop) {
	    return 0;
	  }
	
	  return action.type === _actions.UPDATE_SCROLL_TOP ? action.scrollTop : state;
	}
	
	function reducer(state, action, props) {
	  if (state === undefined) state = {};
	
	  return {
	    initialScrollTop: initialScrollTop(state.initialScrollTop, action, props)
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 379 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	var _extends = __webpack_require__(11)['default'];
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(25);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(24);
	
	var _JSONArrow = __webpack_require__(106);
	
	var _JSONArrow2 = _interopRequireDefault(_JSONArrow);
	
	var _grabNode = __webpack_require__(68);
	
	var _grabNode2 = _interopRequireDefault(_grabNode);
	
	var styles = {
	  base: {
	    position: 'relative',
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14
	  },
	  label: {
	    margin: 0,
	    padding: 0,
	    display: 'inline-block'
	  },
	  span: {
	    cursor: 'default'
	  },
	  spanType: {
	    marginLeft: 5,
	    marginRight: 5
	  }
	};
	
	var JSONArrayNode = (function (_React$Component) {
	  _inherits(JSONArrayNode, _React$Component);
	
	  function JSONArrayNode(props) {
	    _classCallCheck(this, _JSONArrayNode);
	
	    _React$Component.call(this, props);
	    this.defaultProps = {
	      data: [],
	      initialExpanded: false
	    };
	    this.needsChildNodes = true;
	    this.renderedChildren = [];
	    this.itemString = false;
	    this.state = {
	      expanded: this.props.initialExpanded,
	      createdChildNodes: false
	    };
	  }
	
	  // Returns the child nodes for each element in the array. If we have
	  // generated them previously, we return from cache, otherwise we create
	  // them.
	
	  JSONArrayNode.prototype.getChildNodes = function getChildNodes() {
	    var _this = this;
	
	    if (this.state.expanded && this.needsChildNodes) {
	      (function () {
	        var childNodes = [];
	        _this.props.data.forEach(function (element, idx) {
	          var prevData = undefined;
	          if (typeof _this.props.previousData !== 'undefined' && _this.props.previousData !== null) {
	            prevData = _this.props.previousData[idx];
	          }
	          var node = _grabNode2['default'](idx, element, prevData, _this.props.theme, _this.props.styles, _this.props.getItemString);
	          if (node !== false) {
	            childNodes.push(node);
	          }
	        });
	        _this.needsChildNodes = false;
	        _this.renderedChildren = childNodes;
	      })();
	    }
	    return this.renderedChildren;
	  };
	
	  // Returns the "n Items" string for this node, generating and
	  // caching it if it hasn't been created yet.
	
	  JSONArrayNode.prototype.getItemString = function getItemString(itemType) {
	    if (!this.itemString) {
	      this.itemString = this.props.data.length + ' item' + (this.props.data.length !== 1 ? 's' : '');
	    }
	    return this.props.getItemString('Array', this.props.data, itemType, this.itemString);
	  };
	
	  JSONArrayNode.prototype.render = function render() {
	    var childNodes = this.getChildNodes();
	    var childListStyle = {
	      padding: 0,
	      margin: 0,
	      listStyle: 'none',
	      display: this.state.expanded ? 'block' : 'none'
	    };
	    var containerStyle = undefined;
	    var spanStyle = _extends({}, styles.span, {
	      color: this.props.theme.base0E
	    });
	    containerStyle = _extends({}, styles.base);
	    if (this.state.expanded) {
	      spanStyle = _extends({}, spanStyle, {
	        color: this.props.theme.base03
	      });
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: containerStyle },
	      _react2['default'].createElement(_JSONArrow2['default'], { theme: this.props.theme, open: this.state.expanded, onClick: this.handleClick.bind(this), style: this.props.styles.getArrowStyle(this.state.expanded) }),
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Array', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({}, spanStyle, this.props.styles.getItemStringStyle('Array', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.getItemString(_react2['default'].createElement(
	          'span',
	          { style: styles.spanType },
	          '[]'
	        ))
	      ),
	      _react2['default'].createElement(
	        'ol',
	        { style: _extends({}, childListStyle, this.props.styles.getListStyle('Array', this.state.expanded)) },
	        childNodes
	      )
	    );
	  };
	
	  var _JSONArrayNode = JSONArrayNode;
	  JSONArrayNode = _reactMixin2['default'].decorate(_mixins.ExpandedStateHandlerMixin)(JSONArrayNode) || JSONArrayNode;
	  return JSONArrayNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONArrayNode;
	module.exports = exports['default'];
	
	// flag to see if we still need to render our child nodes
	
	// cache store for our child nodes
	
	// cache store for the number of items string we display

/***/ },
/* 380 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	var _extends = __webpack_require__(11)['default'];
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(25);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(24);
	
	var _utilsHexToRgb = __webpack_require__(51);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONBooleanNode = (function (_React$Component) {
	  _inherits(JSONBooleanNode, _React$Component);
	
	  function JSONBooleanNode() {
	    _classCallCheck(this, _JSONBooleanNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONBooleanNode.prototype.render = function render() {
	    var truthString = this.props.value ? 'true' : 'false';
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Boolean', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base09
	          }, this.props.styles.getValueStyle('Boolean', true)) },
	        truthString
	      )
	    );
	  };
	
	  var _JSONBooleanNode = JSONBooleanNode;
	  JSONBooleanNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONBooleanNode) || JSONBooleanNode;
	  return JSONBooleanNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONBooleanNode;
	module.exports = exports['default'];

/***/ },
/* 381 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	var _extends = __webpack_require__(11)['default'];
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(25);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(24);
	
	var _utilsHexToRgb = __webpack_require__(51);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONDateNode = (function (_React$Component) {
	  _inherits(JSONDateNode, _React$Component);
	
	  function JSONDateNode() {
	    _classCallCheck(this, _JSONDateNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONDateNode.prototype.render = function render() {
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Date', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base0B
	          }, this.props.styles.getValueStyle('Date', true)) },
	        this.props.value.toISOString()
	      )
	    );
	  };
	
	  var _JSONDateNode = JSONDateNode;
	  JSONDateNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONDateNode) || JSONDateNode;
	  return JSONDateNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONDateNode;
	module.exports = exports['default'];

/***/ },
/* 382 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	var _extends = __webpack_require__(11)['default'];
	
	var _getIterator = __webpack_require__(207)['default'];
	
	var _Number$isSafeInteger = __webpack_require__(208)['default'];
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(25);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(24);
	
	var _JSONArrow = __webpack_require__(106);
	
	var _JSONArrow2 = _interopRequireDefault(_JSONArrow);
	
	var _grabNode = __webpack_require__(68);
	
	var _grabNode2 = _interopRequireDefault(_grabNode);
	
	var styles = {
	  base: {
	    position: 'relative',
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14
	  },
	  label: {
	    margin: 0,
	    padding: 0,
	    display: 'inline-block'
	  },
	  span: {
	    cursor: 'default'
	  },
	  spanType: {
	    marginLeft: 5,
	    marginRight: 5
	  }
	};
	
	var JSONIterableNode = (function (_React$Component) {
	  _inherits(JSONIterableNode, _React$Component);
	
	  function JSONIterableNode(props) {
	    _classCallCheck(this, _JSONIterableNode);
	
	    _React$Component.call(this, props);
	    this.defaultProps = {
	      data: [],
	      initialExpanded: false
	    };
	    this.needsChildNodes = true;
	    this.renderedChildren = [];
	    this.itemString = false;
	    this.state = {
	      expanded: this.props.initialExpanded,
	      createdChildNodes: false
	    };
	  }
	
	  // Returns the child nodes for each entry in iterable. If we have
	  // generated them previously, we return from cache, otherwise we create
	  // them.
	
	  JSONIterableNode.prototype.getChildNodes = function getChildNodes() {
	    if (this.state.expanded && this.needsChildNodes) {
	      var childNodes = [];
	      for (var _iterator = this.props.data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
	        var _ref;
	
	        if (_isArray) {
	          if (_i >= _iterator.length) break;
	          _ref = _iterator[_i++];
	        } else {
	          _i = _iterator.next();
	          if (_i.done) break;
	          _ref = _i.value;
	        }
	
	        var entry = _ref;
	
	        var key = null;
	        var value = null;
	        if (Array.isArray(entry)) {
	          key = entry[0];
	          value = entry[1];
	        } else {
	          key = childNodes.length;
	          value = entry;
	        }
	
	        var prevData = undefined;
	        if (typeof this.props.previousData !== 'undefined' && this.props.previousData !== null) {
	          prevData = this.props.previousData[key];
	        }
	        var node = _grabNode2['default'](key, value, prevData, this.props.theme, this.props.styles, this.props.getItemString);
	        if (node !== false) {
	          childNodes.push(node);
	        }
	      }
	      this.needsChildNodes = false;
	      this.renderedChildren = childNodes;
	    }
	    return this.renderedChildren;
	  };
	
	  // Returns the "n entries" string for this node, generating and
	  // caching it if it hasn't been created yet.
	
	  JSONIterableNode.prototype.getItemString = function getItemString(itemType) {
	    if (!this.itemString) {
	      var data = this.props.data;
	
	      var count = 0;
	      if (_Number$isSafeInteger(data.size)) {
	        count = data.size;
	      } else {
	        for (var _iterator2 = data, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2);;) {
	          var _ref2;
	
	          if (_isArray2) {
	            if (_i2 >= _iterator2.length) break;
	            _ref2 = _iterator2[_i2++];
	          } else {
	            _i2 = _iterator2.next();
	            if (_i2.done) break;
	            _ref2 = _i2.value;
	          }
	
	          var entry = _ref2;
	          // eslint-disable-line no-unused-vars
	          count += 1;
	        }
	      }
	      this.itemString = count + ' entr' + (count !== 1 ? 'ies' : 'y');
	    }
	    return this.props.getItemString('Iterable', this.props.data, itemType, this.itemString);
	  };
	
	  JSONIterableNode.prototype.render = function render() {
	    var childNodes = this.getChildNodes();
	    var childListStyle = {
	      padding: 0,
	      margin: 0,
	      listStyle: 'none',
	      display: this.state.expanded ? 'block' : 'none'
	    };
	    var containerStyle = undefined;
	    var spanStyle = _extends({}, styles.span, {
	      color: this.props.theme.base0E
	    });
	    containerStyle = _extends({}, styles.base);
	    if (this.state.expanded) {
	      spanStyle = _extends({}, spanStyle, {
	        color: this.props.theme.base03
	      });
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: containerStyle },
	      _react2['default'].createElement(_JSONArrow2['default'], { theme: this.props.theme, open: this.state.expanded, onClick: this.handleClick.bind(this), style: this.props.styles.getArrowStyle(this.state.expanded) }),
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Iterable', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({}, spanStyle, this.props.styles.getItemStringStyle('Iterable', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.getItemString(_react2['default'].createElement(
	          'span',
	          { style: styles.spanType },
	          '()'
	        ))
	      ),
	      _react2['default'].createElement(
	        'ol',
	        { style: _extends({}, childListStyle, this.props.styles.getListStyle('Iterable', this.state.expanded)) },
	        childNodes
	      )
	    );
	  };
	
	  var _JSONIterableNode = JSONIterableNode;
	  JSONIterableNode = _reactMixin2['default'].decorate(_mixins.ExpandedStateHandlerMixin)(JSONIterableNode) || JSONIterableNode;
	  return JSONIterableNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONIterableNode;
	module.exports = exports['default'];
	
	// flag to see if we still need to render our child nodes
	
	// cache store for our child nodes
	
	// cache store for the number of items string we display

/***/ },
/* 383 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	var _extends = __webpack_require__(11)['default'];
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(25);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(24);
	
	var _utilsHexToRgb = __webpack_require__(51);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONNullNode = (function (_React$Component) {
	  _inherits(JSONNullNode, _React$Component);
	
	  function JSONNullNode() {
	    _classCallCheck(this, _JSONNullNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONNullNode.prototype.render = function render() {
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Null', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base08
	          }, this.props.styles.getValueStyle('Null', true)) },
	        'null'
	      )
	    );
	  };
	
	  var _JSONNullNode = JSONNullNode;
	  JSONNullNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONNullNode) || JSONNullNode;
	  return JSONNullNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONNullNode;
	module.exports = exports['default'];

/***/ },
/* 384 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	var _extends = __webpack_require__(11)['default'];
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(25);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(24);
	
	var _utilsHexToRgb = __webpack_require__(51);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONNumberNode = (function (_React$Component) {
	  _inherits(JSONNumberNode, _React$Component);
	
	  function JSONNumberNode() {
	    _classCallCheck(this, _JSONNumberNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONNumberNode.prototype.render = function render() {
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Number', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base09
	          }, this.props.styles.getValueStyle('Number', true)) },
	        this.props.value
	      )
	    );
	  };
	
	  var _JSONNumberNode = JSONNumberNode;
	  JSONNumberNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONNumberNode) || JSONNumberNode;
	  return JSONNumberNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONNumberNode;
	module.exports = exports['default'];

/***/ },
/* 385 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	var _extends = __webpack_require__(11)['default'];
	
	var _Object$keys = __webpack_require__(72)['default'];
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(25);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(24);
	
	var _JSONArrow = __webpack_require__(106);
	
	var _JSONArrow2 = _interopRequireDefault(_JSONArrow);
	
	var _grabNode = __webpack_require__(68);
	
	var _grabNode2 = _interopRequireDefault(_grabNode);
	
	var styles = {
	  base: {
	    position: 'relative',
	    paddingTop: 3,
	    paddingBottom: 3,
	    marginLeft: 14
	  },
	  label: {
	    margin: 0,
	    padding: 0,
	    display: 'inline-block'
	  },
	  span: {
	    cursor: 'default'
	  },
	  spanType: {
	    marginLeft: 5,
	    marginRight: 5
	  }
	};
	
	var JSONObjectNode = (function (_React$Component) {
	  _inherits(JSONObjectNode, _React$Component);
	
	  function JSONObjectNode(props) {
	    _classCallCheck(this, _JSONObjectNode);
	
	    _React$Component.call(this, props);
	    this.defaultProps = {
	      data: [],
	      initialExpanded: false
	    };
	    this.itemString = false;
	    this.needsChildNodes = true;
	    this.renderedChildren = [];
	    this.state = {
	      expanded: this.props.initialExpanded,
	      createdChildNodes: false
	    };
	  }
	
	  // Returns the child nodes for each element in the object. If we have
	  // generated them previously, we return from cache, otherwise we create
	  // them.
	
	  JSONObjectNode.prototype.getChildNodes = function getChildNodes() {
	    if (this.state.expanded && this.needsChildNodes) {
	      var obj = this.props.data;
	      var childNodes = [];
	      for (var k in obj) {
	        if (obj.hasOwnProperty(k)) {
	          var prevData = undefined;
	          if (typeof this.props.previousData !== 'undefined' && this.props.previousData !== null) {
	            prevData = this.props.previousData[k];
	          }
	          var node = _grabNode2['default'](k, obj[k], prevData, this.props.theme, this.props.styles, this.props.getItemString);
	          if (node !== false) {
	            childNodes.push(node);
	          }
	        }
	      }
	      this.needsChildNodes = false;
	      this.renderedChildren = childNodes;
	    }
	    return this.renderedChildren;
	  };
	
	  // Returns the "n Items" string for this node, generating and
	  // caching it if it hasn't been created yet.
	
	  JSONObjectNode.prototype.getItemString = function getItemString(itemType) {
	    if (!this.itemString) {
	      var len = _Object$keys(this.props.data).length;
	      this.itemString = len + ' key' + (len !== 1 ? 's' : '');
	    }
	    return this.props.getItemString('Object', this.props.data, itemType, this.itemString);
	  };
	
	  JSONObjectNode.prototype.render = function render() {
	    var childListStyle = {
	      padding: 0,
	      margin: 0,
	      listStyle: 'none',
	      display: this.state.expanded ? 'block' : 'none'
	    };
	    var containerStyle = undefined;
	    var spanStyle = _extends({}, styles.span, {
	      color: this.props.theme.base0B
	    });
	    containerStyle = _extends({}, styles.base);
	    if (this.state.expanded) {
	      spanStyle = _extends({}, spanStyle, {
	        color: this.props.theme.base03
	      });
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: containerStyle },
	      _react2['default'].createElement(_JSONArrow2['default'], { theme: this.props.theme, open: this.state.expanded, onClick: this.handleClick.bind(this), style: this.props.styles.getArrowStyle(this.state.expanded) }),
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Object', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({}, spanStyle, this.props.styles.getItemStringStyle('Object', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.getItemString(_react2['default'].createElement(
	          'span',
	          { style: styles.spanType },
	          '{}'
	        ))
	      ),
	      _react2['default'].createElement(
	        'ul',
	        { style: _extends({}, childListStyle, this.props.styles.getListStyle('Object', this.state.expanded)) },
	        this.getChildNodes()
	      )
	    );
	  };
	
	  var _JSONObjectNode = JSONObjectNode;
	  JSONObjectNode = _reactMixin2['default'].decorate(_mixins.ExpandedStateHandlerMixin)(JSONObjectNode) || JSONObjectNode;
	  return JSONObjectNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONObjectNode;
	module.exports = exports['default'];
	
	// cache store for the number of items string we display
	
	// flag to see if we still need to render our child nodes
	
	// cache store for our child nodes

/***/ },
/* 386 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(8)['default'];
	
	var _classCallCheck = __webpack_require__(7)['default'];
	
	var _extends = __webpack_require__(11)['default'];
	
	var _interopRequireDefault = __webpack_require__(5)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(25);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(24);
	
	var _utilsHexToRgb = __webpack_require__(51);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONStringNode = (function (_React$Component) {
	  _inherits(JSONStringNode, _React$Component);
	
	  function JSONStringNode() {
	    _classCallCheck(this, _JSONStringNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONStringNode.prototype.render = function render() {
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('String', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base0B
	          }, this.props.styles.getValueStyle('String', true)) },
	        '"',
	        this.props.value,
	        '"'
	      )
	    );
	  };
	
	  var _JSONStringNode = JSONStringNode;
	  JSONStringNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONStringNode) || JSONStringNode;
	  return JSONStringNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONStringNode;
	module.exports = exports['default'];

/***/ },
/* 387 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = {
	  handleClick: function handleClick(e) {
	    e.stopPropagation();
	    this.setState({
	      expanded: !this.state.expanded
	    });
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps() {
	    // resets our caches and flags we need to build child nodes again
	    this.renderedChildren = [];
	    this.itemString = false;
	    this.needsChildNodes = true;
	  }
	};
	module.exports = exports["default"];

/***/ },
/* 388 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = {
	  handleClick: function handleClick(e) {
	    e.stopPropagation();
	  }
	};
	module.exports = exports["default"];

/***/ },
/* 389 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Symbol$iterator = __webpack_require__(213)['default'];
	
	exports.__esModule = true;
	
	exports['default'] = function (obj) {
	  if (obj !== null && typeof obj === 'object' && !Array.isArray(obj) && typeof obj[_Symbol$iterator] === 'function') {
	    return 'Iterable';
	  }
	  return Object.prototype.toString.call(obj).slice(8, -1);
	};
	
	module.exports = exports['default'];

/***/ },
/* 390 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'solarized',
	  author: 'ethan schoonover (http://ethanschoonover.com/solarized)',
	  base00: '#002b36',
	  base01: '#073642',
	  base02: '#586e75',
	  base03: '#657b83',
	  base04: '#839496',
	  base05: '#93a1a1',
	  base06: '#eee8d5',
	  base07: '#fdf6e3',
	  base08: '#dc322f',
	  base09: '#cb4b16',
	  base0A: '#b58900',
	  base0B: '#859900',
	  base0C: '#2aa198',
	  base0D: '#268bd2',
	  base0E: '#6c71c4',
	  base0F: '#d33682'
	};
	module.exports = exports['default'];

/***/ },
/* 391 */
/***/ function(module, exports) {

	'use strict';
	
	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);
	
		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));
	
			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}
	
		return to;
	};


/***/ },
/* 392 */
/***/ function(module, exports) {

	var objToStr = function(x){ return Object.prototype.toString.call(x); };
	
	var thrower = function(error){
	    throw error;
	};
	
	var mixins = module.exports = function makeMixinFunction(rules, _opts){
	    var opts = _opts || {};
	    if (!opts.unknownFunction) {
	        opts.unknownFunction = mixins.ONCE;
	    }
	
	    if (!opts.nonFunctionProperty) {
	        opts.nonFunctionProperty = function(left, right, key){
	            if (left !== undefined && right !== undefined) {
	                var getTypeName = function(obj){
	                    if (obj && obj.constructor && obj.constructor.name) {
	                        return obj.constructor.name;
	                    }
	                    else {
	                        return objToStr(obj).slice(8, -1);
	                    }
	                };
	                throw new TypeError('Cannot mixin key ' + key + ' because it is provided by multiple sources, '
	                        + 'and the types are ' + getTypeName(left) + ' and ' + getTypeName(right));
	            }
	            return left === undefined ? right : left;
	        };
	    }
	
	    function setNonEnumerable(target, key, value){
	        if (key in target){
	            target[key] = value;
	        }
	        else {
	            Object.defineProperty(target, key, {
	                value: value,
	                writable: true,
	                configurable: true
	            });
	        }
	    }
	
	    return function applyMixin(source, mixin){
	        Object.keys(mixin).forEach(function(key){
	            var left = source[key], right = mixin[key], rule = rules[key];
	
	            // this is just a weird case where the key was defined, but there's no value
	            // behave like the key wasn't defined
	            if (left === undefined && right === undefined) return;
	
	            var wrapIfFunction = function(thing){
	                return typeof thing !== "function" ? thing
	                : function(){
	                    return thing.call(this, arguments);
	                };
	            };
	
	            // do we have a rule for this key?
	            if (rule) {
	                // may throw here
	                var fn = rule(left, right, key);
	                setNonEnumerable(source, key, wrapIfFunction(fn));
	                return;
	            }
	
	            var leftIsFn = typeof left === "function";
	            var rightIsFn = typeof right === "function";
	
	            // check to see if they're some combination of functions or undefined
	            // we already know there's no rule, so use the unknown function behavior
	            if (leftIsFn && right === undefined
	             || rightIsFn && left === undefined
	             || leftIsFn && rightIsFn) {
	                // may throw, the default is ONCE so if both are functions
	                // the default is to throw
	                setNonEnumerable(source, key, wrapIfFunction(opts.unknownFunction(left, right, key)));
	                return;
	            }
	
	            // we have no rule for them, one may be a function but one or both aren't
	            // our default is MANY_MERGED_LOOSE which will merge objects, concat arrays
	            // and throw if there's a type mismatch or both are primitives (how do you merge 3, and "foo"?)
	            source[key] = opts.nonFunctionProperty(left, right, key);
	        });
	    };
	};
	
	mixins._mergeObjects = function(obj1, obj2) {
	    var assertObject = function(obj, obj2){
	        var type = objToStr(obj);
	        if (type !== '[object Object]') {
	            var displayType = obj.constructor ? obj.constructor.name : 'Unknown';
	            var displayType2 = obj2.constructor ? obj2.constructor.name : 'Unknown';
	            thrower('cannot merge returned value of type ' + displayType + ' with an ' + displayType2);
	        }
	    };
	
	    if (Array.isArray(obj1) && Array.isArray(obj2)) {
	        return obj1.concat(obj2);
	    }
	
	    assertObject(obj1, obj2);
	    assertObject(obj2, obj1);
	
	    var result = {};
	    Object.keys(obj1).forEach(function(k){
	        if (Object.prototype.hasOwnProperty.call(obj2, k)) {
	            thrower('cannot merge returns because both have the ' + JSON.stringify(k) + ' key');
	        }
	        result[k] = obj1[k];
	    });
	
	    Object.keys(obj2).forEach(function(k){
	        // we can skip the conflict check because all conflicts would already be found
	        result[k] = obj2[k];
	    });
	    return result;
	
	}
	
	// define our built-in mixin types
	mixins.ONCE = function(left, right, key){
	    if (left && right) {
	        throw new TypeError('Cannot mixin ' + key + ' because it has a unique constraint.');
	    }
	
	    var fn = left || right;
	
	    return function(args){
	        return fn.apply(this, args);
	    };
	};
	
	mixins.MANY = function(left, right, key){
	    return function(args){
	        if (right) right.apply(this, args);
	        return left ? left.apply(this, args) : undefined;
	    };
	};
	
	mixins.MANY_MERGED_LOOSE = function(left, right, key) {
	    if(left && right) {
	        return mixins._mergeObjects(left, right);
	    }
	
	    return left || right;
	}
	
	mixins.MANY_MERGED = function(left, right, key){
	    return function(args){
	        var res1 = right && right.apply(this, args);
	        var res2 = left && left.apply(this, args);
	        if (res1 && res2) {
	            return mixins._mergeObjects(res1, res2)
	        }
	        return res2 || res1;
	    };
	};
	
	
	mixins.REDUCE_LEFT = function(_left, _right, key){
	    var left = _left || function(x){ return x };
	    var right = _right || function(x){ return x };
	    return function(args){
	        return right.call(this, left.apply(this, args));
	    };
	};
	
	mixins.REDUCE_RIGHT = function(_left, _right, key){
	    var left = _left || function(x){ return x };
	    var right = _right || function(x){ return x };
	    return function(args){
	        return left.call(this, right.apply(this, args));
	    };
	};
	


/***/ },
/* 393 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = shallowEqual;
	
	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }
	
	  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
	    return false;
	  }
	
	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);
	
	  if (keysA.length !== keysB.length) {
	    return false;
	  }
	
	  // Test for A's keys different from B.
	  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
	  for (var i = 0; i < keysA.length; i++) {
	    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
	      return false;
	    }
	  }
	
	  return true;
	}
	
	module.exports = exports['default'];

/***/ },
/* 394 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	var _base16 = __webpack_require__(418);
	
	_defaults(exports, _interopExportWildcard(_base16, _defaults));
	
	var _nicinabox = __webpack_require__(395);
	
	exports.nicinabox = _interopRequire(_nicinabox);

/***/ },
/* 395 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'nicinabox',
	  author: 'nicinabox (http://github.com/nicinabox)',
	  base00: '#2A2F3A',
	  base01: '#3C444F',
	  base02: '#4F5A65',
	  base03: '#BEBEBE',
	  base04: '#b0b0b0', // based on ocean theme
	  base05: '#d0d0d0', // based on ocean theme
	  base06: '#FFFFFF',
	  base07: '#f5f5f5', // based on ocean theme
	  base08: '#fb9fb1', // based on ocean theme
	  base09: '#FC6D24',
	  base0A: '#ddb26f', // based on ocean theme
	  base0B: '#A1C659',
	  base0C: '#12cfc0', // based on ocean theme
	  base0D: '#6FB3D2',
	  base0E: '#D381C3',
	  base0F: '#deaf8f' // based on ocean theme
	};
	module.exports = exports['default'];

/***/ },
/* 396 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'apathy',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#031A16',
	  base01: '#0B342D',
	  base02: '#184E45',
	  base03: '#2B685E',
	  base04: '#5F9C92',
	  base05: '#81B5AC',
	  base06: '#A7CEC8',
	  base07: '#D2E7E4',
	  base08: '#3E9688',
	  base09: '#3E7996',
	  base0A: '#3E4C96',
	  base0B: '#883E96',
	  base0C: '#963E4C',
	  base0D: '#96883E',
	  base0E: '#4C963E',
	  base0F: '#3E965B'
	};
	module.exports = exports['default'];

/***/ },
/* 397 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'ashes',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#1C2023',
	  base01: '#393F45',
	  base02: '#565E65',
	  base03: '#747C84',
	  base04: '#ADB3BA',
	  base05: '#C7CCD1',
	  base06: '#DFE2E5',
	  base07: '#F3F4F5',
	  base08: '#C7AE95',
	  base09: '#C7C795',
	  base0A: '#AEC795',
	  base0B: '#95C7AE',
	  base0C: '#95AEC7',
	  base0D: '#AE95C7',
	  base0E: '#C795AE',
	  base0F: '#C79595'
	};
	module.exports = exports['default'];

/***/ },
/* 398 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier dune',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/dune)',
	  base00: '#20201d',
	  base01: '#292824',
	  base02: '#6e6b5e',
	  base03: '#7d7a68',
	  base04: '#999580',
	  base05: '#a6a28c',
	  base06: '#e8e4cf',
	  base07: '#fefbec',
	  base08: '#d73737',
	  base09: '#b65611',
	  base0A: '#cfb017',
	  base0B: '#60ac39',
	  base0C: '#1fad83',
	  base0D: '#6684e1',
	  base0E: '#b854d4',
	  base0F: '#d43552'
	};
	module.exports = exports['default'];

/***/ },
/* 399 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier forest',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/forest)',
	  base00: '#1b1918',
	  base01: '#2c2421',
	  base02: '#68615e',
	  base03: '#766e6b',
	  base04: '#9c9491',
	  base05: '#a8a19f',
	  base06: '#e6e2e0',
	  base07: '#f1efee',
	  base08: '#f22c40',
	  base09: '#df5320',
	  base0A: '#d5911a',
	  base0B: '#5ab738',
	  base0C: '#00ad9c',
	  base0D: '#407ee7',
	  base0E: '#6666ea',
	  base0F: '#c33ff3'
	};
	module.exports = exports['default'];

/***/ },
/* 400 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier heath',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/heath)',
	  base00: '#1b181b',
	  base01: '#292329',
	  base02: '#695d69',
	  base03: '#776977',
	  base04: '#9e8f9e',
	  base05: '#ab9bab',
	  base06: '#d8cad8',
	  base07: '#f7f3f7',
	  base08: '#ca402b',
	  base09: '#a65926',
	  base0A: '#bb8a35',
	  base0B: '#379a37',
	  base0C: '#159393',
	  base0D: '#516aec',
	  base0E: '#7b59c0',
	  base0F: '#cc33cc'
	};
	module.exports = exports['default'];

/***/ },
/* 401 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier lakeside',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/lakeside/)',
	  base00: '#161b1d',
	  base01: '#1f292e',
	  base02: '#516d7b',
	  base03: '#5a7b8c',
	  base04: '#7195a8',
	  base05: '#7ea2b4',
	  base06: '#c1e4f6',
	  base07: '#ebf8ff',
	  base08: '#d22d72',
	  base09: '#935c25',
	  base0A: '#8a8a0f',
	  base0B: '#568c3b',
	  base0C: '#2d8f6f',
	  base0D: '#257fad',
	  base0E: '#5d5db1',
	  base0F: '#b72dd2'
	};
	module.exports = exports['default'];

/***/ },
/* 402 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier seaside',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/seaside/)',
	  base00: '#131513',
	  base01: '#242924',
	  base02: '#5e6e5e',
	  base03: '#687d68',
	  base04: '#809980',
	  base05: '#8ca68c',
	  base06: '#cfe8cf',
	  base07: '#f0fff0',
	  base08: '#e6193c',
	  base09: '#87711d',
	  base0A: '#c3c322',
	  base0B: '#29a329',
	  base0C: '#1999b3',
	  base0D: '#3d62f5',
	  base0E: '#ad2bee',
	  base0F: '#e619c3'
	};
	module.exports = exports['default'];

/***/ },
/* 403 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'bespin',
	  author: 'jan t. sott',
	  base00: '#28211c',
	  base01: '#36312e',
	  base02: '#5e5d5c',
	  base03: '#666666',
	  base04: '#797977',
	  base05: '#8a8986',
	  base06: '#9d9b97',
	  base07: '#baae9e',
	  base08: '#cf6a4c',
	  base09: '#cf7d34',
	  base0A: '#f9ee98',
	  base0B: '#54be0d',
	  base0C: '#afc4db',
	  base0D: '#5ea6ea',
	  base0E: '#9b859d',
	  base0F: '#937121'
	};
	module.exports = exports['default'];

/***/ },
/* 404 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'brewer',
	  author: 'timothée poisot (http://github.com/tpoisot)',
	  base00: '#0c0d0e',
	  base01: '#2e2f30',
	  base02: '#515253',
	  base03: '#737475',
	  base04: '#959697',
	  base05: '#b7b8b9',
	  base06: '#dadbdc',
	  base07: '#fcfdfe',
	  base08: '#e31a1c',
	  base09: '#e6550d',
	  base0A: '#dca060',
	  base0B: '#31a354',
	  base0C: '#80b1d3',
	  base0D: '#3182bd',
	  base0E: '#756bb1',
	  base0F: '#b15928'
	};
	module.exports = exports['default'];

/***/ },
/* 405 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'bright',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#000000',
	  base01: '#303030',
	  base02: '#505050',
	  base03: '#b0b0b0',
	  base04: '#d0d0d0',
	  base05: '#e0e0e0',
	  base06: '#f5f5f5',
	  base07: '#ffffff',
	  base08: '#fb0120',
	  base09: '#fc6d24',
	  base0A: '#fda331',
	  base0B: '#a1c659',
	  base0C: '#76c7b7',
	  base0D: '#6fb3d2',
	  base0E: '#d381c3',
	  base0F: '#be643c'
	};
	module.exports = exports['default'];

/***/ },
/* 406 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'chalk',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#151515',
	  base01: '#202020',
	  base02: '#303030',
	  base03: '#505050',
	  base04: '#b0b0b0',
	  base05: '#d0d0d0',
	  base06: '#e0e0e0',
	  base07: '#f5f5f5',
	  base08: '#fb9fb1',
	  base09: '#eda987',
	  base0A: '#ddb26f',
	  base0B: '#acc267',
	  base0C: '#12cfc0',
	  base0D: '#6fc2ef',
	  base0E: '#e1a3ee',
	  base0F: '#deaf8f'
	};
	module.exports = exports['default'];

/***/ },
/* 407 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'codeschool',
	  author: 'brettof86',
	  base00: '#232c31',
	  base01: '#1c3657',
	  base02: '#2a343a',
	  base03: '#3f4944',
	  base04: '#84898c',
	  base05: '#9ea7a6',
	  base06: '#a7cfa3',
	  base07: '#b5d8f6',
	  base08: '#2a5491',
	  base09: '#43820d',
	  base0A: '#a03b1e',
	  base0B: '#237986',
	  base0C: '#b02f30',
	  base0D: '#484d79',
	  base0E: '#c59820',
	  base0F: '#c98344'
	};
	module.exports = exports['default'];

/***/ },
/* 408 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'colors',
	  author: 'mrmrs (http://clrs.cc)',
	  base00: '#111111',
	  base01: '#333333',
	  base02: '#555555',
	  base03: '#777777',
	  base04: '#999999',
	  base05: '#bbbbbb',
	  base06: '#dddddd',
	  base07: '#ffffff',
	  base08: '#ff4136',
	  base09: '#ff851b',
	  base0A: '#ffdc00',
	  base0B: '#2ecc40',
	  base0C: '#7fdbff',
	  base0D: '#0074d9',
	  base0E: '#b10dc9',
	  base0F: '#85144b'
	};
	module.exports = exports['default'];

/***/ },
/* 409 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'default',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#181818',
	  base01: '#282828',
	  base02: '#383838',
	  base03: '#585858',
	  base04: '#b8b8b8',
	  base05: '#d8d8d8',
	  base06: '#e8e8e8',
	  base07: '#f8f8f8',
	  base08: '#ab4642',
	  base09: '#dc9656',
	  base0A: '#f7ca88',
	  base0B: '#a1b56c',
	  base0C: '#86c1b9',
	  base0D: '#7cafc2',
	  base0E: '#ba8baf',
	  base0F: '#a16946'
	};
	module.exports = exports['default'];

/***/ },
/* 410 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'eighties',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#2d2d2d',
	  base01: '#393939',
	  base02: '#515151',
	  base03: '#747369',
	  base04: '#a09f93',
	  base05: '#d3d0c8',
	  base06: '#e8e6df',
	  base07: '#f2f0ec',
	  base08: '#f2777a',
	  base09: '#f99157',
	  base0A: '#ffcc66',
	  base0B: '#99cc99',
	  base0C: '#66cccc',
	  base0D: '#6699cc',
	  base0E: '#cc99cc',
	  base0F: '#d27b53'
	};
	module.exports = exports['default'];

/***/ },
/* 411 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'embers',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#16130F',
	  base01: '#2C2620',
	  base02: '#433B32',
	  base03: '#5A5047',
	  base04: '#8A8075',
	  base05: '#A39A90',
	  base06: '#BEB6AE',
	  base07: '#DBD6D1',
	  base08: '#826D57',
	  base09: '#828257',
	  base0A: '#6D8257',
	  base0B: '#57826D',
	  base0C: '#576D82',
	  base0D: '#6D5782',
	  base0E: '#82576D',
	  base0F: '#825757'
	};
	module.exports = exports['default'];

/***/ },
/* 412 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'flat',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#2C3E50',
	  base01: '#34495E',
	  base02: '#7F8C8D',
	  base03: '#95A5A6',
	  base04: '#BDC3C7',
	  base05: '#e0e0e0',
	  base06: '#f5f5f5',
	  base07: '#ECF0F1',
	  base08: '#E74C3C',
	  base09: '#E67E22',
	  base0A: '#F1C40F',
	  base0B: '#2ECC71',
	  base0C: '#1ABC9C',
	  base0D: '#3498DB',
	  base0E: '#9B59B6',
	  base0F: '#be643c'
	};
	module.exports = exports['default'];

/***/ },
/* 413 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'google',
	  author: 'seth wright (http://sethawright.com)',
	  base00: '#1d1f21',
	  base01: '#282a2e',
	  base02: '#373b41',
	  base03: '#969896',
	  base04: '#b4b7b4',
	  base05: '#c5c8c6',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#CC342B',
	  base09: '#F96A38',
	  base0A: '#FBA922',
	  base0B: '#198844',
	  base0C: '#3971ED',
	  base0D: '#3971ED',
	  base0E: '#A36AC7',
	  base0F: '#3971ED'
	};
	module.exports = exports['default'];

/***/ },
/* 414 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'grayscale',
	  author: 'alexandre gavioli (https://github.com/alexx2/)',
	  base00: '#101010',
	  base01: '#252525',
	  base02: '#464646',
	  base03: '#525252',
	  base04: '#ababab',
	  base05: '#b9b9b9',
	  base06: '#e3e3e3',
	  base07: '#f7f7f7',
	  base08: '#7c7c7c',
	  base09: '#999999',
	  base0A: '#a0a0a0',
	  base0B: '#8e8e8e',
	  base0C: '#868686',
	  base0D: '#686868',
	  base0E: '#747474',
	  base0F: '#5e5e5e'
	};
	module.exports = exports['default'];

/***/ },
/* 415 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'green screen',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#001100',
	  base01: '#003300',
	  base02: '#005500',
	  base03: '#007700',
	  base04: '#009900',
	  base05: '#00bb00',
	  base06: '#00dd00',
	  base07: '#00ff00',
	  base08: '#007700',
	  base09: '#009900',
	  base0A: '#007700',
	  base0B: '#00bb00',
	  base0C: '#005500',
	  base0D: '#009900',
	  base0E: '#00bb00',
	  base0F: '#005500'
	};
	module.exports = exports['default'];

/***/ },
/* 416 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'harmonic16',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#0b1c2c',
	  base01: '#223b54',
	  base02: '#405c79',
	  base03: '#627e99',
	  base04: '#aabcce',
	  base05: '#cbd6e2',
	  base06: '#e5ebf1',
	  base07: '#f7f9fb',
	  base08: '#bf8b56',
	  base09: '#bfbf56',
	  base0A: '#8bbf56',
	  base0B: '#56bf8b',
	  base0C: '#568bbf',
	  base0D: '#8b56bf',
	  base0E: '#bf568b',
	  base0F: '#bf5656'
	};
	module.exports = exports['default'];

/***/ },
/* 417 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'hopscotch',
	  author: 'jan t. sott',
	  base00: '#322931',
	  base01: '#433b42',
	  base02: '#5c545b',
	  base03: '#797379',
	  base04: '#989498',
	  base05: '#b9b5b8',
	  base06: '#d5d3d5',
	  base07: '#ffffff',
	  base08: '#dd464c',
	  base09: '#fd8b19',
	  base0A: '#fdcc59',
	  base0B: '#8fc13e',
	  base0C: '#149b93',
	  base0D: '#1290bf',
	  base0E: '#c85e7c',
	  base0F: '#b33508'
	};
	module.exports = exports['default'];

/***/ },
/* 418 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	var _threezerotwofour = __webpack_require__(430);
	
	exports.threezerotwofour = _interopRequire(_threezerotwofour);
	
	var _apathy = __webpack_require__(396);
	
	exports.apathy = _interopRequire(_apathy);
	
	var _ashes = __webpack_require__(397);
	
	exports.ashes = _interopRequire(_ashes);
	
	var _atelierDune = __webpack_require__(398);
	
	exports.atelierDune = _interopRequire(_atelierDune);
	
	var _atelierForest = __webpack_require__(399);
	
	exports.atelierForest = _interopRequire(_atelierForest);
	
	var _atelierHeath = __webpack_require__(400);
	
	exports.atelierHeath = _interopRequire(_atelierHeath);
	
	var _atelierLakeside = __webpack_require__(401);
	
	exports.atelierLakeside = _interopRequire(_atelierLakeside);
	
	var _atelierSeaside = __webpack_require__(402);
	
	exports.atelierSeaside = _interopRequire(_atelierSeaside);
	
	var _bespin = __webpack_require__(403);
	
	exports.bespin = _interopRequire(_bespin);
	
	var _brewer = __webpack_require__(404);
	
	exports.brewer = _interopRequire(_brewer);
	
	var _bright = __webpack_require__(405);
	
	exports.bright = _interopRequire(_bright);
	
	var _chalk = __webpack_require__(406);
	
	exports.chalk = _interopRequire(_chalk);
	
	var _codeschool = __webpack_require__(407);
	
	exports.codeschool = _interopRequire(_codeschool);
	
	var _colors = __webpack_require__(408);
	
	exports.colors = _interopRequire(_colors);
	
	var _default = __webpack_require__(409);
	
	exports['default'] = _interopRequire(_default);
	
	var _eighties = __webpack_require__(410);
	
	exports.eighties = _interopRequire(_eighties);
	
	var _embers = __webpack_require__(411);
	
	exports.embers = _interopRequire(_embers);
	
	var _flat = __webpack_require__(412);
	
	exports.flat = _interopRequire(_flat);
	
	var _google = __webpack_require__(413);
	
	exports.google = _interopRequire(_google);
	
	var _grayscale = __webpack_require__(414);
	
	exports.grayscale = _interopRequire(_grayscale);
	
	var _greenscreen = __webpack_require__(415);
	
	exports.greenscreen = _interopRequire(_greenscreen);
	
	var _harmonic = __webpack_require__(416);
	
	exports.harmonic = _interopRequire(_harmonic);
	
	var _hopscotch = __webpack_require__(417);
	
	exports.hopscotch = _interopRequire(_hopscotch);
	
	var _isotope = __webpack_require__(419);
	
	exports.isotope = _interopRequire(_isotope);
	
	var _marrakesh = __webpack_require__(420);
	
	exports.marrakesh = _interopRequire(_marrakesh);
	
	var _mocha = __webpack_require__(421);
	
	exports.mocha = _interopRequire(_mocha);
	
	var _monokai = __webpack_require__(422);
	
	exports.monokai = _interopRequire(_monokai);
	
	var _ocean = __webpack_require__(423);
	
	exports.ocean = _interopRequire(_ocean);
	
	var _paraiso = __webpack_require__(424);
	
	exports.paraiso = _interopRequire(_paraiso);
	
	var _pop = __webpack_require__(425);
	
	exports.pop = _interopRequire(_pop);
	
	var _railscasts = __webpack_require__(426);
	
	exports.railscasts = _interopRequire(_railscasts);
	
	var _shapeshifter = __webpack_require__(427);
	
	exports.shapeshifter = _interopRequire(_shapeshifter);
	
	var _solarized = __webpack_require__(428);
	
	exports.solarized = _interopRequire(_solarized);
	
	var _summerfruit = __webpack_require__(429);
	
	exports.summerfruit = _interopRequire(_summerfruit);
	
	var _tomorrow = __webpack_require__(431);
	
	exports.tomorrow = _interopRequire(_tomorrow);
	
	var _tube = __webpack_require__(432);
	
	exports.tube = _interopRequire(_tube);
	
	var _twilight = __webpack_require__(433);
	
	exports.twilight = _interopRequire(_twilight);

/***/ },
/* 419 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'isotope',
	  author: 'jan t. sott',
	  base00: '#000000',
	  base01: '#404040',
	  base02: '#606060',
	  base03: '#808080',
	  base04: '#c0c0c0',
	  base05: '#d0d0d0',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#ff0000',
	  base09: '#ff9900',
	  base0A: '#ff0099',
	  base0B: '#33ff00',
	  base0C: '#00ffff',
	  base0D: '#0066ff',
	  base0E: '#cc00ff',
	  base0F: '#3300ff'
	};
	module.exports = exports['default'];

/***/ },
/* 420 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'marrakesh',
	  author: 'alexandre gavioli (http://github.com/alexx2/)',
	  base00: '#201602',
	  base01: '#302e00',
	  base02: '#5f5b17',
	  base03: '#6c6823',
	  base04: '#86813b',
	  base05: '#948e48',
	  base06: '#ccc37a',
	  base07: '#faf0a5',
	  base08: '#c35359',
	  base09: '#b36144',
	  base0A: '#a88339',
	  base0B: '#18974e',
	  base0C: '#75a738',
	  base0D: '#477ca1',
	  base0E: '#8868b3',
	  base0F: '#b3588e'
	};
	module.exports = exports['default'];

/***/ },
/* 421 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'mocha',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#3B3228',
	  base01: '#534636',
	  base02: '#645240',
	  base03: '#7e705a',
	  base04: '#b8afad',
	  base05: '#d0c8c6',
	  base06: '#e9e1dd',
	  base07: '#f5eeeb',
	  base08: '#cb6077',
	  base09: '#d28b71',
	  base0A: '#f4bc87',
	  base0B: '#beb55b',
	  base0C: '#7bbda4',
	  base0D: '#8ab3b5',
	  base0E: '#a89bb9',
	  base0F: '#bb9584'
	};
	module.exports = exports['default'];

/***/ },
/* 422 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'monokai',
	  author: 'wimer hazenberg (http://www.monokai.nl)',
	  base00: '#272822',
	  base01: '#383830',
	  base02: '#49483e',
	  base03: '#75715e',
	  base04: '#a59f85',
	  base05: '#f8f8f2',
	  base06: '#f5f4f1',
	  base07: '#f9f8f5',
	  base08: '#f92672',
	  base09: '#fd971f',
	  base0A: '#f4bf75',
	  base0B: '#a6e22e',
	  base0C: '#a1efe4',
	  base0D: '#66d9ef',
	  base0E: '#ae81ff',
	  base0F: '#cc6633'
	};
	module.exports = exports['default'];

/***/ },
/* 423 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'ocean',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#2b303b',
	  base01: '#343d46',
	  base02: '#4f5b66',
	  base03: '#65737e',
	  base04: '#a7adba',
	  base05: '#c0c5ce',
	  base06: '#dfe1e8',
	  base07: '#eff1f5',
	  base08: '#bf616a',
	  base09: '#d08770',
	  base0A: '#ebcb8b',
	  base0B: '#a3be8c',
	  base0C: '#96b5b4',
	  base0D: '#8fa1b3',
	  base0E: '#b48ead',
	  base0F: '#ab7967'
	};
	module.exports = exports['default'];

/***/ },
/* 424 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'paraiso',
	  author: 'jan t. sott',
	  base00: '#2f1e2e',
	  base01: '#41323f',
	  base02: '#4f424c',
	  base03: '#776e71',
	  base04: '#8d8687',
	  base05: '#a39e9b',
	  base06: '#b9b6b0',
	  base07: '#e7e9db',
	  base08: '#ef6155',
	  base09: '#f99b15',
	  base0A: '#fec418',
	  base0B: '#48b685',
	  base0C: '#5bc4bf',
	  base0D: '#06b6ef',
	  base0E: '#815ba4',
	  base0F: '#e96ba8'
	};
	module.exports = exports['default'];

/***/ },
/* 425 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'pop',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#000000',
	  base01: '#202020',
	  base02: '#303030',
	  base03: '#505050',
	  base04: '#b0b0b0',
	  base05: '#d0d0d0',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#eb008a',
	  base09: '#f29333',
	  base0A: '#f8ca12',
	  base0B: '#37b349',
	  base0C: '#00aabb',
	  base0D: '#0e5a94',
	  base0E: '#b31e8d',
	  base0F: '#7a2d00'
	};
	module.exports = exports['default'];

/***/ },
/* 426 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'railscasts',
	  author: 'ryan bates (http://railscasts.com)',
	  base00: '#2b2b2b',
	  base01: '#272935',
	  base02: '#3a4055',
	  base03: '#5a647e',
	  base04: '#d4cfc9',
	  base05: '#e6e1dc',
	  base06: '#f4f1ed',
	  base07: '#f9f7f3',
	  base08: '#da4939',
	  base09: '#cc7833',
	  base0A: '#ffc66d',
	  base0B: '#a5c261',
	  base0C: '#519f50',
	  base0D: '#6d9cbe',
	  base0E: '#b6b3eb',
	  base0F: '#bc9458'
	};
	module.exports = exports['default'];

/***/ },
/* 427 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'shapeshifter',
	  author: 'tyler benziger (http://tybenz.com)',
	  base00: '#000000',
	  base01: '#040404',
	  base02: '#102015',
	  base03: '#343434',
	  base04: '#555555',
	  base05: '#ababab',
	  base06: '#e0e0e0',
	  base07: '#f9f9f9',
	  base08: '#e92f2f',
	  base09: '#e09448',
	  base0A: '#dddd13',
	  base0B: '#0ed839',
	  base0C: '#23edda',
	  base0D: '#3b48e3',
	  base0E: '#f996e2',
	  base0F: '#69542d'
	};
	module.exports = exports['default'];

/***/ },
/* 428 */
390,
/* 429 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'summerfruit',
	  author: 'christopher corley (http://cscorley.github.io/)',
	  base00: '#151515',
	  base01: '#202020',
	  base02: '#303030',
	  base03: '#505050',
	  base04: '#B0B0B0',
	  base05: '#D0D0D0',
	  base06: '#E0E0E0',
	  base07: '#FFFFFF',
	  base08: '#FF0086',
	  base09: '#FD8900',
	  base0A: '#ABA800',
	  base0B: '#00C918',
	  base0C: '#1faaaa',
	  base0D: '#3777E6',
	  base0E: '#AD00A1',
	  base0F: '#cc6633'
	};
	module.exports = exports['default'];

/***/ },
/* 430 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'threezerotwofour',
	  author: 'jan t. sott (http://github.com/idleberg)',
	  base00: '#090300',
	  base01: '#3a3432',
	  base02: '#4a4543',
	  base03: '#5c5855',
	  base04: '#807d7c',
	  base05: '#a5a2a2',
	  base06: '#d6d5d4',
	  base07: '#f7f7f7',
	  base08: '#db2d20',
	  base09: '#e8bbd0',
	  base0A: '#fded02',
	  base0B: '#01a252',
	  base0C: '#b5e4f4',
	  base0D: '#01a0e4',
	  base0E: '#a16a94',
	  base0F: '#cdab53'
	};
	module.exports = exports['default'];

/***/ },
/* 431 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'tomorrow',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#1d1f21',
	  base01: '#282a2e',
	  base02: '#373b41',
	  base03: '#969896',
	  base04: '#b4b7b4',
	  base05: '#c5c8c6',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#cc6666',
	  base09: '#de935f',
	  base0A: '#f0c674',
	  base0B: '#b5bd68',
	  base0C: '#8abeb7',
	  base0D: '#81a2be',
	  base0E: '#b294bb',
	  base0F: '#a3685a'
	};
	module.exports = exports['default'];

/***/ },
/* 432 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'london tube',
	  author: 'jan t. sott',
	  base00: '#231f20',
	  base01: '#1c3f95',
	  base02: '#5a5758',
	  base03: '#737171',
	  base04: '#959ca1',
	  base05: '#d9d8d8',
	  base06: '#e7e7e8',
	  base07: '#ffffff',
	  base08: '#ee2e24',
	  base09: '#f386a1',
	  base0A: '#ffd204',
	  base0B: '#00853e',
	  base0C: '#85cebc',
	  base0D: '#009ddc',
	  base0E: '#98005d',
	  base0F: '#b06110'
	};
	module.exports = exports['default'];

/***/ },
/* 433 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'twilight',
	  author: 'david hart (http://hart-dev.com)',
	  base00: '#1e1e1e',
	  base01: '#323537',
	  base02: '#464b50',
	  base03: '#5f5a60',
	  base04: '#838184',
	  base05: '#a7a7a7',
	  base06: '#c3c3c3',
	  base07: '#ffffff',
	  base08: '#cf6a4c',
	  base09: '#cda869',
	  base0A: '#f9ee98',
	  base0B: '#8f9d6a',
	  base0C: '#afc4db',
	  base0D: '#7587a6',
	  base0E: '#9b859d',
	  base0F: '#9b703f'
	};
	module.exports = exports['default'];

/***/ },
/* 434 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	exports['default'] = createDevTools;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRedux = __webpack_require__(43);
	
	var _instrument = __webpack_require__(182);
	
	var _instrument2 = _interopRequireDefault(_instrument);
	
	function createDevTools(children) {
	  var monitorElement = _react.Children.only(children);
	  var monitorProps = monitorElement.props;
	  var Monitor = monitorElement.type;
	  var ConnectedMonitor = _reactRedux.connect(function (state) {
	    return state;
	  })(Monitor);
	  var enhancer = _instrument2['default'](function (state, action) {
	    return Monitor.reducer(state, action, monitorProps);
	  });
	
	  return (function (_Component) {
	    _inherits(DevTools, _Component);
	
	    _createClass(DevTools, null, [{
	      key: 'contextTypes',
	      value: {
	        store: _react.PropTypes.object.isRequired
	      },
	      enumerable: true
	    }, {
	      key: 'instrument',
	      value: function value() {
	        return enhancer;
	      },
	      enumerable: true
	    }]);
	
	    function DevTools(props, context) {
	      _classCallCheck(this, DevTools);
	
	      _Component.call(this, props, context);
	      this.liftedStore = context.store.liftedStore;
	    }
	
	    DevTools.prototype.render = function render() {
	      return _react2['default'].createElement(ConnectedMonitor, _extends({}, monitorProps, {
	        store: this.liftedStore }));
	    };
	
	    return DevTools;
	  })(_react.Component);
	}
	
	module.exports = exports['default'];

/***/ },
/* 435 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = persistState;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodashObjectMapValues = __webpack_require__(472);
	
	var _lodashObjectMapValues2 = _interopRequireDefault(_lodashObjectMapValues);
	
	var _lodashUtilityIdentity = __webpack_require__(111);
	
	var _lodashUtilityIdentity2 = _interopRequireDefault(_lodashUtilityIdentity);
	
	function persistState(sessionId) {
	  var deserializeState = arguments.length <= 1 || arguments[1] === undefined ? _lodashUtilityIdentity2['default'] : arguments[1];
	  var deserializeAction = arguments.length <= 2 || arguments[2] === undefined ? _lodashUtilityIdentity2['default'] : arguments[2];
	
	  if (!sessionId) {
	    return function (next) {
	      return function () {
	        return next.apply(undefined, arguments);
	      };
	    };
	  }
	
	  function deserialize(state) {
	    return _extends({}, state, {
	      actionsById: _lodashObjectMapValues2['default'](state.actionsById, function (liftedAction) {
	        return _extends({}, liftedAction, {
	          action: deserializeAction(liftedAction.action)
	        });
	      }),
	      committedState: deserializeState(state.committedState),
	      computedStates: state.computedStates.map(function (computedState) {
	        return _extends({}, computedState, {
	          state: deserializeState(computedState.state)
	        });
	      })
	    });
	  }
	
	  return function (next) {
	    return function (reducer, initialState) {
	      var key = 'redux-dev-session-' + sessionId;
	
	      var finalInitialState = undefined;
	      try {
	        var json = localStorage.getItem(key);
	        if (json) {
	          finalInitialState = deserialize(JSON.parse(json)) || initialState;
	          next(reducer, initialState);
	        }
	      } catch (e) {
	        console.warn('Could not read debug session from localStorage:', e);
	        try {
	          localStorage.removeItem(key);
	        } finally {
	          finalInitialState = undefined;
	        }
	      }
	
	      var store = next(reducer, finalInitialState);
	
	      return _extends({}, store, {
	        dispatch: function dispatch(action) {
	          store.dispatch(action);
	
	          try {
	            localStorage.setItem(key, JSON.stringify(store.getState()));
	          } catch (e) {
	            console.warn('Could not write debug session to localStorage:', e);
	          }
	
	          return action;
	        }
	      });
	    };
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 436 */
/***/ function(module, exports, __webpack_require__) {

	var baseDifference = __webpack_require__(443),
	    baseFlatten = __webpack_require__(444),
	    isArrayLike = __webpack_require__(70),
	    isObjectLike = __webpack_require__(32),
	    restParam = __webpack_require__(438);
	
	/**
	 * Creates an array of unique `array` values not included in the other
	 * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @param {...Array} [values] The arrays of values to exclude.
	 * @returns {Array} Returns the new array of filtered values.
	 * @example
	 *
	 * _.difference([1, 2, 3], [4, 2]);
	 * // => [1, 3]
	 */
	var difference = restParam(function(array, values) {
	  return (isObjectLike(array) && isArrayLike(array))
	    ? baseDifference(array, baseFlatten(values, false, true))
	    : [];
	});
	
	module.exports = difference;


/***/ },
/* 437 */
/***/ function(module, exports) {

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */
	function last(array) {
	  var length = array ? array.length : 0;
	  return length ? array[length - 1] : undefined;
	}
	
	module.exports = last;


/***/ },
/* 438 */
/***/ function(module, exports) {

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.restParam(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function restParam(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        rest = Array(length);
	
	    while (++index < length) {
	      rest[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, args[0], rest);
	      case 2: return func.call(this, args[0], args[1], rest);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = rest;
	    return func.apply(this, otherArgs);
	  };
	}
	
	module.exports = restParam;


/***/ },
/* 439 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var cachePush = __webpack_require__(457),
	    getNative = __webpack_require__(69);
	
	/** Native method references. */
	var Set = getNative(global, 'Set');
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeCreate = getNative(Object, 'create');
	
	/**
	 *
	 * Creates a cache object to store unique values.
	 *
	 * @private
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var length = values ? values.length : 0;
	
	  this.data = { 'hash': nativeCreate(null), 'set': new Set };
	  while (length--) {
	    this.push(values[length]);
	  }
	}
	
	// Add functions to the `Set` cache.
	SetCache.prototype.push = cachePush;
	
	module.exports = SetCache;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 440 */
/***/ function(module, exports) {

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;
	
	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}
	
	module.exports = arrayPush;


/***/ },
/* 441 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.some` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array.length;
	
	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	module.exports = arraySome;


/***/ },
/* 442 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(450),
	    baseMatchesProperty = __webpack_require__(451),
	    bindCallback = __webpack_require__(455),
	    identity = __webpack_require__(111),
	    property = __webpack_require__(474);
	
	/**
	 * The base implementation of `_.callback` which supports specifying the
	 * number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {*} [func=_.identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function baseCallback(func, thisArg, argCount) {
	  var type = typeof func;
	  if (type == 'function') {
	    return thisArg === undefined
	      ? func
	      : bindCallback(func, thisArg, argCount);
	  }
	  if (func == null) {
	    return identity;
	  }
	  if (type == 'object') {
	    return baseMatches(func);
	  }
	  return thisArg === undefined
	    ? property(func)
	    : baseMatchesProperty(func, thisArg);
	}
	
	module.exports = baseCallback;


/***/ },
/* 443 */
/***/ function(module, exports, __webpack_require__) {

	var baseIndexOf = __webpack_require__(447),
	    cacheIndexOf = __webpack_require__(456),
	    createCache = __webpack_require__(459);
	
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	
	/**
	 * The base implementation of `_.difference` which accepts a single array
	 * of values to exclude.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Array} values The values to exclude.
	 * @returns {Array} Returns the new array of filtered values.
	 */
	function baseDifference(array, values) {
	  var length = array ? array.length : 0,
	      result = [];
	
	  if (!length) {
	    return result;
	  }
	  var index = -1,
	      indexOf = baseIndexOf,
	      isCommon = true,
	      cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
	      valuesLength = values.length;
	
	  if (cache) {
	    indexOf = cacheIndexOf;
	    isCommon = false;
	    values = cache;
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index];
	
	    if (isCommon && value === value) {
	      var valuesIndex = valuesLength;
	      while (valuesIndex--) {
	        if (values[valuesIndex] === value) {
	          continue outer;
	        }
	      }
	      result.push(value);
	    }
	    else if (indexOf(values, value, 0) < 0) {
	      result.push(value);
	    }
	  }
	  return result;
	}
	
	module.exports = baseDifference;


/***/ },
/* 444 */
/***/ function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(440),
	    isArguments = __webpack_require__(109),
	    isArray = __webpack_require__(34),
	    isArrayLike = __webpack_require__(70),
	    isObjectLike = __webpack_require__(32);
	
	/**
	 * The base implementation of `_.flatten` with added support for restricting
	 * flattening and specifying the start index.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {boolean} [isDeep] Specify a deep flatten.
	 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, isDeep, isStrict, result) {
	  result || (result = []);
	
	  var index = -1,
	      length = array.length;
	
	  while (++index < length) {
	    var value = array[index];
	    if (isObjectLike(value) && isArrayLike(value) &&
	        (isStrict || isArray(value) || isArguments(value))) {
	      if (isDeep) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, isDeep, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}
	
	module.exports = baseFlatten;


/***/ },
/* 445 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(458);
	
	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();
	
	module.exports = baseFor;


/***/ },
/* 446 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(445),
	    keys = __webpack_require__(110);
	
	/**
	 * The base implementation of `_.forOwn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return baseFor(object, iteratee, keys);
	}
	
	module.exports = baseForOwn;


/***/ },
/* 447 */
/***/ function(module, exports, __webpack_require__) {

	var indexOfNaN = __webpack_require__(466);
	
	/**
	 * The base implementation of `_.indexOf` without support for binary searches.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  if (value !== value) {
	    return indexOfNaN(array, fromIndex);
	  }
	  var index = fromIndex - 1,
	      length = array.length;
	
	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	module.exports = baseIndexOf;


/***/ },
/* 448 */
/***/ function(module, exports, __webpack_require__) {

	var equalArrays = __webpack_require__(461),
	    equalByTag = __webpack_require__(462),
	    equalObjects = __webpack_require__(463),
	    isArray = __webpack_require__(34),
	    isTypedArray = __webpack_require__(470);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;
	
	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag == argsTag) {
	      objTag = objectTag;
	    } else if (objTag != objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag == argsTag) {
	      othTag = objectTag;
	    } else if (othTag != objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;
	
	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  if (!isLoose) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
	
	    if (objIsWrapped || othIsWrapped) {
	      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);
	
	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == object) {
	      return stackB[length] == other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);
	
	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);
	
	  stackA.pop();
	  stackB.pop();
	
	  return result;
	}
	
	module.exports = baseIsEqualDeep;


/***/ },
/* 449 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(184),
	    toObject = __webpack_require__(33);
	
	/**
	 * The base implementation of `_.isMatch` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Array} matchData The propery names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;
	
	  if (object == null) {
	    return !length;
	  }
	  object = toObject(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];
	
	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
	      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
	        return false;
	      }
	    }
	  }
	  return true;
	}
	
	module.exports = baseIsMatch;


/***/ },
/* 450 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(449),
	    getMatchData = __webpack_require__(465),
	    toObject = __webpack_require__(33);
	
	/**
	 * The base implementation of `_.matches` which does not clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatches(source) {
	  var matchData = getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    var key = matchData[0][0],
	        value = matchData[0][1];
	
	    return function(object) {
	      if (object == null) {
	        return false;
	      }
	      return object[key] === value && (value !== undefined || (key in toObject(object)));
	    };
	  }
	  return function(object) {
	    return baseIsMatch(object, matchData);
	  };
	}
	
	module.exports = baseMatches;


/***/ },
/* 451 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(183),
	    baseIsEqual = __webpack_require__(184),
	    baseSlice = __webpack_require__(453),
	    isArray = __webpack_require__(34),
	    isKey = __webpack_require__(187),
	    isStrictComparable = __webpack_require__(188),
	    last = __webpack_require__(437),
	    toObject = __webpack_require__(33),
	    toPath = __webpack_require__(189);
	
	/**
	 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to compare.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  var isArr = isArray(path),
	      isCommon = isKey(path) && isStrictComparable(srcValue),
	      pathKey = (path + '');
	
	  path = toPath(path);
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    var key = pathKey;
	    object = toObject(object);
	    if ((isArr || !isCommon) && !(key in object)) {
	      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	      if (object == null) {
	        return false;
	      }
	      key = last(path);
	      object = toObject(object);
	    }
	    return object[key] === srcValue
	      ? (srcValue !== undefined || (key in object))
	      : baseIsEqual(srcValue, object[key], undefined, true);
	  };
	}
	
	module.exports = baseMatchesProperty;


/***/ },
/* 452 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(183),
	    toPath = __webpack_require__(189);
	
	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function basePropertyDeep(path) {
	  var pathKey = (path + '');
	  path = toPath(path);
	  return function(object) {
	    return baseGet(object, path, pathKey);
	  };
	}
	
	module.exports = basePropertyDeep;


/***/ },
/* 453 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;
	
	  start = start == null ? 0 : (+start || 0);
	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = (end === undefined || end > length) ? length : (+end || 0);
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;
	
	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}
	
	module.exports = baseSlice;


/***/ },
/* 454 */
/***/ function(module, exports) {

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  return value == null ? '' : (value + '');
	}
	
	module.exports = baseToString;


/***/ },
/* 455 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(111);
	
	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}
	
	module.exports = bindCallback;


/***/ },
/* 456 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(26);
	
	/**
	 * Checks if `value` is in `cache` mimicking the return signature of
	 * `_.indexOf` by returning `0` if the value is found, else `-1`.
	 *
	 * @private
	 * @param {Object} cache The cache to search.
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `0` if `value` is found, else `-1`.
	 */
	function cacheIndexOf(cache, value) {
	  var data = cache.data,
	      result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];
	
	  return result ? 0 : -1;
	}
	
	module.exports = cacheIndexOf;


/***/ },
/* 457 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(26);
	
	/**
	 * Adds `value` to the cache.
	 *
	 * @private
	 * @name push
	 * @memberOf SetCache
	 * @param {*} value The value to cache.
	 */
	function cachePush(value) {
	  var data = this.data;
	  if (typeof value == 'string' || isObject(value)) {
	    data.set.add(value);
	  } else {
	    data.hash[value] = true;
	  }
	}
	
	module.exports = cachePush;


/***/ },
/* 458 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(33);
	
	/**
	 * Creates a base function for `_.forIn` or `_.forInRight`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length,
	        index = fromRight ? length : -1;
	
	    while ((fromRight ? index-- : ++index < length)) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}
	
	module.exports = createBaseFor;


/***/ },
/* 459 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var SetCache = __webpack_require__(439),
	    getNative = __webpack_require__(69);
	
	/** Native method references. */
	var Set = getNative(global, 'Set');
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeCreate = getNative(Object, 'create');
	
	/**
	 * Creates a `Set` cache object to optimize linear searches of large arrays.
	 *
	 * @private
	 * @param {Array} [values] The values to cache.
	 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
	 */
	function createCache(values) {
	  return (nativeCreate && Set) ? new SetCache(values) : null;
	}
	
	module.exports = createCache;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 460 */
/***/ function(module, exports, __webpack_require__) {

	var baseCallback = __webpack_require__(442),
	    baseForOwn = __webpack_require__(446);
	
	/**
	 * Creates a function for `_.mapKeys` or `_.mapValues`.
	 *
	 * @private
	 * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
	 * @returns {Function} Returns the new map function.
	 */
	function createObjectMapper(isMapKeys) {
	  return function(object, iteratee, thisArg) {
	    var result = {};
	    iteratee = baseCallback(iteratee, thisArg, 3);
	
	    baseForOwn(object, function(value, key, object) {
	      var mapped = iteratee(value, key, object);
	      key = isMapKeys ? mapped : key;
	      value = isMapKeys ? value : mapped;
	      result[key] = value;
	    });
	    return result;
	  };
	}
	
	module.exports = createObjectMapper;


/***/ },
/* 461 */
/***/ function(module, exports, __webpack_require__) {

	var arraySome = __webpack_require__(441);
	
	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing arrays.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length;
	
	  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
	    return false;
	  }
	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index],
	        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;
	
	    if (result !== undefined) {
	      if (result) {
	        continue;
	      }
	      return false;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (isLoose) {
	      if (!arraySome(other, function(othValue) {
	            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	          })) {
	        return false;
	      }
	    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
	      return false;
	    }
	  }
	  return true;
	}
	
	module.exports = equalArrays;


/***/ },
/* 462 */
/***/ function(module, exports) {

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    stringTag = '[object String]';
	
	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	      return +object == +other;
	
	    case errorTag:
	      return object.name == other.name && object.message == other.message;
	
	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object)
	        ? other != +other
	        : object == +other;
	
	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings primitives and string
	      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	      return object == (other + '');
	  }
	  return false;
	}
	
	module.exports = equalByTag;


/***/ },
/* 463 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(110);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;
	
	  if (objLength != othLength && !isLoose) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  var skipCtor = isLoose;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key],
	        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;
	
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
	      return false;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (!skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;
	
	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}
	
	module.exports = equalObjects;


/***/ },
/* 464 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(185);
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	module.exports = getLength;


/***/ },
/* 465 */
/***/ function(module, exports, __webpack_require__) {

	var isStrictComparable = __webpack_require__(188),
	    pairs = __webpack_require__(473);
	
	/**
	 * Gets the propery names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = pairs(object),
	      length = result.length;
	
	  while (length--) {
	    result[length][2] = isStrictComparable(result[length][1]);
	  }
	  return result;
	}
	
	module.exports = getMatchData;


/***/ },
/* 466 */
/***/ function(module, exports) {

	/**
	 * Gets the index at which the first occurrence of `NaN` is found in `array`.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
	 */
	function indexOfNaN(array, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 0 : -1);
	
	  while ((fromRight ? index-- : ++index < length)) {
	    var other = array[index];
	    if (other !== other) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	module.exports = indexOfNaN;


/***/ },
/* 467 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(109),
	    isArray = __webpack_require__(34),
	    isIndex = __webpack_require__(186),
	    isLength = __webpack_require__(52),
	    keysIn = __webpack_require__(471);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;
	
	  var allowIndexes = !!length && isLength(length) &&
	    (isArray(object) || isArguments(object));
	
	  var index = -1,
	      result = [];
	
	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = shimKeys;


/***/ },
/* 468 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(26);
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 which returns 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}
	
	module.exports = isFunction;


/***/ },
/* 469 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(468),
	    isObjectLike = __webpack_require__(32);
	
	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}
	
	module.exports = isNative;


/***/ },
/* 470 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(52),
	    isObjectLike = __webpack_require__(32);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}
	
	module.exports = isTypedArray;


/***/ },
/* 471 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(109),
	    isArray = __webpack_require__(34),
	    isIndex = __webpack_require__(186),
	    isLength = __webpack_require__(52),
	    isObject = __webpack_require__(26);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;
	
	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;
	
	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keysIn;


/***/ },
/* 472 */
/***/ function(module, exports, __webpack_require__) {

	var createObjectMapper = __webpack_require__(460);
	
	/**
	 * Creates an object with the same keys as `object` and values generated by
	 * running each own enumerable property of `object` through `iteratee`. The
	 * iteratee function is bound to `thisArg` and invoked with three arguments:
	 * (value, key, object).
	 *
	 * If a property name is provided for `iteratee` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `iteratee` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to iterate over.
	 * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `iteratee`.
	 * @returns {Object} Returns the new mapped object.
	 * @example
	 *
	 * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
	 *   return n * 3;
	 * });
	 * // => { 'a': 3, 'b': 6 }
	 *
	 * var users = {
	 *   'fred':    { 'user': 'fred',    'age': 40 },
	 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
	 * };
	 *
	 * // using the `_.property` callback shorthand
	 * _.mapValues(users, 'age');
	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	 */
	var mapValues = createObjectMapper();
	
	module.exports = mapValues;


/***/ },
/* 473 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(110),
	    toObject = __webpack_require__(33);
	
	/**
	 * Creates a two dimensional array of the key-value pairs for `object`,
	 * e.g. `[[key1, value1], [key2, value2]]`.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the new array of key-value pairs.
	 * @example
	 *
	 * _.pairs({ 'barney': 36, 'fred': 40 });
	 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
	 */
	function pairs(object) {
	  object = toObject(object);
	
	  var index = -1,
	      props = keys(object),
	      length = props.length,
	      result = Array(length);
	
	  while (++index < length) {
	    var key = props[index];
	    result[index] = [key, object[key]];
	  }
	  return result;
	}
	
	module.exports = pairs;


/***/ },
/* 474 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(185),
	    basePropertyDeep = __webpack_require__(452),
	    isKey = __webpack_require__(187);
	
	/**
	 * Creates a function that returns the property value at `path` on a
	 * given object.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': { 'c': 2 } } },
	 *   { 'a': { 'b': { 'c': 1 } } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b.c'));
	 * // => [2, 1]
	 *
	 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	}
	
	module.exports = property;


/***/ },
/* 475 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = thunkMiddleware;
	
	function thunkMiddleware(_ref) {
	  var dispatch = _ref.dispatch;
	  var getState = _ref.getState;
	
	  return function (next) {
	    return function (action) {
	      return typeof action === 'function' ? action(dispatch, getState) : next(action);
	    };
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 481 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(253);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(480)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./core.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./core.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 482 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }
]);
//# sourceMappingURL=app.c0476fecd88dfacd241a.js.map