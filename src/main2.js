import { iniWebgl, creaShader, vinculaShader, background, proyeccion, variablesUniform, leeLaTextura } from "../utils/gl_utils.js";
import { Maze } from "./laberint.js";
import { identidad, rotacionZ, traslacion, escalacion } from "./mat4.js";
import { PacmanLogic } from "./pacmanLogic.js";
import { CharacterRender } from "./characterRender.js";
import { PacmanController } from "./pacmanController.js";
import { RectangleTexture } from "./rentangleTexture.js";
import { RedGhostLogic } from "./redGhostLogic.js";
import { RedController } from "./redController.js";

let gl;
let shader;
let programaID;
let bg;
let polvo;
let polvo2;
let MatrizProyeccion = new Array(16);
let uMatrizProyeccion;
let MatrizModelo = new Array(16);
identidad(MatrizModelo);
let uMatrizModelo;
let MatrizVista = new Array(16);
identidad(MatrizVista);
let uMatrizVista;
let MatrizTextura = new Array(16);
identidad(MatrizTextura);
let uMatrizTextura;
let uUnidadDeTextura;
let codigoTBg;
let codeTRight;
let codeTLeft;
let codeTDown;
let codeTUp;
let laberinto;
let pacmanController;
let ghostRedController;
let uAlpha = 1;

async function main() {
    gl = iniWebgl();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    shader = await creaShader(gl);
    programaID = vinculaShader(gl, shader[0], shader[1]);
    // background(gl, [0, 0, 0, 1]);
    proyeccion(gl, programaID, 0, 816, 960, 0, -1, 1);
    let uniform = variablesUniform(gl, programaID);
    uAlpha = uniform.uAlpha;

    let renderConfig = {
        ...uniform,
        gl: gl,
        programaID: programaID,
        MatrizProyeccion: MatrizProyeccion,
        MatrizModelo: MatrizModelo,
        MatrizVista: MatrizVista,
        MatrizTextura: MatrizTextura,
    };

    codeTRight = gl.createTexture();
    leeLaTextura(gl, "right-48x48", codeTRight);

    codeTLeft = gl.createTexture();
    leeLaTextura(gl, "left-48x48", codeTLeft);

    codeTUp = gl.createTexture();
    leeLaTextura(gl, "up-48x48", codeTUp);

    codeTDown = gl.createTexture();
    leeLaTextura(gl, "down-48x48", codeTDown);

    const spriteMoves = {
        codeTRight,
        codeTLeft,
        codeTUp,
        codeTDown,
    }

    const initialConfig = {
        spriteSheetWidth: 144,
        spriteHeight: 48,
        width: 48,
        height: 48,
        h: 0,
        k: 0,
    }


    codigoTBg = gl.createTexture();
    leeLaTextura(gl, "map-816x960", codigoTBg);
    bg = new RectangleTexture(816, 960, 408, 480, renderConfig, { textureCode: codigoTBg });

    const mazeLogic = new Maze(816, 960, 48);

    const pacmanRender = new CharacterRender(initialConfig, spriteMoves, renderConfig);
    const pacmanLogic = new PacmanLogic({ width: 48, height: 48, x: 0, y: 0, speed: 5, direction: 'right' });
    pacmanController = new PacmanController(pacmanLogic, pacmanRender, mazeLogic, 0.04);


    const codeTRightRed = gl.createTexture();
    leeLaTextura(gl, "red-right-48x48", codeTRightRed);

    const codeTLeftRed = gl.createTexture();
    leeLaTextura(gl, "red-left-48x48", codeTLeftRed);

    const codeTUpRed = gl.createTexture();
    leeLaTextura(gl, "red-up-48x48", codeTUpRed);

    const codeTDownRed = gl.createTexture();
    leeLaTextura(gl, "red-down-48x48", codeTDownRed);

    const spriteMovesRed = {
        codeTRight: codeTRightRed,
        codeTLeft: codeTLeftRed,
        codeTUp: codeTUpRed,
        codeTDown: codeTDownRed,
    }

    const initialConfigRed = {
        spriteSheetWidth: 96,
        spriteHeight: 48,
        width: 48,
        height: 48,
        h: 0,
        k: 0,
    }

    const ghostRedRender = new CharacterRender(initialConfigRed, spriteMovesRed, renderConfig);
    const ghostRedLogic = new RedGhostLogic({ width: 48, height: 48, x: 0, y: 0, speed: 5, direction: 'right' });
    ghostRedController = new RedController(ghostRedLogic, ghostRedRender, mazeLogic, 0.05);

    const codeTpolvo = gl.createTexture();
    leeLaTextura(gl, "polvo-48x48", codeTpolvo);
    polvo = new RectangleTexture(12, 12, 0, 0, renderConfig, { textureCode: codeTpolvo });
    const codeTpolvo2 = gl.createTexture();
    leeLaTextura(gl, "polvo-48x48", codeTpolvo2);
    polvo2 = new RectangleTexture(12, 12, 0, 0, renderConfig, { textureCode: codeTpolvo2 });


    pacmanPosition = pacmanController.getPacmanPosition();

    requestAnimationFrame(gameLoop);

}

