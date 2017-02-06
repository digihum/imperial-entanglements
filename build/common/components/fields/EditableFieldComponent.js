/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
function EditableFieldHOC(WrappedComponent) {
    return class EditableFieldComponent extends React.Component {
        constructor() {
            super();
            this.state = {
                edit: false,
                internalValue: null
            };
        }
        componentWillMount() {
            this.setState({ internalValue: this.props.value === undefined ? null : this.props.value });
        }
        componentWillReceiveProps(newProps) {
            this.setState({ internalValue: newProps.value });
        }
        switchToEditState() {
            this.setState({ edit: true, internalValue: this.props.value });
        }
        setInternalValue(internalValue) {
            this.setState({ internalValue });
        }
        acceptChanges() {
            this.props.onChange(this.state.internalValue);
            this.setState({ edit: false });
        }
        cancelChanges() {
            this.setState({ edit: false, internalValue: this.props.value });
        }
        render() {
            return (React.createElement(WrappedComponent, __assign({}, this.props, { edit: this.state.edit, value: this.state.internalValue, onChange: this.setInternalValue.bind(this), setEdit: this.switchToEditState.bind(this), acceptChanges: this.acceptChanges.bind(this), cancelChanges: this.cancelChanges.bind(this), onDelete: (e) => this.props.onDelete !== undefined ? this.props.onDelete(this.props.value) : null })));
        }
    };
}
exports.EditableFieldHOC = EditableFieldHOC;
//# sourceMappingURL=EditableFieldComponent.js.map