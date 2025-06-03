export class CharacterLogic {
    constructor({ width, height, x, y, speed }) {
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;
        this._speed = speed;
        this._state = 'alive';

        console.log(this._width, this._height, this._x, this._y, this._speed);
    }

    move(x, y) {
        this._x += x * this._speed;
        this._y += y * this._speed;
    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }

    get speed() {
        return this._speed;
    }

    set x(x) {
        this._x = x;
    }
    set y(y) {
        this._y = y;
    }

}