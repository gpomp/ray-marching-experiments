const cubeShader = require('../shaders/cube.shader');

module.exports = function (app) {
  const geom = new THREE.BoxGeometry(1, 1, 1);

  const mat = new THREE.ShaderMaterial({
    vertexShader: cubeShader.vertex,
    fragmentShader: cubeShader.fragment,
    depthTest: false,
    depthWrite: false
  });

  const box = new THREE.Mesh(geom, mat);
  box.frustumCulled = false;
  box.position.set(0, 0, 0);
  box.scale.set(10, 10, 10);

  cubeShader.on('change', () => {
    mat.vertexShader = cubeShader.vertex;
    mat.fragmentShader = cubeShader.fragment;
    mat.needsUpdate = true;
  });

  return {
    object3d: box,

    update (dt, state) {

    }
  };
};
