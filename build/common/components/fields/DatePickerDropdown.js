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
var moment = require("moment");
var lodash_1 = require("lodash");
var formatDate_1 = require("../../helper/formatDate");
var DatePickerDropdown = (function (_super) {
    __extends(DatePickerDropdown, _super);
    function DatePickerDropdown() {
        var _this = _super.call(this) || this;
        //TODO: should be false
        _this.state = {
            showingDropDown: false
        };
        if (document !== undefined) {
            _this.boundWindowClick = function () {
                if (!_this.ignoreGlobalClick) {
                    _this.setState({
                        showingDropDown: false
                    });
                }
                else {
                    _this.ignoreGlobalClick = false;
                }
            };
            document.body.addEventListener('click', _this.boundWindowClick);
        }
        return _this;
    }
    DatePickerDropdown.prototype.componentWillMount = function () {
        this.ignoreBlur = false;
        this.ignoreClick = false;
        this.ignoreGlobalClick = false;
    };
    DatePickerDropdown.prototype.componentWillUnmount = function () {
        document.body.removeEventListener('click', this.boundWindowClick);
    };
    DatePickerDropdown.prototype.componentWillReceiveProps = function (newProps) {
        // this.updateFilter(newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString, newProps);
        // this.setState({
        //     searchString: newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString,
        //     selected: newProps.value,
        //     options: newProps.options
        // });
    };
    //should be false
    DatePickerDropdown.prototype.handleInputBlur = function () {
        if (!this.ignoreBlur) {
            this.setState({
                showingDropDown: false
            });
        }
        else {
            this.ignoreBlur = false;
        }
    };
    DatePickerDropdown.prototype.handleInputFocus = function () {
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
    DatePickerDropdown.prototype.handleInputClick = function () {
        // Input will not be focused if it's disabled
        if (this.isInputFocused() && this.state.showingDropDown === false) {
            this.setState({ showingDropDown: true });
        }
        else {
            //  if (this.state.highlightedIndex !== null && !this.ignoreClick) {
            //      this.selectItemFromMouse(this.state.filteredOptions[this.state.highlightedIndex]);
            //  } else {
            this.ignoreClick = false;
        }
    };
    DatePickerDropdown.prototype.selectItemFromMouse = function (item) {
        var _this = this;
        this.setState({
            showingDropDown: false
        }, function () {
            _this.props.setValue(item);
        });
    };
    DatePickerDropdown.prototype.isInputFocused = function () {
        var el = this.refs[DatePickerDropdown.datePickerDropDownInputBoxRef];
        return el.ownerDocument && (el === el.ownerDocument.activeElement);
    };
    DatePickerDropdown.prototype.onDropdownClick = function () {
        this.ignoreBlur = true;
        this.ignoreGlobalClick = true;
        console.log('clicked');
    };
    DatePickerDropdown.prototype.rangeTypeChanged = function (rangeType) {
        this.props.setValue(rangeType + this.props.value.substr(1));
    };
    DatePickerDropdown.prototype.yearChanged = function (e) {
        var base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
        var yearVal = e.currentTarget.value.substr(0, 4).replace(/[^0-9]/g, '');
        for (var i = yearVal.length; i < 4; i += 1) {
            yearVal += 'X';
        }
        this.props.setValue(base.substr(0, 1) + yearVal + base.substr(5));
    };
    DatePickerDropdown.prototype.monthChanged = function (e) {
        this.ignoreGlobalClick = true;
        var base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
        var monthVal = e.currentTarget.value.substr(0, 2);
        this.props.setValue(base.substr(0, 5) + monthVal + base.substr(7));
    };
    DatePickerDropdown.prototype.dayChanged = function (e) {
        var base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
        var dayVal = e.currentTarget.value.substr(0, 2).replace(/[^0-9]/g, '');
        dayVal = lodash_1.padStart(dayVal, 2, '0');
        this.props.setValue(base.substr(0, 7) + dayVal);
    };
    DatePickerDropdown.prototype.render = function () {
        var _this = this;
        var rangeOption = this.props.value.substr(0, 1);
        if (['<', '>', '='].indexOf(rangeOption) === -1) {
            rangeOption = '=';
        }
        var rangeOptionClassName = function (val) {
            if (val === rangeOption) {
                return 'range-option selected';
            }
            else {
                return 'range-option';
            }
        };
        var year = this.props.value.substr(1, 4).replace(/X/g, '');
        var month = this.props.value.substr(5, 2);
        var day = this.props.value[7] === '0' ? this.props.value[8] === '0' ?
            ''
            : this.props.value.substr(8, 1)
            : this.props.value.substr(7, 2);
        var displayValue = formatDate_1.formatDate(this.props.value);
        return (React.createElement("div", { className: 'combo-dropdown' },
            React.createElement("div", null,
                React.createElement("input", { type: 'text', readOnly: true, ref: DatePickerDropdown.datePickerDropDownInputBoxRef, className: 'search-input', value: displayValue, onBlur: this.handleInputBlur.bind(this), onFocus: this.handleInputFocus.bind(this), onClick: this.handleInputClick.bind(this) })),
            this.state.showingDropDown ? (React.createElement("div", { className: 'dropdown' },
                React.createElement("div", { className: 'date-picker-dropdown', onMouseDown: this.onDropdownClick.bind(this) },
                    React.createElement("section", { className: 'range-type' },
                        React.createElement("div", { className: rangeOptionClassName('<'), onClick: function () { return _this.rangeTypeChanged('<'); } }, "Before"),
                        React.createElement("div", { className: rangeOptionClassName('='), onClick: function () { return _this.rangeTypeChanged('='); } }, "Exactly"),
                        React.createElement("div", { className: rangeOptionClassName('>'), onClick: function () { return _this.rangeTypeChanged('>'); } }, "After")),
                    React.createElement("section", { className: 'date-select' },
                        React.createElement("div", { className: 'date-selector day' },
                            React.createElement("label", { className: 'small' }, "Day"),
                            React.createElement("input", { type: 'text', maxLength: 2, value: day, onChange: this.dayChanged.bind(this) })),
                        React.createElement("div", { className: 'date-selector month' },
                            React.createElement("label", { className: 'small' }, "Month"),
                            React.createElement("select", { onChange: this.monthChanged.bind(this), value: month },
                                React.createElement("option", { value: '00' }, "Unknown"),
                                moment.months().map(function (month, i) { return (React.createElement("option", { key: "option-" + month, value: lodash_1.padStart((i + 1).toString(), 2, '0') }, month)); }))),
                        React.createElement("div", { className: 'date-selector year' },
                            React.createElement("label", { className: 'small' }, "Year"),
                            React.createElement("input", { type: 'text', maxLength: 4, value: year, onChange: this.yearChanged.bind(this) })))))) : null));
    };
    return DatePickerDropdown;
}(React.Component));
DatePickerDropdown.datePickerDropDownInputBoxRef = 'datePickerDropDownInputBox';
exports.DatePickerDropdown = DatePickerDropdown;
//# sourceMappingURL=DatePickerDropdown.js.map