let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let bgImage, spaceImage, enemyImage, explosionImage;

function loadImage() {
  bgImage = new Image();
  bgImage.src = "images/background.gif";

  console.log("bbb", bgImage);
  spaceImage = new Image();
  spaceImage.src = "images/spaceship.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";
  bulletImage = new Image();
  bulletImage.onload = function () {
    bulletReady = true;
  };
  bulletImage.src = "images/bullet.png";

  explosionImage = new Image();
  explosionImage.src = "images/explosion.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.png";
}

let spaceX = 10;
let spaceY = canvas.height - 40;

let bullets = [];
let enemies = [];
let explosions = [];
let gameOver = false;
let score = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function enemy() {
  this.x = 1;
  this.y = 50;
  this.alive = false;
  this.init = function () {
    this.y = 50;
    this.x = getRandomInt(0, canvas.width - 50);
    this.alive = true;
    enemies.push(this);
  };
  this.update = function () {
    if (this.alive) {
      this.y += 1;
      if (this.y >= canvas.height - 50) {
        this.alive = false;
        gameOver = true;
      }
    }
  };
}
function bullet() {
  this.x = spaceX + 20;
  this.y = spaceY;
  this.alive = true;

  this.init = function () {
    bullets.push(this);
  };
  this.update = function () {
    if (this.alive) {
      this.y -= 7;
      if (this.y <= 0) this.alive = false;
    }
  };
  this.checkHit = function () {
    if (this.alive) {
      for (let i = 0; i < enemies.length; i++) {
        if (
          this.y <= enemies[i].y &&
          this.x >= enemies[i].x &&
          this.x <= enemies[i].x + 40
        ) {
          let e = new explosion();
          explosions.push(e);
          e.init(enemies[i].x, enemies[i].y);
          this.alive = false;

          enemies.splice(i, 1);
          score++;
        }
      }
    }
  };
}
function explosion() {
  this.x = 0;
  this.y = 0;
  this.alive = false;
  this.init = function (x, y) {
    this.x = x;
    this.y = y;
    this.alive = true;
  };
  this.update = function () {
    let time = setInterval(function () {
      this.alive = false;
    }, 500);
  };
}

function createBullet() {
  let b = new bullet();
  b.init();
}

let keysDown = {};
function setupKeyboardListeners() {
  document.addEventListener(
    "keydown",
    function (e) {
      keysDown[e.keyCode] = true;
      if (e.keyCode == 32) {
        createBullet();
      }
    },
    false
  );

  document;
  document.addEventListener(
    "keyup",
    function (e) {
      delete keysDown[e.keyCode];
    },
    false
  );
}
function createEnemy() {
  const interval = setInterval(function () {
    let e = new enemy();
    e.init();
  }, 1000);
}

function update() {
  if (37 in keysDown) {
    //left
    spaceX -= 5;
  }
  if (39 in keysDown) {
    spaceX += 5;
  }

  for (let i = 0; i < bullets.length; i++) {
    bullets[i].update();
    bullets[i].checkHit();
  }
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();
  }

  if (spaceX <= 0) {
    spaceX = 0;
  }
  if (spaceX >= canvas.width - 60) {
    spaceX = canvas.width - 60;
  }
}

function render() {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceImage, spaceX, spaceY);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score:${score}`, 20, 30);

  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      ctx.drawImage(enemyImage, enemies[i].x, enemies[i].y);
    }
  }
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].alive) {
      ctx.drawImage(bulletImage, bullets[i].x, bullets[i].y);
    }
  }

  for (let i = 0; i < explosions.length; i++) {
    if (explosions[i].alive) {
      ctx.drawImage(explosionImage, explosions[i].x, explosions[i].y);
      explosions[i].alive = false;
    }
  }
}
function main() {
  if (!gameOver) {
    update();
    render();
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 10, 100, 380, 380);
  }
}
loadImage();
setupKeyboardListeners();
createEnemy();
main();
