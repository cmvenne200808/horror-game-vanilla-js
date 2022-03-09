//@ts-check

import { canvas, ctx } from "../canvas.js";
import { Game } from "../game-objects/game.js";
import { GameObject } from "../game-objects/game-objects.js";

export class StartScene extends GameObject {
	/**
	 * @param {Game} game
	 */
	constructor(game) {
		super(canvas.width, canvas.height, 0, 0);
		this.fillStyle = "black";

		this.textGradient = ctx.createLinearGradient(
			0,
			canvas.height / 2 - 40,
			0,
			canvas.height / 2 + 15
		);
		this.textGradient.addColorStop(0, "green");
		this.textGradient.addColorStop(1, "purple");

		this.game = game;

		canvas.addEventListener(
			"click",
			() => {
				this.game.start();
			},
			{ once: true }
		);
	}

	render() {
		super.render();

		ctx.save();
		ctx.fillStyle = this.textGradient;
		ctx.font = "80px zombiecontrol";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(
			"Click To Begin Game",
			canvas.width / 2,
			canvas.height / 2
		);
		ctx.restore();
	}
}
