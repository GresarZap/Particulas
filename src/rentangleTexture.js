import { identidad, traslacion } from "./mat4.js";
export class RectangleTexture {
    constructor(width, height, h, k, { gl, uMatrizModelo, uMatrizTextura, uUnidadDeTextura, uMatrizVista, MatrizModelo, MatrizVista, MatrizTextura }, {textureCode, spriteSheetWidth = 0, spriteHeight = 0}) {
        this._width = width;
        this._height = height;
        this._h = h;
        this._k = k;

        this._gl = gl;
        this._uMatrizModelo = uMatrizModelo;
        this._uUnidadDeTextura = uUnidadDeTextura;
        this._uMatrizVista = uMatrizVista;
        this._uMatrizTextura = uMatrizTextura;
        this._MatrizModelo = MatrizModelo;
        this._MatrizVista = MatrizVista;
        this._MatrizTextura = MatrizTextura;

        this._textureCode = textureCode;
        this._spriteHeight = spriteSheetWidth ? width : spriteSheetWidth;
        this._spriteSheetWidth = spriteSheetWidth ? width : spriteSheetWidth;
        this._spriteHeight = spriteHeight == 0 ? height : spriteHeight;
        this._frameCount = spriteSheetWidth == 0 ? 1 : spriteSheetWidth / spriteHeight;
        this._currentFrame = 1;

        this._calculateVertices();

        this._calculateVerticesTexture();

        this._uploadMeshData();

    }


    _uploadMeshData() {
        // console.log(vertices);

        /* Se crea el objeto del arreglo de vértices (VAO) */
        // a partir de este punto se relaciona todo con este VAO implicitamente
        this.rectangleVAO = this._gl.createVertexArray();

        /* Se activa el objeto */
        this._gl.bindVertexArray(this.rectangleVAO);

        /* Crea un buffer vacio en js que no es visible para la gpu o contexto de webgl */
        let vertexBuffer = this._gl.createBuffer();

        /* Hacemos que la gpu sea consciente del buffer anterior */
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer);

        /* Se transfiere los datos desde la memoria nativa al buffer de la GPU */
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._vertices), this._gl.STATIC_DRAW);

        /* Se habilita el arreglo de los vértices (indice = 0) */
        // se compartira la informacion de js a gpu en esta direccion por asi decir
        this._gl.enableVertexAttribArray(0);

        // se le dice a la gpu como leer los datos de js
        // la informacion empieza en la posicion 0, cada vertice tiene 2 componentes (x,y), el tipo de dato es float, no se normaliza, no hay espacio entre los vertices y el offset es 0
        this._gl.vertexAttribPointer(0, 2, this._gl.FLOAT, false, 0, 0);


        /* Se genera un nombre (código) para el buffer */
        let codigoCoordenadasDeTextura = this._gl.createBuffer();

        /* Se asigna un nombre (código) al buffer */
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, codigoCoordenadasDeTextura);

        /* Se transfiere los datos desde la memoria nativa al buffer de la GPU */
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._coordTextura), this._gl.STATIC_DRAW);

        /* Se habilita el arreglo de las coordenadas de textura (indice = 1) */
        this._gl.enableVertexAttribArray(1);

        /* Se especifica el arreglo de las coordenadas de textura */
        this._gl.vertexAttribPointer(1, 2, this._gl.FLOAT, false, 0, 0);


        /* Indicamos que ya no usaremos mas este VAO */
        this._gl.bindVertexArray(null);

        /* Quitamos la referencia del buffer que usamos */
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
    }



    _calculateVerticesTexture() {
        //coordenadas de textura u,v, en el rango [0,1]
        this._coordTextura = [
            this._currentFrame / this._frameCount, 1, // 2
            0, 1, // 3
            0, 0, // 0
            this._currentFrame / this._frameCount, 0, // 1
        ];

    }

    _calculateVertices() {
        this._vertices = [
            this._h + this._width / 2, this._k - this._height / 2, //inferior derecha
            this._h - this._width / 2, this._k - this._height / 2, //inferior izquierda
            this._h - this._width / 2, this._k + this._height / 2, //superior izquierda
            this._h + this._width / 2, this._k + this._height / 2, //superior derecha
        ];
    }

    draw(next = false) {

        if (next) {
            this._currentFrame++;

            if (this._currentFrame >= this._frameCount) {
                this._currentFrame = 0;
            }
        }

        identidad(this._MatrizTextura);
        traslacion(this._MatrizTextura, this._currentFrame / this._frameCount, 0, 0);

        this._gl.bindVertexArray(this.rectangleVAO);

        this._gl.uniformMatrix4fv(this._uMatrizModelo, false, this._MatrizModelo);

        this._gl.uniformMatrix4fv(this._uMatrizVista, false, this._MatrizVista);

        this._gl.uniformMatrix4fv(this._uMatrizTextura, false, this._MatrizTextura);

        /* Se activa la unidad de textura 0 */
        this._gl.activeTexture(this._gl.TEXTURE0);

        /* Se vincula uUnidadDeTextura a la unidad de textura 0 */
        this._gl.uniform1i(this._uUnidadDeTextura, 0);

        /* Se vincula la textura con la unidad de textura 0 */
        this._gl.bindTexture(this._gl.TEXTURE_2D, this._textureCode);

        /* Se renderiza las primitivas desde los datos del arreglo */
        this._gl.drawArrays(this._gl.TRIANGLE_FAN, 0, 4);

        /* Se desactiva el objeto del arreglo de vértices */
        this._gl.bindVertexArray(null);

    }

    get MatrizModelo() {
        return this._MatrizModelo;
    }
}