/**
 * @fileOverview Entity Field Editor - select box for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
var ComboDropdown_1 = require("../ComboDropdown");
var lodash_1 = require("lodash");
exports.EntityFieldEditor = function (props) {
    // build the options list
    var options = props.entities.map(function (entity) {
        return ({ key: entity.label, value: entity.uid !== null ? entity.uid : null });
    });
    // find the default option to display
    var selectedOption = options.find(function (opt) {
        return opt.value !== null && opt.value === props.value;
    });
    if (selectedOption === undefined) {
        selectedOption = { key: '', value: null };
    }
    return (React.createElement(ComboDropdown_1.NumberComboDropdown, { options: options, typeName: 'entity type', allowNew: false, value: selectedOption, setValue: function (val) { return val !== null && val.value !== null ? props.onChange(val.value) : props.onChange(null); }, createNewValue: lodash_1.noop }));
};
//# sourceMappingURL=EntityFieldEditor.js.map