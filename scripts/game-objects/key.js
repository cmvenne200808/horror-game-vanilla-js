//@ts-check

import { GameObject } from "./game-objects.js"; 

export class Key extends GameObject {
    constructor(x, y) {
        super(16, 8, x, y);
        this.fillStyle = "yellow";
        this.isPickedUp = false;

    }

    render() {
        // If I am picked up, return and don't draw anything
        if(this.isPickedUp) return;
        // otherwise do normal render
        super.render();
    }
}
