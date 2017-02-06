/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
exports.StringFieldEditor = (props) => {
    return (React.createElement("input", { type: 'text', value: props.value, onChange: (e) => props.onChange(e.target.value) }));
};
//# sourceMappingURL=StringFieldEditor.js.map