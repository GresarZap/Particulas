import { iniWebgl, creaShader, vinculaShader, background, proyeccion, variablesUniform, leeLaTextura } from "../utils/gl_utils.js";
import { Circulo } from "./circulo.js";
import { Maze } from "./laberint.js";
import { identidad, rotacionZ, traslacion } from "./mat4.js";
import { Pacman } from "./pacman.js";
import { RectangleTexture } from "./rectangulo_t.js";

let gl;
let shader;
let programaID;
let bg;
let pacmanR;
let pacmanL;
let pacmanU;
let pacmanD;
let triangulo;
let uColor;
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
let codigoTRight;
let codigoTDown;
let codigoTUp;

let pacman;
let laberinto;

async function main() {
    gl = iniWebgl();

    shader = await creaShader(gl);
    programaID = vinculaShader(gl, shader[0], shader[1]);
    background(gl, [0, 0, 0, 0]);
    proyeccion(gl, programaID, 0, 816, 960, 0, -1, 1);
    let uniform = variablesUniform(gl, programaID);

    let config = {
        ...uniform,
        gl: gl,
        programaID: programaID,
        MatrizProyeccion: MatrizProyeccion,
        MatrizModelo: MatrizModelo,
        MatrizVista: MatrizVista,
        MatrizTextura: MatrizTextura,
    };

    codigoTBg = gl.createTexture();
    leeLaTextura(gl, "map-816x960", codigoTBg);
    bg = new RectangleTexture(816, 960, 408, 480, config, codigoTBg);

    codigoTRight = gl.createTexture();
    leeLaTextura(gl, "right-48x48", codigoTRight);
    pacmanR = new RectangleTexture(48, 48, 0, 0, config, codigoTRight);
    pacmanR.spriteSheetW = 144;
    pacmanR.nroSprites = 3;

    codigoTLeft = gl.createTexture();
    leeLaTextura(gl, "left-48x48", codigoTLeft);
    pacmanL = new RectangleTexture(48, 48, 0, 0, config, codigoTUp);
    pacmanL.spriteSheetW = 144;
    pacmanL.nroSprites = 3;

    codigoTUp = gl.createTexture();
    leeLaTextura(gl, "up-48x48", codigoTUp);
    pacmanU = new RectangleTexture(48, 48, 0, 0, config, codigoTUp);
    pacmanU.spriteSheetW = 144;
    pacmanU.nroSprites = 3;

    codigoTDown = gl.createTexture();
    leeLaTextura(gl, "down-48x48", codigoTDown);
    pacmanD = new RectangleTexture(48, 48, 0, 0, config, codigoTDown);
    pacmanD.spriteSheetW = 144;
    pacmanD.nroSprites = 3;


    let confPacman = {
        width: 48,
        height: 48,
        x: 408,
        y: 888,
        direction: 'right', // 0: up, 1: right, 2: down, 3: left
        speed: 2,
    }

    pacman = new Pacman(confPacman);
    laberinto = new Maze(816, 960, 48);

    animation();
}

let timeSprite = 0;
let speed = 0.3;
let nextSprite = 1;


function animation() {
    background(gl, [0, 0, 0, 0]);
    identidad(MatrizVista);


    identidad(MatrizTextura);
    traslacion(MatrizTextura, 0, 0, 0)
    identidad(MatrizModelo);
    bg.draw(gl);

    identidad(MatrizModelo);


    // console.log(pacman.x, pacman.y);

    identidad(MatrizTextura);
    traslacion(MatrizModelo, pacman.x, pacman.y, 0);
    switch (pacman.direction) {
        case 'up':

            if (!laberinto.colisionU(pacman.x, pacman.y - pacman.speed))
                pacman.move();


            if (timeSprite >= nextSprite) {
                pacmanU.draw(gl, true);
                timeSprite = 0;
            } else {
                pacmanU.draw(gl);
                timeSprite += speed;
            }

            break;
        case 'down':

            if (!laberinto.colisionD(pacman.x, pacman.y + pacman.speed))
                pacman.move();

            if (timeSprite >= nextSprite) {
                pacmanD.draw(gl, true);
                timeSprite = 0;
            } else {
                pacmanD.draw(gl);
                timeSprite += speed;
            }

            break;
        case 'left':

            if (!laberinto.colisionL(pacman.x - pacman.speed, pacman.y)) {
                pacman.move();
            }

            if (timeSprite >= nextSprite) {
                pacmanL.draw(gl, true);
                timeSprite = 0;
            } else {
                pacmanL.draw(gl);
                timeSprite += speed;
            }

            break;
        case 'right':

            if (!laberinto.colisionR(pacman.x + pacman.speed, pacman.y))
                pacman.move();


            if (timeSprite >= nextSprite) {
                pacmanR.draw(gl, true);
                timeSprite = 0;
            } else {
                pacmanR.draw(gl);
                timeSprite += speed;
            }

            break;
    }


    requestAnimationFrame(animation);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (!laberinto.colisionU(pacman.x, pacman.y - pacman.speed))
                pacman.direction = 'up';

            console.log('Flecha arriba');
            break;
        case 'ArrowDown':
            if (!laberinto.colisionD(pacman.x, pacman.y + pacman.speed))
                pacman.direction = 'down';

            console.log('Flecha abajo');
            break;
        case 'ArrowLeft':
            if (!laberinto.colisionL(pacman.x - pacman.speed, pacman.y))
                pacman.direction = 'left';

            console.log('Flecha izquierda');
            break;
        case 'ArrowRight':
            if (!laberinto.colisionR(pacman.x + pacman.speed, pacman.y))
                pacman.direction = 'right';

            console.log('Flecha derecha');
            break;
    }
});

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