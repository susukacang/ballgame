import utils, { randomColor, randomIntFromRange } from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

var gravity = 1
var friction = 0.99

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

addEventListener('click', () => {
  init()
})


// Objects
class Ball {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.stroke()
    c.closePath()
  }

  update() {
    if (this.y + this.radius + this.dy > canvas.height) {
      this.dy = -this.dy * friction
    } else {
      this.dy += gravity
    }

    if (this.x + this.radius + this.dx> canvas.width || this.x - this.radius <= 0) {
      this.dx = -this.dx
    } 
    this.x += this.dx
    this.y += this.dy
    this.draw()
  }
}

// Implementation
let objects
var ball
var ballArray
function init() {
  ballArray = []
  for (let i = 0; i < 4; i++) {
    var radius = randomIntFromRange(8,20)
    var x = randomIntFromRange(radius, canvas.width - radius)
    var y = randomIntFromRange(0, canvas.height - radius)
    var dx = randomIntFromRange(-2, 2)
    var dy = randomIntFromRange(-2, 2)
    var color = randomColor(colors)
    ballArray.push(new Ball(x, y, dx, dy, radius, color))
    
  }
  

  for (let i = 0; i < 400; i++) {
    // objects.push()
  }
  console.log(ballArray)
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < ballArray.length; i++) {
    ballArray[i].update()
  }
  // objects.forEach(object => {
  //  object.update()
  // })
}

init()
animate()
