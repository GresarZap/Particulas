import { identidad, traslacion } from "./mat4.js";
export class PacmanController {
    constructor(pacmanLogic, pacmanRender, mazeLogic, deltaTime) {
        this._pacmanLogic = pacmanLogic;
        this._pacmanRender = pacmanRender;
        this._mazeLogic = mazeLogic;
        this._deltaTime = deltaTime;
        this._countTime = 0;

        this._pacmanLogic.x = this._mazeLogic.positionStartAbsolute[0];
        this._pacmanLogic.y = this._mazeLogic.positionStartAbsolute[1];

        this._MatrizModelo = this._pacmanRender.MatrizModelo;
        this._nextFrame = false;

        this._listenerKeyboard();
    }

    update(deltaTime) {
        if (this._countTime >= this._deltaTime) {

            if (!this.checkCollision(this._pacmanLogic.bufferDirection)) {
                this._pacmanLogic.direction = this._pacmanLogic.bufferDirection;
                this.checkPortal();
                this._pacmanLogic.move();
            } else {
                if (!this.checkCollision(this._pacmanLogic.direction)) {
                    this._pacmanLogic.move();
                }
            }

            this._countTime = 0;
            this._nextFrame = true;
        } else {
            this._countTime += deltaTime;
        }
    }

    checkPortal() {
        switch (this._pacmanLogic.direction) {
            case 'left':
                if( this._mazeLogic.portalL(this._pacmanLogic.x - this._pacmanLogic.speed, this._pacmanLogic.y))
                    this._pacmanLogic.x= this._mazeLogic.destinyPortalLeft.x;
            case 'right':
                if( this._mazeLogic.portalR(this._pacmanLogic.x + this._pacmanLogic.speed, this._pacmanLogic.y))
                    this._pacmanLogic.x= this._mazeLogic.destinyPortalRight.x;
        }
    }

    checkCollision(direction) {
        switch (direction) {
            case 'up':
                return this._mazeLogic.colisionU(this._pacmanLogic.x, this._pacmanLogic.y - this._pacmanLogic.speed);
            case 'down':
                return this._mazeLogic.colisionD(this._pacmanLogic.x, this._pacmanLogic.y + this._pacmanLogic.speed);
            case 'left':
                return this._mazeLogic.colisionL(this._pacmanLogic.x - this._pacmanLogic.speed, this._pacmanLogic.y)
            case 'right':
                return this._mazeLogic.colisionR(this._pacmanLogic.x + this._pacmanLogic.speed, this._pacmanLogic.y);
        }

        return false;
    }

    render() {
        identidad(this._MatrizModelo);
        traslacion(this._MatrizModelo, this._pacmanLogic.x, this._pacmanLogic.y, 0);
        this._pacmanRender.draw(this._pacmanLogic.direction, this._nextFrame);
        this._nextFrame = false;
    }

    _listenerKeyboard() {
        window.addEventListener("keydown", this._handleKey);
    }

    start() {
        // identidad(this._pacmanRender.MatrizModelo);
        // traslacion(this._pacmanRender.MatrizModelo, this._pacmanLogic.x, this._pacmanLogic.y, 0);
        // this._pacmanRender.draw(this._pacmanLogic.direction, false);
    }

    _handleKey = (event) => {
        switch (event.key) {
            case "ArrowUp":
                this._pacmanLogic.bufferDirection = "up";
                break;
            case "ArrowDown":
                this._pacmanLogic.bufferDirection = "down";
                break;
            case "ArrowLeft":
                this._pacmanLogic.bufferDirection = "left";
                break;
            case "ArrowRight":
                this._pacmanLogic.bufferDirection = "right";
                break;
        }
    };

    getPacmanPosition() {
        return [this._pacmanLogic.x, this._pacmanLogic.y];
    }
}