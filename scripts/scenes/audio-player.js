/** @type {HTMLAudioElement} */
let pickupKey = document.getElementById("pickup-key");
let creakyDoor = document.getElementById("door-creaking");
let screaming = document.getElementById("scream");
let teleport = document.getElementById("next-level");
let winGame = document.getElementById("beat-game");
let musicLow = document.getElementById("Low");
let musicMed = document.getElementById("Medium");
let musicHigh1 = document.getElementById("High1");
let musicHigh2 = document.getElementById("High2");

//@ts-check
export class AudioPlayer {
	constructor() {
		this.ctx = new AudioContext();

		this.currentLoop = 0;
		this.loops = [musicLow, musicMed, musicHigh1, musicHigh2];
	}

	init() {
		if (this.ctx.state === "suspended") {
			this.ctx.resume();
		}
	}

	/** @param {HTMLAudioElement} loop */
	wireUpNextMusicLoop(loop) {
		loop.addEventListener(
			"ended",
			() => {
				this.currentLoop++;
				if (this.currentLoop === this.loops.length) {
					this.currentLoop -= 2;
				}

				let loopToPlay = this.loops[this.currentLoop];
				loopToPlay.play();
				this.wireUpNextMusicLoop(loopToPlay);
			},
			{ once: true }
		);
	}

	pickupKey() {
		pickupKey.play();
	}

	creakyDoor() {
		creakyDoor.play();
	}

	screaming() {
		screaming.play();
	}

	teleport() {
		teleport.play();
	}

	winGame() {
		winGame.play();
	}

	playMusic() {
		this.currentLoop = 0;
		let loopToPlay = this.loops[this.currentLoop];
		loopToPlay.play();
		this.wireUpNextMusicLoop(loopToPlay);
	}
}
