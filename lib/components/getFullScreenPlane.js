const rayMarchShader = require('../shaders/ray-march.shader');


module.exports = function (app, opts = {}) {
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.RawShaderMaterial({
    vertexShader: rayMarchShader.vertex,
    fragmentShader: rayMarchShader.fragment,
    depthTest: false,
    depthWrite: false,
    uniforms: Object.assign({}, {
      iTime: { type: 'f', value: 1000 },
      iResolution: { type: 'v2', value: new THREE.Vector2() },
    }, opts.uniforms || {})
  }));

  rayMarchShader.on('change', () => {
    quad.material.vertexShader = rayMarchShader.vertex;
    quad.material.fragmentShader = rayMarchShader.fragment;
    quad.material.needsUpdate = true;
  });

  app.on('resize', resize);
  resize();

  return {
    object3d: quad,
    camera,
    update: (dt, state) => {
      quad.material.uniforms.iTime.value += dt;
    }
  };

  function resize () {
    quad.material.uniforms.iResolution.value.x = app.width;
    quad.material.uniforms.iResolution.value.y = app.height;
  }
}
