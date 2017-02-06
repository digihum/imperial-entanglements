/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
var react_router_1 = require("react-router");
var StatsGrid_1 = require("../stats/StatsGrid");
var setTabList = function (data, router) {
    window.localStorage.setItem('open_tabs', JSON.stringify(data));
    router.transitionTo('/edit/empty');
};
var deleteTabSet = function (id) {
    fetch('/tabset/' + id, {
        method: 'DELETE',
        credentials: 'same-origin'
    });
};
exports.Admin = function (props, context) { return (React.createElement("div", { className: 'page' },
    React.createElement("section", null,
        React.createElement("h1", null, "Welcome to the admin pages"),
        React.createElement("ul", { className: 'links-list' },
            React.createElement("li", null,
                React.createElement(react_router_1.Link, { to: '/users' },
                    React.createElement("i", { className: 'fa fa-users' }),
                    " Manage Users")),
            React.createElement("li", null,
                React.createElement(react_router_1.Link, { to: '/app' },
                    React.createElement("i", { className: 'fa fa-download' }),
                    " Download app")),
            React.createElement("li", null,
                React.createElement("a", { href: '/snapshot' },
                    React.createElement("i", { className: 'fa fa-cloud-download' }),
                    " Download database snapshot")),
            React.createElement("li", null,
                React.createElement(react_router_1.Link, { to: '/upload' },
                    React.createElement("i", { className: 'fa fa-cloud-upload' }),
                    " Upload database file")))),
    React.createElement("section", null,
        React.createElement("h2", null, "Saved Tab Sets"),
        React.createElement("ul", { className: 'links-list' }, props.tabsets.map(function (tabset) {
            return (React.createElement("li", { key: "tabset-" + tabset.uid },
                React.createElement("span", { className: 'a' },
                    React.createElement("span", { onClick: function () { return setTabList(tabset.tabs, context.router); } }, tabset.name),
                    React.createElement("span", null,
                        React.createElement("i", { className: 'fa fa-times', onClick: function () { return deleteTabSet(tabset.uid); } })))));
        }))),
    props.stats !== null ? (React.createElement(StatsGrid_1.StatsGrid, { stats: props.stats })) : null)); };
exports.Admin.contextTypes = {
    router: React.PropTypes.object.isRequired
};
//# sourceMappingURL=Admin.js.map