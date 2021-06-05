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
	mouse.x = e.clientX;
	mouse.y = e.clientY;
	init();
	animate();
	// console.log(e.clientX, e.clientY)
});

addEventListener('dblclick', () => {
	// ballArray = [];
	console.log('dblclick')
});

addEventListener(
	'keydown',
	(e) => {
		if (e.defaultPrevented) {
			return;
		}
		switch (e.code) {
			case 'KeyM':
				console.log(mouse.x, mouse.y);
				break;
			case 'KeyX':
				console.log('clear ballArray');
				ballArray = [];
				break;
			case 'KeyD':
				console.log('delete ball');
				ballArray.pop();
				break;
			case 'KeyA':
				console.log('request animation');
				animationId = requestAnimationFrame(animate);
				break;
			case 'KeyC':
				console.log('cancel animation');
				cancelAnimationFrame(animationId);
				break;
		}
		// refresh()
		e.preventDefault();
	},
	true
);

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
		this.life = 1e3;
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
var ballArray = [];
let numBalls = 1;
let blockArray;

function drawVector(x0, y0, x1, y1) {
	c.beginPath();
	c.moveTo(x0, y0);
	c.lineTo(x1, y1);
	c.fill();
	c.stroke();
	c.closePath();
	drawBubblePoint(x1, y1, 1, "#000000", 0);
	// console.log('drawVector: ', x0, y0, x1, y1);
}

function drawBubblePoint(x0, y0, r = 5, color, fill = 1) {
	c.beginPath();
	c.arc(x0, y0, r, 0, Math.PI * 2, false);
	if (fill) {
		c.fillStyle = color;
		c.fill();
	}

	c.stroke();
	c.closePath();
	// console.log('drawBubblePoint: ', x0, y0);
}

