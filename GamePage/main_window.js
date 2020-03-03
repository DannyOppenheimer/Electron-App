var keysPressed = new Array("256");
var gravity = 0.2,
  terminalVelocity = 4,
  friction = 0.1;
let player = new Player(0, 0, 41, 40);
var lastCalledTime, fps;
var playerIdle, playerWalkRight, playerWalkLeft, playerJump;
var clouds = [];

let canvas, ctx, dpi;

document.addEventListener("keydown", e => {
  keysPressed[e.keyCode] = true;
});
document.addEventListener("keyup", e => {
  keysPressed[e.keyCode] = false;
});
document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("main_game_window");
  ctx = canvas.getContext("2d");
  dpi = window.devicePixelRatio;
  fixDpi();

  playerIdle = new GIF(
    [
      "./Storage/Images/Player/earth_idle_1.png",
      "./Storage/Images/Player/earth_idle_2.png",
      "./Storage/Images/Player/earth_idle_3.png",
      "./Storage/Images/Player/earth_idle_4.png",
      "./Storage/Images/Player/earth_idle_3.png",
      "./Storage/Images/Player/earth_idle_2.png"
    ],
    player
  );

  playerWalkLeft = new GIF(
    [
      "./Storage/Images/Player/earth_walk_left_1.png",
      "./Storage/Images/Player/earth_walk_left_2.png"
    ],
    player
  );

  playerWalkRight = new GIF(
    [
      "./Storage/Images/Player/earth_walk_right_1.png",
      "./Storage/Images/Player/earth_walk_right_2.png"
    ],
    player
  );

  playerJump = new GIF(
    [
      "./Storage/Images/Player/earth_jump_1.png",
      "./Storage/Images/Player/earth_jump_2.png"
    ],
    player
  );

  window.requestAnimationFrame(eventTick);
});

function eventTick() {
  updateCanvas(canvas);
  let floor = updateFloor();
  updatePlayer(player, floor);

  //calculate FPS
  let delta = (Date.now() - lastCalledTime) / 1000;
  lastCalledTime = Date.now();
  fps = 1 / delta;

  window.requestAnimationFrame(eventTick);
}

function updateCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 7;
  ctx.fillStyle = "#4EADF5";

  let rect = new Rectangle(0, 0, canvas.width, canvas.height);
  ctx.fillRect(rect.x, rect.y, canvas.width, canvas.height);

  let cloud = new Image();
  cloud.src = "Storage/Images/Clouds/flat_cloud.png";
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(cloud, 10, 10, cloud.width * 10, cloud.height * 10);
}

function updateFloor() {
  ctx.fillStyle = "#FF0000";

  let floorRect = new Rectangle(0, canvas.height - 100, canvas.width, 100);
  ctx.fillRect(floorRect.x, floorRect.y, floorRect.width, floorRect.height);
  return floorRect;
}

function updatePlayer(player, floor) {
  if (player.velY != -2) {
    player.velY += gravity;
  }
  player.velX += friction * player.lastDirection;
  if (player.velX <= 0.1 && player.velX >= -0.1) {
    player.velX = 0;
  }

  player.collision(floor);

  if (keysPressed[65] == true) {
    player.velX = -5;
    player.lastDirection = 1;
  }
  if (keysPressed[83] == true) {
  }
  if (keysPressed[68] == true) {
    player.velX = 5;
    player.lastDirection = -1;
  }
  if (keysPressed[87] == true) {
    player.jump();
  }

  player.hitbox.x += player.velX;
  player.hitbox.y += player.velY;

  //scale width
  player.hitbox.width = canvas.width / 6;
  player.hitbox.height = (canvas.width / 6) * (40 / 41);

  if (getState(player) == "idle") {
    try {
      ctx.drawImage(
        playerIdle.frames[playerIdle.onFrame],
        player.hitbox.x,
        player.hitbox.y,
        player.hitbox.width,
        player.hitbox.height
      );
    } catch (error) {
      ctx.drawImage(
        playerIdle.frames[0],
        player.hitbox.x,
        player.hitbox.y,
        player.hitbox.width,
        player.hitbox.height
      );
    }
  } else if (getState(player)[0] == "running") {
    if (getState(player)[1] == "left") {
      try {
        ctx.drawImage(
          playerWalkLeft.frames[playerWalkLeft.onFrame],
          player.hitbox.x,
          player.hitbox.y,
          player.hitbox.width,
          player.hitbox.height
        );
      } catch (error) {
        ctx.drawImage(
          playerWalkLeft.frames[0],
          player.hitbox.x,
          player.hitbox.y,
          player.hitbox.width,
          player.hitbox.height
        );
      }
    } else {
      try {
        ctx.drawImage(
          playerWalkRight.frames[playerWalkRight.onFrame],
          player.hitbox.x,
          player.hitbox.y,
          player.hitbox.width,
          player.hitbox.height
        );
      } catch (error) {
        ctx.drawImage(
          playerWalkRight.frames[0],
          player.hitbox.x,
          player.hitbox.y,
          player.hitbox.width,
          player.hitbox.height
        );
      }
    }
  } else if (getState(player) == "jumping") {
    ctx.restore();
    ctx.drawImage(
      playerJump.frames[1],
      player.hitbox.x,
      player.hitbox.y,
      player.hitbox.width,
      player.hitbox.height
    );
  }
}

setInterval(() => {
  playerIdle.nextFrame();
  playerWalkLeft.nextFrame();
  playerWalkRight.nextFrame();
}, 250);
