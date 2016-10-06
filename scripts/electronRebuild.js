const eR = require('electron-rebuild');

const pathToElectron = "./node_modules/electron/dist/electron.exe";

return eR.installNodeHeaders('1.4.0')
  .then(() => eR.rebuildNativeModules('1.4.0', './node_modules'))
  .then(() => eR.preGypFixRun('./node_modules', true, pathToElectron));