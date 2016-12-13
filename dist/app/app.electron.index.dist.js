/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Abstract interface for sources
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const electron_1 = __webpack_require__(1);
	// Keep a global reference of the window object, if you don't, the window will
	// be closed automatically when the JavaScript object is garbage collected.
	let win;
	function createWindow() {
	    // Create the browser window.
	    win = new electron_1.BrowserWindow({
	        width: 1080,
	        height: 786,
	        webPreferences: {
	            webSecurity: false
	        }
	    });
	    // and load the index.html of the app.
	    win.loadURL('file:///' + __dirname + '/index.html');
	    //win.setMenu(null);
	    //
	    // Open the DevTools.
	    win.webContents.openDevTools();
	    // Emitted when the window is closed.
	    win.on('closed', () => {
	        // Dereference the window object, usually you would store windows
	        // in an array if your app supports multi windows, this is the time
	        // when you should delete the corresponding element.
	        win = null;
	    });
	}
	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	electron_1.app.on('ready', createWindow);
	// Quit when all windows are closed.
	electron_1.app.on('window-all-closed', () => {
	    // On macOS it is common for applications and their menu bar
	    // to stay active until the user quits explicitly with Cmd + Q
	    if (process.platform !== 'darwin') {
	        electron_1.app.quit();
	    }
	});
	electron_1.app.on('activate', () => {
	    // On macOS it's common to re-create a window in the app when the
	    // dock icon is clicked and there are no other windows open.
	    if (win === null) {
	        createWindow();
	    }
	});
	// In this file you can include the rest of your app's specific main process
	// code. You can also put them in separate files and require them here.


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ }
/******/ ]);
//# sourceMappingURL=app.electron.index.dist.js.map