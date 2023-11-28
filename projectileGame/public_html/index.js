class Player {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
}


class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.x += this.velocity['x']
    this.y += this.velocity['y']
    this.draw()
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.x += this.velocity['x']
    this.y += this.velocity['y']
    this.draw()
  }
}


class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1
  }

  draw() {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.alpha -= 0.01
    this.velocity['x'] = this.velocity['x'] * 0.98
    this.velocity['y'] = this.velocity['y'] * 0.98
    this.x += this.velocity['x']
    this.y += this.velocity['y']
    this.draw()
  }
}


var enemies = []
var projectiles = []
var particles = []
var score = 0

const canvas = document.getElementById('my_canvas')
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const x = canvas.width / 2
const y = canvas.height / 2

var player = new Player(x, y, 10, 'white')
player.draw()

function init()
{
  enemies = []
  projectiles = []
  particles = []
  score = 0
  document.getElementById('big_score').innerText = score
  document.getElementById('score').innerText = score
  player = new Player(x, y, 10, 'white')
  player.draw()
  
}

window.addEventListener('click', (e) => generateProjectile(e))


function generateProjectile(e) {
  let angle = Math.atan2(e.y - y, e.x - x)
  let velocity = { x: Math.cos(angle)*6, y: Math.sin(angle)*6}
  projectiles.push(new Projectile(x, y, 5, 'white', velocity))
}

let id;
function animate() {
  id = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0,0,0,0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()
  projectiles.forEach((projectile, Pindex) => 
  {
    if (projectile.x - projectile.radius > canvas.width || projectile.x + projectile.radius < 0
      || projectile.y - projectile.radius > canvas.height || projectile.y + projectile.radius < 0)
      {
        setTimeout(() => {
          projectiles.splice(Pindex,1)
        }, 0);
      }
    projectile.update()
  })

  particles.forEach((particle,i) => {
    if (particle.alpha <= 0.1)
    {
      particles.splice(i,1)
    }
    else
    {particle.update()}})

  enemies.forEach((enemy, Eindex) => {
    let distance = Math.hypot(player.x-enemy.x, player.y-enemy.y)
    if (distance - enemy.radius - player.radius < 1)
    {
      cancelAnimationFrame(id)
      document.getElementById('big_score').innerText = score
      document.getElementById('window').style.display = 'flex'
    }
    enemy.update()
    projectiles.forEach((projectile, Pindex) =>
    {
      let distance = Math.hypot(projectile.x-enemy.x, projectile.y-enemy.y) 
      if (distance - projectile.radius - enemy.radius < 1)
      {
        for (let i = 0; i < enemy.radius;i++)
        {
          let particle = new Particle(projectile.x,projectile.y,Math.random()*2,enemy.color,{x:(Math.random()-0.5)*6,y:(Math.random()-0.5)*6})
          particles.push(particle)
        }
        if (enemy.radius >= 15)
        {
          score+=100
          document.getElementById('score').innerText = score
          gsap.to(enemy, {radius: enemy.radius - 10})
          setTimeout(() => {projectiles.splice(Pindex,1)}, 0);
        }
        else
        {
          score+=200
          document.getElementById('score').innerText = score
          setTimeout(() => {projectiles.splice(Pindex,1)}, 0);
          setTimeout(() => {enemies.splice(Eindex,1)}, 0);
        }
      }
    })
  })
}


function spawnEnemies() {
  let random = Math.random()
  let startX;
  let startY;
  if (random <= 0.25) {
    startX = -20
    startY = Math.random() * canvas.height
  }
  else if (random <= 0.5) {
    startX = canvas.width + 20
    startY = Math.random() * canvas.height
  }
  else if (random <= 0.75) {
    startY = -20
    startX = Math.random() * canvas.width
  }
  else {
    startX = Math.random() * canvas.width
    startY = canvas.height + 20
  }
  let angle = Math.atan2(canvas.height / 2 - startY, canvas.width / 2 - startX)
  let radius = (Math.random() * 21) + 10
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  let enemy = new Enemy(startX, startY, radius, color, { x: Math.cos(angle)*2, y: Math.sin(angle)*2 })
  enemies.push(enemy)
}

document.getElementById('start').onclick = () =>
{
  document.getElementById('window').style.display = 'none'
  init()
  setInterval(spawnEnemies, 1000)
  animate()
}