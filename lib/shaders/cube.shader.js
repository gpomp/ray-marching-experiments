const glslify = require('glslify');
const path = require('path');

module.exports = require('shader-reload')({
  vertex: glslify(path.resolve(__dirname, `../shaders/cube.vert`)),
  fragment: glslify(path.resolve(__dirname, `../shaders/cube.frag`))
});
