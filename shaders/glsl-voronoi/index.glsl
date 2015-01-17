#pragma glslify: random = require(glsl-random)

//http://www.iquilezles.org/www/articles/smoothvoronoi/smoothvoronoi.htm

float voronoi( in vec2 x ) {
	vec2 p = floor( x );
	vec2 f = fract( x );
	float res = 8.0;
	for( float j=-1.; j<=1.; j++ )
	for( float i=-1.; i<=1.; i++ ) {
	    vec2  b = vec2( i, j );
	    vec2  r = b - f + random( p + b );
	    float d = dot( r, r );
	    res = min( res, d );
	}
	return sqrt( res );
}

#pragma glslify: export(voronoi)