//@ts-check

import { Barrier } from "./barrier.js";
import { Door } from "./door.js";
import { Key } from "./key.js";
import { Monster } from "./monster.js";
import { Player } from "./player.js";
import { Exit } from "./escape.js";
import { level1, level2, level3, level4 } from "../level.js";
import { canvas, ctx } from "../canvas.js";
import { StartScene } from "../scenes/start.js";
import { GameOverScene } from "../scenes/game-over.js";
import { GameWinScene } from "../scenes/game-win.js";
import { AudioPlayer } from "../scenes/audio-player.js";

export class Game {
	constructor() {
		this.player = undefined;
		this.barriers = [];
		this.monsters = [];
		this.keys = [];
		this.exit = [];
		this.gameObjects = [];

		this.isPlayerDead = false;
		this.isPlayerWin = false;

		this.levels = [level1, level2, level3, level4];
		this.currentLevel = 0;

		this.currentTime = 0;

		this.audioPlayer = new AudioPlayer();
	}

	init() {
		let start = new StartScene(this);
		this.gameObjects.push(start);
		requestAnimationFrame(gameloop);
	}

	resetGame() {
		// re-init game stuff
		this.player = undefined;
		this.barriers = [];
		this.monsters = [];
		this.keys = [];
		this.exit = [];
		this.gameObjects = [];

		this.isPlayerDead = false;
		this.isPlayerWin = false;
	}

	start() {
		this.audioPlayer.init();
		this.audioPlayer.playMusic();
		this.currentLevel = 0;
		this.loadLevel();
	}

	restart() {
		this.resetGame();
		this.start();
	}

	gameOverLose() {
		this.audioPlayer.screaming();
		let gameOver = new GameOverScene(this);
		this.gameObjects = [gameOver];
	}

	gameOverWin() {
		this.audioPlayer.winGame();
		let win = new GameWinScene(this);
		this.gameObjects = [win];
	}
	nextLevel() {
		this.audioPlayer.teleport();
		this.resetGame();
		this.currentLevel++;

		if (this.currentLevel < this.levels.length) {
			this.loadLevel();
		} else {
			this.gameOverWin();
		}
	}

	loadLevel() {
		let level = this.levels[this.currentLevel];

		let monsterCords = [];
		let playerCords = { x: 0, y: 0 };

		level.forEach((row, idx) => {
			for (let col = 0; col < row.length; col++) {
				let x = col * 16;
				let y = idx * 16;

				switch (row[col]) {
					case "w":
						this.barriers.push(new Barrier(x, y, 16, 16));
						break;
					case "m":
						// set x and y properties for monster
						monsterCords.push({ x: x, y: y });
						break;
					case "p":
						// set x and y cordinates for player
						playerCords = { x: x, y: y };
						break;
					case "k":
						this.keys.push(new Key(x, y));
						break;
					case "d":
						this.barriers.push(new Door(x, y, true));
						break;
					case "D":
						this.barriers.push(new Door(x, y, false));
						break;
					case "x":
						this.exit.push(new Exit(x, y, this));
						break;
				}
			}
		});

		monsterCords.forEach((c) => {
			this.monsters.push(new Monster(this, c.x, c.y));
		});

		this.player = new Player(this, playerCords.x, playerCords.y);

		this.gameObjects = [
			game.player,
			...game.monsters,
			...game.barriers,
			...game.keys,
			...game.exit,
		];

		return {
			player: this.player,
			monsters: this.monsters,
			barriers: this.barriers,
			keys: this.keys,
		};
	}
}

export let game = new Game();

function gameloop(timestamp) {
	// clear off the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (game.isPlayerWin) {
		game.nextLevel();
	}
	if (game.isPlayerDead) {
		game.gameOverLose();
	}

	let elapsedTime = Math.floor(timestamp - game.currentTime);
	game.currentTime = timestamp;

	game.gameObjects.forEach((o) => {
		o.update(elapsedTime);
		o.render();
	});

	requestAnimationFrame(gameloop);
}
