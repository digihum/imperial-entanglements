/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
exports.EditableHeader = function (props) {
    if (!props.edit || props.value == null) {
        return (React.createElement("h2", null,
            props.value,
            React.createElement("sup", null,
                React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: props.setEdit }))));
    }
    else {
        return (React.createElement("span", null,
            React.createElement("input", { type: 'text', value: props.value, className: 'text-edit-header', onChange: function (e) { return props.onChange(e.target.value); } }),
            React.createElement("button", { onClick: props.acceptChanges },
                React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
            React.createElement("button", { onClick: props.cancelChanges },
                React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' }))));
    }
};
//# sourceMappingURL=EditableHeader.js.map