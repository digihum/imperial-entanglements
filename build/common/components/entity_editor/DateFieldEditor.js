/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
var DatePickerDropdown_1 = require("../fields/DatePickerDropdown");
exports.DateFieldEditor = function (props) {
    return (React.createElement("div", { className: 'date-selector' },
        React.createElement(DatePickerDropdown_1.DatePickerDropdown, { value: props.value, setValue: props.onChange })));
};
//# sourceMappingURL=DateFieldEditor.js.map