/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const lodash_1 = require("lodash");
exports.ScorePicker = (props) => {
    const values = [1, 2, 3, 4, 5];
    if (props.readOnly) {
        return (React.createElement("span", { className: 'score-picker' }, values.map((val) => (React.createElement("i", { key: val, className: 'fa fa-star' + (val > props.value ? '-o' : ''), "aria-hidden": 'true' })))));
    }
    else {
        return (React.createElement("span", { className: 'score-picker editing' }, lodash_1.reverse(values).map((val) => (React.createElement("i", { key: val, className: 'fa fa-star' + (val > props.value ? '-o' : ''), onClick: () => {
                if (props.onChange === undefined) {
                    throw new Error('An onChange handler is required');
                }
                props.onChange(val);
            }, "aria-hidden": 'true' })))));
    }
};
//# sourceMappingURL=ScorePicker.js.map