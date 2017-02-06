/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
function EditableFieldHOC(WrappedComponent) {
    return (function (_super) {
        __extends(EditableFieldComponent, _super);
        function EditableFieldComponent() {
            var _this = _super.call(this) || this;
            _this.state = {
                edit: false,
                internalValue: null
            };
            return _this;
        }
        EditableFieldComponent.prototype.componentWillMount = function () {
            this.setState({ internalValue: this.props.value === undefined ? null : this.props.value });
        };
        EditableFieldComponent.prototype.componentWillReceiveProps = function (newProps) {
            this.setState({ internalValue: newProps.value });
        };
        EditableFieldComponent.prototype.switchToEditState = function () {
            this.setState({ edit: true, internalValue: this.props.value });
        };
        EditableFieldComponent.prototype.setInternalValue = function (internalValue) {
            this.setState({ internalValue: internalValue });
        };
        EditableFieldComponent.prototype.acceptChanges = function () {
            this.props.onChange(this.state.internalValue);
            this.setState({ edit: false });
        };
        EditableFieldComponent.prototype.cancelChanges = function () {
            this.setState({ edit: false, internalValue: this.props.value });
        };
        EditableFieldComponent.prototype.render = function () {
            var _this = this;
            return (React.createElement(WrappedComponent, __assign({}, this.props, { edit: this.state.edit, value: this.state.internalValue, onChange: this.setInternalValue.bind(this), setEdit: this.switchToEditState.bind(this), acceptChanges: this.acceptChanges.bind(this), cancelChanges: this.cancelChanges.bind(this), onDelete: function (e) { return _this.props.onDelete !== undefined ? _this.props.onDelete(_this.props.value) : null; } })));
        };
        return EditableFieldComponent;
    }(React.Component));
}
exports.EditableFieldHOC = EditableFieldHOC;
//# sourceMappingURL=EditableFieldComponent.js.map