function blockColliding(blockArray, ballArray) {
	blockArray.forEach((block) => {
		const b1 = block.x2 - block.x1;
		const b2 = block.y2 - block.y1;

		// console.log('block: ', b1, b2, block.x1, block.y1, block.x2, block.y2);
		ballArray.forEach((b) => {
			const r = b.radius;
			// check ball on which side of block
			// given b.x, find yp, a point on the block line. compare with b.y and determine on which side of the block line the ball is at
			const t = (b.x - block.x1) / (block.x2 - block.x1);
			const yp = (1 - t) * block.y1 + t * block.y2;
			// p is the parameter to choose vector direction i.e. pointing towards or away the block line
			const p = b.y < yp ? 1 : -1;
			p == 1 ? console.log('above') : console.log('below');
			// console.log('t: ', t, ', b.y: ', b.y, ',yp: ', yp);
			// ensure b1 and b2 are non-zero respectively
			// (a1,a2) is the vector from center of ball which will be normal to the block line
			// for quadrant 1 slope
			// const a1 = (p * r) / Math.sqrt(1 + (b1 / b2) ** 2);
			let a1, a2;
			// vector a must point towards block
			if (Math.sign(b1) == Math.sign(b2)) {
				a1 = -(p * r) / Math.sqrt(1 + (b1 / b2) ** 2);
				a2 = (p * r) / Math.sqrt(1 + (b2 / b1) ** 2);
			} else {
				a1 = (p * r) / Math.sqrt(1 + (b1 / b2) ** 2);
				a2 = (p * r) / Math.sqrt(1 + (b2 / b1) ** 2);
			}

			// (x1,y1) is the point on the edge of the ball. (x1,y1) and (b.x,b.y) forms the head and tail of the vector arrow, a = (a1,a2)
			const x1 = b.x + a1;
			const y1 = b.y + a2;
			// console.log(a1, a2, b.x, b.y, x1, y1);
			drawVector(b.x, b.y, x1, y1);
			// const dx = b.x - xp
			// if(Math.hypot(dx,dy) < b.radius){
			// 	console.log('hit block')
			// }
			const a21 = a2 / a1;
			const Dy = block.y2 - block.y1;
			const Dx = block.x2 - block.x1;
			const Ey = block.y1 - b.y;
			const Ex = block.x1 - b.x;
			const num = Ey - Ex * a21;
			const den = Dy - Dx * a21;
			// k is the parameter of a vector line equation for the block line
			const k = -num / den;
			console.log(a1, a2, a21, num, den, 'k: ', k);
			// (xs,ys ) is point of intersection of block line and normal line drawn from center of ball. the normal line is parallel to vector (a1,a2)
			// const xs = (1-k)*block.x1 + k*block.x2
			// const ys = (1-k)*block.y1 + k*block.y2
			const xs = (1 - k) * block.x1 + k * block.x2;
			const ys = (1 - k) * block.y1 + k * block.y2;
			console.log('xs: ', xs, 'ys: ', ys);

			// determine distance between ball and block line and compare with ball radius. d is actually s.a
			const dx = b.x - xs;
			const dy = b.y - ys;
			const d = Math.hypot(dx, dy);
			let g = b.radius;
			g = 0;
			if (
				xs + g > Math.min(block.x1, block.x2) &&
				xs - g < Math.max(block.x1, block.x2) &&
				ys + g > Math.min(block.y1, block.y2) &&
				ys - g < Math.max(block.y1, block.y2)
			) {
				// check that after block endpoints, no collision between ball and block
				drawBubblePoint(xs, ys, 5, b.color);

				// console.log('d: ',	d, 'dx: ',	dx,	'dy: ',	dy,	', b.radius: ',	b.radius);
				if (d < b.radius) {
					// console.log('hit block');

					// console.log('after: ' + b1.dx);
					const vb1 = { i: b.dx, j: b.dy };

					// determine ball velocity components in the line of collision(a) and normal to the line(n)
					const am = Math.hypot(a1, a2);
					const a1u = a1 / am;
					const a2u = a2 / am;
					// computing unit vectors in both directions
					const va = { i: a1u, j: a2u };
					const vn = { i: -a2u, j: a1u };
					// console.log('va: ',va,', vn: ',vn)
					const b1Dotva = dotPoduct(vb1, va);
					const b1Dotvn = dotPoduct(vb1, vn);
					// assign to initial velocities, u, for convenience
					const u1a = b1Dotva;
					const u1n = b1Dotvn;
					// calculate ball velocities after collision using conservation of linear momentum
					const v1a = -u1a;
					const v1n = u1n;
					// console.log('u1a: ' + u1a + ', u2a: ' + u2a + ', v1a: ' + v1a + ', v2a: ' + v2a)
					// v1 and v2 are scalar quantities pointing in the va direction; va, vx are unit vectors
					const v1aDotvx = v1a * dotPoduct(va, vx);
					const v1aDotvy = v1a * dotPoduct(va, vy);

					const v1nDotvx = u1n * dotPoduct(vn, vx);
					const v1nDotvy = u1n * dotPoduct(vn, vy);

					// console.log('v1aDotvx: ' + v1aDotvx + ', vx.i: ' + vx.i + ', vx.j: ' + vx.j);
					// add the x- and y- components of ball velocities after collision
					// drawBubblePoint(b.x, b.y, b.radius+2, '#000088',0)

					b.dx = v1aDotvx + v1nDotvx;
					b.dy = v1aDotvy + v1nDotvy;
					b.x += (b.radius - d + 1) * -1 * dotPoduct(va, vx); // + v1nDotvx;
					b.y += (b.radius - d + 1) * -1 * dotPoduct(va, vy); // + v1nDotvy;
					// drawBubblePoint(b.x, b.y, b.radius, '#0000FF',0)
					// console.log(b.x,b.y,'draw bubble')
					// add buffer so that it doesn't oscillate...depends on angles
					// b.x = xs + Math.sign(b.dx)*(d+2)
					// b.y = ys + Math.sign(b.dy)*(d+2)
					// console.log('after momentum: ' + b1.dx);
					// cancelAnimationFrame(animationId);
				}
			}
		});
	});
}

