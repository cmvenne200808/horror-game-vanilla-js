//@ts-check
import { GameObject, Location } from "./game-objects.js";
import { canvas, ctx } from "../canvas.js";
import { Game } from "./game.js";

export class Player extends GameObject {
	/**
	 * @param {Game} game
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(game, x, y) {
		super(32, 32, x, y);

		this.isMovingUP = false;
		this.isMovingDown = false;
		this.isMovingLeft = false;
		this.isMovingRight = false;
		this.isSneaking = false;
		this.isRunning = false;

		this.baseSpeed = 3;
		// this.barriers = game.barriers;
		this.game = game;
		this.isSmall = false;
		this.isBig = false;
		this.isBug = false;
		this.isTeleport = false;
		this.inventory = [];

		this.wireupevents();

		this.hue = 0;
		this.setFillStyle();
	}

	setFillStyle() {
		if (this.hue > 360) this.hue = 0;
		this.hue += 4;
		this.fillStyle = `hsla(${this.hue}, 100%, 50%, 1)`;
	}

	wireupevents() {
		window.addEventListener("keydown", (e) => {
			// console.log(e.key);
			this.toggleMovement(e.key, true);
		});

		window.addEventListener("keyup", (e) => {
			// console.log(e.key);
			this.toggleMovement(e.key, false);
		});
	}

	toggleMovement(key, toggleValue) {
		console.log(key);

		switch (key) {
			case "ArrowUp":
			case "w":
				this.isMovingUp = toggleValue;
				break;
			case "ArrowDown":
			case "s":
				this.isMovingDown = toggleValue;
				break;
			case "ArrowLeft":
			case "a":
				this.isMovingLeft = toggleValue;
				break;
			case "ArrowRight":
			case "d":
				this.isMovingRight = toggleValue;
				break;
			case "q":
				this.isSneaking = toggleValue;
				break;
			case "Shift":
				this.isRunning = toggleValue;
				break;
			case "x":
				if (toggleValue) this.isSmall = !this.isSmall;
				break;
			case "v":
				if (toggleValue) this.isBig = !this.isBig;
				break;
			case "z":
				if (toggleValue) this.isTeleport = !this.isTeleport;
				break;
			case "c":
				if (toggleValue) this.isBug = !this.isBug;
		}
	}

	update(elapsedTime) {
		let speedMultiplier = 1;

		if (!this.isSmall) {
			speedMultiplier = 1;
			this.height = 32;
			this.width = 32;
		}

		if (!this.isBig) {
			speedMultiplier = 1;
			this.height = 32;
			this.width = 32;
		}

		if (!this.isTeleport) {
			speedMultiplier = 1;
			this.height = 32;
			this.width = 32;
		}

		if (!this.isBug) {
			speedMultiplier = 1;
			this.height = 32;
			this.width = 32;
		}

		if (this.isRunning && !this.isSneaking) {
			speedMultiplier = 2;
		} else if (this.isSneaking && !this.isRunning) {
			speedMultiplier = 0.5;
		}

		if (this.isSmall) {
			speedMultiplier = 2;
			this.height = 12;
			this.width = 12;
		}

		if (this.isBig) {
			speedMultiplier = 0.5;
			this.height = 68;
			this.width = 68;
		}

		if (this.isTeleport) {
			speedMultiplier = 100;
			this.height = 24;
			this.width = 24;
		}

		if (this.isBug) {
			speedMultiplier = 0.5;
			this.height = 6;
			this.width = 6;
		}

		let speed = this.baseSpeed * speedMultiplier;

		if (this.isMovingUp) {
			this.y -= speed;
		}

		if (this.isMovingDown) {
			this.y += speed;
		}

		if (this.isMovingRight) {
			this.x += speed;
		}

		if (this.isMovingLeft) {
			this.x -= speed;
		}

		if (this.x + this.width >= canvas.width) {
			this.x = canvas.width - this.width;
		}
		if (this.x <= 0) {
			this.x = 0;
		}
		if (this.y + this.height >= canvas.height) {
			this.y = canvas.height - this.height;
		}
		if (this.y <= 0) {
			this.y = 0;
		}

		this.game.barriers.forEach((b) => {
			if (b.isOpen) return;

			let safeLocation = this.isColliding(b);

			if (safeLocation && b.isLocked && this.inventory.length) {
				// removes the last key picked up
				this.inventory.pop();
				// unlock the door
				this.game.audioPlayer.creakyDoor();
				b.isLocked = false;
				b.isOpen = true;
				// bail out
				return;
			}

			if (safeLocation) {
				this.x = safeLocation.x;
				this.y = safeLocation.y;
			}
		});

		this.game.keys
			.filter((k) => !k.isPickedUp)
			.forEach((k) => {
				if (this.isColliding(k)) {
					this.game.audioPlayer.pickupKey();
					this.inventory.push(k);
					k.isPickedUp = true;
				}
			});

		super.update(elapsedTime);

		this.setFillStyle();
	}
}
