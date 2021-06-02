import utils, { randomColor, randomIntFromRange } from './utils';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
};

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

var gravity = 1;
var friction = 0.99;

// Event Listeners
addEventListener('mousemove', (event) => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
	// console.log(mouse.x, mouse.y)
});

addEventListener('resize', () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	init();
});

addEventListener('click', (e) => {
	init();
	// console.log(e.clientX, e.clientY)
});

// Objects
class Ball {
	constructor(x, y, dx, dy, radius, color) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.radius = radius;
		this.color = color;
		this.hit = 0;
	}

	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
		c.stroke();
		c.closePath();
	}

	update() {
		// bounce from floor
		if (this.y + this.radius + this.dy > canvas.height) {
			this.dy = -this.dy * friction;
			this.y = canvas.height - this.radius - 1;
		} else {
			this.dy += gravity;
		}

		// bounce from ceiling
		if (this.y - this.radius <= 0) {
			this.dy = -this.dy;
			this.y = this.radius + 1;
		}

		// bounce from left wall
		if (this.x - this.radius <= 0) {
			this.dx = -this.dx;
			this.x = this.radius + 1;
		}
		// bounce from right wall
		if (this.x + this.radius + this.dx > canvas.width) {
			this.dx = -this.dx;
			this.x = canvas.width - this.radius - 1;
		}
		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	}
}

class Block {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		// // OB = OP + rAB
		// this.OP = {i: this.x1, j: this.y1}
		// this.AB = {i: this.x2 - this.x1, j: this.y2 - this.y1}
		// this.OB = this.OP + r*this.AB
	}

	draw() {
		c.beginPath();
		c.moveTo(this.x1, this.y1);
		c.lineTo(this.x2, this.y2);
		c.fill();
		c.stroke();
		c.closePath();
	}

	update() {
		this.draw();
	}
}

// Implementation
let objects;
var ball;
var ballArray;
let numBalls = 4;
let blockArray;

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
	for (let i = 0; i < numBalls; i++) {
		var radius = randomIntFromRange(20, 80);
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(0, canvas.height - radius);
		var dx = randomIntFromRange(-8, 8);
		var dy = randomIntFromRange(-8, 8);
		var color = randomColor(colors);
		ballArray.push(new Ball(x, y, dx, dy, radius, color));
	}
	ballArray.forEach((b) => b.draw());
	// console.log(ballArray);

	blockArray = [];
	blockArray.push(
		new Block(0, canvas.height / 2, canvas.width / 2, canvas.height)
	);

	blockArray.forEach((block) => {
		const b1 = block.x2 - block.x1;
		const b2 = block.y2 - block.y1;
		console.log('block: ', b1, b2, block.x1, block.y1, block.x2, block.y2);
		ballArray.forEach((b) => {
			const r = b.radius;
			// check ball on which side of block
			const t = (b.x - block.x1) / (block.x2 - block.x1);
			const yp = (1 - t) * block.y1 + t * block.y2;
			const p = b.y > yp ? 1 : -1;
			p == 1 ? console.log('above') : console.log('below');
			console.log('t: ', t, ', b.y: ', b.y, ',yp: ', yp);
			// ensure b1 and b2 are non-zero respectively

			const a1 = (p * r) / Math.sqrt(1 + (b1 / b2) ** 2);
			const a2 = (-p * r) / Math.sqrt(1 + (b2 / b1) ** 2);
			const x1 = b.x + a1;
			const y1 = b.y + a2;
			console.log(a1, a2, b.x, b.y, x1, y1);
			drawVector(b.x, b.y, x1, y1);
			// const dx = b.x - xp
			// if(Math.hypot(dx,dy) < b.radius){
			// 	console.log('hit block')
			// }
			const a21 = a2 / a1;
			const num = block.y1 - b.y - a21 + b.x * a21;
			const den = block.y1 - block.y2 - block.x1 * a21 + block.x2 * a21;
			const k = num / den;
			console.log('k: ', k)
			const xs = (1-k)*block.x1 + k*block.x2
			const ys = (1-k)*block.y1 + k*block.y2
			drawBubblePoint(xs,ys)

		});
	});

	blockArray.forEach((b) => b.draw());
}

