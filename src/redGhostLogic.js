import { CharacterLogic } from "./characterLogic.js";

export class RedGhostLogic extends CharacterLogic{
    constructor({ width, height, x, y, speed, direction }) {
        super({ width, height, x, y, speed });
        this._direction = direction;
        this._bufferDirection = direction;
        this._speed = speed;
    }

    move() {
        switch (this._direction) {
            case 'up':
                this._y -= this._speed;
                break;
            case 'down':
                this._y += this._speed;
                break;
            case 'left':
                this._x -= this._speed;
                break;
            case 'right':
                this._x += this._speed;
                break;
        }
    }

    nextMove(direction) {
        switch (direction) {
            case 'up':
                return [this._x, this._y - this._speed];
            case 'down':
                return [this._x, this._y + this._speed];
            case 'left':
                return [this._x - this._speed, this._y];
            case 'right':
                return [this._x + this._speed, this._y];
        }
    }

    set direction(direction) {
        this._direction = direction;
    }

    get direction() {
        return this._direction;
    }

    get bufferDirection() {
        return this._bufferDirection;
    }

    set bufferDirection(bufferDirection) {
        this._bufferDirection = bufferDirection;
    }
}