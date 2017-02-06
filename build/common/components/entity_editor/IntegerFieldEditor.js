/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
exports.IntegerFieldEditor = function (props) {
    var integerFieldChangeHandler = function (e) { return props.onChange(e.target.value); };
    return (React.createElement("input", { type: 'number', value: props.value, onChange: integerFieldChangeHandler }));
};
//# sourceMappingURL=IntegerFieldEditor.js.map