/**
 * @fileOverview Entity Field Editor - select box for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const ComboDropdown_1 = require("../ComboDropdown");
const lodash_1 = require("lodash");
exports.EntityFieldEditor = (props) => {
    // build the options list
    const options = props.entities.map((entity) => ({ key: entity.label, value: entity.uid !== null ? entity.uid : null }));
    // find the default option to display
    let selectedOption = options.find((opt) => opt.value !== null && opt.value === props.value);
    if (selectedOption === undefined) {
        selectedOption = { key: '', value: null };
    }
    return (React.createElement(ComboDropdown_1.NumberComboDropdown, { options: options, typeName: 'entity type', allowNew: false, value: selectedOption, setValue: (val) => val !== null && val.value !== null ? props.onChange(val.value) : props.onChange(null), createNewValue: lodash_1.noop }));
};
//# sourceMappingURL=EntityFieldEditor.js.map