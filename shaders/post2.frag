varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform sampler2D tFrost;
uniform sampler2D tOverlay;
uniform sampler2D tColorLUT;
uniform vec2 resolution;

#pragma glslify: spherize = require(./glsl-spherize)
#pragma glslify: displace = require(./glsl-displace)
#pragma glslify: srcOver = require(./glsl-src-over)
#pragma glslify: colorCorrect = require(glsl-lut/flipY)

void main() {
    //tex coord for frost displacement, aspect corrected and tiled
    vec2 nuv = gl_FragCoord.xy / resolution.xy * 0.7;
    nuv.x *= resolution.x/resolution.y; 
    
    //frost displace texture color
    vec4 frostColor = texture2D(tFrost, nuv);
    //overlay/border texture color 
    vec4 overlayColor = texture2D(tOverlay, vUv);

    //displace the UVs with frost texture
    vec2 uv = displace(frostColor, vUv, 0.15, 0.2, 0.5);

    //spherize the UVs for street view
    uv = spherize(uv * resolution.xy, resolution);
    // vec2 uv = vUv;

    //sample from street view tex with distorted UVs
    vec4 texColor = texture2D(tDiffuse, uv);

    //add a white vignette
    float vignette = length(vUv - 0.5);
    texColor += smoothstep(0.5, 1.5, vignette);

    //apply color corrections
    texColor = colorCorrect(texColor, tColorLUT);

    // gl_FragCoord = texColor;
    
    //blend with alpha src-over blending
    gl_FragColor = srcOver(texColor, overlayColor);

    // gl_FragColor = texture2D(tDiffuse, vUv);
}