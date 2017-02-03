/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const StatsGrid_1 = require("../common/stats/StatsGrid");
exports.AdminApp = (props) => (React.createElement("div", { className: 'page' },
    React.createElement("section", null,
        React.createElement("h1", null, "VRE App"),
        props.stats !== null ? (React.createElement(StatsGrid_1.StatsGrid, { stats: props.stats })) : null)));
//# sourceMappingURL=AdminApp.js.map