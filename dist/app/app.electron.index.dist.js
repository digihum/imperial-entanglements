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

	eval("/**\r\n * @fileOverview Abstract interface for sources\r\n * @author <a href=\"mailto:tim.hollies@warwick.ac.uk\">Tim Hollies</a>\r\n * @version 0.0.1\r\n */\r\n\"use strict\";\r\nconst electron_1 = __webpack_require__(1);\r\n// Keep a global reference of the window object, if you don't, the window will\r\n// be closed automatically when the JavaScript object is garbage collected.\r\nlet win;\r\nfunction createWindow() {\r\n    // Create the browser window.\r\n    win = new electron_1.BrowserWindow({\r\n        width: 1080,\r\n        height: 786,\r\n        webPreferences: {\r\n            webSecurity: false\r\n        }\r\n    });\r\n    // and load the index.html of the app.\r\n    win.loadURL('file:///' + __dirname + '/index.html');\r\n    //win.setMenu(null);\r\n    //\r\n    // Open the DevTools.\r\n    win.webContents.openDevTools();\r\n    // Emitted when the window is closed.\r\n    win.on('closed', () => {\r\n        // Dereference the window object, usually you would store windows\r\n        // in an array if your app supports multi windows, this is the time\r\n        // when you should delete the corresponding element.\r\n        win = null;\r\n    });\r\n}\r\n// This method will be called when Electron has finished\r\n// initialization and is ready to create browser windows.\r\n// Some APIs can only be used after this event occurs.\r\nelectron_1.app.on('ready', createWindow);\r\n// Quit when all windows are closed.\r\nelectron_1.app.on('window-all-closed', () => {\r\n    // On macOS it is common for applications and their menu bar\r\n    // to stay active until the user quits explicitly with Cmd + Q\r\n    if (process.platform !== 'darwin') {\r\n        electron_1.app.quit();\r\n    }\r\n});\r\nelectron_1.app.on('activate', () => {\r\n    // On macOS it's common to re-create a window in the app when the\r\n    // dock icon is clicked and there are no other windows open.\r\n    if (win === null) {\r\n        createWindow();\r\n    }\r\n});\r\n// In this file you can include the rest of your app's specific main process\r\n// code. You can also put them in separate files and require them here.\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2luZGV4LnRzP2VjNmUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRzs7QUFFSCwwQ0FBc0Q7QUFHdEQsOEVBQThFO0FBQzlFLDJFQUEyRTtBQUMzRSxJQUFJLEdBQUcsQ0FBQztBQUVSO0lBRUUsNkJBQTZCO0lBQzdCLEdBQUcsR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDcEIsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNkLFdBQVcsRUFBRSxLQUFLO1NBQ25CO0tBQ0osQ0FBQyxDQUFDO0lBRUgsc0NBQXNDO0lBQ3RDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLFNBQVMsR0FBRyxhQUFhLENBQUMsQ0FBQztJQUVwRCxvQkFBb0I7SUFFcEIsRUFBRTtJQUVGLHFCQUFxQjtJQUNyQixHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRTtJQUU5QixxQ0FBcUM7SUFDckMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7UUFDZixpRUFBaUU7UUFDakUsbUVBQW1FO1FBQ25FLG9EQUFvRDtRQUNwRCxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ2IsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsd0RBQXdEO0FBQ3hELHlEQUF5RDtBQUN6RCxzREFBc0Q7QUFDdEQsY0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFOUIsb0NBQW9DO0FBQ3BDLGNBQUcsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUU7SUFDMUIsNERBQTREO0lBQzVELDhEQUE4RDtJQUM5RCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDbEMsY0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2IsQ0FBQztBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsY0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUU7SUFDakIsaUVBQWlFO0lBQ2pFLDREQUE0RDtJQUM1RCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqQixZQUFZLEVBQUUsQ0FBQztJQUNqQixDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCw0RUFBNEU7QUFDNUUsdUVBQXVFIiwiZmlsZSI6IjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgQWJzdHJhY3QgaW50ZXJmYWNlIGZvciBzb3VyY2VzXG4gKiBAYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86dGltLmhvbGxpZXNAd2Fyd2ljay5hYy51a1wiPlRpbSBIb2xsaWVzPC9hPlxuICogQHZlcnNpb24gMC4wLjFcbiAqL1xuXG5pbXBvcnQge2FwcCwgQnJvd3NlcldpbmRvdywgcHJvdG9jb2x9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbi8vIEtlZXAgYSBnbG9iYWwgcmVmZXJlbmNlIG9mIHRoZSB3aW5kb3cgb2JqZWN0LCBpZiB5b3UgZG9uJ3QsIHRoZSB3aW5kb3cgd2lsbFxuLy8gYmUgY2xvc2VkIGF1dG9tYXRpY2FsbHkgd2hlbiB0aGUgSmF2YVNjcmlwdCBvYmplY3QgaXMgZ2FyYmFnZSBjb2xsZWN0ZWQuXG5sZXQgd2luO1xuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3cgKCkge1xuXG4gIC8vIENyZWF0ZSB0aGUgYnJvd3NlciB3aW5kb3cuXG4gIHdpbiA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgIHdpZHRoOiAxMDgwLFxuICAgICAgaGVpZ2h0OiA3ODYsXG4gICAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgICB3ZWJTZWN1cml0eTogZmFsc2VcbiAgICAgIH1cbiAgfSk7XG5cbiAgLy8gYW5kIGxvYWQgdGhlIGluZGV4Lmh0bWwgb2YgdGhlIGFwcC5cbiAgd2luLmxvYWRVUkwoJ2ZpbGU6Ly8vJyArIF9fZGlybmFtZSArICcvaW5kZXguaHRtbCcpO1xuXG4gIC8vd2luLnNldE1lbnUobnVsbCk7XG5cbiAgLy9cblxuICAvLyBPcGVuIHRoZSBEZXZUb29scy5cbiAgd2luLndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpXG5cbiAgLy8gRW1pdHRlZCB3aGVuIHRoZSB3aW5kb3cgaXMgY2xvc2VkLlxuICB3aW4ub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAvLyBEZXJlZmVyZW5jZSB0aGUgd2luZG93IG9iamVjdCwgdXN1YWxseSB5b3Ugd291bGQgc3RvcmUgd2luZG93c1xuICAgIC8vIGluIGFuIGFycmF5IGlmIHlvdXIgYXBwIHN1cHBvcnRzIG11bHRpIHdpbmRvd3MsIHRoaXMgaXMgdGhlIHRpbWVcbiAgICAvLyB3aGVuIHlvdSBzaG91bGQgZGVsZXRlIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnQuXG4gICAgd2luID0gbnVsbDtcbiAgfSk7XG59XG5cbi8vIFRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIHdoZW4gRWxlY3Ryb24gaGFzIGZpbmlzaGVkXG4vLyBpbml0aWFsaXphdGlvbiBhbmQgaXMgcmVhZHkgdG8gY3JlYXRlIGJyb3dzZXIgd2luZG93cy5cbi8vIFNvbWUgQVBJcyBjYW4gb25seSBiZSB1c2VkIGFmdGVyIHRoaXMgZXZlbnQgb2NjdXJzLlxuYXBwLm9uKCdyZWFkeScsIGNyZWF0ZVdpbmRvdyk7XG5cbi8vIFF1aXQgd2hlbiBhbGwgd2luZG93cyBhcmUgY2xvc2VkLlxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgLy8gT24gbWFjT1MgaXQgaXMgY29tbW9uIGZvciBhcHBsaWNhdGlvbnMgYW5kIHRoZWlyIG1lbnUgYmFyXG4gIC8vIHRvIHN0YXkgYWN0aXZlIHVudGlsIHRoZSB1c2VyIHF1aXRzIGV4cGxpY2l0bHkgd2l0aCBDbWQgKyBRXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuICAgIGFwcC5xdWl0KCk7XG4gIH1cbn0pO1xuXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xuICAvLyBPbiBtYWNPUyBpdCdzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgaW4gdGhlIGFwcCB3aGVuIHRoZVxuICAvLyBkb2NrIGljb24gaXMgY2xpY2tlZCBhbmQgdGhlcmUgYXJlIG5vIG90aGVyIHdpbmRvd3Mgb3Blbi5cbiAgaWYgKHdpbiA9PT0gbnVsbCkge1xuICAgIGNyZWF0ZVdpbmRvdygpO1xuICB9XG59KTtcblxuLy8gSW4gdGhpcyBmaWxlIHlvdSBjYW4gaW5jbHVkZSB0aGUgcmVzdCBvZiB5b3VyIGFwcCdzIHNwZWNpZmljIG1haW4gcHJvY2Vzc1xuLy8gY29kZS4gWW91IGNhbiBhbHNvIHB1dCB0aGVtIGluIHNlcGFyYXRlIGZpbGVzIGFuZCByZXF1aXJlIHRoZW0gaGVyZS5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hcHAvaW5kZXgudHMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("module.exports = require(\"electron\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzY5MjgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZWxlY3Ryb25cIlxuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }
/******/ ]);