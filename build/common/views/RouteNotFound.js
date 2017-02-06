/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
exports.RouteNotFound = function (props) { return (React.createElement("section", null,
    React.createElement("h1", null,
        "The page at ",
        props.url,
        " does not exist :("))); };
//# sourceMappingURL=RouteNotFound.js.map