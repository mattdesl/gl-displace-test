#pragma glslify: voronoi = require(../glsl-voronoi)

vec2 displace(vec4 tex, vec2 texCoord, float dotDepth, float textureDepth, float strength) {
	float b = voronoi(.003 * texCoord + 2.0);
	float g = voronoi(0.2 * texCoord);
	float r = voronoi(texCoord - 1.0);
	vec4 dt = tex * 1.0;
	vec4 dis = dt * dotDepth + 1.0 - tex * textureDepth;

	dis.x = dis.x - 1.0 + textureDepth*dotDepth;
	dis.y = dis.y - 1.0 + textureDepth*dotDepth;
	dis.x *= strength;
	dis.y *= strength;
	vec2 res_uv = texCoord ;
	res_uv.x = res_uv.x + dis.x - 0.0;
	res_uv.y = res_uv.y + dis.y;
	return res_uv;
}

#pragma glslify: export(displace)