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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/canvas.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/canvas.js":
/*!**************************!*\
  !*** ./src/js/canvas.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};
var colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];
var gravity = 1;
var friction = 0.99; // Event Listeners

addEventListener('mousemove', function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY; // console.log(mouse.x, mouse.y)
});
addEventListener('resize', function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});
addEventListener('click', function (e) {
  init(); // console.log(e.clientX, e.clientY)
}); // Objects

var Ball = /*#__PURE__*/function () {
  function Ball(x, y, dx, dy, radius, color) {
    _classCallCheck(this, Ball);

    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.hit = 0;
  }

  _createClass(Ball, [{
    key: "draw",
    value: function draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
      c.stroke();
      c.closePath();
    }
  }, {
    key: "update",
    value: function update() {
      // bounce from floor
      if (this.y + this.radius + this.dy > canvas.height) {
        this.dy = -this.dy * friction;
        this.y = canvas.height - this.radius - 1;
      } else {
        this.dy += gravity;
      } // bounce from ceiling


      if (this.y - this.radius <= 0) {
        this.dy = -this.dy;
        this.y = this.radius + 1;
      } // bounce from left wall


      if (this.x - this.radius <= 0) {
        this.dx = -this.dx;
        this.x = this.radius + 1;
      } // bounce from right wall


      if (this.x + this.radius + this.dx > canvas.width) {
        this.dx = -this.dx;
        this.x = canvas.width - this.radius - 1;
      }

      this.x += this.dx;
      this.y += this.dy;
      this.draw();
    }
  }]);

  return Ball;
}();

var Block = /*#__PURE__*/function () {
  function Block(x1, y1, x2, y2) {
    _classCallCheck(this, Block);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2; // // OB = OP + rAB
    // this.OP = {i: this.x1, j: this.y1}
    // this.AB = {i: this.x2 - this.x1, j: this.y2 - this.y1}
    // this.OB = this.OP + r*this.AB
  }

  _createClass(Block, [{
    key: "draw",
    value: function draw() {
      c.beginPath();
      c.moveTo(this.x1, this.y1);
      c.lineTo(this.x2, this.y2);
      c.fill();
      c.stroke();
      c.closePath();
    }
  }, {
    key: "update",
    value: function update() {
      this.draw();
    }
  }]);

  return Block;
}(); // Implementation


var objects;
var ball;
var ballArray;
var numBalls = 4;
var blockArray;

function drawVector(x0, y0, x1, y1) {
  c.beginPath();
  c.moveTo(x0, y0);
  c.lineTo(x1, y1);
  c.fill();
  c.stroke();
  c.closePath();
  console.log('drawVector: ', x0, y0, x1, y1);
}

function drawBubblePoint(x0, y0) {
  c.beginPath();
  c.arc(x0, y0, 5, 0, Math.PI * 2, false);
  c.fill();
  c.stroke();
  c.closePath();
  console.log('drawBubblePoint: ', x0, y0);
}

function init() {
  ballArray = [];

  for (var i = 0; i < numBalls; i++) {
    var radius = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["randomIntFromRange"])(20, 80);
    var x = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["randomIntFromRange"])(radius, canvas.width - radius);
    var y = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["randomIntFromRange"])(0, canvas.height - radius);
    var dx = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["randomIntFromRange"])(-8, 8);
    var dy = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["randomIntFromRange"])(-8, 8);
    var color = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["randomColor"])(colors);
    ballArray.push(new Ball(x, y, dx, dy, radius, color));
  }

  ballArray.forEach(function (b) {
    return b.draw();
  }); // console.log(ballArray);

  blockArray = [];
  blockArray.push(new Block(0, canvas.height / 2, canvas.width / 2, canvas.height));
  blockArray.forEach(function (block) {
    var b1 = block.x2 - block.x1;
    var b2 = block.y2 - block.y1;
    console.log('block: ', b1, b2, block.x1, block.y1, block.x2, block.y2);
    ballArray.forEach(function (b) {
      var r = b.radius; // check ball on which side of block

      var t = (b.x - block.x1) / (block.x2 - block.x1);
      var yp = (1 - t) * block.y1 + t * block.y2;
      var p = b.y > yp ? 1 : -1;
      p == 1 ? console.log('above') : console.log('below');
      console.log('t: ', t, ', b.y: ', b.y, ',yp: ', yp); // ensure b1 and b2 are non-zero respectively

      var a1 = p * r / Math.sqrt(1 + Math.pow(b1 / b2, 2));
      var a2 = -p * r / Math.sqrt(1 + Math.pow(b2 / b1, 2));
      var x1 = b.x + a1;
      var y1 = b.y + a2;
      console.log(a1, a2, b.x, b.y, x1, y1);
      drawVector(b.x, b.y, x1, y1); // const dx = b.x - xp
      // if(Math.hypot(dx,dy) < b.radius){
      // 	console.log('hit block')
      // }

      var a21 = a2 / a1;
      var num = block.y1 - b.y - a21 + b.x * a21;
      var den = block.y1 - block.y2 - block.x1 * a21 + block.x2 * a21;
      var k = num / den;
      console.log('k: ', k);
      var xs = (1 - k) * block.x1 + k * block.x2;
      var ys = (1 - k) * block.y1 + k * block.y2;
      drawBubblePoint(xs, ys);
    });
  });
  blockArray.forEach(function (b) {
    return b.draw();
  });
}

