import { RectangleTexture } from "./rentangleTexture.js";

export class CharacterRender {
    constructor(contentConfig, codeTextures, renderConfig) {
        this._x = contentConfig.h;
        this._y = contentConfig.k;
        this._left = this._initializeSpriteTexture(contentConfig, renderConfig, codeTextures.codeTLeft);
        this._right = this._initializeSpriteTexture(contentConfig, renderConfig, codeTextures.codeTRight);
        this._up = this._initializeSpriteTexture(contentConfig, renderConfig, codeTextures.codeTUp);
        this._down = this._initializeSpriteTexture(contentConfig, renderConfig, codeTextures.codeTDown);
        this._MatrizModelo = renderConfig.MatrizModelo;
    }

    _initializeSpriteTexture(contentConfig, renderConfig, textureCode) {

        const setupSprite = {
            textureCode:textureCode,
            spriteSheetWidth: contentConfig.spriteSheetWidth,
            spriteHeight: contentConfig.spriteHeight
        };

        return new RectangleTexture(contentConfig.width, contentConfig.height, contentConfig.h, contentConfig.k, renderConfig, setupSprite);
    }

    draw(direction, nextFrame = false) {
        switch (direction) {
            case 'up':
                this._up.draw(nextFrame);
                break;
            case 'down':
                this._down.draw(nextFrame);
                break;
            case 'left':
                this._left.draw(nextFrame);
                break;
            case 'right':
                this._right.draw(nextFrame);
                break;
        }
    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }

    get MatrizModelo() {
        return this._MatrizModelo;
    }
}