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
var lunr = require("lunr");
var lodash_1 = require("lodash");
var ComboDropdown = (function (_super) {
    __extends(ComboDropdown, _super);
    function ComboDropdown() {
        var _this = _super.call(this) || this;
        _this.state = {
            searchString: '',
            showingDropDown: false,
            filteredOptions: [],
            highlightedIndex: null,
            dropDownHeight: 0
        };
        return _this;
    }
    ComboDropdown.prototype.componentWillMount = function () {
        this.ignoreBlur = false;
        this.ignoreClick = false;
        this.recalculateHeight = true;
        this.dropDownBoxElement = null;
        this.setState({
            filteredOptions: this.props.options,
            searchString: this.props.value === null || this.props.value.key === null ? '' : this.props.value.key
        });
    };
    ComboDropdown.prototype.componentWillReceiveProps = function (newProps) {
        var filterString = '';
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
    };
    ComboDropdown.prototype.changeSearchString = function (event) {
        var _this = this;
        this.setState({
            searchString: event.target.value,
            showingDropDown: true
        }, function () {
            _this.updateFilter(_this.state.searchString, _this.props);
            if (_this.props.updateSearchString !== undefined) {
                _this.props.updateSearchString(_this.state.searchString);
            }
        });
    };
    ComboDropdown.prototype.updateSearchString = function (s) {
        if (this.props.updateSearchString !== undefined) {
            this.props.updateSearchString(s);
        }
    };
    ComboDropdown.prototype.updateFilter = function (filter, props) {
        var filtered = [];
        if (filter.length > 0) {
            var idx_1 = lunr(function () {
                this.field('key', { boost: 10 });
            });
            props.options.forEach(function (opt, i) { return idx_1.add(Object.assign({}, opt, { id: i })); });
            var result = idx_1.search(filter);
            for (var i = 0; i < result.length; i += 1) {
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
    };
    ComboDropdown.prototype.addNewAction = function (option) {
        this.props.createNewValue(option);
    };
    ComboDropdown.prototype.selectOption = function (option) {
        this.props.setValue(option);
        this.ignoreBlur = false;
        this.recalculateHeight = true;
        this.setState({ showingDropDown: false, searchString: option.key });
        this.updateSearchString(option.key);
    };
    ComboDropdown.prototype.handleInputBlur = function () {
        var _this = this;
        if (!this.ignoreBlur) {
            if (this.state.searchString.length === 0) {
                this.setState({ searchString: '' });
            }
            else {
                if (lodash_1.findIndex(this.props.options, function (option) { return option.key === _this.state.searchString; }) === -1) {
                    this.setState({ searchString: this.props.value === null ? '' : this.props.value.key }, function () {
                        _this.updateFilter(_this.props.value === null ? '' : _this.props.value.key, _this.props);
                    });
                }
            }
            this.recalculateHeight = true;
            this.setState({
                showingDropDown: false
            });
        }
    };
    ComboDropdown.prototype.handleInputFocus = function () {
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
    };
    ComboDropdown.prototype.handleInputClick = function () {
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
    };
    ComboDropdown.prototype.selectItemFromMouse = function (item) {
        var _this = this;
        this.recalculateHeight = true;
        this.setState({
            showingDropDown: false,
            highlightedIndex: null
        }, function () {
            _this.props.setValue(item);
            _this.refs[ComboDropdown.comboDropdownInputBoxRef].focus();
        });
    };
    ComboDropdown.prototype.isInputFocused = function () {
        var el = this.refs[ComboDropdown.comboDropdownInputBoxRef];
        return el.ownerDocument && (el === el.ownerDocument.activeElement);
    };
    ComboDropdown.prototype.clearSearchBox = function () {
        this.props.setValue(null);
        this.setState({ searchString: '' });
        this.refs[ComboDropdown.comboDropdownInputBoxRef].focus();
    };
    ComboDropdown.prototype.calculateDropdownHeight = function (val) {
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
    };
    ComboDropdown.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: 'combo-dropdown ' + this.props.additionalClasses.join(' ') },
            React.createElement("div", null,
                React.createElement("input", { type: 'text', ref: ComboDropdown.comboDropdownInputBoxRef, className: 'search-input', value: this.state.searchString, placeholder: 'Click here and start typing..', onBlur: this.handleInputBlur.bind(this), onFocus: this.handleInputFocus.bind(this), onChange: this.changeSearchString.bind(this), onClick: this.handleInputClick.bind(this) }),
                this.state.searchString.length > 0 ? (React.createElement("i", { className: 'fa fa-times clear-button', onClick: this.clearSearchBox.bind(this) })) : null),
            this.state.showingDropDown ? (React.createElement("div", { className: 'dropdown', style: { maxHeight: this.state.dropDownHeight, overflowY: 'auto' }, ref: this.calculateDropdownHeight.bind(this) },
                React.createElement("ul", null,
                    this.state.searchString.length === 0 && this.props.allowNew ? (React.createElement("li", { className: 'add', onMouseDown: function () { return _this.ignoreBlur = true; }, onClick: function () { return _this.addNewAction(''); } },
                        React.createElement("i", { className: 'fa fa-plus', "aria-hidden": 'true' }),
                        "Add new ",
                        this.props.typeName)) : null,
                    this.state.filteredOptions.map(function (opt, i) { return (React.createElement("li", { key: "opt-" + opt.key + "-" + i, onMouseDown: function () { return _this.ignoreBlur = true; }, onClick: function () { return _this.selectOption(opt); } }, opt.key)); }),
                    this.state.searchString.length > 0 && this.props.allowNew ? (React.createElement("li", { className: 'add', onMouseDown: function () { return _this.ignoreBlur = true; }, onClick: function () { return _this.addNewAction(_this.state.searchString); } },
                        React.createElement("i", { className: 'fa fa-plus', "aria-hidden": 'true' }),
                        "Add new ",
                        this.props.typeName,
                        ": '",
                        this.state.searchString,
                        "'")) : null))) : null));
    };
    return ComboDropdown;
}(React.Component));
ComboDropdown.defaultProps = {
    allowNew: true,
    additionalClasses: [],
    updateSearchString: lodash_1.noop
};
ComboDropdown.comboDropdownInputBoxRef = 'comboDropDownInputBox';
exports.ComboDropdown = ComboDropdown;
var NumberComboDropdown = (function (_super) {
    __extends(NumberComboDropdown, _super);
    function NumberComboDropdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NumberComboDropdown;
}(ComboDropdown));
exports.NumberComboDropdown = NumberComboDropdown;
var StringComboDropdown = (function (_super) {
    __extends(StringComboDropdown, _super);
    function StringComboDropdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StringComboDropdown;
}(ComboDropdown));
exports.StringComboDropdown = StringComboDropdown;
//# sourceMappingURL=ComboDropdown.js.map