var vx = {
  i: 1,
  j: 0
};
var vy = {
  i: 0,
  j: 1
}; // Animation Loop

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  blockArray.forEach(function (b) {
    console.log('block');
    b.update();
  });

  for (var i = 0; i < ballArray.length; i++) {
    ballArray[i].update(); // reset hit to 0 for all balls

    ballArray[i].hit = 0;
  }

  ballArray.forEach(function (b1, id1) {
    // console.log(b)
    if (!b1.hit) {
      ballArray.forEach(function (b2, id2) {
        if (id1 != id2 && !b2.hit) {
          var dx = b1.x - b2.x;
          var dy = b1.y - b2.y;
          var d = Math.hypot(dx, dy);
          var a = Math.atan2(dy, dx);
          var n = 0.5 * Math.PI + a;
          var ax = Math.cos(a);
          var ay = Math.sin(a); // let nx = Math.cos(n)
          // let ny = Math.sin(n)
          //  let vn = {i:-sin(a), j: cos(a)}

          var va = {
            i: ax,
            j: ay
          }; // let vn = {i: nx, j: ny}

          var vn = {
            i: -ay,
            j: ax
          };
          var dd = d - b1.radius - b2.radius;
          var m = 2; // margin

          if (d + m < b1.radius + b2.radius) {
            // console.log('hit distance: dd: ' + dd + ', d: ' + d + ', b1r: ' + b1.radius + ', b2r: ' + b2.radius + ', angle: ' + a);
            // console.log('hit distance: dd: ' + dd + ', d: ' + d + ', dy: ' + dy + ', dx: ' + dx + ', angle: ' +	a);
            // ball masses and relative masses
            var m1 = Math.PI * Math.pow(b1.radius, 2);
            var m2 = Math.PI * Math.pow(b2.radius, 2);
            var M = m1 + m2;
            var m1_M = m1 / M;
            var m2_M = m2 / M; // set hit to 1 to ensure that the ball is not referenced again when collision has been detected

            b1.hit = 1;
            b2.hit = 1;
            b1.x += m * ax * m1_M;
            b1.y += m * ay * m1_M;
            b2.x -= m * ax * m2_M;
            b2.y -= m * ay * m2_M; // console.log('after: ' + b1.dx);

            var vb1 = {
              i: b1.dx,
              j: b1.dy
            };
            var vb2 = {
              i: b2.dx,
              j: b2.dy
            }; // determine ball velocity components in the line of collision(a) and normal to the line(n)

            var b1Dotva = dotPoduct(vb1, va);
            var b1Dotvn = dotPoduct(vb1, vn);
            var b2Dotva = dotPoduct(vb2, va);
            var b2Dotvn = dotPoduct(vb2, vn); // assign to initial velocities, u, for convenience

            var u1a = b1Dotva;
            var u2a = b2Dotva;
            var u1n = b1Dotvn;
            var u2n = b2Dotvn; // calculate ball velocities after collision using conservation of linear momentum

            var v = momentumChange(m1, u1a, m2, u2a);
            var v1a = v.v1;
            var v2a = v.v2; // console.log('u1a: ' + u1a + ', u2a: ' + u2a + ', v1a: ' + v1a + ', v2a: ' + v2a)
            // v1 and v2 are scalar quantities pointing in the va direction; va, vx are unit vectors

            var v1aDotvx = v1a * dotPoduct(va, vx);
            var v1aDotvy = v1a * dotPoduct(va, vy);
            var v2aDotvx = v2a * dotPoduct(va, vx);
            var v2aDotvy = v2a * dotPoduct(va, vy);
            var v1nDotvx = u1n * dotPoduct(vn, vx);
            var v1nDotvy = u1n * dotPoduct(vn, vy);
            var v2nDotvx = u2n * dotPoduct(vn, vx);
            var v2nDotvy = u2n * dotPoduct(vn, vy); // console.log('v1aDotvx: ' + v1aDotvx + ', vx.i: ' + vx.i + ', vx.j: ' + vx.j);
            // add the x- and y- components of ball velocities after collision

            b1.dx = v1aDotvx + v1nDotvx;
            b1.dy = v1aDotvy + v1nDotvy;
            b2.dx = v2aDotvx + v2nDotvx;
            b2.dy = v2aDotvy + v2nDotvy; // console.log('after momentum: ' + b1.dx);
          }
        }
      });
    }
  });
}

function momentumChange(m1, u1, m2, u2) {
  // let e = (v2+u2)/(v1+u1) <= 1
  // e = 1
  var v1 = (m1 * u1 + m2 * u2 - m2 * (u1 - u2)) / (m1 + m2);
  var v2 = (m2 * u2 + m1 * u1 - m1 * (u2 - u1)) / (m2 + m1); // console.log('m1: ' + m1 + ', m2: ' + m2)
  // console.log('u1: ' + u1 + ', u2: ' + u2 + ', v1: ' + v1 + ', v2: ' + v2)

  return {
    v1: v1,
    v2: v2
  };
}

function dotPoduct(v1, v2) {
  return v1.i * v2.i + v1.j * v2.j;
}

init(); // animate();

/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  var xDist = x2 - x1;
  var yDist = y2 - y1;
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

module.exports = {
  randomIntFromRange: randomIntFromRange,
  randomColor: randomColor,
  distance: distance
};

/***/ })

/******/ });
//# sourceMappingURL=canvas.bundle.js.map