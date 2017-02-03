/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const lunr = require("lunr");
const lodash_1 = require("lodash");
class ComboDropdown extends React.Component {
    constructor() {
        super();
        this.state = {
            searchString: '',
            showingDropDown: false,
            filteredOptions: [],
            highlightedIndex: null,
            dropDownHeight: 0
        };
    }
    componentWillMount() {
        this.ignoreBlur = false;
        this.ignoreClick = false;
        this.recalculateHeight = true;
        this.dropDownBoxElement = null;
        this.setState({
            filteredOptions: this.props.options,
            searchString: this.props.value === null || this.props.value.key === null ? '' : this.props.value.key
        });
    }
    componentWillReceiveProps(newProps) {
        let filterString = '';
        if (this.props.value === null) {
            if (newProps.value === null) {
                // change nothing
                filterString = this.state.searchString;
            }
            else {
                // set to newProps value
                filterString = newProps.value.key;
            }
        }
        else {
            if (newProps.value === null) {
                // set to ''
                filterString = '';
            }
            else {
                if (newProps.value === this.props.value) {
                    // change nothing
                    filterString = this.state.searchString;
                }
                else {
                    // set to newProps value
                    filterString = newProps.value.key;
                }
            }
        }
        //const filterString = newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString;
        this.updateFilter(filterString, newProps);
        this.setState({
            searchString: filterString
        });
    }
    changeSearchString(event) {
        this.setState({
            searchString: event.target.value,
            showingDropDown: true
        }, () => {
            this.updateFilter(this.state.searchString, this.props);
            if (this.props.updateSearchString !== undefined) {
                this.props.updateSearchString(this.state.searchString);
            }
        });
    }
    updateSearchString(s) {
        if (this.props.updateSearchString !== undefined) {
            this.props.updateSearchString(s);
        }
    }
    updateFilter(filter, props) {
        let filtered = [];
        if (filter.length > 0) {
            const idx = lunr(function () {
                this.field('key', { boost: 10 });
            });
            props.options.forEach((opt, i) => idx.add(Object.assign({}, opt, { id: i })));
            const result = idx.search(filter);
            for (let i = 0; i < result.length; i += 1) {
                filtered.push(props.options[result[i].ref]);
            }
        }
        else {
            filtered = props.options;
        }
        if (this.dropDownBoxElement !== null) {
            this.recalculateHeight = true;
            this.calculateDropdownHeight(this.dropDownBoxElement);
        }
        this.setState({
            filteredOptions: filtered
        });
    }
    addNewAction(option) {
        this.props.createNewValue(option);
    }
    selectOption(option) {
        this.props.setValue(option);
        this.ignoreBlur = false;
        this.recalculateHeight = true;
        this.setState({ showingDropDown: false, searchString: option.key });
        this.updateSearchString(option.key);
    }
    handleInputBlur() {
        if (!this.ignoreBlur) {
            if (this.state.searchString.length === 0) {
                this.setState({ searchString: '' });
            }
            else {
                if (lodash_1.findIndex(this.props.options, (option) => option.key === this.state.searchString) === -1) {
                    this.setState({ searchString: this.props.value === null ? '' : this.props.value.key }, () => {
                        this.updateFilter(this.props.value === null ? '' : this.props.value.key, this.props);
                    });
                }
            }
            this.recalculateHeight = true;
            this.setState({
                showingDropDown: false
            });
        }
    }
    handleInputFocus() {
        if (this.ignoreBlur) {
            this.ignoreBlur = true;
            return;
        }
        // We don't want `selectItemFromMouse` to trigger when
        // the user clicks into the input to focus it, so set this
        // flag to cancel out the logic in `handleInputClick`.
        // The event order is:  MouseDown -> Focus -> MouseUp -> Click
        this.ignoreClick = true;
        this.setState({ showingDropDown: true });
    }
    handleInputClick() {
        // Input will not be focused if it's disabled
        if (this.isInputFocused() && this.state.showingDropDown === false) {
            this.setState({ showingDropDown: true });
        }
        else {
            if (this.state.highlightedIndex !== null && !this.ignoreClick) {
                this.selectItemFromMouse(this.state.filteredOptions[this.state.highlightedIndex]);
            }
            else {
                this.ignoreClick = false;
            }
        }
    }
    selectItemFromMouse(item) {
        this.recalculateHeight = true;
        this.setState({
            showingDropDown: false,
            highlightedIndex: null
        }, () => {
            this.props.setValue(item);
            this.refs[ComboDropdown.comboDropdownInputBoxRef].focus();
        });
    }
    isInputFocused() {
        const el = this.refs[ComboDropdown.comboDropdownInputBoxRef];
        return el.ownerDocument && (el === el.ownerDocument.activeElement);
    }
    clearSearchBox() {
        this.props.setValue(null);
        this.setState({ searchString: '' });
        this.refs[ComboDropdown.comboDropdownInputBoxRef].focus();
    }
    calculateDropdownHeight(val) {
        this.dropDownBoxElement = val;
        if (val === null || !this.recalculateHeight) {
            return;
        }
        else {
            this.setState({
                dropDownHeight: window.document.body.getBoundingClientRect().bottom - val.getBoundingClientRect().top - 32
            });
            this.recalculateHeight = false;
        }
    }
    render() {
        return (React.createElement("div", { className: 'combo-dropdown ' + this.props.additionalClasses.join(' ') },
            React.createElement("div", null,
                React.createElement("input", { type: 'text', ref: ComboDropdown.comboDropdownInputBoxRef, className: 'search-input', value: this.state.searchString, placeholder: 'Click here and start typing..', onBlur: this.handleInputBlur.bind(this), onFocus: this.handleInputFocus.bind(this), onChange: this.changeSearchString.bind(this), onClick: this.handleInputClick.bind(this) }),
                this.state.searchString.length > 0 ? (React.createElement("i", { className: 'fa fa-times clear-button', onClick: this.clearSearchBox.bind(this) })) : null),
            this.state.showingDropDown ? (React.createElement("div", { className: 'dropdown', style: { maxHeight: this.state.dropDownHeight, overflowY: 'auto' }, ref: this.calculateDropdownHeight.bind(this) },
                React.createElement("ul", null,
                    this.state.searchString.length === 0 && this.props.allowNew ? (React.createElement("li", { className: 'add', onMouseDown: () => this.ignoreBlur = true, onClick: () => this.addNewAction('') },
                        React.createElement("i", { className: 'fa fa-plus', "aria-hidden": 'true' }),
                        "Add new ",
                        this.props.typeName)) : null,
                    this.state.filteredOptions.map((opt, i) => (React.createElement("li", { key: `opt-${opt.key}-${i}`, onMouseDown: () => this.ignoreBlur = true, onClick: () => this.selectOption(opt) }, opt.key))),
                    this.state.searchString.length > 0 && this.props.allowNew ? (React.createElement("li", { className: 'add', onMouseDown: () => this.ignoreBlur = true, onClick: () => this.addNewAction(this.state.searchString) },
                        React.createElement("i", { className: 'fa fa-plus', "aria-hidden": 'true' }),
                        "Add new ",
                        this.props.typeName,
                        ": '",
                        this.state.searchString,
                        "'")) : null))) : null));
    }
}
ComboDropdown.defaultProps = {
    allowNew: true,
    additionalClasses: [],
    updateSearchString: lodash_1.noop
};
ComboDropdown.comboDropdownInputBoxRef = 'comboDropDownInputBox';
exports.ComboDropdown = ComboDropdown;
class NumberComboDropdown extends ComboDropdown {
}
exports.NumberComboDropdown = NumberComboDropdown;
class StringComboDropdown extends ComboDropdown {
}
exports.StringComboDropdown = StringComboDropdown;
//# sourceMappingURL=ComboDropdown.js.map