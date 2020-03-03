class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  intersects(r2) {
    if (
      // check top-left corner
      this.y > r2.y &&
      this.x > r2.x &&
      this.y + this.height < r2.y + r2.height &&
      this.x + this.width < r2.x + r2.width
    ) {
      return true;
    }
    // bottom left corner
    if (
      this.y + this.height > r2.y &&
      this.y < r2.y &&
      this.x + this.width < r2.x + r2.width &&
      this.x > r2.x
    ) {
      return true;
    }
    //top right corner
    if (
      this.y > r2.y &&
      this.y + this.height < r2.y &&
      this.x + this.width < r2.x + r2.width &&
      this.x > r2.x
    ) {
      return true;
    }

    return false;
  }
}

class Obstacle {
  constructor(x, y, width, height) {
    this.hitbox = new Rectangle(x, y, width, height);
    this.velY = 0;
    this.velX = 0;
  }

  belowCoords(y) {
    if (y < this.hitbox.y + this.hitbox.height) {
      return true;
    }
  }

  collision(rect) {
    if (this.hitbox.intersects(rect)) {
      this.jumping = false;
      this.velY = 0;
    }
  }
}

class Player extends Obstacle {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.lastDirection = 1;
    this.idle_frame = 0;

    this.jumping;
  }

  jump() {
    if (!this.jumping) {
      this.jumping = true;
      this.velY = -6;
      setTimeout(() => {
        this.velY = 0;
      }, 1000);
    }
  }
}

class GIF {
  /**
   * @param {string[]} frames - Frames in GIF
   * @param {object} sprite - Player to assign image to
   * @param {number} startingFrame - Starting GIF frame
   */
  constructor(frames, sprite, startingFrame = 0) {
    this.frames = [];
    for (let i of frames) {
      let tempImage = new Image();
      tempImage.src = i;
      this.frames.push(tempImage);
    }
    this.sprite = sprite;
    this.onFrame = 0;
    this.maxFrames = this.frames.length;
    this.timer;
  }

  nextFrame() {
    if (this.onFrame >= this.maxFrames) {
      this.onFrame = 0;
    }
    this.onFrame++;
    if (this.onFrame > this.maxFrames) {
      this.onFrame = 0;
    }
    return this.frames[this.onFrame];
  }

  prevFrame() {
    if (this.onFrame <= 0) {
      this.onFrame = this.maxFrames;
    }
    this.onFrame--;
    return this.frames[this.onFrame];
  }

  /**
   * @param {number} tickspeed - How fast anim switches
   * @param {boolean} forward - Forward run or backward run
   */
  frameTick(tickspeed, ctx, forward = true) {
    (this.timer = setInterval(() => {
      if (forward) {
        frame = this.nextFrame();
        ctx.drawImage(
          frame,
          this.sprite.x,
          this.sprite.y,
          this.sprite.width,
          this.sprite.height
        );
      }
    })),
      tickspeed;
  }

  stopTick() {
    clearInterval(this.timer);
  }
}
/**
 * @param {object} object - Object to get state of
 */
function getState(object) {
  if (object.jumping) {
    return "jumping";
  }
  if (object.velX != 0) {
    if (object.velX > 0) {
      return ["running", "right"];
    }
    if (object.velX < 0) {
      return ["running", "left"];
    }
  }
  return "idle";
}

function drawImage(ctx, img, x, y, width, height, deg, flip, flop, center) {
  ctx.save();

  if (typeof width === "undefined") width = img.width;
  if (typeof height === "undefined") height = img.height;
  if (typeof center === "undefined") center = false;

  // Set rotation point to center of image, instead of top/left
  if (center) {
    x -= width / 2;
    y -= height / 2;
  }

  // Set the origin to the center of the image
  ctx.translate(x + width / 2, y + height / 2);

  // Rotate the canvas around the origin
  var rad = 2 * Math.PI - (deg * Math.PI) / 180;
  ctx.rotate(rad);

  // Flip/flop the canvas
  if (flip) flipScale = -1;
  else flipScale = 1;
  if (flop) flopScale = -1;
  else flopScale = 1;
  ctx.scale(flipScale, flopScale);

  // Draw the image
  ctx.drawImage(img, -width / 2, -height / 2, width, height);

  ctx.restore();
}

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
