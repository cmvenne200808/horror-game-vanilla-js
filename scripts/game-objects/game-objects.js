//@ts-check
import { ctx } from "../canvas.js";

export class GameObject {
    constructor(w, h) {
        this.x = 0;
        this.y = 0;
        this.width = w;
        this.height = h;
        this.fillStyle = "";
    }

    update(elapsedTime) {}
    render() {
        ctx.save();
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    getBounds() {
        return new ObjectBounds(this.x, this.y, this.width, this.height);
    }

    /**
     * @param { GameObject } o
     */
    isColliding(o) {
        let myBounds = this.getBounds();
        let obounds = o.getBounds();

        if(myBounds.bottom <= obounds.top) return false;
        if(myBounds.top >= obounds.bottom) return false;
        if(myBounds.right <= obounds.left) return false;
        if(myBounds.left >= obounds.right) return false;
        return true;
        
    }
}

class ObjectBounds {
    constructor(x, y, w, h) {
        this.top = y;
        this.bottom = y + h;
        this.left = x;
        this.right = x + w;
    }
}
