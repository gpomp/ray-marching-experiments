#pragma glslify: snoise3 = require(glsl-noise/classic/3d)
float fbm (in vec3 p, in int OCTAVES) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * snoise3(p);
        p *= 2.;
        amplitude *= .5;
    }
    return value;
}

#pragma glslify: export(fbm)
