import { traslacion } from "./mat4.js";
export class RectangleTexture {
    constructor(width, height, h, k, { gl, uMatrizModelo, uMatrizTextura, uUnidadDeTextura, uMatrizVista, MatrizModelo, MatrizVista, MatrizTextura }, codigoDeTextura) {
        this._width = width;
        this._height = height;
        this._h = h;
        this._k = k;

        this._gl = gl;
        this._uMatrizModelo = uMatrizModelo;
        this._uUnidadDeTextura = uUnidadDeTextura;
        this._uMatrizVista = uMatrizVista;
        this._MatrizModelo = MatrizModelo;
        this._uMatrizTextura = uMatrizTextura;
        this._MatrizVista = MatrizVista;
        this._MatrizTextura = MatrizTextura;
        this._codigoDeTextura = codigoDeTextura;

        this._spriteSheetW = width;
        this._nroSprites = 1;
        this._sprite = 0;

        this._vertices = [
            this._h + this._width / 2, this._k - this._height / 2, //inferior derecha
            this._h - this._width / 2, this._k - this._height / 2, //inferior izquierda
            this._h - this._width / 2, this._k + this._height / 2, //superior izquierda
            this._h + this._width / 2, this._k + this._height / 2, //superior derecha
        ];
            
        this.coordenadaTextura();

        this.gpuValores();

    }


    gpuValores() {
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

    

    coordenadaTextura() {
        this._widthSprite = this._width / this._spriteSheetW;
        this._coordTextura = [
            this._widthSprite, 1, // 2
            0, 1, // 3
            0, 0, // 0
            this._widthSprite, 0, // 1
        ];

        // console.log(this._coordTextura);
    }

    draw(gl, siguiente = false) {

        if (siguiente) {
            this._sprite++;

            if (this._sprite >= this._nroSprites) {
                this._sprite = 0;
            }
            // console.log(this._sprite);
            traslacion(this._MatrizTextura, this._sprite * this._widthSprite, 0, 0)
        }

        traslacion(this._MatrizTextura, this._sprite * this._widthSprite, 0, 0)

        gl.bindVertexArray(this.rectangleVAO);

        gl.uniformMatrix4fv(this._uMatrizModelo, false, this._MatrizModelo);

        gl.uniformMatrix4fv(this._uMatrizVista, false, this._MatrizVista);

        gl.uniformMatrix4fv(this._uMatrizTextura, false, this._MatrizTextura);

        /* Se activa la unidad de textura 0 */
        gl.activeTexture(gl.TEXTURE0);

        /* Se vincula uUnidadDeTextura a la unidad de textura 0 */
        gl.uniform1i(this._uUnidadDeTextura, 0);

        /* Se vincula la textura con la unidad de textura 0 */
        gl.bindTexture(gl.TEXTURE_2D, this._codigoDeTextura);

        /* Se renderiza las primitivas desde los datos del arreglo */
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        /* Se desactiva el objeto del arreglo de vértices */
        gl.bindVertexArray(null);


    }

    set spriteSheetW(value) {
        this._spriteSheetW = value;
        this.coordenadaTextura();
        this.gpuValores();
    }

    set nroSprites(value){
        this._nroSprites = value;
    }
}