#version 300 es
precision mediump float;

uniform sampler2D uUnidadDeTextura;

in vec2 vCoordenadasDeTextura;
out vec4 color;
uniform float uAlpha;

void main() {
    // color = texture(uUnidadDeTextura, vCoordenadasDeTextura); 
    vec4 texColor = texture(uUnidadDeTextura, vCoordenadasDeTextura);
    color = vec4(texColor.rgb, texColor.a * uAlpha); // ← más transparente
}