/**
 * Signed distance function for a sphere centered at the origin with radius 1.0;
 */
float sphereSDF(vec3 p) {
    return length(p) - 1.0;
}

#pragma glslify: export(sphereSDF)
