/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
exports.SearchBar = (props) => {
    const filterFunc = (s) => {
        return (a) => {
            if (s.length === 0) {
                return true;
            }
            return props.getValue(a).toLowerCase().indexOf(s.toLowerCase()) !== -1;
        };
    };
    return (React.createElement("div", null,
        React.createElement("div", { className: 'input-addon-formgroup' },
            React.createElement("span", { className: 'input-addon-icon' },
                React.createElement("i", { className: 'fa fa-search fa-fw' })),
            React.createElement("input", { type: 'text', className: 'form-control with-addon', onChange: (e) => props.setFilterFunc(filterFunc(e.target.value)) }))));
};
//# sourceMappingURL=SearchBar.js.map