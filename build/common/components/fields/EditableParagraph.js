/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const mousetrap = require("mousetrap");
exports.EditableParagraph = (props) => {
    let keyBoardShortcuts;
    const bindKeyboard = (val) => {
        if (val !== null) {
            val.focus();
            keyBoardShortcuts = new mousetrap(val);
            keyBoardShortcuts.bind('ctrl+return', props.acceptChanges);
            keyBoardShortcuts.bind('escape', props.cancelChanges);
        }
        else {
            keyBoardShortcuts.unbind('ctrl+return');
        }
    };
    if (!props.edit) {
        return (React.createElement("div", { onClick: props.setEdit, className: 'editable-paragraph-box' },
            React.createElement("p", null,
                props.value === null || props.value.length > 0 ? props.value
                    : (React.createElement("em", null, "No value")),
                React.createElement("sup", null,
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true' })))));
    }
    else {
        return (React.createElement("div", null,
            React.createElement("textarea", { value: props.value === null ? '' : props.value, ref: bindKeyboard, onChange: (e) => props.onChange(e.target.value), style: { width: '100%', height: '6em' } }),
            React.createElement("button", { onClick: props.acceptChanges },
                React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
            React.createElement("button", { onClick: props.cancelChanges },
                React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' }))));
    }
};
//# sourceMappingURL=EditableParagraph.js.map