/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
var lodash_1 = require("lodash");
exports.ScorePicker = function (props) {
    var values = [1, 2, 3, 4, 5];
    if (props.readOnly) {
        return (React.createElement("span", { className: 'score-picker' }, values.map(function (val) { return (React.createElement("i", { key: val, className: 'fa fa-star' + (val > props.value ? '-o' : ''), "aria-hidden": 'true' })); })));
    }
    else {
        return (React.createElement("span", { className: 'score-picker editing' }, lodash_1.reverse(values).map(function (val) { return (React.createElement("i", { key: val, className: 'fa fa-star' + (val > props.value ? '-o' : ''), onClick: function () {
                if (props.onChange === undefined) {
                    throw new Error('An onChange handler is required');
                }
                props.onChange(val);
            }, "aria-hidden": 'true' })); })));
    }
};
//# sourceMappingURL=ScorePicker.js.map