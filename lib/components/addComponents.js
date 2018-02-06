// const getBox = require('./getBox');
const getFullScreenPlane = require('./getFullScreenPlane');
const query = require('../util/query');
module.exports = function ({ app, components }) {
  if (!query.gui) {
    const ui = document.querySelector('.dg.ac');
    ui.style.display = 'none';
  } else {
    const ui = document.querySelector('.dg.ac');
    ui.style.zIndex = 1000;
  }

  const mouse = new THREE.Vector2();
  const mouseUniforms = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  const fsPlane = components.add(getFullScreenPlane(app, {
    uniforms: {
      noiseMap: { type: 't', value: new THREE.TextureLoader().load('img/noise-high.jpg', (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        tex.needsUpdate = true;
      }) },
      mouse: { type: 'v2', value: mouse }
    }
   }));

  const intersectObjects = [fsPlane.object3d];

  app.camera = fsPlane.camera;
  app.camera.position.set(0, 0, 0);

  window.addEventListener('mousemove', onMouseMove, false);

  app.on('tick', update);

  function update () {
    // mouseUniforms.lerp(mouse, 0.8);
    raycaster.setFromCamera( mouse, app.camera );
    var intersects = raycaster.intersectObjects(intersectObjects);
    if (intersects.length && intersects.length > 0) {
      mouseUniforms.set(intersects[0].point.x, intersects[0].point.y);
    }
    
  }

  function onMouseMove (event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth );
    mouse.y = 1 - ( event.clientY / window.innerHeight );
  }
};
