/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
exports.IntegerFieldEditor = (props) => {
    const integerFieldChangeHandler = (e) => props.onChange(e.target.value);
    return (React.createElement("input", { type: 'number', value: props.value, onChange: integerFieldChangeHandler }));
};
//# sourceMappingURL=IntegerFieldEditor.js.map