let vx = { i: 1, j: 0 };
let vy = { i: 0, j: 1 };

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	blockArray.forEach((b) => {
		console.log('block');
		b.update();
	});

	for (let i = 0; i < ballArray.length; i++) {
		ballArray[i].update();
		// reset hit to 0 for all balls
		ballArray[i].hit = 0;
	}

	ballArray.forEach((b1, id1) => {
		// console.log(b)
		if (!b1.hit) {
			ballArray.forEach((b2, id2) => {
				if (id1 != id2 && !b2.hit) {
					let dx = b1.x - b2.x;
					let dy = b1.y - b2.y;
					let d = Math.hypot(dx, dy);
					let a = Math.atan2(dy, dx);
					let n = 0.5 * Math.PI + a;
					let ax = Math.cos(a);
					let ay = Math.sin(a);
					// let nx = Math.cos(n)
					// let ny = Math.sin(n)
					//  let vn = {i:-sin(a), j: cos(a)}
					let va = { i: ax, j: ay };
					// let vn = {i: nx, j: ny}
					let vn = { i: -ay, j: ax };

					let dd = d - b1.radius - b2.radius;
					let m = 2; // margin
					if (d + m < b1.radius + b2.radius) {
						// console.log('hit distance: dd: ' + dd + ', d: ' + d + ', b1r: ' + b1.radius + ', b2r: ' + b2.radius + ', angle: ' + a);
						// console.log('hit distance: dd: ' + dd + ', d: ' + d + ', dy: ' + dy + ', dx: ' + dx + ', angle: ' +	a);

						// ball masses and relative masses
						const m1 = Math.PI * b1.radius ** 2;
						const m2 = Math.PI * b2.radius ** 2;
						const M = m1 + m2;
						const m1_M = m1 / M;
						const m2_M = m2 / M;
						// set hit to 1 to ensure that the ball is not referenced again when collision has been detected
						b1.hit = 1;
						b2.hit = 1;
						b1.x += m * ax * m1_M;
						b1.y += m * ay * m1_M;
						b2.x -= m * ax * m2_M;
						b2.y -= m * ay * m2_M;
						// console.log('after: ' + b1.dx);
						const vb1 = { i: b1.dx, j: b1.dy };
						const vb2 = { i: b2.dx, j: b2.dy };
						// determine ball velocity components in the line of collision(a) and normal to the line(n)
						const b1Dotva = dotPoduct(vb1, va);
						const b1Dotvn = dotPoduct(vb1, vn);
						const b2Dotva = dotPoduct(vb2, va);
						const b2Dotvn = dotPoduct(vb2, vn);
						// assign to initial velocities, u, for convenience
						const u1a = b1Dotva;
						const u2a = b2Dotva;
						const u1n = b1Dotvn;
						const u2n = b2Dotvn;
						// calculate ball velocities after collision using conservation of linear momentum
						const v = momentumChange(m1, u1a, m2, u2a);
						const v1a = v.v1;
						const v2a = v.v2;
						// console.log('u1a: ' + u1a + ', u2a: ' + u2a + ', v1a: ' + v1a + ', v2a: ' + v2a)
						// v1 and v2 are scalar quantities pointing in the va direction; va, vx are unit vectors
						const v1aDotvx = v1a * dotPoduct(va, vx);
						const v1aDotvy = v1a * dotPoduct(va, vy);
						const v2aDotvx = v2a * dotPoduct(va, vx);
						const v2aDotvy = v2a * dotPoduct(va, vy);
						const v1nDotvx = u1n * dotPoduct(vn, vx);
						const v1nDotvy = u1n * dotPoduct(vn, vy);
						const v2nDotvx = u2n * dotPoduct(vn, vx);
						const v2nDotvy = u2n * dotPoduct(vn, vy);
						// console.log('v1aDotvx: ' + v1aDotvx + ', vx.i: ' + vx.i + ', vx.j: ' + vx.j);
						// add the x- and y- components of ball velocities after collision
						b1.dx = v1aDotvx + v1nDotvx;
						b1.dy = v1aDotvy + v1nDotvy;
						b2.dx = v2aDotvx + v2nDotvx;
						b2.dy = v2aDotvy + v2nDotvy;
						// console.log('after momentum: ' + b1.dx);
					}
				}
			});
		}
	});
}

function momentumChange(m1, u1, m2, u2) {
	// let e = (v2+u2)/(v1+u1) <= 1
	// e = 1
	let v1 = (m1 * u1 + m2 * u2 - m2 * (u1 - u2)) / (m1 + m2);
	let v2 = (m2 * u2 + m1 * u1 - m1 * (u2 - u1)) / (m2 + m1);
	// console.log('m1: ' + m1 + ', m2: ' + m2)
	// console.log('u1: ' + u1 + ', u2: ' + u2 + ', v1: ' + v1 + ', v2: ' + v2)
	return { v1, v2 };
}

function dotPoduct(v1, v2) {
	return v1.i * v2.i + v1.j * v2.j;
}

init();
// animate();
