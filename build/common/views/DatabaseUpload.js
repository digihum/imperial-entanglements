/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
exports.DatabaseUpload = function (props) { return (React.createElement("div", { className: 'page' },
    React.createElement("section", null,
        React.createElement("h1", null, "This is the database upload page"),
        React.createElement("input", { type: 'file', id: 'input', accept: '.sqlite' }),
        React.createElement("button", { onClick: function () { alert('Work in process'); } }, "Upload")))); };
//# sourceMappingURL=DatabaseUpload.js.map