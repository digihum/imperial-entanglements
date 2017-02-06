/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
exports.StringFieldEditor = function (props) {
    return (React.createElement("input", { type: 'text', value: props.value, onChange: function (e) { return props.onChange(e.target.value); } }));
};
//# sourceMappingURL=StringFieldEditor.js.map