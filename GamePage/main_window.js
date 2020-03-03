var keysPressed = new Array("256");
var gravity = 0.2,
  terminalVelocity = 4,
  friction = 0.1;
let player = new Player(0, 0, 41, 40);
var lastCalledTime, fps;
var playerIdle, playerWalk;
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

  playerWalk = new GIF(
    [
      "./Storage/Images/Player/earth_walk_1.png",
      "./Storage/Images/Player/earth_walk_2.png"
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
        player.hitbox.width * 1,
        player.hitbox.height
      );
    }
  } else {
    mirrorImage(ctx, playerWalk.frames[0], player.hitbox.x, player.hitbox.y, true, false);
  }
}

function fixDpi() {
  let style_height = +getComputedStyle(canvas)
    .getPropertyValue("height")
    .slice(0, -2);

  let style_width = +getComputedStyle(canvas)
    .getPropertyValue("width")
    .slice(0, -2);

  ctx.imageSmoothingEnabled = false;
  canvas.setAttribute("height", style_height * dpi);
  canvas.setAttribute("width", style_width * dpi);
}

setInterval(() => {
  playerIdle.nextFrame();
  playerWalk.nextFrame();
}, 250);

function mirrorImage(
  ctx,
  image,
  x = 0,
  y = 0,
  horizontal = false,
  vertical = false
) {
  ctx.save(); // save the current canvas state
  ctx.setTransform(
    horizontal ? -1 : 1,
    0, // set the direction of x axis
    0,
    vertical ? -1 : 1, // set the direction of y axis
    x + horizontal ? image.width : 0, // set the x origin
    y + vertical ? image.height : 0 // set the y origin
  );
  ctx.drawImage(image, 0, 0);
  ctx.restore(); // restore the state as it was when this function was called
}
