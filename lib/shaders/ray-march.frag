precision highp float;

#pragma glslify: PI = require('glsl-pi')

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 mouse;
uniform sampler2D noiseMap;
varying vec2 vUv;

const int MAX_MARCHING_STEPS = 150;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPSILON = 0.0001;

float customSDF(vec3 p) {
    float sphere = length(p) - (1.0);
    float t = iTime * 0.1;
    vec2 noiseuvs = vec2(
        atan(p.x, p.z) / (2.0 * PI) + 0.5,
        p.y * 0.5 + 0.5
    );

    vec2 modNoiseUVS = vec2(
        mod((noiseuvs.x + (t * 3.0 + p.x) * 0.05), 2.0) / 2.0,
        mod((noiseuvs.y * 0.5 + (t * 3.0 + 2.0 + p.z) * 0.08), 2.0) / 2.0
    );

    vec3 noise = texture2D(noiseMap, modNoiseUVS).rgb;

    float displacement = sin(2.0 * p.x + noise.r - iTime) * sin(2.0 * p.y + iTime + noise.g) * sin(2.0 * p.z + noise.b + iTime) * 0.25;
    float disturbance = noise.r * 0.1 - (noise.g * 2.0 - 1.0) * (0.2) - noise.b * sin(-t + noise.g) * 0.2;
    float mouseDisturbance = smoothstep(0.4, 0.0, distance(mouse, gl_FragCoord.xy / iResolution.xy));

    return sphere + disturbance * 5.0 * displacement - (1.0 + (sin(iTime + noise.r) + 1.0) * 0.5) * mouseDisturbance * noise.b * 0.4;
}

/**
 * Signed distance function describing the scene.
 * 
 * Absolute value of the return value indicates the distance to the surface.
 * Sign indicates whether the point is inside or outside the surface,
 * negative indicating inside.
 */
float sceneSDF(vec3 samplePoint) {
    return customSDF(samplePoint);
}

#pragma glslify: shortestDistanceToSurface = require(./util/ray-marching/shortestDistanceToSurface.glsl, iTime=iTime, MAX_MARCHING_STEPS=MAX_MARCHING_STEPS, sceneSDF=sceneSDF, EPSILON=EPSILON)

#pragma glslify: rayDirection = require(./util/ray-marching/rayDirection.glsl, iTime=iTime)

#pragma glslify: estimateNormal = require(./util/ray-marching/estimateNormal.glsl, iTime=iTime, sceneSDF=sceneSDF, EPSILON=EPSILON)

#pragma glslify: phongIllumination = require(./util/ray-marching/phongIllumination.glsl, iTime=iTime,estimateNormal=estimateNormal)

#pragma glslify: viewMatrix = require(./util/ray-marching/viewMatrix.glsl)

void main()
{
  float t = iTime * 0.1;
  vec3 viewDir = rayDirection(45.0, iResolution.xy, gl_FragCoord.xy);
  float radius = 4.0;
    vec3 eye = vec3(radius, 0.0, radius);
    
    mat4 viewToWorld = viewMatrix(eye, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    
    vec3 worldDir = (viewToWorld * vec4(viewDir, 0.0)).xyz;
    
    float dist = shortestDistanceToSurface(eye, worldDir, MIN_DIST, MAX_DIST);
    // vec4 mouseVal = vec4(vec3(0.0, 0.0, step(distance(mouse, gl_FragCoord.xy / iResolution.xy), 0.1)), 1.0);
    
    if (dist > MAX_DIST - EPSILON) {
        // Didn't hit anything
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
    }
    
    // The closest point on the surface to the eyepoint along the view ray
    vec3 p = eye + dist * worldDir;
    
    vec3 K_a = vec3(0.1, 0.1, 0.1);
    vec3 K_d = vec3(0.1, 0.1, 0.1);
    vec3 K_s = vec3(0.9, 0.9, 0.9);
    float shininess = 1.0;
    
    vec3 color = phongIllumination(K_a, K_d, K_s, shininess, p, eye);

    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor += mouseVal;
}