let lastTime = 0;
let pacmanPosition;
let transcurridoP = 0;

let particulas = [];


function gameLoop(currentTime) {
    gl.uniform1f(uAlpha, 1);
    background(gl, [0, 0, 0, 1]);
    identidad(MatrizModelo);
    identidad(MatrizTextura);
    traslacion(MatrizModelo, 0, 0, 0);
    bg.draw(false);

    if (!lastTime) lastTime = currentTime;
    const deltaTime = (currentTime - lastTime) / 1000; // en segundos
    lastTime = currentTime;

    // Agregar nueva partícula cada cierto tiempo
    transcurridoP += deltaTime;
    if (transcurridoP > 0.08) {
        pacmanPosition = pacmanController.getPacmanPosition();
        particulas.push(new Particula(pacmanPosition));
        transcurridoP = 0;
    }

    // Actualizar y dibujar partículas
    for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];
        p.actualizar(deltaTime);
        p.dibujar(gl, MatrizModelo, polvo, uAlpha);
        if (!p.estaViva()) {
            particulas.splice(i, 1);
        }
    }


    gl.uniform1f(uAlpha, 1);

    pacmanController.update(deltaTime);
    pacmanController.render();

    ghostRedController.update(deltaTime, pacmanController.getPacmanPosition());
    ghostRedController.render();



    requestAnimationFrame(gameLoop);
}

class Particula {
    constructor(pos) {
        this.pos = [...pos];
        this.alfa = 1;
        this.tam = 1;
        this.rot = 0;
        this.vida = 0;
    }

    actualizar(dt) {
        this.vida += dt;
        this.alfa -= 0.7 * dt;   // en lugar de 0.01 por frame
        this.tam += 2 * dt;      // en lugar de 0.04 por frame
        this.rot += 180 * dt;    // en lugar de 1 por frame (180 grados por segundo)
    }

    estaViva() {
        return this.alfa > 0;
    }

    dibujar(gl, MatrizModelo, polvo, uAlpha) {
        gl.uniform1f(uAlpha, this.alfa);

        identidad(MatrizModelo);
        traslacion(MatrizModelo, this.pos[0], this.pos[1] + 18, 0);
        rotacionZ(MatrizModelo, -this.rot);
        escalacion(MatrizModelo, this.tam, this.tam, 1);

        polvo.draw(false);
    }
}


// eventos touch para dispositivos moviles

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) pacman.direction = 'right';
        else if (deltaX < -50) pacman.direction = 'left';
    } else {
        if (deltaY > 50) pacman.direction = 'down';
        else if (deltaY < -50) pacman.direction = 'up';
    }
}



window.onload = main;