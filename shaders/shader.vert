#version 300 es

layout(location = 0) in vec2 aVertices;
layout(location = 1) in vec2 aCoordenadasDeTextura;

uniform float uPointSize;
uniform mat4 uMatrizProyeccion;
uniform mat4 uMatrizModelo;
uniform mat4 uMatrizVista;
uniform mat4 uMatrizTextura;

out vec2 vCoordenadasDeTextura;

void main() {
    vCoordenadasDeTextura = (uMatrizTextura * vec4(aCoordenadasDeTextura, 0.0, 1.0)).xy; 
    gl_Position = uMatrizProyeccion * uMatrizVista * uMatrizModelo * vec4(aVertices, 0.0, 1.0);  
}
