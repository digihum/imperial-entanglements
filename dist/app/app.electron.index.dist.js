/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\r\n * @fileOverview Abstract interface for sources\r\n * @author <a href=\"mailto:tim.hollies@warwick.ac.uk\">Tim Hollies</a>\r\n * @version 0.0.1\r\n */\r\n\"use strict\";\r\nconst electron_1 = __webpack_require__(1);\r\n// Keep a global reference of the window object, if you don't, the window will\r\n// be closed automatically when the JavaScript object is garbage collected.\r\nlet win;\r\nfunction createWindow() {\r\n    // Create the browser window.\r\n    win = new electron_1.BrowserWindow({\r\n        width: 1080,\r\n        height: 786,\r\n        webPreferences: {\r\n            webSecurity: false\r\n        }\r\n    });\r\n    // and load the index.html of the app.\r\n    win.loadURL('file:///' + __dirname + '/index.html');\r\n    //win.setMenu(null);\r\n    //\r\n    // Open the DevTools.\r\n    win.webContents.openDevTools();\r\n    // Emitted when the window is closed.\r\n    win.on('closed', () => {\r\n        // Dereference the window object, usually you would store windows\r\n        // in an array if your app supports multi windows, this is the time\r\n        // when you should delete the corresponding element.\r\n        win = null;\r\n    });\r\n}\r\n// This method will be called when Electron has finished\r\n// initialization and is ready to create browser windows.\r\n// Some APIs can only be used after this event occurs.\r\nelectron_1.app.on('ready', createWindow);\r\n// Quit when all windows are closed.\r\nelectron_1.app.on('window-all-closed', () => {\r\n    // On macOS it is common for applications and their menu bar\r\n    // to stay active until the user quits explicitly with Cmd + Q\r\n    if (process.platform !== 'darwin') {\r\n        electron_1.app.quit();\r\n    }\r\n});\r\nelectron_1.app.on('activate', () => {\r\n    // On macOS it's common to re-create a window in the app when the\r\n    // dock icon is clicked and there are no other windows open.\r\n    if (win === null) {\r\n        createWindow();\r\n    }\r\n});\r\n// In this file you can include the rest of your app's specific main process\r\n// code. You can also put them in separate files and require them here.\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2luZGV4LnRzP2VjNmUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRzs7QUFFSCx1Q0FBMkMsQ0FBVSxDQUFDO0FBR3RELDhFQUE4RTtBQUM5RSwyRUFBMkU7QUFDM0UsSUFBSSxHQUFHLENBQUM7QUFFUjtJQUVFLDZCQUE2QjtJQUM3QixHQUFHLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1FBQ3BCLEtBQUssRUFBRSxJQUFJO1FBQ1gsTUFBTSxFQUFFLEdBQUc7UUFDWCxjQUFjLEVBQUU7WUFDZCxXQUFXLEVBQUUsS0FBSztTQUNuQjtLQUNKLENBQUMsQ0FBQztJQUVILHNDQUFzQztJQUN0QyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxTQUFTLEdBQUcsYUFBYSxDQUFDLENBQUM7SUFFcEQsb0JBQW9CO0lBRXBCLEVBQUU7SUFFRixxQkFBcUI7SUFDckIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUU7SUFFOUIscUNBQXFDO0lBQ3JDLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ2YsaUVBQWlFO1FBQ2pFLG1FQUFtRTtRQUNuRSxvREFBb0Q7UUFDcEQsR0FBRyxHQUFHLElBQUksQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELHdEQUF3RDtBQUN4RCx5REFBeUQ7QUFDekQsc0RBQXNEO0FBQ3RELGNBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRTlCLG9DQUFvQztBQUNwQyxjQUFHLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFO0lBQzFCLDREQUE0RDtJQUM1RCw4REFBOEQ7SUFDOUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLGNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNiLENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGNBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQ2pCLGlFQUFpRTtJQUNqRSw0REFBNEQ7SUFDNUQsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsWUFBWSxFQUFFLENBQUM7SUFDakIsQ0FBQztBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsNEVBQTRFO0FBQzVFLHVFQUF1RSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IEFic3RyYWN0IGludGVyZmFjZSBmb3Igc291cmNlc1xuICogQGF1dGhvciA8YSBocmVmPVwibWFpbHRvOnRpbS5ob2xsaWVzQHdhcndpY2suYWMudWtcIj5UaW0gSG9sbGllczwvYT5cbiAqIEB2ZXJzaW9uIDAuMC4xXG4gKi9cblxuaW1wb3J0IHthcHAsIEJyb3dzZXJXaW5kb3csIHByb3RvY29sfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG4vLyBLZWVwIGEgZ2xvYmFsIHJlZmVyZW5jZSBvZiB0aGUgd2luZG93IG9iamVjdCwgaWYgeW91IGRvbid0LCB0aGUgd2luZG93IHdpbGxcbi8vIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIEphdmFTY3JpcHQgb2JqZWN0IGlzIGdhcmJhZ2UgY29sbGVjdGVkLlxubGV0IHdpbjtcblxuZnVuY3Rpb24gY3JlYXRlV2luZG93ICgpIHtcblxuICAvLyBDcmVhdGUgdGhlIGJyb3dzZXIgd2luZG93LlxuICB3aW4gPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICB3aWR0aDogMTA4MCxcbiAgICAgIGhlaWdodDogNzg2LFxuICAgICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgICAgd2ViU2VjdXJpdHk6IGZhbHNlXG4gICAgICB9XG4gIH0pO1xuXG4gIC8vIGFuZCBsb2FkIHRoZSBpbmRleC5odG1sIG9mIHRoZSBhcHAuXG4gIHdpbi5sb2FkVVJMKCdmaWxlOi8vLycgKyBfX2Rpcm5hbWUgKyAnL2luZGV4Lmh0bWwnKTtcblxuICAvL3dpbi5zZXRNZW51KG51bGwpO1xuXG4gIC8vXG5cbiAgLy8gT3BlbiB0aGUgRGV2VG9vbHMuXG4gIHdpbi53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKVxuXG4gIC8vIEVtaXR0ZWQgd2hlbiB0aGUgd2luZG93IGlzIGNsb3NlZC5cbiAgd2luLm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgLy8gRGVyZWZlcmVuY2UgdGhlIHdpbmRvdyBvYmplY3QsIHVzdWFsbHkgeW91IHdvdWxkIHN0b3JlIHdpbmRvd3NcbiAgICAvLyBpbiBhbiBhcnJheSBpZiB5b3VyIGFwcCBzdXBwb3J0cyBtdWx0aSB3aW5kb3dzLCB0aGlzIGlzIHRoZSB0aW1lXG4gICAgLy8gd2hlbiB5b3Ugc2hvdWxkIGRlbGV0ZSB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50LlxuICAgIHdpbiA9IG51bGw7XG4gIH0pO1xufVxuXG4vLyBUaGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCB3aGVuIEVsZWN0cm9uIGhhcyBmaW5pc2hlZFxuLy8gaW5pdGlhbGl6YXRpb24gYW5kIGlzIHJlYWR5IHRvIGNyZWF0ZSBicm93c2VyIHdpbmRvd3MuXG4vLyBTb21lIEFQSXMgY2FuIG9ubHkgYmUgdXNlZCBhZnRlciB0aGlzIGV2ZW50IG9jY3Vycy5cbmFwcC5vbigncmVhZHknLCBjcmVhdGVXaW5kb3cpO1xuXG4vLyBRdWl0IHdoZW4gYWxsIHdpbmRvd3MgYXJlIGNsb3NlZC5cbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XG4gIC8vIE9uIG1hY09TIGl0IGlzIGNvbW1vbiBmb3IgYXBwbGljYXRpb25zIGFuZCB0aGVpciBtZW51IGJhclxuICAvLyB0byBzdGF5IGFjdGl2ZSB1bnRpbCB0aGUgdXNlciBxdWl0cyBleHBsaWNpdGx5IHdpdGggQ21kICsgUVxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcbiAgICBhcHAucXVpdCgpO1xuICB9XG59KTtcblxuYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcbiAgLy8gT24gbWFjT1MgaXQncyBjb21tb24gdG8gcmUtY3JlYXRlIGEgd2luZG93IGluIHRoZSBhcHAgd2hlbiB0aGVcbiAgLy8gZG9jayBpY29uIGlzIGNsaWNrZWQgYW5kIHRoZXJlIGFyZSBubyBvdGhlciB3aW5kb3dzIG9wZW4uXG4gIGlmICh3aW4gPT09IG51bGwpIHtcbiAgICBjcmVhdGVXaW5kb3coKTtcbiAgfVxufSk7XG5cbi8vIEluIHRoaXMgZmlsZSB5b3UgY2FuIGluY2x1ZGUgdGhlIHJlc3Qgb2YgeW91ciBhcHAncyBzcGVjaWZpYyBtYWluIHByb2Nlc3Ncbi8vIGNvZGUuIFlvdSBjYW4gYWxzbyBwdXQgdGhlbSBpbiBzZXBhcmF0ZSBmaWxlcyBhbmQgcmVxdWlyZSB0aGVtIGhlcmUuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYXBwL2luZGV4LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("module.exports = require(\"electron\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzY5MjgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZWxlY3Ryb25cIlxuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }
/******/ ]);