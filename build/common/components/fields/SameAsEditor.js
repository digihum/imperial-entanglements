/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const mousetrap = require("mousetrap");
class SameAsEditor extends React.Component {
    constructor(props) {
        super();
        this.state = {
            temporaryValue: '',
            urls: props.value === null || props.value.length === 0 ? [] : props.value.split(',')
        };
    }
    componentWillReceiveProps(props) {
        this.setState({
            temporaryValue: '',
            urls: props.value === null || props.value.length === 0 ? [] : props.value.split(',')
        });
    }
    addItemToList() {
        if (this.state.temporaryValue.length === 0) {
            return;
        }
        this.setState({ urls: this.state.urls.concat([this.state.temporaryValue]), temporaryValue: '' }, () => this.props.onChange(this.state.urls.join(',')));
    }
    removeItemFromList(itemId) {
        this.setState({
            urls: this.state.urls.filter((val, i) => i !== itemId)
        }, () => this.props.onChange(this.state.urls.join(',')));
    }
    setupKeyboardShortcuts(val) {
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.addItemToList.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancelChanges);
            this.keyboardShortcuts.bind('ctrl+s', (e) => {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    // internet explorer
                    e.returnValue = false;
                }
                this.props.acceptChanges();
            });
        }
        else {
            this.keyboardShortcuts.unbind('return');
            this.keyboardShortcuts.unbind('escape');
            this.keyboardShortcuts.unbind('ctrl+s');
        }
    }
    render() {
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
                    React.createElement("input", { type: 'text', value: this.state.temporaryValue, ref: this.setupKeyboardShortcuts.bind(this), onChange: (e) => this.setState({ temporaryValue: e.target.value }), className: 'form-control with-addon' }),
                    React.createElement("span", { className: 'input-addon-icon right button', onClick: this.addItemToList.bind(this) },
                        React.createElement("i", { className: 'fa fa-plus' }))))) : null,
            React.createElement("ul", { className: 'same-as-list' }, this.state.urls.map((url, i) => (React.createElement("li", { key: `li-${url}` },
                React.createElement("a", { target: '_blank', href: url }, url),
                " ",
                this.props.edit ? (React.createElement("i", { className: 'fa fa-times close-button', onClick: this.removeItemFromList.bind(this, i) })) : null))))));
    }
}
exports.SameAsEditor = SameAsEditor;
//# sourceMappingURL=SameAsEditor.js.map