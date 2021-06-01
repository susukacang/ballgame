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
var friction = 0.9;

// Event Listeners
addEventListener('mousemove', (event) => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener('resize', () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	init();
});

addEventListener('click', () => {
	init();
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
		if (this.y + this.radius + this.dy > canvas.height) {
			this.dy = -this.dy * friction;
		} else {
			this.dy += gravity;
		}

		if (
			this.x + this.radius + this.dx > canvas.width ||
			this.x - this.radius <= 0
		) {
			this.dx = -this.dx;
		}
		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	}
}

// Implementation
let objects;
var ball;
var ballArray;
let numBalls = 5

function init() {
	ballArray = [];
	for (let i = 0; i < numBalls; i++) {
		var radius = randomIntFromRange(20, 30);
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(0, canvas.height - radius);
		var dx = randomIntFromRange(-4, 4);
		var dy = randomIntFromRange(-4, 4);
		var color = randomColor(colors);
		ballArray.push(new Ball(x, y, dx, dy, radius, color));
	}

	for (let i = 0; i < 400; i++) {
		// objects.push()
	}
	console.log(ballArray);
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < ballArray.length; i++) {
    ballArray[i].update();
    ballArray[i].hit = 0;
	}
	// objects.forEach(object => {
	//  object.update()
	// })

	ballArray.forEach((b1, id1) => {
		// console.log(b)
		if (!b1.hit) {
			ballArray.forEach((b2, id2) => {
				if (id1 != id2 && !b2.hit) {
					let dx = b1.x - b2.x;
					let dy = b1.y - b2.y;
					let d = Math.hypot(dx, dy);
					let a = Math.atan2(dy, dx);
					let n = 0.5*Math.PI + a
					let ax = Math.cos(a)
					let ay = Math.sin(a)
					let nx = Math.cos(n)
					let ny = Math.sin(n)
					let va = {i: ax, j: ay}
					let vn = {i: nx, j: ny}

					let dd = d - b1.radius - b2.radius;
					if (dd < 0) {
						console.log('hit distance: ' + dd + ', angle: ' + a);
						// ballArray.splice(id1,1)
						// ballArray.splice(id2,1)
						// b1.color = randomColor(colors);
						// b2.color = randomColor(colors);
						console.log('before: ' + b1.dx);
						// b1.dx = -b1.dx;
						// b2.dx = -b2.dx;
						// b1.dy = -b1.dy;
						// b2.dy = -b2.dy;
						b1.hit = 1;
						b2.hit = 1;
						console.log('after: ' + b1.dx);
						const vb1 = {i: b1.dx, j: b1.dy}
						const vb2 = {i: b2.dx, j: b2.dy}

						const b1Dotva = dotPoduct(vb1, va)
						const b1Dotvn = dotPoduct(vb1, vn)
						const b2Dotva = dotPoduct(vb2, va)
						const b2Dotvn = dotPoduct(vb2, vn)
						const u1a = b1Dotva
						const u2a = b2Dotva
						const u1n = b1Dotvn
						const u2n = b2Dotvn
						console.log(va, vn, b1, b2)
						console.log(b1Dotva, b1Dotvn, b2Dotva, b2Dotvn)
						const m1 = Math.PI*(b1.radius)**2
						const m2 = Math.PI*(b2.radius)**2
						// let p1 = m1*b1Dotva
						// let p2 = m2*b2Dotva
						const v = momentumChange(m1, u1a, m2, u2a)
						const v1a = v.v1
						const v2a = v.v2
						console.log('u1a: ' + u1a + ', u2a: ' + u2a + ', v1a: ' + v1a + ', v2a: ' + v2a)
						// v1 and v2 are scalar quantities pointing in the va direction; va, vx are unit vectors
						const v1aDotvx = v1a * dotPoduct(va, vx)
						const v1aDotvy = v1a * dotPoduct(va, vy)
						const v2aDotvx = v2a * dotPoduct(va, vx)
						const v2aDotvy = v2a * dotPoduct(va, vy)
						const v1nDotvx = u1n * dotPoduct(vn, vx)
						const v1nDotvy = u1n * dotPoduct(vn, vy)
						const v2nDotvx = u2n * dotPoduct(vn, vx)
						const v2nDotvy = u2n * dotPoduct(vn, vy)
						console.log('v1aDotvx: ' + v1aDotvx + ', vx.i: ' + vx.i + ', vx.j: ' + vx.j);
						b1.dx = v1aDotvx + v1nDotvx
						b1.dy = v1aDotvy + v1nDotvy
						b2.dx = v2aDotvx + v2nDotvx
						b2.dy = v2aDotvy + v2nDotvy
						console.log('after momentum: ' + b1.dx);
					}
				}
			});
		}
	});
}

function momentumChange(m1, u1, m2, u2){
	// let e = (v2+u2)/(v1+u1) <= 1
	// e = 1
	let v1 = (m1*u1 + m2*u2 - m2*(u1-u2))/(m1 + m2)
	let v2 = (m2*u2 + m1*u1 - m1*(u2-u1))/(m2 + m1)
	console.log('m1: ' + m1 + ', m2: ' + m2)
	console.log('u1: ' + u1 + ', u2: ' + u2 + ', v1: ' + v1 + ', v2: ' + v2)
	return { v1, v2 }
}

function dotPoduct(v1 ,v2){
	return v1.i*v2.i + v1.j*v2.j
}

let vx = {i:1, j:0}
let vy = {i:0, j:1}


init();
animate();
