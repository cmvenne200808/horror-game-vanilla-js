//@ts-check

import { GameObject } from "./game-objects.js";
import { Game } from "./game.js";

export class Exit extends GameObject {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {Game} [game]
	 */
	constructor(x, y, game) {
		super(48, 16, x, y);
		this.game = game;

		this.hue = 206;
		this.setFillStyle();
	}

	setFillStyle() {
		if (this.hue > 291) this.hue = 206;
		this.hue += 1;
		this.fillStyle = `hsla(${this.hue}, 100%, 50%, 1)`;
	}

	update(elapsedTime) {
		if (this.isColliding(this.game.player)) {
			this.game.isPlayerWin = true;
		}
		this.setFillStyle();
	}
}
