this["EssaComponents"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/15.
	 */

	module.exports = {
	    Animate: __webpack_require__(1),
	    Calendar: __webpack_require__(10),
	    Collapse: __webpack_require__(33),
	    Conditional: __webpack_require__(36),
	    HideOnBodyClick: __webpack_require__(15),
	    Message: __webpack_require__(39),
	    Pagination: __webpack_require__(43),
	    Popup: __webpack_require__(45),
	    Selectable: __webpack_require__(23),
	    Slider: __webpack_require__(53)
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(2);
	var AnimateMixin = __webpack_require__(3);
	var assert = __webpack_require__(9);

	var Animate = React.createClass({
	    displayName: 'Animate',

	    mixins: [AnimateMixin],

	    render: function render() {
	        var self = this;
	        var props = self.props;
	        var children = props.children;
	        var Components = props.component;
	        var ret = props.getContent(props, this.state, self);

	        if (ret === undefined) {
	            children = children && children.constructor === Array ? children : [children];

	            assert(children.length, "children is required");

	            children = React.Children.map(children, function (child) {
	                return React.cloneElement(child, { parent: self });
	            });

	            ret = React.createElement(Components, {
	                className: props.className,
	                style: this.styleProps() }, children);
	        }

	        return ret;
	    }

	});

	module.exports = Animate;

/***/ },
/* 2 */
/***/ function(module, exports) {

	(function() { module.exports = this["React"]; }());

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/14.
	 */

	var TweenEvents = ['Start', 'Update', 'Complete', 'Stop'];
	var noop = __webpack_require__(4);
	var TWEEN = __webpack_require__(5);
	var Tween = TWEEN.Tween;
	var requestAnimation = __webpack_require__(6);
	var requestAnimationFrame = requestAnimation.requestAnimationFrame;
	var cancelAnimationFrame = requestAnimation.cancelAnimationFrame;
	var assign = __webpack_require__(8);
	var React = __webpack_require__(2);

	module.exports = {

	    propTypes: {
	        component: React.PropTypes.string,
	        style: React.PropTypes.object,
	        from: React.PropTypes.object,
	        to: React.PropTypes.object,
	        during: React.PropTypes.number,
	        delay: React.PropTypes.number,
	        repeat: React.PropTypes.number,
	        easing: React.PropTypes.func,
	        className: React.PropTypes.string
	    },

	    getInitialState: function getInitialState() {
	        return { to: {} };
	    },

	    getDefaultProps: function getDefaultProps() {
	        var props = {};

	        TweenEvents.forEach(function (name) {
	            props['on' + name] = noop;
	        });

	        return assign(props, {
	            className: '',
	            component: 'span',
	            styleProps: { position: 'absolute' },
	            from: {},
	            to: {},
	            during: 1000,
	            delay: 0,
	            repeat: 0,
	            onMount: noop,
	            getContent: noop,
	            easing: TWEEN.Easing.Linear.None
	        });
	    },

	    styleProps: function styleProps() {
	        return assign({}, this.state.to, this.props.style);
	    },

	    onTweenUpdate: function onTweenUpdate(result) {
	        this.setState({ to: result });
	    },

	    backToTheStart: function backToTheStart(callback) {
	        this.animate(this.props.to, this.props.from, callback);
	    },

	    startAnimate: function startAnimate(callback) {
	        this.animate(this.props.from, this.props.to, callback);
	    },

	    animate: function animate(from, to, callback) {
	        var self = this;
	        var id = null;
	        var props = this.props;
	        var _animate = null;
	        var cancelAnimate = null;

	        from = assign({}, from);
	        to = assign({}, to);

	        var tween = this.__tween = new Tween(from).to(to, props.during).delay(props.delay).repeat(props.repeat).easing(props.easing);

	        tween.onStart(function () {
	            props.onStart.call(self);
	        });

	        tween.onUpdate(function () {
	            // this 为 tween 中的 props 对象
	            // 所以可以直接传递给函数
	            props.onUpdate.call(self, this);
	            self.onTweenUpdate.call(self, this);
	        });

	        tween.onComplete(function () {
	            typeof callback === 'function' && callback();
	            cancelAnimate();
	        });

	        tween.onStop(function () {
	            cancelAnimate();
	            props.onStop.call(this);
	        });

	        tween.start();

	        cancelAnimate = function cancelAnimate() {
	            if (id !== null) {
	                cancelAnimationFrame(id);
	                id = null;
	            }
	        };

	        _animate = function animate(time) {
	            id = requestAnimationFrame(_animate);
	            TWEEN.update(time);
	        };

	        _animate();
	    },

	    componentDidMount: function componentDidMount() {
	        this.props.onMount(this);
	    }
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Created by xcp on 2016/3/14.
	 */
	"use strict";

	module.exports = function () {};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * Tween.js - Licensed under the MIT license
	 * https://github.com/sole/tween.js
	 * ----------------------------------------------
	 *
	 * See https://github.com/sole/tween.js/graphs/contributors for the full list of contributors.
	 * Thank you all, you're awesome!
	 */

	// performance.now polyfill
	(function (root) {
	    root = this;
	    if ('performance' in root === false) {
	        root.performance = {};
	    }

	    // IE 8
	    Date.now = Date.now || function () {
	        return new Date().getTime();
	    };

	    if ('now' in root.performance === false) {
	        var offset = root.performance.timing && root.performance.timing.navigationStart ? performance.timing.navigationStart : Date.now();

	        root.performance.now = function () {
	            return Date.now() - offset;
	        };
	    }
	})();

	var TWEEN = TWEEN || function () {

	    var _tweens = [];

	    return {

	        REVISION: '14',

	        getAll: function getAll() {

	            return _tweens;
	        },

	        removeAll: function removeAll() {

	            _tweens = [];
	        },

	        add: function add(tween) {

	            _tweens.push(tween);
	        },

	        remove: function remove(tween) {

	            var i = _tweens.indexOf(tween);

	            if (i !== -1) {

	                _tweens.splice(i, 1);
	            }
	        },

	        update: function update(time) {

	            if (_tweens.length === 0) return false;

	            var i = 0;

	            time = time !== undefined ? time : window.performance.now();

	            while (i < _tweens.length) {

	                if (_tweens[i].update(time)) {

	                    i++;
	                } else {

	                    _tweens.splice(i, 1);
	                }
	            }

	            return true;
	        }
	    };
	}();

	TWEEN.Tween = function (object) {

	    var _object = object;
	    var _valuesStart = {};
	    var _valuesEnd = {};
	    var _valuesStartRepeat = {};
	    var _duration = 1000;
	    var _repeat = 0;
	    var _yoyo = false;
	    var _isPlaying = false;
	    var _reversed = false;
	    var _delayTime = 0;
	    var _startTime = null;
	    var _easingFunction = TWEEN.Easing.Linear.None;
	    var _interpolationFunction = TWEEN.Interpolation.Linear;
	    var _chainedTweens = [];
	    var _onStartCallback = null;
	    var _onStartCallbackFired = false;
	    var _onUpdateCallback = null;
	    var _onCompleteCallback = null;
	    var _onStopCallback = null;

	    // Set all starting values present on the target object
	    for (var field in object) {

	        _valuesStart[field] = parseFloat(object[field], 10);
	    }

	    this.to = function (properties, duration) {

	        if (duration !== undefined) {

	            _duration = duration;
	        }

	        _valuesEnd = properties;

	        return this;
	    };

	    this.start = function (time) {

	        TWEEN.add(this);

	        _isPlaying = true;

	        _onStartCallbackFired = false;

	        _startTime = time !== undefined ? time : window.performance.now();
	        _startTime += _delayTime;

	        for (var property in _valuesEnd) {

	            // check if an Array was provided as property value
	            if (_valuesEnd[property] instanceof Array) {

	                if (_valuesEnd[property].length === 0) {

	                    continue;
	                }

	                // create a local copy of the Array with the start value at the front
	                _valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);
	            }

	            _valuesStart[property] = _object[property];

	            if (_valuesStart[property] instanceof Array === false) {
	                _valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
	            }

	            _valuesStartRepeat[property] = _valuesStart[property] || 0;
	        }

	        return this;
	    };

	    this.stop = function () {

	        if (!_isPlaying) {
	            return this;
	        }

	        TWEEN.remove(this);
	        _isPlaying = false;

	        if (_onStopCallback !== null) {

	            _onStopCallback.call(_object);
	        }

	        this.stopChainedTweens();
	        return this;
	    };

	    this.stopChainedTweens = function () {

	        for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {

	            _chainedTweens[i].stop();
	        }
	    };

	    this.delay = function (amount) {

	        _delayTime = amount;
	        return this;
	    };

	    this.repeat = function (times) {

	        _repeat = times;
	        return this;
	    };

	    this.yoyo = function (yoyo) {

	        _yoyo = yoyo;
	        return this;
	    };

	    this.easing = function (easing) {

	        _easingFunction = easing;
	        return this;
	    };

	    this.interpolation = function (interpolation) {

	        _interpolationFunction = interpolation;
	        return this;
	    };

	    this.chain = function () {

	        _chainedTweens = arguments;
	        return this;
	    };

	    this.onStart = function (callback) {

	        _onStartCallback = callback;
	        return this;
	    };

	    this.onUpdate = function (callback) {

	        _onUpdateCallback = callback;
	        return this;
	    };

	    this.onComplete = function (callback) {

	        _onCompleteCallback = callback;
	        return this;
	    };

	    this.onStop = function (callback) {

	        _onStopCallback = callback;
	        return this;
	    };

	    this.update = function (time) {

	        var property;

	        if (time < _startTime) {

	            return true;
	        }

	        if (_onStartCallbackFired === false) {

	            if (_onStartCallback !== null) {

	                _onStartCallback.call(_object);
	            }

	            _onStartCallbackFired = true;
	        }

	        var elapsed = (time - _startTime) / _duration;
	        elapsed = elapsed > 1 ? 1 : elapsed;

	        var value = _easingFunction(elapsed);

	        for (property in _valuesEnd) {

	            var start = _valuesStart[property] || 0;
	            var end = _valuesEnd[property];

	            if (end instanceof Array) {

	                _object[property] = _interpolationFunction(end, value);
	            } else {

	                // Parses relative end values with start as base (e.g.: +10, -3)
	                if (typeof end === "string") {
	                    end = start + parseFloat(end, 10);
	                }

	                // protect against non numeric properties.
	                if (typeof end === "number") {
	                    _object[property] = start + (end - start) * value;
	                }
	            }
	        }

	        if (_onUpdateCallback !== null) {

	            _onUpdateCallback.call(_object, value);
	        }

	        if (elapsed == 1) {

	            if (_repeat > 0) {

	                if (isFinite(_repeat)) {
	                    _repeat--;
	                }

	                // reassign starting values, restart by making startTime = now
	                for (property in _valuesStartRepeat) {

	                    if (typeof _valuesEnd[property] === "string") {
	                        _valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
	                    }

	                    if (_yoyo) {
	                        var tmp = _valuesStartRepeat[property];
	                        _valuesStartRepeat[property] = _valuesEnd[property];
	                        _valuesEnd[property] = tmp;
	                    }

	                    _valuesStart[property] = _valuesStartRepeat[property];
	                }

	                if (_yoyo) {
	                    _reversed = !_reversed;
	                }

	                _startTime = time + _delayTime;

	                return true;
	            } else {

	                if (_onCompleteCallback !== null) {

	                    _onCompleteCallback.call(_object);
	                }

	                for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {

	                    _chainedTweens[i].start(time);
	                }

	                return false;
	            }
	        }

	        return true;
	    };
	};

	TWEEN.Easing = {

	    Linear: {

	        None: function None(k) {

	            return k;
	        }

	    },

	    Quadratic: {

	        In: function In(k) {

	            return k * k;
	        },

	        Out: function Out(k) {

	            return k * (2 - k);
	        },

	        InOut: function InOut(k) {

	            if ((k *= 2) < 1) return 0.5 * k * k;
	            return -0.5 * (--k * (k - 2) - 1);
	        }

	    },

	    Cubic: {

	        In: function In(k) {

	            return k * k * k;
	        },

	        Out: function Out(k) {

	            return --k * k * k + 1;
	        },

	        InOut: function InOut(k) {

	            if ((k *= 2) < 1) return 0.5 * k * k * k;
	            return 0.5 * ((k -= 2) * k * k + 2);
	        }

	    },

	    Quartic: {

	        In: function In(k) {

	            return k * k * k * k;
	        },

	        Out: function Out(k) {

	            return 1 - --k * k * k * k;
	        },

	        InOut: function InOut(k) {

	            if ((k *= 2) < 1) return 0.5 * k * k * k * k;
	            return -0.5 * ((k -= 2) * k * k * k - 2);
	        }

	    },

	    Quintic: {

	        In: function In(k) {

	            return k * k * k * k * k;
	        },

	        Out: function Out(k) {

	            return --k * k * k * k * k + 1;
	        },

	        InOut: function InOut(k) {

	            if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
	            return 0.5 * ((k -= 2) * k * k * k * k + 2);
	        }

	    },

	    Sinusoidal: {

	        In: function In(k) {

	            return 1 - Math.cos(k * Math.PI / 2);
	        },

	        Out: function Out(k) {

	            return Math.sin(k * Math.PI / 2);
	        },

	        InOut: function InOut(k) {

	            return 0.5 * (1 - Math.cos(Math.PI * k));
	        }

	    },

	    Exponential: {

	        In: function In(k) {

	            return k === 0 ? 0 : Math.pow(1024, k - 1);
	        },

	        Out: function Out(k) {

	            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
	        },

	        InOut: function InOut(k) {

	            if (k === 0) return 0;
	            if (k === 1) return 1;
	            if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
	            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
	        }

	    },

	    Circular: {

	        In: function In(k) {

	            return 1 - Math.sqrt(1 - k * k);
	        },

	        Out: function Out(k) {

	            return Math.sqrt(1 - --k * k);
	        },

	        InOut: function InOut(k) {

	            if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
	            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
	        }

	    },

	    Elastic: {

	        In: function In(k) {

	            var s,
	                a = 0.1,
	                p = 0.4;
	            if (k === 0) return 0;
	            if (k === 1) return 1;
	            if (!a || a < 1) {
	                a = 1;
	                s = p / 4;
	            } else s = p * Math.asin(1 / a) / (2 * Math.PI);
	            return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
	        },

	        Out: function Out(k) {

	            var s,
	                a = 0.1,
	                p = 0.4;
	            if (k === 0) return 0;
	            if (k === 1) return 1;
	            if (!a || a < 1) {
	                a = 1;
	                s = p / 4;
	            } else s = p * Math.asin(1 / a) / (2 * Math.PI);
	            return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
	        },

	        InOut: function InOut(k) {

	            var s,
	                a = 0.1,
	                p = 0.4;
	            if (k === 0) return 0;
	            if (k === 1) return 1;
	            if (!a || a < 1) {
	                a = 1;
	                s = p / 4;
	            } else s = p * Math.asin(1 / a) / (2 * Math.PI);
	            if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
	            return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
	        }

	    },

	    Back: {

	        In: function In(k) {

	            var s = 1.70158;
	            return k * k * ((s + 1) * k - s);
	        },

	        Out: function Out(k) {

	            var s = 1.70158;
	            return --k * k * ((s + 1) * k + s) + 1;
	        },

	        InOut: function InOut(k) {

	            var s = 1.70158 * 1.525;
	            if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
	            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
	        }

	    },

	    Bounce: {

	        In: function In(k) {

	            return 1 - TWEEN.Easing.Bounce.Out(1 - k);
	        },

	        Out: function Out(k) {

	            if (k < 1 / 2.75) {

	                return 7.5625 * k * k;
	            } else if (k < 2 / 2.75) {

	                return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
	            } else if (k < 2.5 / 2.75) {

	                return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
	            } else {

	                return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
	            }
	        },

	        InOut: function InOut(k) {

	            if (k < 0.5) return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
	            return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
	        }

	    }

	};

	TWEEN.Interpolation = {

	    Linear: function Linear(v, k) {

	        var m = v.length - 1,
	            f = m * k,
	            i = Math.floor(f),
	            fn = TWEEN.Interpolation.Utils.Linear;

	        if (k < 0) return fn(v[0], v[1], f);
	        if (k > 1) return fn(v[m], v[m - 1], m - f);

	        return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
	    },

	    Bezier: function Bezier(v, k) {

	        var b = 0,
	            n = v.length - 1,
	            pw = Math.pow,
	            bn = TWEEN.Interpolation.Utils.Bernstein,
	            i;

	        for (i = 0; i <= n; i++) {
	            b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
	        }

	        return b;
	    },

	    CatmullRom: function CatmullRom(v, k) {

	        var m = v.length - 1,
	            f = m * k,
	            i = Math.floor(f),
	            fn = TWEEN.Interpolation.Utils.CatmullRom;

	        if (v[0] === v[m]) {

	            if (k < 0) i = Math.floor(f = m * (1 + k));

	            return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
	        } else {

	            if (k < 0) return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
	            if (k > 1) return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);

	            return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
	        }
	    },

	    Utils: {

	        Linear: function Linear(p0, p1, t) {

	            return (p1 - p0) * t + p0;
	        },

	        Bernstein: function Bernstein(n, i) {

	            var fc = TWEEN.Interpolation.Utils.Factorial;
	            return fc(n) / fc(i) / fc(n - i);
	        },

	        Factorial: function () {

	            var a = [1];

	            return function (n) {

	                var s = 1,
	                    i;
	                if (a[n]) return a[n];
	                for (i = n; i > 1; i--) {
	                    s *= i;
	                }return a[n] = s;
	            };
	        }(),

	        CatmullRom: function CatmullRom(p0, p1, p2, p3, t) {

	            var v0 = (p2 - p0) * 0.5,
	                v1 = (p3 - p1) * 0.5,
	                t2 = t * t,
	                t3 = t * t2;
	            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
	        }

	    }

	};

	// UMD (Universal Module Definition)
	(function (root) {
	    root = this;
	    if (true) {

	        // AMD
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return TWEEN;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {

	        // Node.js
	        module.exports = TWEEN;
	    } else {

	        // Global variable
	        root.TWEEN = TWEEN;
	    }
	})();

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

	// requestAnimationFrame polyfill by Erik Möller
	// fixes from Paul Irish and Tino Zijdel

	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	var noop = __webpack_require__(4);
	var runtimeIsNode = __webpack_require__(7)();

	var _exports = {
	    requestAnimationFrame: noop,
	    cancelAnimationFrame: noop
	};

	if (!runtimeIsNode) {
	    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	    }

	    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
	        var currTime = new Date().getTime();
	        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	        var id = window.setTimeout(function () {
	            callback(currTime + timeToCall);
	        }, timeToCall);
	        lastTime = currTime + timeToCall;
	        return id;
	    };

	    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
	        clearTimeout(id);
	    };

	    _exports.requestAnimationFrame = window.requestAnimationFrame;
	    _exports.cancelAnimationFrame = window.cancelAnimationFrame;
	}

	module.exports = _exports;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Created by xcp on 2016/3/30.
	 */

	module.exports = function () {
	    var result = false;
	    try {
	        result = window;
	    } catch (e) {}

	    return !result;
	};

