#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D colorBuffer;
uniform sampler2D tDisplace;

uniform vec3 params;
varying vec2 vUv;

#pragma glslify: displace = require(./glsl-displace)

void main() {
    vec4 displaceColor = texture2D(tDisplace, vUv);
    vec2 displaced = displace(displaceColor, vUv, params.x, params.y, params.z);
    vec4 sampleColor = texture2D(colorBuffer, displaced);

    gl_FragColor = sampleColor;
}