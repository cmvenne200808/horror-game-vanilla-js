//@ts-check
import { GameObject } from "./game-objects/game-objects.js"; 
import { ctx, canvas } from "./canvas.js";

// /** @type {HTMLCanvasElement} */
// //@ts-ignore
// const canvas = document.getElementById("game-canvas");
// const ctx = canvas.getContext("2d");
// canvas.width = 800;
// canvas.height = 600;


class Player extends GameObject{
    constructor(barriers) {
        super(32, 32);
        // this.width = 32;
        // this.height = 32;
        this.x = (canvas.width / 2) - (this.width / 2);
        this.y = (canvas.height / 2) - (this.height / 2);
        this.fillStyle = "teal";

        this.isMovingUP = false;
        this.isMovingDown = false;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isSneaking = false;
        this.isRunning = false;

        this.baseSpeed = 3;
        this.barriers = barriers;

        this.wireupevents();
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

        switch(key) {
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
        }
    }

    update(elapsedTime) {
        let speedMultiplier = 1;

        if(this.isRunning && !this.isSneaking) {
            speedMultiplier = 2;
        } else if(this.isSneaking && !this.isRunning) {
            speedMultiplier = 0.5;
        }

        let speed = this.baseSpeed * speedMultiplier;

        if(this.isMovingUp) {
            this.y -= speed;
        }

        if(this.isMovingDown) {
            this.y += speed;
        }

        if(this.isMovingRight) {
            this.x += speed;
        }

        if(this.isMovingLeft) {
            this.x -= speed;
        }


        if(this.x + this.width >= canvas.width) {
            this.x = canvas.width - this.width;
        }
        if(this.x <= 0) {
            this.x = 0;
        }
        if(this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
        }
        if(this.y <= 0) {
            this.y = 0;
        }

        this.barriers.forEach((b) => {
            if(this.isColliding(b)) {
                let bounds = b.getBounds();

                if(player.isMovingDown) {
                    this.y = bounds.top - this.height;
                } else if(player.isMovingUp) {
                    this.y = bounds.bottom;
                }

                if(player.isMovingRight) {
                    this.x = bounds.left - this.width;
                } else if(player.isMovingLeft) {
                    this.x = bounds.right;
                }
            }

        })
    }

}

class Monster extends GameObject{
    constructor() {
        super(32, 32);
        this.fillStyle = "red";
        // this.width = 32;
        // this.height = 32;
        // this.x = 0;
        // this.y = 0;

        this.baseSpeed = 3;

        this.movement = {
            timeSinceLastUpdate: 0,
            timeToNextUpdate: 1000, // 1000 milliseconds = 1 second
            x: {
                direction: 1,
                speed: this.baseSpeed
            },
            y: {
                direction: 1,
                speed: this.baseSpeed
            },
        };
    }
    
    update(elapsedTime) {
        this.movement.timeSinceLastUpdate += elapsedTime;
        if(this.movement.timeSinceLastUpdate >= this.movement.timeToNextUpdate) {
            this.movement.x.direction = Math.random() >= 0.5 ? 1 : -1;
            this.movement.y.direction = Math.random() >= 0.5 ? 1 : -1;
            
            this.movement.x.speed = Math.random() * this.baseSpeed;
            this.movement.y.speed = Math.random() * this.baseSpeed;

            this.movement.timeToNextUpdate = Math.random() * 1000 + 500;
            this.movement.timeSinceLastUpdate =0;
        }

        if(this.x + this.width >= canvas.width) {
            this.movement.x.direction = -1;
        }
        if(this.x <= 0) {
            this.movement.x.direction = 1;
        }
        if(this.y + this.height >= canvas.height) {
            this.movement.y.direction = -1;
        }
        if(this.y <= 0) {
            this.movement.y.direction = 1;
        }

        this.x += this.movement.x.speed * this.movement.x.direction
        this.y += this.movement.y.speed * this.movement.y.direction
    }

}

class Barrier extends GameObject{
    constructor(x, y, w, h) {
        super(w,h);
        this.x = x;
        this.y = y;
        this.fillStyle = "black"

    }

}

class Game {
    constructor(gameObjecets) {
        this.gameObjecets = gameObjects;
    }

    checkForCollisions() {
        this.gameObjecets.forEach(o => {
            console.log(typeof(o));
        });
    }
}

let b1 = new Barrier(600, 300, 32, 32 * 3);
let barriers = [b1];

let player = new Player(barriers);
let m1 = new Monster();

let gameObjects = [player, m1, ...barriers];

let game = new Game(gameObjects);

let currentTime = 0;

let spawnMonster = 0;
const monsterSpawnRate = 1000;

function gameloop(timestamp) {
    // console.log(timestamp);
    // clear off the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let elapsedTime = Math.floor(timestamp - currentTime);
    currentTime = timestamp;

    // spawnMonster += elapsedTime;
    // if(spawnMonster >= 10000) {
    //     gameObjects.push(new Monster());
    //     spawnMonster = 0;
    // }

    game.checkForCollisions();

    gameObjects.forEach((o) => {
        o.update(elapsedTime);
        o.render();
    });

    requestAnimationFrame(gameloop);
}


requestAnimationFrame(gameloop);
