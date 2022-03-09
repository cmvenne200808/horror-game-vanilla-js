//@ts-check

import { GameObject } from "./game-objects.js";

export class Door extends GameObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {boolean} isVertical
     */
    constructor(x, y, isVertical){
        let width = isVertical ? 16 : 48;
        let height = isVertical ? 48 : 16;
        let adjustX = isVertical ? x : x - 16;
        let adjustY = isVertical ? y - 16 : y;

        super(width, height, adjustX, adjustY);
        this.fillStyle = "brown";
        this.isOpen = false;
        this.isLocked = true;
    }

    render() {
        // if I am open, don't render the door
        if(this.isOpen) return;
        // otherwise do the normal thing
        super.render();
    }

}