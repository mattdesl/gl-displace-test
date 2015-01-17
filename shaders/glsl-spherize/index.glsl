#ifndef PI
#define PI 3.141592653589793
#endif

vec2 spherize(vec2 pixelCoord, vec2 resolution) {
    vec2 norm = 2.0 * pixelCoord/resolution.xy - 1.0;
	// norm.x *= resolution.x / resolution.y;
    
    float r = length(norm);
    float phi = atan(norm.y, norm.x);
    
    //bulge a bit
    // r = r * 1;
    // r = pow(r, 1.5);
    
    //zoom in a bit
    r /= 1.5;
    
    //spherize
    r = (4.0 * asin(r) / PI);

    vec2 coord = vec2(r * cos(phi), r * sin(phi));
    coord = coord/2.0 + 0.5;
    return coord;
}


#pragma glslify: export(spherize)