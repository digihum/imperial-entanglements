/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const DatePickerDropdown_1 = require("../fields/DatePickerDropdown");
exports.DateFieldEditor = (props) => {
    return (React.createElement("div", { className: 'date-selector' },
        React.createElement(DatePickerDropdown_1.DatePickerDropdown, { value: props.value, setValue: props.onChange })));
};
//# sourceMappingURL=DateFieldEditor.js.map