function createRectBlock(blockArray, points){
	blockArray.push(new Block(points[0].x,points[0].y,points[1].x,points[1].y));
	blockArray.push(new Block(points[1].x,points[1].y,points[2].x,points[2].y));
	blockArray.push(new Block(points[2].x,points[2].y,points[3].x,points[3].y));
	blockArray.push(new Block(points[3].x,points[3].y,points[0].x,points[0].y));
}

function init() {
	// ballArray = [];
	for (let i = 0; i < numBalls; i++) {
		var radius = randomIntFromRange(20, 80);
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(0, canvas.height - radius);

		x = mouse.x;
		y = mouse.y;

		var dx = randomIntFromRange(-8, 8);
		var dy = randomIntFromRange(-8, 8);
		var color = randomColor(colors);
		ballArray.push(new Ball(x, y, dx, dy, radius, color));
	}
	ballArray.forEach((b) => b.draw());
	// console.log(ballArray);

	blockArray = [];
	let points=[]
	let cw = canvas.width
	let ch = canvas.height
	let t = 50
	points.push({x:ch/4 - t, y:ch/4 + t})
	points.push({x:ch/4 + t, y:ch/4 - t})
	points.push({x:ch*2/4 + t, y:ch*2/4 -t})
	points.push({x:ch*2/4 - t, y:ch*2/4 + t})
	createRectBlock(blockArray, points)

	cw = canvas.width
	ch = canvas.height
	t = 100
	let s = 500
	points = []
	points.push({x:ch/4 - t + s, y:ch/4 + t})
	points.push({x:ch/4 + t + s, y:ch/4 - t})
	points.push({x:ch*2/4 + t + s, y:ch*2/4 -t})
	points.push({x:ch*2/4 - t + s, y:ch*2/4 + t})
	createRectBlock(blockArray, points)

	blockArray.push(new Block(0,ch*5/6,cw,ch*6/7))
	// for(let i=0;i<3;i++){
	// 	blockArray.push(
	// 		new Block(
	// 			points[i].x,
	// 			points[i].y,
	// 			points[i+1].x,
	// 			points[i+1].y
	// 		)
	// 	);
	// }

	// blockArray.push(
	// 	new Block(
	// 		canvas.width / 4,
	// 		canvas.width / 4,
	// 		(canvas.width * 3) / 4,
	// 		(canvas.width * 3) / 4
	// 	)
	// );
	// blockArray.push(
	// 	new Block(canvas.width - canvas.height, canvas.height, canvas.width, 0)
	// );
	// blockArray.push(new Block(0, 0, canvas.width, canvas.width));
	// blockArray.push(new Block(canvas.width, canvas.width, 0, 0));
	// blockArray.push(new Block(canvas.width / 2, 0, (canvas.width * 3) / 4, canvas.height));
	// blockArray.push(new Block(0, canvas.height / 3, canvas.width, canvas.height / 2));
	// blockArray.push(
	// 	new Block(canvas.width / 2, 0, canvas.width, canvas.width / 2)
	// );
	// blockArray.push(new Block(0, canvas.width / 2, canvas.width / 2, 0));
	// ball colliding with block
	blockColliding(blockArray, ballArray);

	blockArray.forEach((b) => {
		b.draw();
		// console.log('block position: ', b.x1, b.y1, b.x2, b.y2);
	});
}

let vx = { i: 1, j: 0 };
let vy = { i: 0, j: 1 };

function calculateBallLife() {
	ballArray.forEach((b, id) => {
		b.life -= 1;
		if (b.life == 0) ballArray.splice(id, 1);
	});
}

// Animation Loop
function animate() {
	animationId = requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	// calculateBallLife()

	blockArray.forEach((b) => {
		// console.log('block');
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

	// ball colliding with block
	blockColliding(blockArray, ballArray);
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
// main
let animationId;
init();
animate();
