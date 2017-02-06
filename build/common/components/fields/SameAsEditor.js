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
var React = require("react");
var mousetrap = require("mousetrap");
var SameAsEditor = (function (_super) {
    __extends(SameAsEditor, _super);
    function SameAsEditor(props) {
        var _this = _super.call(this) || this;
        _this.state = {
            temporaryValue: '',
            urls: props.value === null || props.value.length === 0 ? [] : props.value.split(',')
        };
        return _this;
    }
    SameAsEditor.prototype.componentWillReceiveProps = function (props) {
        this.setState({
            temporaryValue: '',
            urls: props.value === null || props.value.length === 0 ? [] : props.value.split(',')
        });
    };
    SameAsEditor.prototype.addItemToList = function () {
        var _this = this;
        if (this.state.temporaryValue.length === 0) {
            return;
        }
        this.setState({ urls: this.state.urls.concat([this.state.temporaryValue]), temporaryValue: '' }, function () { return _this.props.onChange(_this.state.urls.join(',')); });
    };
    SameAsEditor.prototype.removeItemFromList = function (itemId) {
        var _this = this;
        this.setState({
            urls: this.state.urls.filter(function (val, i) { return i !== itemId; })
        }, function () { return _this.props.onChange(_this.state.urls.join(',')); });
    };
    SameAsEditor.prototype.setupKeyboardShortcuts = function (val) {
        var _this = this;
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.addItemToList.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancelChanges);
            this.keyboardShortcuts.bind('ctrl+s', function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    // internet explorer
                    e.returnValue = false;
                }
                _this.props.acceptChanges();
            });
        }
        else {
            this.keyboardShortcuts.unbind('return');
            this.keyboardShortcuts.unbind('escape');
            this.keyboardShortcuts.unbind('ctrl+s');
        }
    };
    SameAsEditor.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: 'same-as-box' },
            React.createElement("label", { className: 'small' },
                "Same As ",
                !this.props.edit ? (React.createElement("sup", null,
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: this.props.setEdit }))) : null),
            this.props.edit ? (React.createElement("div", { className: 'edit-group' },
                React.createElement("button", { onClick: this.props.acceptChanges },
                    React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
                React.createElement("button", { onClick: this.props.cancelChanges },
                    React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' })),
                React.createElement("div", { className: 'input-addon-formgroup' },
                    React.createElement("input", { type: 'text', value: this.state.temporaryValue, ref: this.setupKeyboardShortcuts.bind(this), onChange: function (e) { return _this.setState({ temporaryValue: e.target.value }); }, className: 'form-control with-addon' }),
                    React.createElement("span", { className: 'input-addon-icon right button', onClick: this.addItemToList.bind(this) },
                        React.createElement("i", { className: 'fa fa-plus' }))))) : null,
            React.createElement("ul", { className: 'same-as-list' }, this.state.urls.map(function (url, i) { return (React.createElement("li", { key: "li-" + url },
                React.createElement("a", { target: '_blank', href: url }, url),
                " ",
                _this.props.edit ? (React.createElement("i", { className: 'fa fa-times close-button', onClick: _this.removeItemFromList.bind(_this, i) })) : null)); }))));
    };
    return SameAsEditor;
}(React.Component));
exports.SameAsEditor = SameAsEditor;
//# sourceMappingURL=SameAsEditor.js.map