/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const moment = require("moment");
const lodash_1 = require("lodash");
const formatDate_1 = require("../../helper/formatDate");
class DatePickerDropdown extends React.Component {
    constructor() {
        super();
        //TODO: should be false
        this.state = {
            showingDropDown: false
        };
        if (document !== undefined) {
            this.boundWindowClick = () => {
                if (!this.ignoreGlobalClick) {
                    this.setState({
                        showingDropDown: false
                    });
                }
                else {
                    this.ignoreGlobalClick = false;
                }
            };
            document.body.addEventListener('click', this.boundWindowClick);
        }
    }
    componentWillMount() {
        this.ignoreBlur = false;
        this.ignoreClick = false;
        this.ignoreGlobalClick = false;
    }
    componentWillUnmount() {
        document.body.removeEventListener('click', this.boundWindowClick);
    }
    componentWillReceiveProps(newProps) {
        // this.updateFilter(newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString, newProps);
        // this.setState({
        //     searchString: newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString,
        //     selected: newProps.value,
        //     options: newProps.options
        // });
    }
    //should be false
    handleInputBlur() {
        if (!this.ignoreBlur) {
            this.setState({
                showingDropDown: false
            });
        }
        else {
            this.ignoreBlur = false;
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
            //  if (this.state.highlightedIndex !== null && !this.ignoreClick) {
            //      this.selectItemFromMouse(this.state.filteredOptions[this.state.highlightedIndex]);
            //  } else {
            this.ignoreClick = false;
        }
    }
    selectItemFromMouse(item) {
        this.setState({
            showingDropDown: false
        }, () => {
            this.props.setValue(item);
        });
    }
    isInputFocused() {
        const el = this.refs[DatePickerDropdown.datePickerDropDownInputBoxRef];
        return el.ownerDocument && (el === el.ownerDocument.activeElement);
    }
    onDropdownClick() {
        this.ignoreBlur = true;
        this.ignoreGlobalClick = true;
        console.log('clicked');
    }
    rangeTypeChanged(rangeType) {
        this.props.setValue(rangeType + this.props.value.substr(1));
    }
    yearChanged(e) {
        const base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
        let yearVal = e.currentTarget.value.substr(0, 4).replace(/[^0-9]/g, '');
        for (let i = yearVal.length; i < 4; i += 1) {
            yearVal += 'X';
        }
        this.props.setValue(base.substr(0, 1) + yearVal + base.substr(5));
    }
    monthChanged(e) {
        this.ignoreGlobalClick = true;
        const base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
        const monthVal = e.currentTarget.value.substr(0, 2);
        this.props.setValue(base.substr(0, 5) + monthVal + base.substr(7));
    }
    dayChanged(e) {
        const base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
        let dayVal = e.currentTarget.value.substr(0, 2).replace(/[^0-9]/g, '');
        dayVal = lodash_1.padStart(dayVal, 2, '0');
        this.props.setValue(base.substr(0, 7) + dayVal);
    }
    render() {
        let rangeOption = this.props.value.substr(0, 1);
        if (['<', '>', '='].indexOf(rangeOption) === -1) {
            rangeOption = '=';
        }
        const rangeOptionClassName = (val) => {
            if (val === rangeOption) {
                return 'range-option selected';
            }
            else {
                return 'range-option';
            }
        };
        const year = this.props.value.substr(1, 4).replace(/X/g, '');
        const month = this.props.value.substr(5, 2);
        const day = this.props.value[7] === '0' ? this.props.value[8] === '0' ?
            ''
            : this.props.value.substr(8, 1)
            : this.props.value.substr(7, 2);
        const displayValue = formatDate_1.formatDate(this.props.value);
        return (React.createElement("div", { className: 'combo-dropdown' },
            React.createElement("div", null,
                React.createElement("input", { type: 'text', readOnly: true, ref: DatePickerDropdown.datePickerDropDownInputBoxRef, className: 'search-input', value: displayValue, onBlur: this.handleInputBlur.bind(this), onFocus: this.handleInputFocus.bind(this), onClick: this.handleInputClick.bind(this) })),
            this.state.showingDropDown ? (React.createElement("div", { className: 'dropdown' },
                React.createElement("div", { className: 'date-picker-dropdown', onMouseDown: this.onDropdownClick.bind(this) },
                    React.createElement("section", { className: 'range-type' },
                        React.createElement("div", { className: rangeOptionClassName('<'), onClick: () => this.rangeTypeChanged('<') }, "Before"),
                        React.createElement("div", { className: rangeOptionClassName('='), onClick: () => this.rangeTypeChanged('=') }, "Exactly"),
                        React.createElement("div", { className: rangeOptionClassName('>'), onClick: () => this.rangeTypeChanged('>') }, "After")),
                    React.createElement("section", { className: 'date-select' },
                        React.createElement("div", { className: 'date-selector day' },
                            React.createElement("label", { className: 'small' }, "Day"),
                            React.createElement("input", { type: 'text', maxLength: 2, value: day, onChange: this.dayChanged.bind(this) })),
                        React.createElement("div", { className: 'date-selector month' },
                            React.createElement("label", { className: 'small' }, "Month"),
                            React.createElement("select", { onChange: this.monthChanged.bind(this), value: month },
                                React.createElement("option", { value: '00' }, "Unknown"),
                                moment.months().map((month, i) => (React.createElement("option", { key: `option-${month}`, value: lodash_1.padStart((i + 1).toString(), 2, '0') }, month))))),
                        React.createElement("div", { className: 'date-selector year' },
                            React.createElement("label", { className: 'small' }, "Year"),
                            React.createElement("input", { type: 'text', maxLength: 4, value: year, onChange: this.yearChanged.bind(this) })))))) : null));
    }
}
DatePickerDropdown.datePickerDropDownInputBoxRef = 'datePickerDropDownInputBox';
exports.DatePickerDropdown = DatePickerDropdown;
//# sourceMappingURL=DatePickerDropdown.js.map