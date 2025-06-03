import { loadFile } from "./load_file.js";
import { ortho } from "../src/mat4.js";
export function iniWebgl() {
    // 2. Inicializacion de webgl
    const canvas = document.getElementById("webglcanvas");
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("WebGL 2.0 no es compatible con este navegador.");
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return gl;
}

export async function creaShader(gl) {
    // 3. Creacion de Shaders
    // Shader Vertex
    const shaderDeVertice = gl.createShader(gl.VERTEX_SHADER);
    const vertexCode = await loadFile('/shaders/shader.vert');
    gl.shaderSource(shaderDeVertice, vertexCode.trim());
    gl.compileShader(shaderDeVertice);

    if (!gl.getShaderParameter(shaderDeVertice, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shaderDeVertice));
    }

    // Shader Fragment
    const shaderDeFragmento = gl.createShader(gl.FRAGMENT_SHADER);
    const fragCode = await loadFile('/shaders/shader.frag');
    gl.shaderSource(shaderDeFragmento, fragCode.trim());
    gl.compileShader(shaderDeFragmento);

    if (!gl.getShaderParameter(shaderDeFragmento, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shaderDeFragmento));
    }

    return [shaderDeVertice, shaderDeFragmento];
}

export function vinculaShader(gl, shaderDeVertice, shaderDeFragmento) {
    const programaID = gl.createProgram();

    gl.attachShader(programaID, shaderDeVertice);
    gl.attachShader(programaID, shaderDeFragmento);
    gl.linkProgram(programaID);

    if (!gl.getProgramParameter(programaID, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(programaID));
    }

    gl.useProgram(programaID);

    return programaID;
}

export function background(gl, bg) {
    // 6. Configuración del color de limpieza
    gl.clearColor(...bg);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

export function variablesUniform(gl, programaID) {
    // 7. Configuración de valores uniform
    return {
        uMatrizModelo: gl.getUniformLocation(programaID, "uMatrizModelo"),
        uMatrizVista: gl.getUniformLocation(programaID, "uMatrizVista"),
        uUnidadDeTextura: gl.getUniformLocation(programaID, "uUnidadDeTextura"),
        uMatrizTextura: gl.getUniformLocation(programaID, "uMatrizTextura"),
        uAlpha: gl.getUniformLocation(programaID, "uAlpha"),
    }
}

export function proyeccion(gl, programaID, left, right, bottom, top, near, far) {
    // 7.1 Transformacion

    const uMatrizProyeccion = gl.getUniformLocation(programaID, "uMatrizProyeccion");
    let MatrizProyeccion = new Array(16);
    ortho(MatrizProyeccion, left, right, bottom, top, near, far);
    gl.uniformMatrix4fv(uMatrizProyeccion, false, MatrizProyeccion);
}

export function leeLaTextura(gl, ID_del_archivo, codigoDeTextura) {

    /* Se asigna un nombre (código) a la textura */
    gl.bindTexture(gl.TEXTURE_2D, codigoDeTextura);

    /* true, invierte los píxeles en el orden de abajo hacia arriba que WebGL espera */
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    /* Obtiene la imagen */
    var imagen = document.getElementById(ID_del_archivo);
    /* Se lee la textura */
    /* |  tipo   |0=1 resol|RGB/RGBA |orden col|tip datos| buffer  | */
    /* |    1    |    2    |    3    |    4    |    5    |    6    | */
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagen);

    /* Para que el patrón de textura se agrande y se acomode a una área grande */
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    /* Para que el patrón de textura se reduzca y se acomode a una área pequeña */
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    /* Para repetir la textura tanto en s y t fuera del rango del 0 al 1
      * POR DEFECTO! */
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    /* Para limitar la textura tanto de s y t dentro del rango del 0 al 1 */
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    /* Se deja de asignar un nombre (código) a la textura */
    gl.bindTexture(gl.TEXTURE_2D, null);

}