varying vec2 vUv;

uniform sampler2D tDiffuse;
// uniform sampler2D tTriangles;
uniform sampler2D tLines;

// #pragma glslify: BlendOverlay = require(./glsl-blend-overlay)

void main() {
    vec4 diffuse = texture2D(tDiffuse, vUv);
    // vec4 triangles = texture2D(tTriangles, vUv);
    vec4 lines = texture2D(tLines, vUv);

    float dist = smoothstep(0.5, 0.4, vUv.y);

    // triangles = max(diffuse, triangles);

    // vec3 lineFill = BlendOverlay(triangles.rgb, max(triangles.rgb, lines.rgb));
    // vec3 lineFill = max(triangles.rgb, lines.rgb);
    // triangles.rgb = mix(triangles.rgb, lineFill, 1.0);



    gl_FragColor = mix(diffuse, max(diffuse, lines), dist);
    gl_FragColor.rgb += smoothstep(0.4, 0.0, vUv.y) * 0.5;
}