/***/ },
/* 8 */
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
/* 9 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/14.
	 */

	module.exports = function (condition, format) {
	    var args = Array.prototype.splice.call(arguments, 0);

	    if (args.length < 2) {
	        throw new Error("condition and message are required");
	    }

	    format = '' + format;

	    if (!condition) {
	        var index = 2;
	        var message = format.replace(/%s/g, function () {
	            return args[index++];
	        });

	        if (typeof console !== 'undefined') console.log(message);
	        try {
	            throw new Error(message);
	        } catch (e) {}
	    }
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/4/27.
	 */

	var React = __webpack_require__(2);
	var moment = __webpack_require__(11);
	var DropDown = __webpack_require__(12);
	var noop = __webpack_require__(4);
	var DatePicker = __webpack_require__(21);
	var PickerHeader = __webpack_require__(22);

	// 如果日期在当前日期之前，则禁用掉
	var disabledDate = function disabledDate(time) {
	    return time.isBefore(new Date(), 'day');
	};

	// 如果日期不属于同一月，则表示diff
	var diffDate = function diffDate(base, comp) {
	    return !(base.isSame(comp, 'month') && base.isSame(comp, 'year'));
	};

	var Calendar = React.createClass({
	    displayName: 'Calendar',

	    propTypes: {
	        weekDaysMin: React.PropTypes.array
	    },

	    getInitialState: function getInitialState() {
	        return {
	            show: false,
	            changeFromHeader: false,
	            currentTime: null,
	            onlyShowMonth: false
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            // class name
	            wrapClassName: 'comp-date-picker',
	            headerClassName: 'date-header',
	            disabledClassName: 'disabled',
	            currentClassName: 'curr',
	            diffMonthClassName: 'diff',

	            // header
	            startTime: [2010, 0, 1],
	            endTime: [2020, 0, 1],

	            defaultTime: new Date() * 1,
	            showDays: 6 * 7,
	            weekDaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

	            startWeek: 0, // [0-6]
	            format: 'YYYY-MM-DD HH:mm:ss',
	            onlyShowMonth: false,
	            disabledDate: disabledDate,
	            diffDate: diffDate,
	            onChange: noop,
	            onSelect: noop,
	            onMount: noop,
	            shouldUpdate: noop
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({
	            currentTime: moment(this.props.defaultTime),
	            showDays: this.props.showDays,
	            onlyShowMonth: this.props.onlyShowMonth
	        });
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({
	            currentTime: moment(nextProps.defaultTime),
	            showDays: nextProps.showDays,
	            onlyShowMonth: nextProps.onlyShowMonth
	        });
	    },

	    componentDidMount: function componentDidMount() {
	        this.props.onMount(this);
	    },

	    // 如果年份或月分发生了变化
	    // 则更新
	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        return nextState.changeFromHeader || !!this.props.shouldUpdate();
	    },

	    today: function today() {
	        this.setState({ currentTime: moment() });
	    },

	    _isSameDate: function _isSameDate(base, comp) {
	        return base.isSame(comp, 'year') && base.isSame(comp, 'month') && base.isSame(comp, 'day');
	    },

	    _spliceArray: function _spliceArray(arr, step) {
	        var l = arr.length;
	        var start = 0;
	        var r = [];
	        while (start < l) {
	            r.push(arr.slice(start, start + step));
	            start += step;
	        }
	        return r;
	    },

	    onHeaderChange: function onHeaderChange(year, month) {
	        // 如果当前选中的时间和下一次更新的时间的月份相同
	        // 那么设置下一次的天为当前的天数
	        // 也就是说当前选中的日期，在下一次UI刷新时[月分相同]，依然为选中状态
	        var cur = this.state.currentTime;
	        var nextDate = 1;
	        if (month === cur.month()) {
	            nextDate = cur.date();
	        }
	        var next = moment([year, month, nextDate]);

	        this.setState({ currentTime: next, changeFromHeader: true }, function () {
	            this._onChange(next, cur);
	        }.bind(this));
	    },

	    onSelect: function onSelect(cur) {
	        var prev = this.state.currentTime;

	        this.setState({ currentTime: cur, changeFromHeader: false }, function () {
	            this.props.onSelect(cur);
	            this._onChange(cur, prev);
	        }.bind(this));
	    },

	    _onChange: function _onChange(cur, prev) {
	        if (!this._isSameDate(cur, prev)) {
	            this.props.onChange(cur, prev);
	        }
	    },

	    render: function render() {
	        var self = this;
	        var props = self.props;
	        var state = self.state;

	        var m, firstDay, w, start, total, count, list, l, days, week, datePanel;

	        if (!state.onlyShowMonth) {
	            m = moment(state.currentTime);
	            // 获得当前月的第一天
	            firstDay = m.clone().date(1);
	            // 获得第一天的星期
	            w = firstDay.day();
	            // 计算其开始位置的日期
	            // 从周日开始[默认为0]
	            start = w > props.startWeek ? firstDay.clone().add(-(w - props.startWeek), 'day') : firstDay;

	            self.__startTime = start;

	            total = props.showDays;
	            count = 0;

	            // 循环生成每一天
	            // 日期分成多份，每份长度为一周
	            list = this._spliceArray(new Array(total).fill(true), 7);
	            l = list.length - 1;
	            days = list.map(function (week, index) {
	                return React.createElement('tr', { key: index }, week.map(function () {
	                    var time = start.clone().add(count++, 'day');

	                    if (index === l) {
	                        self.__endTime = time;
	                    }

	                    return React.createElement('td', { key: count }, React.createElement(DatePicker, {
	                        className: props.headerClassName,
	                        onSelect: self.onSelect,
	                        diffMonthClassName: props.diffMonthClassName,
	                        disabledClassName: props.disabledClassName,
	                        currentClassName: props.currentClassName,
	                        currentTime: m,
	                        disabledDate: props.disabledDate,
	                        diffDate: props.diffDate,
	                        format: props.format,
	                        time: time }));
	                }));
	            });

	            week = [];
	            total = props.weekDaysMin.length;
	            count = props.startWeek;

	            while (count < total) {
	                week.push(React.createElement('td', { key: 'week-' + count }, React.createElement('div', { className: 'date-week' }, props.weekDaysMin[count++])));
	            }

	            count = 0;
	            total = props.startWeek;
	            while (count < total) {
	                week.push(React.createElement('td', { key: 'week-' + count }, React.createElement('div', null, props.weekDaysMin[count++])));
	            }

	            week = React.createElement('tr', null, week);

	            datePanel = React.createElement('table', null, React.createElement('thead', null, week), React.createElement('tbody', null, days));
	        }

	        return React.createElement('div', { className: props.wrapClassName }, React.createElement(PickerHeader, {
	            className: props.headerClassName,
	            currentTime: state.currentTime,
	            startTime: props.startTime,
	            endTime: props.endTime,
	            onChange: this.onHeaderChange }), datePanel);
	    }
	});

	module.exports = Calendar;

/***/ },
/* 11 */
/***/ function(module, exports) {

	(function() { module.exports = this["moment"]; }());

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/22.
	 */

	var React = __webpack_require__(2);
	var noop = __webpack_require__(4);
	var Selectable = __webpack_require__(13);

	var DropDown = React.createClass({
	    displayName: 'DropDown',

	    getDefaultProps: function getDefaultProps() {
	        return {
	            wrapClassName: null,
	            selectorContent: null,
	            selectorBindEvent: true,
	            onSelect: noop,
	            getItemWrap: noop,
	            disabled: false,
	            panelContent: null
	        };
	    },

	    getInitialState: function getInitialState() {
	        return {
	            disabled: false,
	            currentSelectedValue: null
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({ disabled: this.props.disabled });
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({ disabled: nextProps.disabled });
	    },

	    onSelect: function onSelect(value) {
	        this.__selector.onSelect(value);
	        if (this.__selectable) {
	            this.__selectable.onSelect(value);
	        }
	    },

	    onSelectableMount: function onSelectableMount(selectable) {
	        this.__selectable = selectable;
	    },

	    onSelectorMount: function onSelectorMount(selector) {
	        this.__selector = selector;
	    },

	    render: function render() {
	        var props = this.props;

	        var items = props.panelContent.map(function (item, index) {
	            var _props = { key: index };
	            if (item.props.isItem) {
	                _props.onSelect = this.onSelect;
	            }
	            return React.cloneElement(item, _props);
	        }, this);

	        var panelContent = props.getItemWrap(items, props, this.state, this) || React.createElement('ol', { className: 'comp-select-m-t' }, items);

	        var selectorContent = React.cloneElement(props.selectorContent, {
	            onMount: this.onSelectorMount
	        });

	        return React.createElement(Selectable, {
	            onSelect: props.onSelect,
	            disabled: this.state.disabled,
	            wrapClassName: props.wrapClassName,
	            selectorBindEvent: props.selectorBindEvent,
	            onMount: this.onSelectableMount,
	            selectorContent: selectorContent,
	            panelContent: panelContent });
	    }

	});

	DropDown.Item = React.createClass({
	    displayName: 'Item',

	    getDefaultProps: function getDefaultProps() {
	        return {
	            value: null,
	            isItem: true,
	            getItemContent: noop,
	            onSelect: noop
	        };
	    },

	    onSelect: function onSelect() {
	        this.props.onSelect(this.props.value);
	    },

	    render: function render() {
	        return this.props.children ? React.cloneElement(this.props.children, { onClick: this.onSelect }) : this.props.getItemContent(this.props.value, { onClick: this.onSelect }, this);
	    }
	});

	DropDown.Selector = React.createClass({
	    displayName: 'Selector',

	    getInitialState: function getInitialState() {
	        return {
	            panelStateIsShow: false,
	            currentSelectedValue: null
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            defaultSelectedValue: null,
	            onSelect: noop,
	            onMount: noop,
	            getSelectorContent: noop
	        };
	    },

	    componentDidMount: function componentDidMount() {
	        this.props.onMount(this);
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({ currentSelectedValue: this.props.defaultSelectedValue });
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({ currentSelectedValue: nextProps.defaultSelectedValue });
	    },

	    onSelect: function onSelect(value) {
	        var self = this;
	        this.setState({ currentSelectedValue: value }, function () {
	            self.props.onSelect(value);
	        });
	    },

	    render: function render() {
	        return this.props.children ? this.props.children : this.props.getSelectorContent(this.state.currentSelectedValue);
	    }
	});

	module.exports = DropDown;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/22.
	 */

	var React = __webpack_require__(2);
	var noop = __webpack_require__(4);
	var classNames = __webpack_require__(14);
	var HideOnBodyClick = __webpack_require__(15);
	var NotAllowSelect = __webpack_require__(20);

	var Selectable = React.createClass({
	    displayName: 'Selectable',

	    getDefaultProps: function getDefaultProps() {
	        return {
	            wrapClassName: null,
	            onSelect: noop,
	            onComponentMount: noop,
	            onMount: noop,
	            selectorBindEvent: true,
	            selectorContent: null,
	            disabled: false,
	            panelContent: null
	        };
	    },

	    getInitialState: function getInitialState() {
	        return {
	            disabled: false,
	            visible: false
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({ disabled: this.props.disabled });
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({ disabled: nextProps.disabled });
	    },

	    componentDidMount: function componentDidMount() {
	        // TODO 废弃属性,用onMount代替
	        this.props.onComponentMount(this);
	        this.props.onMount(this);
	    },

	    showPanel: function showPanel() {
	        this.setState({ visible: true }, function () {
	            var animate = this.__animate;
	            var animateProps = animate.props;
	            animate.animate(animateProps.from, animateProps.to);
	        });
	    },

	    onAnimateMount: function onAnimateMount(inst) {
	        this.__animate = inst.__animate;
	    },

	    onSelect: function onSelect(item) {
	        // 动画结束时执行 props.onSelect
	        this.__animate.backToTheStart(function () {
	            this.onHide(function () {
	                this.props.onSelect(item);
	            }.bind(this));
	        }.bind(this));
	    },

	    onHide: function onHide(fn) {
	        this.setState({ visible: false }, fn);
	    },

	    shouldHide: function shouldHide() {
	        return this.state.visible;
	    },

	    render: function render() {
	        var props = this.props;
	        var state = this.state;

	        var className = {
	            'comp-custom-select': true,
	            'disabled': state.disabled,
	            'comp-show-panel': state.visible
	        };

	        if (props.wrapClassName) {
	            className[props.wrapClassName] = true;
	        }

	        var selector = null;
	        if (props.selectorBindEvent && !state.disabled) {
	            selector = React.createElement('div', { onClick: this.showPanel }, props.selectorContent);
	        } else {
	            selector = props.selectorContent;
	        }

	        return React.createElement('div', { className: classNames(className), ref: 'selectable' }, React.createElement('div', { className: 'comp-select-selector-pd' }, React.createElement(NotAllowSelect, null, selector)), React.createElement(HideOnBodyClick, {
	            refTarget: this.refs.selectable,
	            onHide: this.onHide,
	            onMount: this.onAnimateMount,
	            shouldHide: this.shouldHide }, React.createElement('div', { className: 'comp-select-panel' }, props.panelContent)));
	    }

	});

	module.exports = Selectable;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/22.
	 */

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(16);
	var Animate = __webpack_require__(1);
	var contains = __webpack_require__(17);
	var DOMEvent = __webpack_require__(18);
	var body = __webpack_require__(19);
	var noop = __webpack_require__(4);
	var assert = __webpack_require__(9);

	var shouldHide = function shouldHide() {
	    return true;
	};

	var HideOnBodyClick = React.createClass({
	    displayName: 'HideOnBodyClick',

	    getInitialState: function getInitialState() {
	        return {
	            visible: true
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            component: 'div',
	            refTarget: null,
	            style: {},
	            visible: true,
	            onHide: noop,
	            onMount: noop,
	            shouldHide: shouldHide
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({ visible: this.props.visible });
	    },

	    componentDidMount: function componentDidMount() {

	        this.__bodyHandle = function (e) {
	            var target = e.target || e.srcElement;
	            var mountNode = ReactDOM.findDOMNode(this);
	            var props = this.props;

	            if (!props.shouldHide() || props.refTarget && contains(props.refTarget, target) || contains(mountNode, target)) {
	                return;
	            }

	            if (this.__animate && this.__animate.backToTheStart) {
	                this.__animate.backToTheStart(this.onHide);
	            }
	        }.bind(this);

	        DOMEvent.on(body, 'click', this.__bodyHandle, false);
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        DOMEvent.off(body, 'click', this.__bodyHandle, false);
	    },

	    onHide: function onHide() {
	        this.props.onHide();
	    },

	    onMount: function onMount(animate) {
	        this.__animate = animate;
	        this.props.onMount(this);
	        if (this.state.visible) {
	            animate.startAnimate();
	        }
	    },

	    render: function render() {
	        var props = this.props;
	        var Components = props.component;
	        assert(props.children, 'children required in HideOnBodyClick');

	        return React.createElement(Components, { style: { background: '#fff' } }, React.createElement(Animate, {
	            style: props.style,
	            component: props.component,
	            from: { opacity: 0 },
	            to: { opacity: 1 },
	            during: 200,
	            onMount: this.onMount }, props.children));
	    }
	});

	module.exports = HideOnBodyClick;

/***/ },
/* 16 */
/***/ function(module, exports) {

	(function() { module.exports = this["ReactDOM"]; }());

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Created by xcp on 2016/3/15.
	 *
	 * from jquery-1.9.1
	 */

	module.exports = function (a, b) {
	    var c = a.nodeType === 9 ? a.documentElement : a;

	    return a === b || !!(b && b.nodeType === 1 && (c.contains ? c.contains(b) : a.compareDocumentPosition && a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_CONTAINED_BY));
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/19.
	 */

	var isElement = function isElement(elem) {
	    var result = false;
	    try {
	        result = elem.nodeType === 1;
	    } catch (e) {}
	    return result;
	};

	var body = __webpack_require__(19);
	var isW3c = !!body.addEventListener;
	var ADD_EVENT_NAME = isW3c ? 'addEventListener' : 'attachEvent';
	var REMOVE_EVENT_NAME = isW3c ? 'removeEventListener' : 'detachEvent';
	var EVENT_TYPE_PREFIX = isW3c ? '' : 'on';

	var eventType = function eventType(type) {
	    return EVENT_TYPE_PREFIX + type;
	};

	var factory = function factory(handleName) {
	    return function (elem, type, handle, capture) {
	        if (!isElement(elem)) return elem;
	        if (elem[handleName]) {
	            elem[handleName](eventType(type), handle, capture);
	        }
	        return elem;
	    };
	};

	module.exports = {
	    on: factory(ADD_EVENT_NAME),
	    off: factory(REMOVE_EVENT_NAME)
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/19.
	 */

	module.exports = __webpack_require__(7)() ? {} : document.body || document.documentElement;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/4/29.
	 */

	var React = __webpack_require__(2);
	var assign = __webpack_require__(8);
	var returnFalse = function returnFalse() {
	    return false;
	};
	var NotAllowSelect = React.createClass({
	    displayName: 'NotAllowSelect',

	    getDefaultProps: function getDefaultProps() {
	        return {
	            style: {}
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        this.style = {
	            MozUserSelect: 'none',
	            WebkitUserSelect: 'none',
	            msUserSelect: 'none',
	            userSelect: 'none'
	        };
	    },

	    render: function render() {
	        return React.cloneElement(this.props.children, {
	            onSelect: returnFalse,
	            style: assign({}, this.style, this.props.style)
	        });
	    }
	});
	module.exports = NotAllowSelect;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/4/27.
	 */

	var moment = __webpack_require__(11);
	var React = __webpack_require__(2);
	var noop = __webpack_require__(4);
	var classnames = __webpack_require__(14);

	var DatePicker = React.createClass({
	    displayName: 'DatePicker',

	    getDefaultProps: function getDefaultProps() {
	        return {
	            dateItemClassName: 'date-item',
	            disabledClassName: 'disabled',
	            currentClassName: 'curr',
	            diffMonthClassName: 'diff',
	            currentTime: moment(),
	            time: moment(),
	            format: 'YYYY-MM-DD HH:mm:ss',
	            onSelect: noop,
	            disabledDate: noop,
	            diffDate: noop
	        };
	    },

	    onSelect: function onSelect() {
	        this.props.onSelect(this.props.time);
	    },

	    render: function render() {
	        var props = this.props;
	        var disabled = props.disabledDate(props.time);
	        var className = {};
	        var current = props.currentTime;

	        className[props.dateItemClassName] = true;
	        className[props.disabledClassName] = disabled;
	        className[props.currentClassName] = props.time.isSame(current, 'year') && props.time.isSame(current, 'month') && props.time.isSame(current, 'day');
	        className[props.diffMonthClassName] = props.diffDate(props.currentTime, props.time);

	        return React.createElement('div', {
	            className: classnames(className),
	            onClick: disabled ? noop : this.onSelect }, props.time.date());
	    }
	});

	module.exports = DatePicker;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/4/27.
	 */

	var React = __webpack_require__(2);
	var moment = __webpack_require__(11);
	var Selectable = __webpack_require__(23);
	var noop = __webpack_require__(4);
	var assert = __webpack_require__(9);

	var getItemContent = function getItemContent(value, props) {
	    var item = React.createElement('li', { className: 'comp-panel-item' }, value.year());
	    return React.cloneElement(item, props);
	};

	var getSelectorContent = function getSelectorContent(value) {
	    return React.createElement('div', { className: 'comp-select-selector' }, React.createElement('span', { className: 'util-font-12' }, value.year()), React.createElement('span', { className: 'icon-img icon-tran-black-d' }));
	};

	var PickerHeader = React.createClass({
	    displayName: 'PickerHeader',

	    getInitialState: function getInitialState() {
	        return {
	            currentTime: null,
	            monthList: []
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            className: '',
	            currentTime: moment(),
	            startTime: [2010, 0, 1],
	            endTime: [2020, 0, 1],
	            onChange: noop
	        };
	    },

	    getMonth: function getMonth(time) {
	        var currentMonth = time.month() + 1;
	        var props = this.props;
	        var year = time.year();
	        var startTimeYear = props.startTime[0];
	        var endTimeYear = props.endTime[0];
	        var startTimeMonth = props.startTime[1] + 1;
	        var endTimeMonth = props.endTime[1] + 1;

	        var monthList = new Array(12).fill(1).map(function (v, i) {
	            return i + 1;
	        });

	        // 生成每一年的月份的时候,该月需要大于start,小于end
	        var list = monthList.filter(function (v) {
	            // 当前年和开始年相同
	            // 则判断月份是否相同
	            if (year === startTimeYear) {
	                return v >= startTimeMonth;
	            } else if (year === endTimeYear) {
	                return v <= endTimeMonth;
	            }
	            return true;
	        });

	        // 如果当前年 + 上一次时间月份超出了endTime
	        // 则将endTime的月份设置为合法的第一个月
	        var month = currentMonth;
	        // 如果当前月小于月份的最小值,则取最小值
	        // 如果当前月份大于月份的最大值,则取最大值

	        if (currentMonth < list[0]) {
	            month = list[0];
	        } else if (currentMonth > list[list.length - 1]) {
	            month = list[list.length - 1];
	        }

	        return {
	            month: month - 1,
	            monthList: list
	        };
	    },

	    setTime: function setTime(time) {
	        this.setState({ currentTime: time });
	    },

	    // 确定 time 是否在 startTime 和 endTime 范围内
	    timeInRange: function timeInRange(time) {
	        var cur = time.valueOf();
	        var start = moment(this.props.startTime).valueOf();
	        var end = moment(this.props.endTime).valueOf();
	        return cur <= end && cur >= start;
	    },

	    setYear: function setYear(time) {
	        var currentMonth = this.state.currentTime.month();
	        var month = this.getMonth(time.clone().month(currentMonth));
	        this.setState({
	            currentTime: time.clone().month(month.month),
	            monthList: month.monthList
	        });
	    },

	    setMonth: function setMonth(month) {
	        this.setTime(this.state.currentTime.clone().month(month - 1));
	    },

	    nextMonth: function nextMonth() {
	        var nextTime = this.state.currentTime.clone().add(1, 'month');
	        if (this.timeInRange(nextTime)) {
	            var month = this.getMonth(nextTime);
	            this.setState({
	                currentTime: nextTime.clone().month(month.month),
	                monthList: month.monthList
	            });
	        }
	    },

	    previousMonth: function previousMonth() {
	        var nextTime = this.state.currentTime.clone().add(-1, 'month');
	        if (this.timeInRange(nextTime)) {
	            var month = this.getMonth(nextTime);
	            this.setState({
	                currentTime: nextTime.clone().month(month.month),
	                monthList: month.monthList
	            });
	        }
	    },

	    nextYear: function nextYear() {
	        this.setTime(this.state.currentTime.clone().add(1, 'year'));
	    },

	    previousYear: function previousYear() {
	        this.setTime(this.state.currentTime.clone().add(-1, 'year'));
	    },

	    componentWillMount: function componentWillMount() {
	        var props = this.props;
	        var start = moment(props.startTime).month(props.currentTime.month());
	        var end = moment(props.endTime);

	        var sl = start.year();
	        var el = end.year();

	        assert(start.valueOf() <= end.valueOf(), 'start year need to be less than end year');

	        // 年间距
	        var yearList = [];
	        var s = 0,
	            l = el - sl;
	        while (s <= l) {
	            yearList.push(start.clone().add(s++, 'year'));
	        }

	        this.__yearList = yearList;

	        var month = this.getMonth(moment(props.currentTime));

	        this.setState({
	            currentTime: this.props.currentTime,
	            monthList: month.monthList
	        });
	    },

	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        if (nextState.currentTime.year() !== this.state.currentTime.year() || nextState.currentTime.month() !== this.state.currentTime.month()) {
	            this.props.onChange(nextState.currentTime.year(), nextState.currentTime.month());
	            return true;
	        }
	        return false;
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({ currentTime: nextProps.currentTime });
	    },

	    render: function render() {
	        var iconStyle = { cursor: 'pointer' };

	        return React.createElement('div', { className: this.props.className }, React.createElement(Selectable.Custom, {
	            defaultSelectedValue: this.state.currentTime,
	            getSelectorContent: getSelectorContent,
	            getItemContent: getItemContent,
	            onSelect: this.setYear,
	            itemList: this.__yearList }), React.createElement(Selectable.Importable, {
	            defaultSelectedValue: this.state.currentTime.month() + 1,
	            onSelect: this.setMonth,
	            itemList: this.state.monthList }), React.createElement('span', { style: iconStyle,
	            className: 'icon-img icon-img icon-tran-black-l util-v-m comp-icon-gap',
	            onClick: this.previousMonth }), React.createElement('span', { style: iconStyle,
	            className: 'icon-img icon-img icon-tran-black-r util-v-m',
	            onClick: this.nextMonth }));
	    }

	});

	module.exports = PickerHeader;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/22.
	 */

	module.exports = {
	    Importable: __webpack_require__(24),
	    Diff: __webpack_require__(25),
	    Container: __webpack_require__(26),
	    FOContainer: __webpack_require__(29),
	    MiniContainer: __webpack_require__(30),
	    DropDown: __webpack_require__(12),
	    Custom: __webpack_require__(31),
	    Checkbox: __webpack_require__(32),
	    Selectable: __webpack_require__(13)
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/23.
	 */

	var React = __webpack_require__(2);
	var DropDown = __webpack_require__(12);
	var noop = __webpack_require__(4);

	var getSelectorContent = function getSelectorContent(props, state, onChange) {
	    return function (value) {
	        if (state.inputState) {
	            return React.createElement('input', {
	                ref: 'inputNode',
	                onChange: onChange,
	                className: 'input-default',
	                style: { width: 60 },
	                defaultValue: value });
	        }
	        return React.createElement('div', { className: 'comp-select-selector' }, React.createElement('span', { className: 'util-font-12' }, value), React.createElement('span', { className: 'icon-img icon-tran-black-d' }));
	    };
	};

	var getItemContent = function getItemContent(value, props) {
	    var item = React.createElement('li', { className: 'comp-panel-item' }, React.createElement('strong', null, value));
	    return React.cloneElement(item, props);
	};

	var getTruth = function getTruth() {
	    return true;
	};

	var Importable = React.createClass({
	    displayName: 'Importable',

	    getInitialState: function getInitialState() {
	        return {
	            currentSelectedValue: null,
	            fromInput: false,
	            disabled: false,
	            inputState: false
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            itemList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'],
	            defaultSelectedValue: 1,
	            onSelect: noop,
	            validate: getTruth,
	            getSelectorContent: getSelectorContent,
	            getItemContent: getItemContent,
	            disabled: false,
	            rejectValue: '10+'
	        };
	    },

	    getCurrent: function getCurrent() {
	        return this.state.currentSelectedValue;
	    },

	    onSelect: function onSelect(value) {
	        var isReject = value === this.props.rejectValue;
	        var next = isReject ? this.state.currentSelectedValue : value;

	        // 如果当前值为 rejectValue，则将上一次选择的值传给回调
	        // 同时需要重新 render，以确认是否需要绑定事件
	        this.props.onSelect(next);
	        this.setState({
	            currentSelectedValue: next,
	            inputState: isReject
	        });
	    },

	    onChange: function onChange(e) {
	        this._inputNode = e.target;
	        if (this.props.validate(e.target.value, e.target, this)) {
	            this.setState({
	                currentSelectedValue: e.target.value,
	                fromInput: true
	            });
	        }
	    },

	    validate: function validate() {
	        var inputNode = this._inputNode;
	        return inputNode ? this.props.validate(inputNode.value, inputNode) : true;
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({
	            currentSelectedValue: this.props.defaultSelectedValue,
	            disabled: this.props.disabled
	        });
	    },

	    // 如果是input的输入值变化，则不需要重新渲染
	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        return !nextState.fromInput;
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({
	            currentSelectedValue: nextProps.defaultSelectedValue,
	            disabled: nextProps.disabled
	        });
	    },

	    queryBindEvent: function queryBindEvent() {
	        //var value = this.state.currentSelectedValue;
	        //return value !== this.props.rejectValue ||
	        //    (value && typeof value === 'object' && !value.target)
	        return !this.state.disabled && !this.state.inputState;
	    },

	    render: function render() {
	        var self = this;
	        var props = self.props;
	        var state = self.state;

	        var selectorContent = React.createElement(DropDown.Selector, {
	            defaultSelectedValue: state.currentSelectedValue,
	            getSelectorContent: props.getSelectorContent(props, state, self.onChange) });

	        var panelContent = React.Children.map(props.itemList, function (value, index) {
	            return React.createElement(DropDown.Item, {
	                value: value,
	                key: index,
	                getItemContent: props.getItemContent });
	        });

	        return React.createElement(DropDown, {
	            onSelect: self.onSelect,
	            disabled: props.disabled,
	            selectorBindEvent: this.queryBindEvent(),
	            selectorContent: selectorContent,
	            panelContent: panelContent });
	    }
	});

	module.exports = Importable;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/23.
	 */

	var React = __webpack_require__(2);
	var DropDown = __webpack_require__(12);
	var noop = __webpack_require__(4);

	var getSelectorContent = function getSelectorContent(item) {
	    return React.createElement('div', { className: 'comp-select-selector' }, React.createElement('span', { className: 'util-font-12' }, item.text), React.createElement('span', { className: 'icon-img icon-tran-black-d' }));
	};

	var getItemContent = function getItemContent(item, props) {
	    var elem = React.createElement(DropDown.Item, { isItem: !!item.value, value: item }, item.value ? React.createElement('li', { className: 'comp-panel-item' }, React.createElement('strong', null, item.text)) : React.createElement('li', { className: 'comp-panel-title' }, React.createElement('span', { className: 'color-remind' }, item.text)));
	    return React.cloneElement(elem, props);
	};

	var Diff = React.createClass({
	    displayName: 'Diff',

	    getInitialState: function getInitialState() {
	        return {
	            currentSelectedValue: null,
	            disabled: false
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        var itemList = [{ value: 0, text: '筛选异常原因' }, { value: 1, text: '全部' }, { value: 2, text: '编号重复' }, { value: 3, text: '编号不存在' }, { value: 4, text: '已下架' }];

	        return {
	            itemList: itemList,
	            defaultSelectedValue: itemList[0],
	            rejectValue: null,
	            disabled: false,
	            onSelect: noop,
	            getSelectorContent: getSelectorContent,
	            getItemContent: getItemContent
	        };
	    },

	    onSelect: function onSelect(value) {
	        var self = this;
	        self.setState({ currentSelectedValue: value }, function () {
	            self.props.onSelect(value);
	        });
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({
	            currentSelectedValue: this.props.defaultSelectedValue === null ? this.props.itemList[0] : this.props.defaultSelectedValue,
	            disabled: this.props.disabled
	        });
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({
	            currentSelectedValue: nextProps.defaultSelectedValue,
	            disabled: nextProps.disabled
	        });
	    },

	    ensureEvent: function ensureEvent() {
	        return this.state.currentSelectedValue !== this.props.rejectValue;
	    },

	    render: function render() {
	        var self = this;
	        var props = self.props;
	        var panelContent = props.itemList.map(props.getItemContent);
	        var selector = React.createElement(DropDown.Selector, {
	            defaultSelectedValue: this.state.currentSelectedValue,
	            getSelectorContent: props.getSelectorContent });

	        return React.createElement(DropDown, {
	            onSelect: self.onSelect,
	            disabled: this.state.disabled,
	            selectorContent: selector,
	            panelContent: panelContent });
	    }
	});

	module.exports = Diff;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/23.
	 */

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(16);
	var HideOnBodyClick = __webpack_require__(15);
	var classNames = __webpack_require__(14);

	var SelectableMixin = __webpack_require__(27);
	var ContainerMixin = __webpack_require__(28);

	var Container = React.createClass({
	    displayName: 'Container',

	    mixins: [SelectableMixin, ContainerMixin],

	    reRender: function reRender(itemList) {
	        var mountNode = ReactDOM.findDOMNode(this).parentNode;
	        ReactDOM.render(React.createElement(Container, {
	            itemList: itemList,
	            onSelect: this.props.onSelect,
	            defaultSelectedValue: this.props.defaultSelectedValue }), mountNode);
	    },

	    render: function render() {
	        var panelClassName = {
	            'comp-custom-select': true,
	            'comp-show-panel': this.state.panelStateIsShow
	        };

	        var progressText = 'progress-bar-text';

	        var progressClassName = this.getProgressClassName(this.state.currentSelectedValue ? this.state.currentSelectedValue.percent : 0, progressText);

	        var itemList = this.props.itemList.map(function (item) {
	            return React.createElement('li', { className: 'comp-panel-item', key: item.index }, React.createElement('strong', { className: 'comp-icon-gap' }, item.index), React.createElement('div', { className: 'comp-select-progress comp-icon-gap',
	                onClick: this.onSelect.bind(this, item) }, React.createElement('span', { className: this.getProgressClassName(item.percent, progressText) })), React.createElement('span', {
	                className: 'icon-img icon-close util-v-m',
	                onClick: this.props.remove.bind(this, item) }));
	        }, this);

	        return React.createElement('div', { className: classNames(panelClassName), ref: 'selectable' }, React.createElement('div', { className: 'comp-select-selector-pd' }, React.createElement('div', { className: 'comp-select-selector', onClick: this.showPanel }, React.createElement('div', { className: 'comp-select-progress' }, React.createElement('span', { className: progressClassName })), React.createElement('span', { className: 'icon-img icon-tran-black-d' }))), React.createElement(HideOnBodyClick, {
	            refTarget: this.refs.selectable,
	            onHide: this.onHide,
	            onMount: this.onAnimateMount,
	            shouldHide: this.shouldHide }, React.createElement('div', { className: 'comp-select-panel comp-progress-panel' }, React.createElement('ol', { className: 'comp-select-m-t' }, itemList, React.createElement('li', { className: 'comp-panel-title util-text-center' }, React.createElement('span', { className: 'icon-img icon-plus util-v-m', onClick: this.props.add }))))));
	    }
	});

	module.exports = Container;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/24.
	 */

	var React = __webpack_require__(2);
	var noop = __webpack_require__(4);
	var shouldHide = function shouldHide() {
	    return true;
	};

	module.exports = {

	    propTypes: {
	        itemList: React.PropTypes.array,
	        defaultSelectedValue: React.PropTypes.any,
	        onSelect: React.PropTypes.func
	    },

	    getInitialState: function getInitialState() {
	        return {
	            panelStateIsShow: false,
	            currentSelectedValue: null
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        var itemList = [];
	        return {
	            itemList: itemList,
	            selectorClassName: '',
	            selectorStyle: {},
	            shouldHide: shouldHide,
	            defaultSelectedValue: itemList[0],
	            onSelect: noop
	        };
	    },

	    onSelect: function onSelect(value) {
	        var self = this;
	        self.__animate.backToTheStart(function () {
	            self.onHide();
	            self.setState({ currentSelectedValue: value }, function () {
	                self.props.onSelect(value);
	            });
	        });
	    },

	    onHide: function onHide() {
	        this.setState({ panelStateIsShow: false });
	    },

	    shouldHide: function shouldHide() {
	        return this.state.panelStateIsShow;
	    },

	    onAnimateMount: function onAnimateMount(inst) {
	        this.__animate = inst.__animate;
	    },

	    showPanel: function showPanel() {
	        var self = this;
	        self.setState({ panelStateIsShow: true }, function () {
	            var animate = self.__animate;
	            var animateProps = animate.props;
	            animate.animate(animateProps.from, animateProps.to);
	        });
	    },

	    hidePanel: function hidePanel() {
	        this.setState({ panelStateIsShow: false });
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({ currentSelectedValue: this.props.defaultSelectedValue });
	    }
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/24.
	 */

	var classNames = __webpack_require__(14);
	var noop = __webpack_require__(4);

	module.exports = {

	    getDefaultProps: function getDefaultProps() {
	        return {
	            add: noop,
	            remove: noop
	        };
	    },

	    addOne: function addOne() {
	        var index = 0;
	        this.props.itemList.forEach(function (item) {
	            if (item.index > index) index = item.index;
	        });

	        this.props.itemList.push({ percent: 0, index: index + 1 });
	        this.reRender(this.props.itemList);
	    },

	    removeOne: function removeOne(item) {
	        var index = this.props.itemList.indexOf(item);
	        if (index !== -1) {
	            this.props.itemList.splice(index, 1);
	            this.reRender(this.props.itemList);
	        }
	    },

	    getProgressClassName: function getProgressClassName() {
	        var args = Array.prototype.slice.call(arguments, 1);
	        var percent = arguments[0];
	        var className = {};

	        args.forEach(function (name) {
	            className[name] = true;
	        });

	        className['progress-' + parseInt(percent * 100)] = true;
	        return classNames(className);
	    }
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/23.
	 */

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(16);
	var HideOnBodyClick = __webpack_require__(15);
	var classNames = __webpack_require__(14);
	var noop = __webpack_require__(4);

	var SelectableMixin = __webpack_require__(27);
	var ContainerMixin = __webpack_require__(28);

	var FOContainer = React.createClass({
	    displayName: 'FOContainer',

	    propTypes: {
	        firstOut: React.PropTypes.array
	    },

	    mixins: [SelectableMixin, ContainerMixin],

	    getDefaultProps: function getDefaultProps() {
	        return { firstOut: [] };
	    },

	    reRender: function reRender(itemList) {
	        var mountNode = ReactDOM.findDOMNode(this).parentNode;
	        ReactDOM.render(React.createElement(FOContainer, {
	            itemList: itemList,
	            firstOut: this.props.firstOut,
	            onSelect: this.props.onSelect,
	            defaultSelectedValue: this.props.defaultSelectedValue }), mountNode);
	    },

	    getItemElement: function getItemElement(item) {
	        return React.createElement('li', { className: 'comp-panel-item', key: item.index }, React.createElement('strong', { className: 'comp-icon-gap' }, item.index), React.createElement('div', { className: 'comp-select-progress comp-icon-gap',
	            onClick: this.onSelect.bind(this, item) }, React.createElement('span', { className: this.getProgressClassName(item.percent, 'progress-bar-text') })), React.createElement('span', { className: 'icon-img icon-close util-v-m', onClick: this.props.remove.bind(this, item) }));
	    },

	    render: function render() {
	        var panelClassName = {
	            'comp-custom-select': true,
	            'comp-show-panel': this.state.panelStateIsShow
	        };

	        var progressText = 'progress-bar-text';

	        var progressClassName = this.getProgressClassName(this.state.currentSelectedValue ? this.state.currentSelectedValue.percent : 0, progressText);

	        var props = this.props;

	        var itemList = props.itemList.filter(function (item) {
	            return props.firstOut.indexOf(item) === -1;
	        }, this).map(this.getItemElement, this);

	        var firstOutList = props.firstOut.map(this.getItemElement, this);

	        return React.createElement('div', { className: classNames(panelClassName), ref: 'selectable' }, React.createElement('div', { className: 'comp-select-selector-pd' }, React.createElement('div', { className: 'comp-select-selector', onClick: this.showPanel }, React.createElement('div', { className: 'comp-select-progress' }, React.createElement('span', { className: progressClassName })), React.createElement('span', { className: 'icon-img icon-tran-black-d' }))), React.createElement(HideOnBodyClick, {
	            refTarget: this.refs.selectable,
	            onHide: this.onHide,
	            onMount: this.onAnimateMount,
	            shouldHide: this.shouldHide }, React.createElement('div', { className: 'comp-select-panel comp-progress-panel' }, React.createElement('div', { className: 'bub-bd-b' }, React.createElement('div', { className: 'bub-pd-l-lg bub-pd-r-lg' }, React.createElement('span', { className: 'color-selection comp-neg-m-l comp-icon-gap' }, '先出货柜'), React.createElement('span', { className: 'icon-img icon-qa-normal util-v-text-t' })), React.createElement('div', { className: 'bub-pd-b' }, React.createElement('ol', { className: 'comp-select-m-t bub-pd-t' }, firstOutList))), React.createElement('ol', { className: 'comp-select-m-t bub-pd-t' }, React.createElement('li', { className: 'comp-panel-title util-line-14' }, React.createElement('span', { className: 'color-selection comp-neg-m-l comp-icon-gap' }, '其他货柜'), React.createElement('span', { className: 'icon-img icon-qa-normal util-v-text-t' })), itemList, React.createElement('li', { className: 'comp-panel-title util-text-center' }, React.createElement('span', { className: 'icon-img icon-plus util-v-m', onClick: this.props.add }))))));
	    }
	});

	module.exports = FOContainer;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/23.
	 */

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(16);
	var HideOnBodyClick = __webpack_require__(15);
	var classNames = __webpack_require__(14);

	var SelectableMixin = __webpack_require__(27);
	var ContainerMixin = __webpack_require__(28);

	var MiniContainer = React.createClass({
	    displayName: 'MiniContainer',

	    mixins: [SelectableMixin, ContainerMixin],

	    reRender: function reRender(itemList) {
	        var mountNode = ReactDOM.findDOMNode(this).parentNode;
	        ReactDOM.render(React.createElement(MiniContainer, {
	            itemList: itemList,
	            onSelect: this.props.onSelect,
	            defaultSelectedValue: this.props.defaultSelectedValue }), mountNode);
	    },

	    render: function render() {
	        var props = this.props;
	        var panelClassName = {
	            'comp-custom-select': true,
	            'comp-show-panel': this.state.panelStateIsShow
	        };

	        var progressClassName = this.getProgressClassName(this.state.currentSelectedValue ? this.state.currentSelectedValue.percent : 0, 'progress-bar-text');

	        var itemList = this.props.itemList.map(function (item) {
	            return React.createElement('div', { className: 'col-xs-4', key: item.index }, React.createElement('div', { className: 'comp-mini-item', onClick: this.onSelect.bind(this, item) }, React.createElement('div', { className: 'row' }, React.createElement('strong', { className: 'col-xs-4 util-text-right' }, item.index), React.createElement('div', { className: 'col-xs-8' }, React.createElement('span', { className: this.getProgressClassName(item.percent) })))));
	        }, this);

	        return React.createElement('div', { className: classNames(panelClassName), ref: 'selectable' }, React.createElement('div', {
	            className: "comp-select-selector-pd" + (props.selectorClassName ? ' ' + props.selectorClassName : ''),
	            style: props.selectorStyle }, React.createElement('div', {
	            className: 'comp-select-selector',
	            onClick: this.showPanel }, React.createElement('div', { className: 'comp-select-progress' }, React.createElement('span', { className: progressClassName })), React.createElement('span', { className: 'icon-img icon-tran-black-d' }))), React.createElement(HideOnBodyClick, {
	            refTarget: this.refs.selectable,
	            onHide: this.onHide,
	            onMount: this.onAnimateMount,
	            shouldHide: this.shouldHide }, React.createElement('div', { className: 'comp-select-panel comp-progress-panel comp-mini-progress' }, React.createElement('div', { className: 'comp-select-m-t' }, React.createElement('div', { className: 'row' }, itemList, React.createElement('div', { className: 'comp-panel-title util-text-center col-xs-12' }, React.createElement('span', { className: 'icon-img icon-plus util-v-m', onClick: props.add })))))));
	    }
	});

	module.exports = MiniContainer;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/23.
	 */

	var React = __webpack_require__(2);
	var DropDown = __webpack_require__(12);
	var noop = __webpack_require__(4);

	var Custom = React.createClass({
	    displayName: 'Custom',

	    getInitialState: function getInitialState() {
	        return {
	            currentSelectedValue: null,
	            disabled: true
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            itemList: [],
	            wrapClassName: null,
	            defaultSelectedValue: null,
	            disabled: false,
	            onSelect: noop,
	            getItemWrap: noop,
	            getSelectorContent: noop,
	            getItemsContent: noop,
	            getItemContent: noop
	        };
	    },

	    onSelect: function onSelect(value) {
	        this.props.onSelect(value);
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({
	            currentSelectedValue: this.props.defaultSelectedValue === null ? this.props.itemList[0] : this.props.defaultSelectedValue,
	            disabled: this.props.disabled
	        });
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({
	            currentSelectedValue: nextProps.defaultSelectedValue,
	            disabled: nextProps.disabled
	        });
	    },

	    ensureEvent: function ensureEvent() {
	        return this.state.currentSelectedValue !== this.props.rejectValue && !this.state.disabled;
	    },

	    render: function render() {
	        var self = this;
	        var props = self.props;

	        var selectorContent = React.createElement(DropDown.Selector, {
	            defaultSelectedValue: self.state.currentSelectedValue,
	            getSelectorContent: props.getSelectorContent });

	        var panelContent = props.getItemsContent(props, self.state, this) || props.itemList.map(function (value, index) {
	            return React.createElement(DropDown.Item, {
	                value: value,
	                key: index,
	                getItemContent: props.getItemContent });
	        });

	        return React.createElement(DropDown, {
	            onSelect: self.onSelect,
	            disabled: this.state.disabled,
	            getItemWrap: props.getItemWrap,
	            wrapClassName: props.wrapClassName,
	            selectorBindEvent: this.ensureEvent(),
	            selectorContent: selectorContent,
	            panelContent: panelContent });
	    }
	});

	module.exports = Custom;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	} : function (obj) {
	    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	};

	/**
	 * Created by xcp on 2016/4/10.
	 */

	var React = __webpack_require__(2);
	var noop = __webpack_require__(4);

	var Checkbox = React.createClass({
	    displayName: 'Checkbox',

	    getInitialState: function getInitialState() {
	        return {
	            checkedList: [],
	            maxChecked: 1
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            wrapClassName: 'list',
	            checkedList: [],
	            itemList: [],
	            // 可选择多少个
	            maxChecked: null,
	            onOutOfBounds: noop,
	            onComponentMount: noop,
	            onChange: noop,
	            getContent: function getContent(item, index, inst) {
	                return React.createElement('label', { key: index }, React.createElement(Checkbox.Checkbox, {
	                    checked: inst.state.checkedList.indexOf(item) !== -1,
	                    onComponentMount: inst.recordCheckbox,
	                    onChange: inst.onChange,
	                    value: item }), React.createElement(Checkbox.Label, { content: item.content }));
	            }
	        };
	    },

	    onChange: function onChange(checked, item) {
	        var checkedList = this.state.checkedList;
	        var index = checkedList.indexOf(item);

	        // copy checkedList
	        var nextCheckedList = checkedList.slice(0);

	        if (!checked && index !== -1) {
	            nextCheckedList.splice(index, 1);
	        } else if (index === -1) {
	            nextCheckedList.push(item);
	        }

	        // 选择数量越界
	        if (nextCheckedList.length > this.state.maxChecked) {
	            this.props.onOutOfBounds(nextCheckedList);
	        }

	        this.updateCheckedList(nextCheckedList);
	    },

	    getCheckedValue: function getCheckedValue() {
	        return this.state.checkedList;
	    },

	    updateCheckedList: function updateCheckedList(checkedList) {
	        this.setState({ checkedList: checkedList.slice(0, this.state.maxChecked) });
	    },

	    cleanup: function cleanup() {
	        this.updateCheckedList([]);
	    },

	    checkAll: function checkAll() {
	        this.updateCheckedList(this.props.itemList);
	    },

	    recordCheckbox: function recordCheckbox(checkboxInst) {
	        this._checkbox.push(checkboxInst);
	    },

	    listHasChange: function listHasChange(cur, next) {
	        return cur.length !== next.length || cur.some(function (item) {
	            return next.indexOf(item) === -1;
	        });
	    },

	    componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
	        if (this.listHasChange(this.state.checkedList, nextState.checkedList)) {
	            this.props.onChange(this.state.checkedList, nextState.checkedList);
	        }
	    },

	    componentWillMount: function componentWillMount() {
	        this._checkbox = [];

	        var maxChecked = this.props.maxChecked;

	        if (maxChecked == null) {
	            maxChecked = this.props.checkedList.length;
	        }

	        if (typeof maxChecked !== 'number' && !this.props.maxChecked) {
	            maxChecked = 1;
	        }

	        this.setState({
	            maxChecked: maxChecked,
	            checkedList: this.props.checkedList.slice(0, maxChecked)
	        });
	    },

	    componentDidMount: function componentDidMount() {
	        this.props.onComponentMount(this);
	    },

	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        // 如果下一次要更新checkbox与上一次一样，则不用更新
	        return this.listHasChange(this.state.checkedList, nextState.checkedList);
	    },

	    render: function render() {
	        var items = this.props.itemList.map(function (item, index) {
	            return this.props.getContent(item, index, this);
	        }, this);

	        return React.createElement('div', { className: this.props.wrapClassName }, items);
	    }
	});

	Checkbox.Label = React.createClass({
	    displayName: 'Label',

	    getDefaultProps: function getDefaultProps() {
	        return {
	            content: null,
	            getContent: function getContent(content) {
	                content = content || {};
	                content = (typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object' ? content : {};
	                return React.createElement('span', null, content.name, React.createElement('em', null, content.widget));
	            }
	        };
	    },

	    render: function render() {
	        return this.props.getContent(this.props.content);
	    }
	});

	Checkbox.Checkbox = React.createClass({
	    displayName: 'Checkbox',

	    getInitialState: function getInitialState() {
	        return { checked: false };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            checked: false,
	            checkedClassName: 'icon-img icon-checkbox-b',
	            uncheckedClassName: 'icon-img icon-checkbox-a',
	            value: null,
	            onComponentMount: noop,
	            onChange: noop,
	            getContent: function getContent(inst) {
	                var className = inst.state.checked ? inst.props.checkedClassName : inst.props.uncheckedClassName;
	                return React.createElement('i', { className: className, onClick: inst.toggleChecked });
	            }
	        };
	    },

	    isChecked: function isChecked() {
	        return this.state.checked;
	    },

	    getValue: function getValue() {
	        return this.props.value;
	    },

	    toggleChecked: function toggleChecked() {
	        this.props.onChange(!this.state.checked, this.props.value);
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({ checked: this.props.checked });
	    },

	    componentDidMount: function componentDidMount() {
	        this.props.onComponentMount(this);
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({ checked: nextProps.checked });
	    },

	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        return nextState.checked !== this.state.checked;
	    },

	    render: function render() {
	        return this.props.getContent(this);
	    }
	});

	module.exports = Checkbox;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/5/5.
	 * 折叠面板，提供展开和折叠功能
	 * <Collapse>
	 *   <Panel title={content} key="1">
	 *     <h2>1</h2>
	 *   </Panel>
	 *   <Panel title={content} key="2">
	 *     <h2>1</h2>
	 *   </Panel>
	 * </Collapse>
	 *
	 * var right = <span class="icon-img icon-tran-black-t"/>;
	 * var left = <span class="icon-img icon-tran-black-d"/>;
	 */

	var React = __webpack_require__(2);
	var Animate = __webpack_require__(1);
	var Panel = __webpack_require__(34);
	var noop = __webpack_require__(4);
	var util = __webpack_require__(35);

	var Collapse = React.createClass({
	    displayName: 'Collapse',

	    getInitialState: function getInitialState() {
	        return {
	            expandKeys: []
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            expandKeys: [],
	            className: '',
	            accordion: false
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        this.setExpandKeys(this.props.expandKeys);
	        this._allKeys = React.Children.map(this.props.children, function (child) {
	            return child.key;
	        });
	    },

	    setExpandKeys: function setExpandKeys(keys) {
	        this.setState({ expandKeys: this.props.accordion ? keys.slice(0, 1) : keys });
	    },

	    addOne: function addOne(key) {
	        this.setExpandKeys(util.add(this.state.expandKeys, key));
	    },

	    removeOne: function removeOne(key) {
	        this.setExpandKeys(util.remove(this.state.expandKeys, key));
	    },

	    expand: function expand() {
	        this.setState({ expandKeys: this._allKeys });
	    },

	    collapse: function collapse() {
	        this.setState({ expandKeys: [] });
	    },

	    onChange: function onChange(key, collapse) {
	        if (this.props.accordion) {
	            this.setState({ expandKeys: collapse ? [] : [key] });
	        } else {
	            this[(collapse ? 'remove' : 'add') + 'One'](key);
	        }
	    },

	    render: function render() {
	        var self = this;
	        var expandKeys = self.state.expandKeys;
	        var props = self.props;

	        return React.createElement('div', { className: props.className }, React.Children.map(props.children, function (child) {
	            return React.cloneElement(child, {
	                mark: child.key,
	                onChange: self.onChange,
	                collapse: expandKeys.indexOf(child.key) === -1
	            });
	        }));
	    }
	});

	var getTitle = function getTitle(props, state, inst) {
	    var dir = state.collapse ? 't' : 'd';
	    return React.createElement('span', null, props.title, React.createElement('span', {
	        style: { marginLeft: 10, cursor: 'pointer' },
	        onClick: inst.toggle,
	        className: "inline-block icon-img icon-tran-black-" + dir }));
	};

	Collapse.Node = React.createClass({
	    displayName: 'Node',

	    getInitialState: function getInitialState() {
	        return { collapse: true };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            mark: null,
	            title: null,
	            collapse: true,
	            component: 'div',
	            onChange: noop,
	            getTitle: getTitle
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({ collapse: this.props.collapse });
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        if (nextProps.collapse !== this.state.collapse) {
	            this.setState({ collapse: nextProps.collapse });
	        }
	    },

	    toggle: function toggle() {
	        this.props.onChange(this.props.mark, !this.state.collapse);
	    },

	    onChange: function onChange() {},

	    render: function render() {
	        var Component = this.props.component;
	        return React.createElement(Component, null, React.createElement(Panel, {
	            collapse: this.state.collapse,
	            title: this.props.getTitle(this.props, this.state, this),
	            onChange: this.onChange }, this.props.children));
	    }
	});

	module.exports = Collapse;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/5/5.
	 */

	var React = __webpack_require__(2);
	var Animate = __webpack_require__(1);
	var noop = __webpack_require__(4);
	var assign = __webpack_require__(8);

	var Panel = React.createClass({
	    displayName: 'Panel',

	    getInitialState: function getInitialState() {
	        return {
	            collapse: true,
	            isInitial: true,
	            from: {},
	            to: {}
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            isPanel: true,
	            components: 'div',
	            className: 'module',
	            title: null,
	            collapse: true,
	            onMount: noop,
	            onChange: noop,
	            getContent: noop
	        };
	    },

	    _toggleUIState: function _toggleUIState(collapse) {
	        this.__animate[collapse ? 'backToTheStart' : 'startAnimate']();
	    },

	    onMount: function onMount(inst) {
	        this.__animate = inst;
	    },

	    expand: function expand() {
	        this.setState({ collapse: false });
	    },

	    collapse: function collapse() {
	        this.setState({ collapse: true });
	    },

	    toggle: function toggle() {
	        this.setState({ collapse: !this.state.collapse });
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({ collapse: this.props.collapse });
	    },

	    componentDidMount: function componentDidMount() {
	        var height = this.__animate.refs.wrap.offsetHeight;
	        this.setState({
	            from: { height: 0 },
	            to: { height: height },
	            isInitial: false
	        });
	        this.props.onMount(this);
	    },

	    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	        if (prevState.collapse !== this.state.collapse) {
	            this._toggleUIState(this.state.collapse);
	            this.props.onChange(this.state.collapse);
	        }
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        if (nextProps.collapse !== this.state.collapse) {
	            this.setState({ collapse: nextProps.collapse });
	        }
	    },

	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        return nextState.collapse !== this.state.collapse;
	    },

	    render: function render() {
	        var props = this.props;
	        var state = this.state;
	        var ret = props.getContent(props, this.state, this);
	        var Components = props.components;

	        var style = { overflow: 'hidden' };

	        // 如果初始状态为展开 -> collapse = false
	        // 那么容器高度就不用理会
	        // 如果是折叠状态 -> collapse = true
	        // 那么高度就需要设置为0
	        // 如果不是初始状态呢？
	        // 也就是说要加上一个初始状态判断？

	        if (state.collapse && state.isInitial) {
	            style.height = 0;
	        }

	        var getContent = function getContent(p, s, inst) {
	            return React.createElement('div', { style: inst.styleProps() }, React.cloneElement(ret || props.children, { ref: 'wrap' }));
	        };

	        return React.createElement(Components, { className: props.className }, React.cloneElement(props.title), React.createElement('div', { style: style }, React.createElement(Animate, {
	            onMount: this.onMount,
	            from: state.from,
	            to: state.to,
	            during: 200,
	            getContent: getContent })));
	    }
	});

	module.exports = Panel;

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * Created by xcp on 2016/5/7.
	 */

	var _isArray = Object.isArray || function (any) {
	    return any && (typeof any === 'undefined' ? 'undefined' : _typeof(any)) === 'object' && any.constructor === Array;
	};

	module.exports = {

	    isArray: function isArray(any) {
	        return _isArray(any);
	    },

	    index: function index(arr, item) {
	        return arr.indexOf(item);
	    },

	    contains: function contains(arr, item) {
	        return this.index(arr, item) !== -1;
	    },

	    add: function add(arr, item) {
	        if (!this.contains(arr, item)) {
	            arr.push(item);
	        }
	        return arr;
	    },

	    remove: function remove(arr, item) {
	        var index = this.index(arr, item);
	        if (index !== -1) {
	            arr.splice(index, 1);
	        }
	        return arr;
	    }
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/14.
	 */

	var React = __webpack_require__(2);
	var assert = __webpack_require__(9);
	var noop = __webpack_require__(4);
	var ConditionItem = __webpack_require__(37);
	var ConditionMixin = __webpack_require__(38);

	var Conditional = React.createClass({
	    displayName: 'Conditional',

	    mixins: [ConditionMixin],

	    getInitialState: function getInitialState() {
	        return {
	            checkedItemValue: null
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            itemList: [],
	            onChecked: noop,
	            onChange: noop,
	            className: 'conditional',
	            itemClassName: 'cond-item',
	            checkedClassName: 'checked',
	            defaultChecked: null
	        };
	    },

	    onChecked: function onChecked(isChecked, currentValue) {
	        var prev = this.state.checkedItemValue;

	        // 无论何时都有一个项被选中
	        //this.setState({checkedItemValue: isChecked ? currentValue : null});
	        this.setState({ checkedItemValue: currentValue });
	        this.props.onChecked(isChecked, currentValue);
	        if (isChecked && prev !== currentValue) {
	            this.props.onChange(prev, currentValue);
	        }
	    },

	    componentWillMount: function componentWillMount() {
	        var def = this.props.defaultChecked;
	        this.setState({ checkedItemValue: def !== null ? def : this.props.itemList[0].value });
	    },

	    render: function render() {
	        var props = this.props;

	        var items = props.itemList.map(function (item) {
	            return React.createElement(ConditionItem, {
	                key: item.value,
	                isChecked: this.state.checkedItemValue === item.value,
	                onChecked: this.onChecked,
	                value: item.value }, item.children);
	        }, this);

	        return React.createElement('div', { className: props.className }, items);
	    }
	});

	module.exports = Conditional;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/14.
	 */

	var React = __webpack_require__(2);
	var noop = __webpack_require__(4);
	var ConditionMixin = __webpack_require__(38);
	var classNames = __webpack_require__(14);

	var ConditionItem = React.createClass({
	    displayName: 'ConditionItem',

	    mixins: [ConditionMixin],

	    getInitialState: function getInitialState() {
	        return {
	            isChecked: false
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            className: 'cond-item',
	            checkedClassName: 'checked',
	            children: null,
	            value: null,
	            onChecked: noop,
	            onChange: noop,
	            isChecked: false
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({ isChecked: this.props.isChecked });
	    },

	    // TODO 该组件设计得有点绕，得改
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({ isChecked: nextProps.isChecked });
	    },

	    onChecked: function onChecked() {
	        this.setState({ isChecked: !this.state.isChecked }, function () {
	            this.props.onChecked(this.state.isChecked, this.props.value);
	        });
	    },

	    render: function render() {
	        var props = this.props;
	        var className = {};

	        className[props.className] = true;
	        className[props.checkedClassName] = props.isChecked;

	        return React.createElement('span', {
	            className: classNames(className),
	            onClick: this.onChecked }, props.children);
	    }

	});

	module.exports = ConditionItem;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/14.
	 */

	var React = __webpack_require__(2);

	module.exports = {
	    propTypes: {
	        itemList: React.PropTypes.array,
	        onChecked: React.PropTypes.func,
	        onChange: React.PropTypes.func,
	        className: React.PropTypes.string,
	        itemClassName: React.PropTypes.string,
	        checkedClassName: React.PropTypes.string,
	        defaultChecked: React.PropTypes.any
	    }
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by xcp on 2016/3/19.
	 */
	"use strict";

	var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	} : function (obj) {
	    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	};

	var runtimeIsNode = __webpack_require__(7)();
	var noop = __webpack_require__(4);
	var ReactDOM = __webpack_require__(16);
	var Message = __webpack_require__(40);
	var body = __webpack_require__(19);
	var List = __webpack_require__(42);

	var objectToString = function objectToString(obj, separator) {
	    obj = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj;
	    return Object.keys(obj).map(function (key) {
	        return key + ':' + obj[key];
	    }).join(separator || ';');
	};

	var getMax = function getMax(list) {
	    var max = Number.MIN_VALUE;
	    list.forEach(function (v) {
	        if (v > max) {
	            max = v;
	        }
	    });
	    return max;
	};

	var setStyle = function setStyle(node, style) {
	    if (node && (node.nodeType === 1 || node.nodeType === 9)) {
	        Object.keys(style).forEach(function (prop) {
	            node.style[prop] = style[prop];
	        });
	    }
	};

	if (!runtimeIsNode) {

	    var mountNodeWrap = document.createElement('div');
	    var baseStyle = {
	        position: 'fixed',
	        top: '20px',
	        left: '50%'
	    };

	    // 缓存所有的message
	    var list = new List();

	    var updateStyle = function updateStyle(style) {
	        setStyle(mountNodeWrap, style);
	    };

	    var getItem = function getItem() {
	        return { inst: null, width: 0 };
	    };

	    var getItemsWidth = function getItemsWidth() {
	        var collection = [];
	        list.each(function (item) {
	            collection.push(item.width);
	        });
	        return collection;
	    };

	    updateStyle(baseStyle);
	    body.appendChild(mountNodeWrap);

	    module.exports = function (message, callback) {
	        var mountNode = document.createElement('div');
	        var item = getItem();

	        // 加入队列
	        list.add(item);

	        setStyle(mountNode, { 'marginBottom': '10px' });
	        mountNodeWrap.appendChild(mountNode);

	        var updateWrapStyle = function updateWrapStyle() {
	            updateStyle(Object.assign(baseStyle, { marginLeft: -parseInt(getMax(getItemsWidth()) / 2) + 'px' }));
	        };

	        var onUnmout = function onUnmout() {
	            callback && callback();
	            // 移除队列
	            list.remove(item);
	            // 重新计算宽度
	            updateWrapStyle();
	            mountNodeWrap.removeChild(mountNode);
	        };

	        var onMount = function onMount() {
	            item.width = mountNode.offsetWidth;
	            // 重新计算宽度
	            updateWrapStyle();
	        };

	        item.inst = ReactDOM.render(React.createElement(Message, {
	            onMount: onMount,
	            message: message,
	            onUnmout: onUnmout }), mountNode);
	    };
	} else {
	    module.exports = Message;
	}

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/18.
	 * 全局提示信息，会自动隐藏掉
	 * 如果有多个信息同时出现，则依次排成一列
	 */

	var React = __webpack_require__(2);
	var Animate = __webpack_require__(1);
	var AutoUnmountMixin = __webpack_require__(41);
	var noop = __webpack_require__(4);

	var Message = React.createClass({
	    displayName: 'Message',

	    mixins: [AutoUnmountMixin],

	    onMount: function onMount(animation) {
	        this.animateDidMount(animation);
	        animation.startAnimate(this.props.closeable ? noop : this.autoUnmount);
	    },

	    render: function render() {
	        var props = this.props;

	        return React.createElement(Animate, {
	            component: props.animate.component,
	            from: props.animate.from,
	            to: props.animate.to,
	            during: props.animate.during,
	            onMount: this.onMount }, React.createElement('div', { className: 'inline-block' }, React.createElement('div', { className: 'bub-bill' }, React.createElement('div', { className: 'util-bill-pd' }, props.message))));
	    }
	});

	module.exports = Message;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/18.
	 */

	var ReactDOM = __webpack_require__(16);
	var noop = __webpack_require__(4);

	module.exports = {

	    getInitialState: function getInitialState() {
	        return { visible: true };
	    },

	    getDefaultProps: function getDefaultProps() {
	        this.__backToTheStart = noop;
	        return {
	            message: '',
	            during: 3000,
	            closeable: false,
	            onMount: noop,
	            onUnmout: noop,
	            animate: {
	                component: 'span',
	                from: { opacity: 0 },
	                to: { opacity: 1 },
	                during: 500
	            }
	        };
	    },

	    // export animate
	    animateDidMount: function animateDidMount(animate) {
	        this.__backToTheStart = animate.backToTheStart;
	    },

	    componentDidMount: function componentDidMount() {
	        this.props.onMount(this);
	    },

	    unmount: function unmount() {
	        if (typeof this.__backToTheStart === 'function') {
	            this.__backToTheStart(this.props.onUnmout);
	        } else {
	            this.props.onUnmout();
	        }
	    },

	    autoUnmount: function autoUnmount() {
	        setTimeout(this.unmount, this.props.during);
	    }
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 5/23/16.
	 */

	var array = __webpack_require__(35);

	function List(initialize) {
	    this._list = array.isArray(initialize) ? initialize.slice() : [];
	}

	List.prototype.add = function (item) {
	    array.add(this._list, item);
	};

	List.prototype.addAll = function (list) {
	    list = array.isArray(list) ? list : [];
	    list.forEach(function (v) {
	        this.add(v);
	    }, this);
	};

	List.prototype.remove = function (item) {
	    array.remove(this._list, item);
	};

	List.prototype.removeAll = function () {
	    this._list = [];
	};

	List.prototype.contains = function (item) {
	    array.contains(this._list, item);
	};

	List.prototype.get = function (index) {
	    return this._list[index] || null;
	};

	List.prototype.each = function (fn, scope) {
	    if (typeof fn === 'function') {
	        this._list.forEach(function () {
	            fn.apply(scope, arguments);
	        });
	    }
	};

	List.prototype.size = function () {
	    return this._list.length;
	};

	List.prototype.toString = function () {
	    return '[object List]';
	};

	module.exports = List;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/23.
	 */

	var React = __webpack_require__(2);
	var noop = __webpack_require__(4);
	var NotAllowSelect = __webpack_require__(20);
	var PageInput = __webpack_require__(44);
	var Selectable = __webpack_require__(23);

	var getContent = function getContent(current) {
	    return React.createElement('div', {
	        className: 'comp-area-item util-font-12 color-white-bg util-line-14' }, current, React.createElement('span', { className: 'icon-img icon-tran-black-d' }));
	};

	var getItemContent = function getItemContent(val, props) {
	    var item = React.createElement('li', { className: 'comp-panel-item util-font-12' }, React.createElement('strong', null, val));
	    return React.cloneElement(item, props);
	};

	var Pagination = React.createClass({
	    displayName: 'Pagination',

	    propTypes: {
	        defaultCurrent: React.PropTypes.number,
	        total: React.PropTypes.number,
	        pageSize: React.PropTypes.number,
	        itemsInOnePage: React.PropTypes.number,
	        keepPages: React.PropTypes.number,
	        onChange: React.PropTypes.func,
	        onSelect: React.PropTypes.func,
	        getPage: React.PropTypes.func
	    },

	    getInitialState: function getInitialState() {
	        return {
	            // current page
	            current: 1,
	            itemsInOnePage: 60
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            // default page
	            defaultCurrent: 1,
	            // item total
	            total: 0,
	            itemsInOnePage: 60,
	            // pages in one item
	            pageSize: 5,
	            keepPages: 2,
	            // 可输入页码
	            importable: true,
	            // 可配置 itemsInOnePage
	            itemsConfigurable: true,
	            configurableList: [200, 100, 60],
	            // invoke when page number changed
	            onChange: noop,
	            onSelect: noop,
	            getPage: function getPage(num, isCurrent) {
	                return React.createElement('span', {
	                    className: 'page-item' + (isCurrent ? ' focus' : '') }, num);
	            }
	        };
	    },

	    _computed: function _computed(itemsInOnePage) {
	        var props = this.props;
	        var pages = Math.ceil(props.total / itemsInOnePage);
	        var showPages = pages > props.pageSize ? props.pageSize : pages;

	        this.__computed = {
	            pages: pages,
	            showPages: showPages,
	            currentPageOffset: Math.ceil(showPages / 2) - 1
	        };
	    },

	    onSelect: function onSelect(num) {
	        this.skip(num);
	    },

	    prev: function prev() {
	        this.skip(this.state.current - 1);
	    },

	    next: function next() {
	        this.skip(this.state.current + 1);
	    },

	    skip: function skip(num) {
	        this.props.onSelect(num, this.state.itemsInOnePage);

	        if (num < 1 || num > this.__computed.pages || num === this.state.current) return;

	        this.setState({ current: num });
	    },

	    _getCurrentStart: function _getCurrentStart(page) {
	        // 只需要保持 current 在一个固定位置
	        // 即可保证鼠标下一次点击的时候不会点击在同一个 number 上
	        // 点击固定位置的右边 -> next
	        // 点击因定位置的右边 -> prev
	        // 该函数需要根据 page 确认当前页码的开始位置
	        var computed = this.__computed;
	        var start = page - computed.currentPageOffset;

	        // 衡量边界
	        return start + computed.showPages >= computed.pages ? computed.pages - computed.showPages + 1 : start > this.props.keepPages ? start : 1;
	    },

	    _getPage: function _getPage(num, isCurrent) {
	        return React.cloneElement(this.props.getPage(num, isCurrent), {
	            onClick: this.onSelect.bind(this, num),
	            key: num
	        });
	    },

	    onItemsInOnePageChange: function onItemsInOnePageChange(num) {
	        // 每页显示条数改变后，直接跳转到第1页
	        this.setState({ itemsInOnePage: num, current: 1 });
	    },

	    componentWillMount: function componentWillMount() {
	        this._computed(this.props.itemsInOnePage);
	        this.setState({
	            current: this.props.defaultCurrent,
	            itemsInOnePage: this.props.itemsInOnePage
	        });
	    },

	    componentDidMount: function componentDidMount() {
	        // 经讨论,初始化时不执行onSelect
	        // this.props.onSelect(this.state.current, this.state.itemsInOnePage)
	    },

	    componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
	        if (nextState.itemsInOnePage !== this.state.itemsInOnePage) {
	            this._computed(nextState.itemsInOnePage);
	        }
	    },

	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        var cur = this.state;
	        return cur.current !== nextState.current || cur.itemsInOnePage !== nextState.itemsInOnePage;
	    },

	    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	        if (prevState.current !== this.state.current || prevState.itemsInOnePage !== this.state.itemsInOnePage) {
	            this.props.onChange(this.state.current, this.state.itemsInOnePage);
	        }
	    },

	    render: function render() {
	        var props = this.props;
	        var computed = this.__computed;
	        var current = this.state.current;
	        var start = this._getCurrentStart(current);
	        var prev, next;

	        if (start > props.keepPages) {
	            prev = new Array(props.keepPages).fill(1).map(function (v, i) {
	                return this._getPage(i + 1, i + 1 === current);
	            }, this);
	        }

	        var pageItems = new Array(computed.showPages).fill(1).map(function () {
	            var num = start++;
	            return this._getPage(num, current === num);
	        }, this);

	        if (start < computed.pages) {
	            next = new Array(props.keepPages).fill(1).map(function (v, i) {
	                var num = computed.pages - props.keepPages + i + 1;
	                return this._getPage(num, current === num);
	            }, this);
	        }

	        var configurable = null;
	        if (props.itemsConfigurable) configurable = React.createElement(Selectable.Custom, {
	            getSelectorContent: getContent,
	            getItemContent: getItemContent,
	            onSelect: this.onItemsInOnePageChange,
	            itemList: props.configurableList,
	            defaultSelectedValue: this.state.itemsInOnePage });

	        var importable = null;
	        var nextPage = null;
	        if (props.importable) {
	            nextPage = current + 1;
	            nextPage = nextPage > computed.pages ? computed.pages : nextPage;
	            importable = React.createElement(PageInput, {
	                current: nextPage,
	                max: computed.pages,
	                onSearch: this.skip });
	        }
	        return React.createElement(NotAllowSelect, null, React.createElement('div', { className: 'pagination' }, configurable, prev, prev ? React.createElement('span', { className: 'page-item default' }) : null, pageItems, next ? React.createElement('span', { className: 'page-item default' }) : null, next, importable));
	    }
	});

	module.exports = Pagination;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/4/29.
	 */

	var React = __webpack_require__(2);
	var noop = __webpack_require__(4);
	var intReg = /^\d+$/;
	var getTruth = function getTruth() {
	    return true;
	};

	var PageInput = React.createClass({
	    displayName: 'PageInput',

	    getInitialState: function getInitialState() {
	        return { current: 1 };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            onSearch: noop,
	            validate: getTruth,
	            current: 1,
	            max: Math.MAX_VALUE,
	            min: 0,
	            validateFailedMark: -1
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({ current: this.props.current });
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextState) {
	        this.setState({ current: nextProps.current });
	    },

	    _validate: function _validate(str) {
	        var mark = this.props.validateFailedMark;
	        if (str.length === 0 || !intReg.test(str) || !this.props.validate(str)) {
	            return mark;
	        }

	        var num = parseInt(str);
	        return num >= this.props.min && num <= this.props.max ? num : mark;
	    },

	    onChange: function onChange() {
	        var val = this.refs.page.value;

	        if (val) {
	            var result = this._validate(val);

	            if (result === this.props.validateFailedMark) {
	                return this.refs.page.value = this.state.current;
	            }

	            if (result !== this.state.current) {
	                this.setState({ current: result });
	            }
	        }
	    },

	    onSearch: function onSearch() {
	        this.props.onSearch(this.state.current);
	    },

	    render: function render() {
	        return React.createElement('span', null, React.createElement('input', {
	            onChange: this.onChange,
	            ref: 'page',
	            type: 'number',
	            style: { padding: 0 },
	            className: 'input-default page-item',
	            placeholder: this.state.current }), React.createElement('div', { className: 'page-item comp-search', onClick: this.onSearch }, React.createElement('div', { className: 'icon-img icon-search util-v-m' })));
	    }
	});

	module.exports = PageInput;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/25.
	 */

	module.exports = {
	    Popup: __webpack_require__(46),
	    Bubble: __webpack_require__(49),
	    Bias: __webpack_require__(50),
	    Dialog: __webpack_require__(51),
	    PositionBubble: __webpack_require__(52),
	    PopupWrap: __webpack_require__(47)
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/15.
	 */

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(16);
	var PopupWrap = __webpack_require__(47);
	var absolutePosition = __webpack_require__(48);
	var body = __webpack_require__(19);
	var noop = __webpack_require__(4);
	var POPUP_GAP = 5;
	var truth = function truth() {
	    return true;
	};

	var Popup = React.createClass({
	    displayName: 'Popup',

	    getInitialState: function getInitialState() {
	        return {
	            visible: false
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            animate: {
	                from: { opacity: 0 },
	                to: { opacity: 1 },
	                during: 500
	            },
	            trigger: 'click',
	            content: null,
	            placement: null,
	            baseElement: null,
	            unMountOnHide: true,
	            onHide: noop,
	            onChange: noop,
	            shouldUpdate: truth,
	            shouldHide: truth,
	            onComponentMount: noop,
	            onMount: noop
	        };
	    },

	    getTrigger: function getTrigger() {
	        return {
	            click: 'onClick',
	            hover: 'onMouseEnter'
	        }[this.props.trigger] || 'onClick';
	    },

	    componentWillMount: function componentWillMount() {
	        this.__popupMountNode = null;
	        this.__position = null;
	        this.__content = null;
	        this.__isUnmount = false;
	    },

	    // Invoked once, only on the client
	    componentDidMount: function componentDidMount() {
	        this.__popupMountNode = document.createElement('div');
	        body.appendChild(this.__popupMountNode);
	        // TODO 将要废弃 onComponentMount 属性
	        this.props.onComponentMount(this);
	        this.props.onMount(this);
	    },

	    update: function update(props) {
	        this.setState(props);
	    },

	    _createContent: function _createContent() {
	        var props = this.props;

	        if (typeof props.content === 'string') props.content = React.createElement('span', null, props.content);

	        this.__content = React.cloneElement(props.content, {
	            placement: props.placement
	        });
	    },

	    onHide: function onHide() {
	        if (this.__isUnmount) return;
	        this.setState({ visible: false }, function () {
	            if (this.props.unMountOnHide) this.unMount();
	            this.props.onHide();
	        });
	    },

	    unMount: function unMount() {
	        try {
	            ReactDOM.unmountComponentAtNode(this.__popupMountNode);
	        } catch (e) {}
	    },

	    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	        if (this.state.visible !== prevState.visible || !!this.props.shouldUpdate()) {
	            this.renderPopup();
	            this.props.onChange();
	        }
	    },

	    hide: function hide(callback) {
	        if (this.__isUnmount || !this.state.visible) return;

	        this.__animate.backToTheStart(function () {
	            this.setState({ visible: false }, callback);
	        }.bind(this));
	    },

	    autoVisible: function autoVisible() {
	        this.hide(this.onHide);
	    },

	    computedPosition: function computedPosition() {
	        var props = this.props;
	        var targetNode = props.baseElement || this.refs.targetNode;
	        // 左上角的位置
	        var pos = absolutePosition(targetNode);
	        var placement = props.placement;
	        var w = targetNode.offsetWidth;
	        var h = targetNode.offsetHeight;

	        // 在该组件内，只需将最外层定位到对应位置
	        // 不用理会内容的size
	        switch (placement) {
	            case "top":
	                pos.y = pos.y - POPUP_GAP;
	                break;
	            case "right":
	                pos.x = pos.x + w + POPUP_GAP;
	                break;
	            case "bottom":
	                pos.y = pos.y + h + POPUP_GAP;
	                break;
	            case "left":
	                pos.x = pos.x - POPUP_GAP;
	                break;
	        }

	        return this.__position = pos;
	    },

	    renderPopup: function renderPopup() {
	        if (!this.isMounted()) return;

	        this._createContent();
	        // 渲染的时候才计算位置
	        // 如果提前计算，在页面布局发生变化的情况下
	        // 计算的位置是错误的
	        this.computedPosition();

	        var props = this.props;
	        var style = {
	            position: 'absolute',
	            left: this.__position.x,
	            top: this.__position.y
	        };
	        // 生成后总是隐藏的
	        // 根据state来自行调用显示隐藏
	        ReactDOM.render(React.createElement(PopupWrap, {
	            baseElement: props.baseElement,
	            onMount: this.onAnimateMount,
	            style: style,
	            placement: props.placement,
	            visible: this.state.visible,
	            onHide: this.onHide,
	            shouldHide: props.shouldHide,
	            refTarget: this.refs.targetNode }, this.__content), this.__popupMountNode);
	    },

	    showPopup: function showPopup() {
	        this.setState({ visible: true }, function () {
	            this.__animate.startAnimate();
	        });
	    },

	    onAnimateMount: function onAnimateMount(inst) {
	        this._popupWrap = inst;
	        // TODO 兼容代码,下个大版本删除
	        this.__animate = inst.__animate;
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        this.__isUnmount = true;
	        try {
	            body.removeChild(this.__popupMountNode);
	        } catch (e) {}
	    },

	    render: function render() {
	        var props = { ref: 'targetNode' };
	        props[this.getTrigger()] = this.showPopup;
	        if (props.onMouseEnter) {
	            props.onMouseLeave = this.hide;
	        }

	        return React.cloneElement(this.props.children || React.createElement('span', { style: { display: 'none' } }), props);
	    }
	});

	module.exports = Popup;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/15.
	 * PopupWrap 的作用：
	 * 1. 确定 popup 的位置
	 * 2. 监听 body click 事件，卸载元素
	 */

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(16);
	var assign = __webpack_require__(8);
	var noop = __webpack_require__(4);
	var DOMEvent = __webpack_require__(18);
	var HideOnBodyClick = __webpack_require__(15);
	var shouldHide = function shouldHide() {
	    return true;
	};

	var PopupWrap = React.createClass({
	    displayName: 'PopupWrap',

	    getInitialState: function getInitialState() {
	        return {
	            left: 0,
	            top: 0
	        };
	    },

	    getDefaultProps: function getDefaultProps() {

	        return {
	            style: { backgroundColor: '#fff' },
	            placement: 'top',
	            refTarget: null,
	            baseElement: null,
	            visible: false,
	            onHide: noop,
	            shouldHide: shouldHide,
	            onMount: noop
	        };
	    },

	    recompute: function recompute(callback) {
	        var node = ReactDOM.findDOMNode(this.refs.popup);
	        var position = { x: node.offsetWidth, y: node.offsetHeight };
	        var baseElement = this.props.baseElement || this.props.refTarget;

	        switch (this.props.placement) {
	            case "top":
	                position.x = -(position.x - baseElement.offsetWidth) / 2;
	                position.y = -position.y;
	                break;
	            case "bottom":
	                position.x = -(position.x - baseElement.offsetWidth) / 2;
	                position.y = 0;
	                break;
	            case "left":
	                position.x = -position.x;
	                position.y = 0;
	                break;
	            default:
	                position.x = 0;
	                position.y = 0;
	        }
	        this.setState({ left: position.x, top: position.y }, callback || noop);
	    },

	    componentDidMount: function componentDidMount() {
	        this.recompute();
	    },

	    render: function render() {
	        var props = this.props;
	        var style = {
	            top: this.state.top,
	            left: this.state.left,
	            position: 'absolute'
	        };

	        if (!props.visible) {
	            style = assign(style, { display: 'none' });
	        }

	        var children = React.cloneElement(props.children, {
	            style: assign(style, props.children.props.style),
	            placement: props.placement,
	            ref: 'popup'
	        });

	        return React.createElement(HideOnBodyClick, {
	            refTarget: props.refTarget,
	            style: props.style,
	            shouldHide: props.shouldHide,
	            onMount: props.onMount,
	            onHide: props.onHide }, children);
	    }
	});

	module.exports = PopupWrap;

/***/ },
/* 48 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Created by xcp on 2016/3/15.
	 */

	module.exports = function (node) {
	    var result = { x: 0, y: 0 };
	    var body = document.body || document.documentElement;

	    if (!(node && node.nodeType === 1)) return result;

	    var offsetLeft = node.offsetLeft;
	    var offsetTop = node.offsetTop;

	    var parent = node.offsetParent;
	    if (!parent) return result;

	    while (parent !== body) {
	        offsetLeft += parent.offsetLeft;
	        offsetTop += parent.offsetTop;
	        parent = parent.offsetParent;
	    }
	    return {
	        x: offsetLeft,
	        y: offsetTop
	    };
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/15.
	 */

	var React = __webpack_require__(2);
	var noop = __webpack_require__(4);
	var Bubble = React.createClass({
	    displayName: 'Bubble',

	    propTypes: {
	        symBolClass: React.PropTypes.array
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            placement: 'top',
	            symbolStyle: {},
	            symbolClass: [],
	            onComponentMount: noop,
	            onMount: noop,
	            style: {}
	        };
	    },

	    getClassName: function getClassName() {
	        var dir = {
	            top: 'd',
	            right: 'l',
	            bottom: 't',
	            left: 'r'
	        }[this.props.placement] || 'd';

	        return {
	            wrapperClass: 'bub bub-dir-' + dir,
	            symbolClass: 'bub-symbol icon-img icon-arrow-blue-' + dir
	        };
	    },

	    componentDidMount: function componentDidMount() {
	        // TODO 将要废弃 onComponentMount 属性
	        this.props.onComponentMount(this.refs.wrap, this);
	        this.props.onMount(this.refs.wrap, this);
	    },

	    render: function render() {

	        var classNames = this.getClassName();
	        var symbolClassName = this.props.symbolClass.length > 0 ? ' ' + this.props.symbolClass.join(' ') : '';

	        return React.createElement('div', { className: classNames.wrapperClass, style: this.props.style }, React.createElement('span', { className: classNames.symbolClass + symbolClassName,
	            style: this.props.symbolStyle }), React.createElement('div', { className: 'bub-con', ref: 'wrap' }, this.props.children));
	    }
	});

	module.exports = Bubble;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/3/15.
	 */

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(16);
	var noop = __webpack_require__(4);

	var Bias = React.createClass({
	    displayName: 'Bias',

	    propTypes: {
	        symBolClass: React.PropTypes.array
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            placement: 'topLeft',
	            closeable: false,
	            symbolStyle: {},
	            symbolClass: [],
	            onComponentMount: noop,
	            onMount: noop,
	            style: {}
	        };
	    },

	    getClassName: function getClassName() {
	        var symbolDir = {
	            topLeft: 'd-l',
	            right: 'r',
	            topRight: 'd-r',
	            left: 'l'
	        }[this.props.placement] || 'd-l';

	        var dir = {
	            topLeft: 'd',
	            topRight: 'd',
	            right: 'r',
	            left: 'l'
	        }[this.props.placement] || 'd';

	        return {
	            wrapperClass: 'bub bub-bias-dir-' + dir,
	            symbolClass: 'bub-symbol icon-img icon-bias-' + symbolDir
	        };
	    },

	    unmount: function unmount() {
	        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
	    },

	    componentDidMount: function componentDidMount() {
	        // TODO 将要废弃 onComponentMount 属性
	        this.props.onComponentMount(this.refs.wrap, this);
	        this.props.onMount(this.refs.wrap, this);
	    },

	    render: function render() {

	        var classNames = this.getClassName();
	        var symbolClassName = this.props.symbolClass.length > 0 ? ' ' + this.props.symbolClass.join(' ') : '';
	        var closeElement = null;
	        if (this.props.closeable) {
	            closeElement = React.createElement('span', {
	                className: 'icon-img icon-close-yellow bub-bias-last',
	                onClick: this.unmount });
	        }

	        return React.createElement('div', { className: classNames.wrapperClass, style: this.props.style }, React.createElement('span', { className: classNames.symbolClass + symbolClassName,
	            style: this.props.symbolStyle }), React.createElement('div', { className: 'bub-bias-con', ref: 'wrap' }, React.createElement('div', {
	            className: 'bub-bias-con-text inline-block' }, this.props.children), closeElement));
	    }
	});

	module.exports = Bias;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/4/14.
	 */

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(16);
	var assign = __webpack_require__(8);
	var noop = __webpack_require__(4);
	var HideOnBodyClick = __webpack_require__(15);

	var Dialog = React.createClass({
	    displayName: 'Dialog',

	    getInitialState: function getInitialState() {
	        return {
	            visible: true,
	            baseStyle: {
	                position: 'fixed',
	                left: '50%',
	                top: '50%',
	                zIndex: 999
	            },
	            posStyle: {}
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            style: { backgroundColor: '#fff' },
	            className: 'bub-dialog bubble-company-staff',
	            refTarget: null,
	            visible: true,
	            onHide: noop,
	            onMount: noop,
	            onComponentMount: noop
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({ visible: this.props.visible });
	    },

	    componentDidMount: function componentDidMount() {
	        var wrap = this.refs.wrap;
	        this._mountNode = ReactDOM.findDOMNode(this).parentNode;

	        // TODO 将要废弃 onComponentMount 属性
	        this.props.onComponentMount(this, wrap);
	        this.props.onMount(this, wrap);

	        this.setState({
	            posStyle: {
	                marginLeft: '-' + wrap.offsetWidth / 2 + 'px',
	                marginTop: '-' + wrap.offsetHeight / 2 + 'px'
	            }
	        });
	    },

	    onAnimateMount: function onAnimateMount(inst) {
	        this.__animate = inst.__animate;
	    },

	    onHidden: function onHidden() {
	        this.setState({ visible: false }, function () {
	            ReactDOM.unmountComponentAtNode(this._mountNode);
	            this.props.onHide();
	        });
	    },

	    hide: function hide() {
	        if (!this.isMounted()) return false;
	        if (this.__animate) {
	            this.__animate.backToTheStart(this.onHidden);
	        } else {
	            this.onHidden();
	        }
	        return true;
	    },

	    render: function render() {
	        var props = this.props;
	        var style = assign({}, props.style, this.state.baseStyle, this.state.posStyle);
	        if (!this.state.visible) {
	            style = assign(style, { display: 'none' });
	        }

	        return React.createElement(HideOnBodyClick, {
	            refTarget: props.refTarget,
	            style: style,
	            onMount: this.onAnimateMount,
	            onHide: this.onHidden }, React.createElement('div', { className: props.className, ref: 'wrap' }));
	    }

	});

	module.exports = Dialog;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	} : function (obj) {
	    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	};

	/**
	 * Created by xcp on 2016/4/30.
	 */

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(16);
	var Bubble = __webpack_require__(49);
	var PopupWrap = __webpack_require__(47);

	var noop = __webpack_require__(4);
	var body = __webpack_require__(19);
	var absolutePosition = __webpack_require__(48);
	var POPUP_GAP = 5;

	var PositionBubble = React.createClass({
	    displayName: 'PositionBubble',

	    getInitialState: function getInitialState() {
	        return {
	            visible: false,
	            baseElement: body
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            visible: false,
	            baseElement: body,
	            onUnMount: noop,
	            onMount: noop,
	            getContent: function getContent(props, state, inst) {
	                var style = { left: '50%', marginLeft: -10 };
	                return React.createElement(Bubble, {
	                    placement: 'top',
	                    symbolStyle: style,
	                    onMount: inst.onMount });
	            }
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState({
	            visible: this.props.visible,
	            baseElement: this.props.baseElement
	        });
	    },

	    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	        var fn = noop;
	        if (prevState.visible !== this.state.visible) {
	            fn = function () {
	                var fn = this.state.visible ? 'startAnimate' : 'backToTheStart';
	                this._animation[fn]();
	            }.bind(this);
	        }
	        this.refs.popupWrap.recompute(fn);
	    },

	    computePosition: function computePosition() {
	        var props = this.props;
	        var target = this.state.baseElement;
	        var pos = absolutePosition(target);
	        var placement = props.placement;
	        var w = target.offsetWidth;
	        var h = target.offsetHeight;

	        switch (placement) {
	            case "top":
	                pos.y = pos.y - POPUP_GAP;
	                break;
	            case "right":
	                pos.x = pos.x + w + POPUP_GAP;
	                break;
	            case "bottom":
	                pos.y = pos.y + h + POPUP_GAP;
	                break;
	            case "left":
	                pos.x = pos.x - POPUP_GAP;
	                break;
	        }
	        return pos;
	    },

	    shouldHide: function shouldHide() {
	        return false;
	    },

	    update: function update(props) {
	        this.setState(props);
	    },

	    updateBaseElement: function updateBaseElement(elem) {
	        if (elem === this.state.baseElement && this.state.visible) return;

	        this._animation.backToTheStart(function () {
	            this.setState({ visible: false }, function () {
	                this.setState({
	                    visible: true,
	                    baseElement: elem
	                });
	            });
	        }.bind(this));
	    },

	    onMount: function onMount(wrap, inst) {
	        this.props.onMount(wrap, inst);
	    },

	    onWrapMount: function onWrapMount(inst) {
	        this._animation = inst.__animate;
	    },

	    show: function show() {
	        this.setState({ visible: true });
	    },

	    hide: function hide() {
	        this.setState({ visible: false });
	    },

	    unMount: function unMount() {
	        if (this.__isUnmount) return;

	        var fn = function () {
	            this.__isUnmount = true;
	            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
	        }.bind(this);

	        if (this.state.visible) {
	            this._animation.backToTheStart(fn);
	        } else {
	            fn();
	        }
	    },

	    render: function render() {
	        var props = this.props;
	        var pos = this.computePosition();
	        var content = props.getContent(props, this.state, this);

	        var style = {
	            top: pos.y,
	            left: pos.x,
	            position: 'absolute'
	        };
	        return React.createElement(PopupWrap, {
	            ref: 'popupWrap',
	            placement: content.props.placement,
	            shouldHide: this.shouldHide,
	            style: style,
	            baseElement: this.state.baseElement,
	            visible: this.state.visible,
	            onMount: this.onWrapMount }, content);
	    }

	});

	module.exports = function (target, props) {
	    if (!body) return {};

	    props = (typeof props === 'undefined' ? 'undefined' : _typeof(props)) === 'object' && props ? props : {};

	    var _props = {};

	    Object.keys(PositionBubble.defaultProps).forEach(function (name) {
	        if (props.hasOwnProperty(name)) _props[name] = props[name];
	    });

	    var mountNode = document.createElement('div');

	    body.appendChild(mountNode);
	    var _onUnMount = _props.onUnMount;

	    _props.onUnMount = function () {
	        _onUnMount && _onUnMount();
	        body.removeChild(mountNode);
	    };

	    _props.baseElement = target;

	    return ReactDOM.render(React.createElement(PositionBubble, _props), mountNode);
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/5/14.
	 */

	module.exports = {
	  Slider: __webpack_require__(54),
	  Slipper: __webpack_require__(55)
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/5/10.
	 */

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(16);
	var noop = __webpack_require__(4);
	var Slipper = __webpack_require__(55);
	var elementAbsPosition = __webpack_require__(48);

	var Slider = React.createClass({
	    displayName: 'Slider',

	    getInitialState: function getInitialState() {
	        return {
	            disabled: false,
	            step: 1,

	            leftPos: 0, // left position
	            rightPos: 100, // right position

	            leftStart: 0, // left range
	            leftEnd: 50,
	            rightStart: 0, // right range
	            rightEnd: 100,

	            base: { x: 0, y: 0, w: 0 },
	            rightStyle: {}
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            min: 0,
	            max: 100,
	            step: 1,

	            disabled: false,

	            leftValue: 0, // left value
	            rightValue: 100, // right value

	            leftStart: 0, // left range
	            leftEnd: 50,
	            rightStart: 50, // right range
	            rightEnd: 100,

	            precision: 2, // float number precision
	            onChange: noop
	        };
	    },

	    copyProps: function copyProps(props) {
	        var nextState = {};
	        var hasOwn = nextState.hasOwnProperty;
	        var s = this.state;

	        Object.keys(props).forEach(function (name) {
	            if (hasOwn.call(s, name)) nextState[name] = props[name];
	        });
	        return nextState;
	    },

	    transPropsToState: function transPropsToState(props) {
	        var p = this.parseFloat;
	        var r = function r(s) {
	            return s - props.min;
	        };
	        var state = this.copyProps(props);
	        // 将最大值和最小值的区间数均分为100份
	        var step = this._step = p(r(props.max) / 100);
	        // 计算props.step约为多少份
	        // 将真实step转为滑动器step
	        // 滑动器一直取两位有效小数
	        state.step = p(props.step / step, 2) || 1;
	        // 将初始数据转换为滑块的位置
	        state.leftPos = p(r(props.leftValue) / step);
	        state.rightPos = p(r(props.rightValue) / step);

	        // 将左右滑块的取值范围转为位置
	        state.leftStart = p(r(props.leftStart) / step);
	        state.leftEnd = p(r(props.leftEnd) / step);
	        state.rightStart = p(r(props.rightStart) / step);
	        state.rightEnd = p(r(props.rightEnd) / step);

	        return state;
	    },

	    componentWillMount: function componentWillMount() {
	        this.setState(this.transPropsToState(this.props));
	    },

	    parseFloat: function (_parseFloat) {
	        function parseFloat(_x, _x2) {
	            return _parseFloat.apply(this, arguments);
	        }

	        parseFloat.toString = function () {
	            return _parseFloat.toString();
	        };

	        return parseFloat;
	    }(function (num, f) {
	        return parseFloat(num.toFixed(f !== undefined ? f : this.props.precision));
	    }),

	    componentDidMount: function componentDidMount() {
	        var base = this.refs.wrap;
	        var pos = elementAbsPosition(base);
	        pos.w = base.offsetWidth;

	        // 将值转换为0~100区间
	        var right = ReactDOM.findDOMNode(this.refs.right);

	        this.setState({
	            base: pos,
	            // 右边的元素不能超出窗口范围
	            rightStyle: { marginLeft: -right.clientWidth }
	        });
	    },

	    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	        var state = this.state;
	        var props = this.props;
	        var p = this.parseFloat;

	        // 边界的值可能会损失精度
	        var left = state.leftPos === state.leftStart ? props.leftStart : state.leftPos === state.leftEnd ? props.leftEnd : p(state.leftPos * this._step + props.min);

	        var right = state.rightPos === state.rightStart ? props.rightStart : state.rightPos === state.rightEnd ? props.rightEnd : p(state.rightPos * this._step + props.min);

	        if (prevState.leftPos !== state.leftPos || prevState.rightPos !== state.rightPos) {
	            props.onChange(state.leftPos, state.rightPos, left, right);
	        }
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(props) {
	        this.setState(this.transPropsToState(props));
	    },

	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        return Object.keys(this.state).some(function (name) {
	            return nextState[name] !== this.state[name];
	        }, this);
	    },

	    onLeftMove: function onLeftMove(pos) {
	        this.setState({ leftPos: pos });
	    },

	    onRightMove: function onRightMove(pos) {
	        this.setState({ rightPos: pos });
	    },

	    render: function render() {
	        var state = this.state;
	        var rangeStyle = {
	            width: state.rightPos - state.leftPos + '%',
	            left: state.leftPos + '%'
	        };

	        return React.createElement('div', { className: 'li' }, React.createElement('div', { className: 'price-move', ref: 'wrap' }, React.createElement('div', { className: 'move-bg', style: rangeStyle }), React.createElement(Slipper, {
	            base: state.base,
	            type: 'left',
	            min: state.leftStart,
	            max: state.leftEnd,
	            start: state.leftPos,
	            step: state.step,
	            onMove: this.onLeftMove }), React.createElement(Slipper, {
	            style: state.rightStyle,
	            base: state.base,
	            ref: 'right',
	            type: 'right',
	            min: state.rightStart,
	            max: state.rightEnd,
	            start: state.rightPos,
	            step: state.step,
	            onMove: this.onRightMove })));
	    }
	});

	module.exports = Slider;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by xcp on 2016/5/10.
	 */

	var React = __webpack_require__(2);
	var noop = __webpack_require__(4);
	var DOMEvent = __webpack_require__(18);
	var NotAllowSelect = __webpack_require__(20);
	var elementAbsPosition = __webpack_require__(48);
	var assign = __webpack_require__(8);

	var now = function now() {
	    return new Date() * 1;
	};

	var Slipper = React.createClass({
	    displayName: 'Slipper',

	    getInitialState: function getInitialState() {
	        return {
	            style: {},
	            disabled: false,
	            pos: 0,
	            dir: 'right',
	            base: { x: 0, y: 0, w: 200 }
	        };
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            style: {},
	            type: 'left',
	            timeGap: 50,
	            min: 0,
	            max: 100,
	            // step 要能被 min 和 max 整除
	            // 否则不能选择左右两个闭区间
	            step: 10,
	            start: 0,
	            base: null,
	            disabled: false,
	            onMount: noop,
	            onMove: noop
	        };
	    },

	    componentWillMount: function componentWillMount() {
	        var typeMirror = {
	            left: 'right',
	            right: 'left'
	        };
	        this.setState({
	            disabled: this.props.disabled,
	            pos: this.props.start,
	            dir: typeMirror[this.props.type] || 'left',
	            base: this.props.base
	        });
	    },

	    componentDidMount: function componentDidMount() {
	        this._mouseDown = false;
	        this._prevTime = now();
	        this.props.onMount(this);
	        var self = this;
	        var wrap, base;

	        if (!this.props.base) {
	            wrap = ReactDOM.findDOMNode(this.refs.wrap).parentNode;
	            base = elementAbsPosition(wrap);
	            base.w = wrap.offsetWidth;
	            this.setState({ base: base });
	        }

	        this._onMouseMoveProxy = function (e) {
	            self.onMouseMove.call(self, e);
	        };

	        this._onMouseUpProxy = function (e) {
	            self.onMouseUp.call(self, e);
	        };

	        DOMEvent.on(document.body, 'mousemove', this._onMouseMoveProxy);
	        DOMEvent.on(document.body, 'mouseup', this._onMouseUpProxy);
	    },

	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setState({
	            pos: nextProps.start,
	            disabled: nextProps.disabled,
	            style: nextProps.style,
	            base: nextProps.base
	        });
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        DOMEvent.off(document.body, 'mousemove', this._onMouseMoveProxy);
	        DOMEvent.off(document.body, 'mouseup', this._onMouseUpProxy);
	    },

	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        return this.state.pos !== nextState.pos || Object.keys(nextState.style).length || Object.keys(nextState.base).length;
	    },

	    _abs: function _abs(num) {
	        return num > 0 ? num : ~num + 1;
	    },

	    onMouseDown: function onMouseDown() {
	        this._mouseDown = true;
	    },

	    /**
	     * 该函数需要绑定到body上面，就算鼠标离开了icon
	     * 只要没有mouseUp，也还是可以拖的
	     * @param e
	     */
	    onMouseMove: function onMouseMove(e) {
	        if (!this._mouseDown) {
	            return;
	        }

	        var props = this.props;
	        var state = this.state;
	        var curPos = state.pos;
	        var cur = now();

	        // 如果时间间距不满足、超出范围
	        // 直接返回
	        if (cur - this._prevTime < props.timeGap || curPos < props.min || curPos > props.max) {
	            return;
	        }

	        this._prevTime = cur;

	        var pos = { x: e.pageX, y: e.pageY };

	        // 当前位置与基础位置距离的百分比
	        // 避免0为分母的情况
	        var gap = (pos.x - state.base.x) / (state.base.w || 1);
	        gap = gap * 100;
	        gap = gap - gap % props.step;

	        if (gap > props.max) {
	            gap = props.max;
	        }

	        if (gap < props.min) {
	            gap = props.min;
	        }

	        if (gap === curPos) {
	            return;
	        }
	        // console.log('base=%s, gap=%s, step=%s',
	        //     JSON.stringify(state.base), gap, props.step);

	        this.setState({ pos: gap });
	        this.props.onMove(gap);
	    },

	    onMouseUp: function onMouseUp() {
	        this._mouseDown = false;
	    },

	    render: function render() {

	        var style = assign({
	            position: 'absolute',
	            left: this.state.pos + '%'
	        }, this.state.style);

	        var props = {
	            ref: 'icon',
	            className: "icon-img icon-price-" + this.state.dir
	        };

	        if (!this.state.disabled) {
	            props.onMouseDown = this.onMouseDown;
	            props.onMouseMove = this.onMouseMove;
	            props.onMouseUp = this.onMouseUp;
	        }

	        return React.createElement(NotAllowSelect, { ref: 'wrap', style: style }, React.createElement('span', props));
	    }
	});

	module.exports = Slipper;

/***/ }
/******/ ]);