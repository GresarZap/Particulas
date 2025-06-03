export class Triangle {
    constructor(gl, base, height, h, k) {
        this.base = base;
        this.height = height;
        this.h = h;
        this.k = k;
        this._color = [1, 0, 0, 1];

        let center = Math.sqrt()

        this._vertices = [
            this.h - this.base / 2, this.k - this.height / 3, //inferior izquierda
            this.h + this.base / 2, this.k - this.height / 3, //inferior derecha
            this.h, this.k + 2* this.height / 3 //superior
        ];
        
        
        /* Se crea el objeto del arreglo de vértices (VAO) */
        // a partir de este punto se relaciona todo con este VAO implicitamente
        this.triangleVAO = gl.createVertexArray();

        /* Se activa el objeto */
        gl.bindVertexArray(this.triangleVAO);

        /* Crea un buffer vacio en js que no es visible para la gpu o contexto de webgl */
        let vertexBuffer = gl.createBuffer();

        /* Hacemos que la gpu sea consciente del buffer anterior */
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        /* Se transfiere los datos desde la memoria nativa al buffer de la GPU */
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);

        /* Se habilita el arreglo de los vértices (indice = 0) */
        // se compartira la informacion de js a gpu en esta direccion por asi decir
        gl.enableVertexAttribArray(0);

        // se le dice a la gpu como leer los datos de js
        // la informacion empieza en la posicion 0, cada vertice tiene 2 componentes (x,y), el tipo de dato es float, no se normaliza, no hay espacio entre los vertices y el offset es 0
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        /* Indicamos que ya no usaremos mas este VAO */
        gl.bindVertexArray(null);

        /* Quitamos la referencia del buffer que usamos */
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    draw(gl, llenado, uColor, uMatrizModelo = null, MatrizModelo = null) {

        /* Se activa el objeto del arreglo de vértices */
        gl.bindVertexArray(this.triangleVAO);

        if (uMatrizModelo && MatrizModelo)
            gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
        else {
            console.err("Debe ingresar la matriz modelo y el uniform uMatrizModelo");
            gl.bindVertexArray(null);
            return;
        }

        gl.uniform4f(uColor, this._color[0], this._color[1], this._color[2], this._color[3]);
        /* Se renderiza las primitivas desde los datos del arreglo */
        gl.drawArrays(llenado ? gl.TRIANGLE_FAN : gl.LINE_LOOP, 0, 3);


        /* Se desactiva el objeto del arreglo de vértices */
        gl.bindVertexArray(null);
    }
}