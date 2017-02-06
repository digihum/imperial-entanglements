/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const react_router_1 = require("react-router");
exports.StatsGrid = (props) => {
    return (React.createElement("section", { className: 'stats-grid' },
        React.createElement(react_router_1.Link, { to: '/edit/entity' },
            React.createElement("div", { className: 'entity' },
                React.createElement("span", { className: 'item-name' }, "Entities"),
                React.createElement("span", { className: 'item-count' }, props.stats.entity))),
        React.createElement(react_router_1.Link, { to: '/edit/entity_type' },
            React.createElement("div", { className: 'entity_type' },
                React.createElement("span", { className: 'item-name' }, "Entity Types"),
                React.createElement("span", { className: 'item-count' }, props.stats.entityType))),
        React.createElement(react_router_1.Link, { to: '/edit/source' },
            React.createElement("div", { className: 'source' },
                React.createElement("span", { className: 'item-name' }, "Sources"),
                React.createElement("span", { className: 'item-count' }, props.stats.source))),
        React.createElement(react_router_1.Link, { to: '/edit/predicate' },
            React.createElement("div", { className: 'predicate' },
                React.createElement("span", { className: 'item-name' }, "Properties"),
                React.createElement("span", { className: 'item-count' }, props.stats.predicate))),
        React.createElement("div", { className: 'record' },
            React.createElement("span", { className: 'item-name' }, "Records"),
            React.createElement("span", { className: 'item-count' }, props.stats.record))));
};
//# sourceMappingURL=StatsGrid.js.map