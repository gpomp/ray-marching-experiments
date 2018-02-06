require('babel-polyfill');
global.THREE = require('three');
const createApp = require('./app/createApp');
const createObjectList = require('./util/createObjectList');
const addComponents = require('./components/addComponents');
const query = require('./util/query');

const skipFrames = query.skipFrames;
const skipFrameFPS = 20;

startApp();

function startApp () {
  let intervalTime = 0;
  const app = createApp();

  // a stack of ThreeJS components
  const components = createObjectList(app.scene);

  // init & create all ThreeJS components
  addComponents({ app, components });

  app.on('tick', tick);
  app.start();

  function tick (dt) {
    // all time is handled in MS for consistency with
    // audio/video elements later
    dt = dt / 1000;

    intervalTime += dt;
    if (intervalTime > 1 / skipFrameFPS) {
      intervalTime = 0;
    } else if (skipFrames) {
      return;
    }

    app.update(dt); // update camera
    components.update(dt); // update components
    app.render(); // render frame
  }
}
