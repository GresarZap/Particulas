export class Maze {
    constructor(width, height, cellSize) {
        this._width = width;
        this._height = height;
        this._cellSize = cellSize;
        this._positionStartRelative = {
            x: 8,
            y: 18
        };
        this._positionStartAbsolute = [
            this._cellSize / 2 + this._positionStartRelative.x * this._cellSize,
            this._cellSize / 2 + this._positionStartRelative.y * this._cellSize
        ];

        this._destinyPortalLeft = {
            x: this._cellSize / 2 + 16.9 * this._cellSize,
            y: this._cellSize / 2 + 8 * this._cellSize
        }

        this._destinyPortalRight = {
            x: this._cellSize / 2 + -1 * this._cellSize,
            y: this._cellSize / 2 + 8 * this._cellSize
        }

        this._positionGhost = [
            this._cellSize / 2 + 1 * this._cellSize,
            this._cellSize / 2 + 18 * this._cellSize
        ]

        this._hitBox = (cellSize / 2) - 2.5;

        this.tiles = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],//0
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],//1
            [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1],//2
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//3
            [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],//4
            [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],//5
            [1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1],//6
            [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],//7
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],//8
            [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],//9
            [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],//10
            [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],//11
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],//12
            [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1],//13
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],//14
            [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],//15
            [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],//16
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],//17
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//18
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],//19
            //0,1,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16
        ]
    }

    colisionR(x, y) {
        let i = Math.floor((y - this._hitBox) / this._cellSize);
        let j = Math.floor((x + this._hitBox) / this._cellSize);
        // console.log(i, j);
        if (this.tiles[i][j] == 1)
            return true;

        i = Math.floor((y + this._hitBox) / this._cellSize);
        // console.log(i, j);
        if (this.tiles[i][j] == 1)
            return true;

        return false;
    }

    colisionL(x, y) {
        let i = Math.floor((y - this._hitBox) / this._cellSize);
        let j = Math.floor((x - this._hitBox) / this._cellSize);
        // console.log(i, j);
        if (this.tiles[i][j] == 1)
            return true;

        i = Math.floor((y + this._hitBox) / this._cellSize);
        // console.log(i, j);
        if (this.tiles[i][j] == 1)
            return true;

        return false;
    }

    colisionU(x, y) {
        let i = Math.floor((y - this._hitBox) / this._cellSize);
        let j = Math.floor((x - this._hitBox) / this._cellSize);
        // console.log(i, j);
        if (this.tiles[i][j] == 1 || this.tiles[i][j] == undefined)
            return true;

        j = Math.floor((x + this._hitBox) / this._cellSize);
        // console.log(i, j);
        if (this.tiles[i][j] == 1)
            return true;

        return false;
    }

    colisionD(x, y) {
        let i = Math.floor((y + this._hitBox) / this._cellSize);
        let j = Math.floor((x - this._hitBox) / this._cellSize);

        if (j < -2 || j > 18) return true;
        if(j < 0) return true;
        if (this.tiles[i][j] == 1 || this.tiles[i][j] == undefined)
            return true;

        j = Math.floor((x + this._hitBox) / this._cellSize);
        // console.log(i, j);
        if (this.tiles[i][j] == 1)
            return true;

        return false;
    }

    portalL(x, y) {
        let i = Math.floor((y - this._hitBox) / this._cellSize);
        let j = Math.floor((x - this._hitBox) / this._cellSize);
        if (j == -2)
            return true;

        return false;
    }

    portalR(x, y) {
        let i = Math.floor((y - this._hitBox) / this._cellSize);
        let j = Math.floor((x + this._hitBox) / this._cellSize);
        // console.log(i, j);
        if (j == 18)
            return true;

        return false;
    }

    get positionStartRelative() {
        return this._positionStartRelative;
    }
    get positionStartAbsolute() {
        return this._positionStartAbsolute;
    }

    get destinyPortalLeft() {
        return this._destinyPortalLeft;
    }

    get destinyPortalRight() {
        return this._destinyPortalRight;
    }
    get positionGhost() {
        return this._positionGhost;
    }
}