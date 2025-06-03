import { identidad, traslacion } from "./mat4.js";
export class RedController {
    constructor(redLogic, redRender, mazeLogic, deltaTime) {
        this._redLogic = redLogic;
        this._redRender = redRender;
        this._mazeLogic = mazeLogic;
        this._deltaTime = deltaTime;
        this._countTime = 0;

        this._redLogic.x = this._mazeLogic.positionGhost[0];
        this._redLogic.y = this._mazeLogic.positionGhost[1];

        this._MatrizModelo = this._redRender.MatrizModelo;
        this._nextFrame = false;

    }

    update(deltaTime, positionPacman) {
        this._redLogic.bufferDirection = this.bestMove(this.optionsMove(), positionPacman);
        if (this._countTime >= this._deltaTime) {

            if (!this.checkCollision(this._redLogic.bufferDirection)) {
                this._redLogic.direction = this._redLogic.bufferDirection;
                this.checkPortal();
                this._redLogic.move();
            } else {
                if (!this.checkCollision(this._redLogic.direction)) {
                    this._redLogic.move();
                }
            }

            this._countTime = 0;
            this._nextFrame = true;
        } else {
            this._countTime += deltaTime;
        }
    }

    optionsMove() {

        const options = {
            up: this.checkCollision('up') || this._redLogic.direction === 'down',
            down: this.checkCollision('down') || this._redLogic.direction === 'up',
            left: this.checkCollision('left') || this._redLogic.direction === 'right',
            right: this.checkCollision('right') || this._redLogic.direction === 'left'
        };


        return options;
    }

    // distancia al cuadrado
    distanceToPacman(positionPacman, direction) {
        let distanceX = 0;
        let distanceY = 0;
        switch (direction) {
            case 'left':
                distanceX = Math.abs(this._redLogic.x - this._redLogic.speed - positionPacman[0]);
                distanceY = Math.abs(this._redLogic.y - positionPacman[1]);
                break;
            case 'right':
                distanceX = Math.abs(this._redLogic.x + this._redLogic.speed - positionPacman[0]);
                distanceY = Math.abs(this._redLogic.y - positionPacman[1]);
                break;
            case 'up':
                distanceX = Math.abs(this._redLogic.x - positionPacman[0]);
                distanceY = Math.abs(this._redLogic.y - this._redLogic.speed - positionPacman[1]);
                break;
            case 'down':
                distanceX = Math.abs(this._redLogic.x - positionPacman[0]);
                distanceY = Math.abs(this._redLogic.y + this._redLogic.speed - positionPacman[1]);
                break;
        }
        return distanceX ** 2 + distanceY ** 2;
    }

    bestMove(options, positionPacman) {
        const distances = {
            up: this.distanceToPacman(positionPacman, 'up'),
            down: this.distanceToPacman(positionPacman, 'down'),
            left: this.distanceToPacman(positionPacman, 'left'),
            right: this.distanceToPacman(positionPacman, 'right')
        };

        let bestMove = null;
        let bestDistance = Infinity;
        for (const option in options) {
            if (!options[option] && distances[option] < bestDistance) {
                bestDistance = distances[option];
                bestMove = option;
            }
        }


        return bestMove;
    }

    checkPortal() {
        switch (this._redLogic.direction) {
            case 'left':
                if (this._mazeLogic.portalL(this._redLogic.x - this._redLogic.speed, this._redLogic.y))
                    this._redLogic.x = this._mazeLogic.destinyPortalLeft.x;
            case 'right':
                if (this._mazeLogic.portalR(this._redLogic.x + this._redLogic.speed, this._redLogic.y))
                    this._redLogic.x = this._mazeLogic.destinyPortalRight.x;
        }
    }

    checkCollision(direction) {
        // console.log(this._redLogic.bufferDirection, this._redLogic.x, this._redLogic.y);
        switch (direction) {
            case 'up':
                return this._mazeLogic.colisionU(this._redLogic.x, this._redLogic.y - this._redLogic.speed);
            case 'down':
                return this._mazeLogic.colisionD(this._redLogic.x, this._redLogic.y + this._redLogic.speed);
            case 'left':
                return this._mazeLogic.colisionL(this._redLogic.x - this._redLogic.speed, this._redLogic.y);
            case 'right':
                return this._mazeLogic.colisionR(this._redLogic.x + this._redLogic.speed, this._redLogic.y);
        }

        return false;
    }

    render() {
        identidad(this._MatrizModelo);
        traslacion(this._MatrizModelo, this._redLogic.x, this._redLogic.y, 0);
        this._redRender.draw(this._redLogic.direction, this._nextFrame);
        this._nextFrame = false;
    }
}