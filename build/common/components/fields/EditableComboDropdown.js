/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const ComboDropdown_1 = require("../ComboDropdown");
function EditableComboDropdown(props) {
    if (props.edit) {
        return (React.createElement("div", null,
            React.createElement(ComboDropdown_1.NumberComboDropdown, __assign({}, props.comboSettings, { value: props.value, setValue: props.onChange, allowNew: false, createNewValue: () => { } })),
            React.createElement("button", { onClick: props.acceptChanges },
                React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
            React.createElement("button", { onClick: props.cancelChanges },
                React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' }))));
    }
    else {
        return (React.createElement("div", null,
            props.value !== null && props.value.key.length > 0 ? props.value.key
                : (React.createElement("em", null, "No value")),
            React.createElement("sup", null,
                React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: props.setEdit }))));
    }
}
exports.EditableComboDropdown = EditableComboDropdown;
;
//# sourceMappingURL=EditableComboDropdown.js.map