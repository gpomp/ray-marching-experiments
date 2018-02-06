var dat = require('dat-gui');
var datGUI = {};
datGUI.instance = new dat.GUI();
datGUI.destroy = function() {
    datGUI.instance.destroy();
    datGUI.instance = new dat.GUI();
};

module.exports = datGUI;
