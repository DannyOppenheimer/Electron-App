var keysPressed = new Array('256');

document.addEventListener('keydown', e => {
	keysPressed[e.keyCode] = true;
});
document.addEventListener('keyup', e => {
	keysPressed[e.keyCode] = false;
});

document.addEventListener('DOMContentLoaded', () => {
	let canvas = document.getElementById('main_game_window');
	let player = new Player(0, 0, 30, 50);

	// start event tick
	setInterval(() => {
		let ctx = drawCanvas(canvas);
		let floor = drawFloor(ctx, canvas);
		drawPlayer(ctx, canvas, player, floor);
	}, 10);
});

function drawCanvas(canvas) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 7;
	var ctx = canvas.getContext('2d');
	rect = new Rectangle(0, 0, canvas.width, canvas.height);
	ctx.fillRect(rect.x, rect.y, canvas.width, canvas.height);
	return ctx;
}

function drawFloor(ctx, canvas) {
	ctx.fillStyle = '#FF0000';
	floorRect = new Rectangle(0, canvas.height, canvas.width, - 100);
	ctx.fillRect(floorRect.x, floorRect.y, floorRect.width, floorRect.height);
	return floorRect;
}

function drawPlayer(ctx, canvas, player, floor) {
	if (player.velY != -2) {
		player.velY = 2;
	}

	if (keysPressed[65] == true) {
		player.hitbox.x--;
	}
	if (keysPressed[87] == true) {
		player.jump();
	}
	if (keysPressed[83] == true) {
	}
	if (keysPressed[68] == true) {
		player.hitbox.x++;
	}

	player.belowCoords(canvas.height - 100);

	ctx.fillStyle = '#FFFFFF';
	player.hitbox.x += player.velX;
	player.hitbox.y += player.velY;
	ctx.fillRect(player.hitbox.x, player.hitbox.y, player.hitbox.width, player.hitbox.height);
}

class Player {
	constructor(x, y, width, height) {
		this.hitbox = new Rectangle(x, y, width, height);
		this.velY = 0;
		this.velX = 0;
	}

	jump() {
		this.velY = -2;
		setTimeout(() => {
			this.velY = 0;
		}, 1000);
	}

	belowCoords(y) {
		// alert("y " + y)
		// alert("this y " + this.hitbox.y)
		if(y < (this.hitbox.y + this.hitbox.height) ) {
			this.velY = 0;
		}
	}

	collision(rect) {
		if (this.hitbox.intersects(rect)) {
			thix.velY = 0;
		}
	}
}

class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	intersects(rect2) {
		if (this.x < rect2.x + rect2.width && this.x + this.width > rect2.x && this.y < rect2.y + rect2.height && this.y + this.height > rect2.y) {
			return true;
		}
		return false;
	}
}
