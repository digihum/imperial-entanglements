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

	eval("/**\r\n * @fileOverview Abstract interface for sources\r\n * @author <a href=\"mailto:tim.hollies@warwick.ac.uk\">Tim Hollies</a>\r\n * @version 0.0.1\r\n */\r\n\"use strict\";\r\nconst electron_1 = __webpack_require__(1);\r\n// Keep a global reference of the window object, if you don't, the window will\r\n// be closed automatically when the JavaScript object is garbage collected.\r\nlet win;\r\nfunction createWindow() {\r\n    // Create the browser window.\r\n    win = new electron_1.BrowserWindow({\r\n        width: 1080,\r\n        height: 786,\r\n        webPreferences: {\r\n            webSecurity: false\r\n        }\r\n    });\r\n    // and load the index.html of the app.\r\n    win.loadURL('file:///' + __dirname + '/index.html');\r\n    //win.setMenu(null);\r\n    //\r\n    // Open the DevTools.\r\n    win.webContents.openDevTools();\r\n    // Emitted when the window is closed.\r\n    win.on('closed', () => {\r\n        // Dereference the window object, usually you would store windows\r\n        // in an array if your app supports multi windows, this is the time\r\n        // when you should delete the corresponding element.\r\n        win = null;\r\n    });\r\n}\r\n// This method will be called when Electron has finished\r\n// initialization and is ready to create browser windows.\r\n// Some APIs can only be used after this event occurs.\r\nelectron_1.app.on('ready', createWindow);\r\n// Quit when all windows are closed.\r\nelectron_1.app.on('window-all-closed', () => {\r\n    // On macOS it is common for applications and their menu bar\r\n    // to stay active until the user quits explicitly with Cmd + Q\r\n    if (process.platform !== 'darwin') {\r\n        electron_1.app.quit();\r\n    }\r\n});\r\nelectron_1.app.on('activate', () => {\r\n    // On macOS it's common to re-create a window in the app when the\r\n    // dock icon is clicked and there are no other windows open.\r\n    if (win === null) {\r\n        createWindow();\r\n    }\r\n});\r\n// In this file you can include the rest of your app's specific main process\r\n// code. You can also put them in separate files and require them here.\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2luZGV4LnRzP2VjNmUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRzs7QUFFSCwwQ0FBNkM7QUFFN0MsOEVBQThFO0FBQzlFLDJFQUEyRTtBQUMzRSxJQUFJLEdBQUcsQ0FBQztBQUVSO0lBRUUsNkJBQTZCO0lBQzdCLEdBQUcsR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDcEIsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNkLFdBQVcsRUFBRSxLQUFLO1NBQ25CO0tBQ0osQ0FBQyxDQUFDO0lBRUgsc0NBQXNDO0lBQ3RDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLFNBQVMsR0FBRyxhQUFhLENBQUMsQ0FBQztJQUVwRCxvQkFBb0I7SUFFcEIsRUFBRTtJQUVGLHFCQUFxQjtJQUNyQixHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBRS9CLHFDQUFxQztJQUNyQyxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUNmLGlFQUFpRTtRQUNqRSxtRUFBbUU7UUFDbkUsb0RBQW9EO1FBQ3BELEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDYixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCx3REFBd0Q7QUFDeEQseURBQXlEO0FBQ3pELHNEQUFzRDtBQUN0RCxjQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUU5QixvQ0FBb0M7QUFDcEMsY0FBRyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRTtJQUMxQiw0REFBNEQ7SUFDNUQsOERBQThEO0lBQzlELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNsQyxjQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDYixDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxjQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUNqQixpRUFBaUU7SUFDakUsNERBQTREO0lBQzVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLFlBQVksRUFBRSxDQUFDO0lBQ2pCLENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILDRFQUE0RTtBQUM1RSx1RUFBdUUiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlldyBBYnN0cmFjdCBpbnRlcmZhY2UgZm9yIHNvdXJjZXNcbiAqIEBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzp0aW0uaG9sbGllc0B3YXJ3aWNrLmFjLnVrXCI+VGltIEhvbGxpZXM8L2E+XG4gKiBAdmVyc2lvbiAwLjAuMVxuICovXG5cbmltcG9ydCB7YXBwLCBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nO1xuXG4vLyBLZWVwIGEgZ2xvYmFsIHJlZmVyZW5jZSBvZiB0aGUgd2luZG93IG9iamVjdCwgaWYgeW91IGRvbid0LCB0aGUgd2luZG93IHdpbGxcbi8vIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIEphdmFTY3JpcHQgb2JqZWN0IGlzIGdhcmJhZ2UgY29sbGVjdGVkLlxubGV0IHdpbjtcblxuZnVuY3Rpb24gY3JlYXRlV2luZG93ICgpIHtcblxuICAvLyBDcmVhdGUgdGhlIGJyb3dzZXIgd2luZG93LlxuICB3aW4gPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICB3aWR0aDogMTA4MCxcbiAgICAgIGhlaWdodDogNzg2LFxuICAgICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgICAgd2ViU2VjdXJpdHk6IGZhbHNlXG4gICAgICB9XG4gIH0pO1xuXG4gIC8vIGFuZCBsb2FkIHRoZSBpbmRleC5odG1sIG9mIHRoZSBhcHAuXG4gIHdpbi5sb2FkVVJMKCdmaWxlOi8vLycgKyBfX2Rpcm5hbWUgKyAnL2luZGV4Lmh0bWwnKTtcblxuICAvL3dpbi5zZXRNZW51KG51bGwpO1xuXG4gIC8vXG5cbiAgLy8gT3BlbiB0aGUgRGV2VG9vbHMuXG4gIHdpbi53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcblxuICAvLyBFbWl0dGVkIHdoZW4gdGhlIHdpbmRvdyBpcyBjbG9zZWQuXG4gIHdpbi5vbignY2xvc2VkJywgKCkgPT4ge1xuICAgIC8vIERlcmVmZXJlbmNlIHRoZSB3aW5kb3cgb2JqZWN0LCB1c3VhbGx5IHlvdSB3b3VsZCBzdG9yZSB3aW5kb3dzXG4gICAgLy8gaW4gYW4gYXJyYXkgaWYgeW91ciBhcHAgc3VwcG9ydHMgbXVsdGkgd2luZG93cywgdGhpcyBpcyB0aGUgdGltZVxuICAgIC8vIHdoZW4geW91IHNob3VsZCBkZWxldGUgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudC5cbiAgICB3aW4gPSBudWxsO1xuICB9KTtcbn1cblxuLy8gVGhpcyBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgd2hlbiBFbGVjdHJvbiBoYXMgZmluaXNoZWRcbi8vIGluaXRpYWxpemF0aW9uIGFuZCBpcyByZWFkeSB0byBjcmVhdGUgYnJvd3NlciB3aW5kb3dzLlxuLy8gU29tZSBBUElzIGNhbiBvbmx5IGJlIHVzZWQgYWZ0ZXIgdGhpcyBldmVudCBvY2N1cnMuXG5hcHAub24oJ3JlYWR5JywgY3JlYXRlV2luZG93KTtcblxuLy8gUXVpdCB3aGVuIGFsbCB3aW5kb3dzIGFyZSBjbG9zZWQuXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xuICAvLyBPbiBtYWNPUyBpdCBpcyBjb21tb24gZm9yIGFwcGxpY2F0aW9ucyBhbmQgdGhlaXIgbWVudSBiYXJcbiAgLy8gdG8gc3RheSBhY3RpdmUgdW50aWwgdGhlIHVzZXIgcXVpdHMgZXhwbGljaXRseSB3aXRoIENtZCArIFFcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgYXBwLnF1aXQoKTtcbiAgfVxufSk7XG5cbmFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XG4gIC8vIE9uIG1hY09TIGl0J3MgY29tbW9uIHRvIHJlLWNyZWF0ZSBhIHdpbmRvdyBpbiB0aGUgYXBwIHdoZW4gdGhlXG4gIC8vIGRvY2sgaWNvbiBpcyBjbGlja2VkIGFuZCB0aGVyZSBhcmUgbm8gb3RoZXIgd2luZG93cyBvcGVuLlxuICBpZiAod2luID09PSBudWxsKSB7XG4gICAgY3JlYXRlV2luZG93KCk7XG4gIH1cbn0pO1xuXG4vLyBJbiB0aGlzIGZpbGUgeW91IGNhbiBpbmNsdWRlIHRoZSByZXN0IG9mIHlvdXIgYXBwJ3Mgc3BlY2lmaWMgbWFpbiBwcm9jZXNzXG4vLyBjb2RlLiBZb3UgY2FuIGFsc28gcHV0IHRoZW0gaW4gc2VwYXJhdGUgZmlsZXMgYW5kIHJlcXVpcmUgdGhlbSBoZXJlLlxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FwcC9pbmRleC50cyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("module.exports = require(\"electron\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzY5MjgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZWxlY3Ryb25cIlxuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }
/******/ ]);