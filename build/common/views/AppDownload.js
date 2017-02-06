/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
exports.AppDownload = function (props) { return (React.createElement("div", { className: 'page' },
    React.createElement("section", null,
        React.createElement("h1", null, "App Download"),
        React.createElement("p", null, "Use this VRE without an internet connection! Simply download the app for your platform and then" + " " + "download a database snapshot from the main page. When you are ready, use the upload tool to merge" + " " + "your offline copy with the server."),
        React.createElement("ul", { className: 'links-list' },
            React.createElement("li", null,
                React.createElement("a", { href: 'https://github.com/digihum/imperial-entanglements-app/raw/master/bin/imperial-entanglements%20Setup%200.1.1.exe' },
                    React.createElement("i", { className: 'fa fa-windows' }),
                    " Windows")),
            React.createElement("li", null,
                React.createElement("a", { href: 'https://github.com/digihum/imperial-entanglements-app/raw/master/bin/mac/imperial-entanglements-0.1.1.dmg' },
                    React.createElement("i", { className: 'fa fa-apple' }),
                    " Mac")),
            React.createElement("li", null,
                React.createElement("a", { href: 'https://github.com/digihum/imperial-entanglements-app/raw/master/bin/imperial-entanglements-0.1.1-x86_64.AppImage' },
                    React.createElement("i", { className: 'fa fa-linux' }),
                    " Linux")))))); };
//# sourceMappingURL=AppDownload.js.map