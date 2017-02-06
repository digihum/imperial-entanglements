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
var ComboDropdown_1 = require("../ComboDropdown");
var lodash_1 = require("lodash");
var PredicateRangeComboDropdown = (function (_super) {
    __extends(PredicateRangeComboDropdown, _super);
    function PredicateRangeComboDropdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PredicateRangeComboDropdown;
}(ComboDropdown_1.ComboDropdown));
exports.PredicateRangeComboDropdown = PredicateRangeComboDropdown;
var PredicateDescription = (function (_super) {
    __extends(PredicateDescription, _super);
    function PredicateDescription() {
        var _this = _super.call(this) || this;
        _this.state = {
            editingDomain: false,
            editingRange: false,
            rangeValue: { key: '', value: null },
            domainValue: { key: '', value: null }
        };
        return _this;
    }
    PredicateDescription.prototype.componentWillMount = function () {
        this.setState({
            rangeValue: this.props.range,
            domainValue: this.props.domain
        });
    };
    PredicateDescription.prototype.componentWillReceiveProps = function (newProps) {
        this.setState({
            rangeValue: newProps.range,
            domainValue: newProps.domain
        });
    };
    PredicateDescription.prototype.acceptDomainChanges = function () {
        this.props.domainChanged(this.state.domainValue);
        this.setState({ editingDomain: false });
    };
    PredicateDescription.prototype.cancelDomainChanges = function () {
        this.setState({ editingDomain: false, domainValue: this.props.domain });
    };
    PredicateDescription.prototype.acceptRangeChanges = function () {
        this.props.rangeChanged(this.state.rangeValue);
        this.setState({ editingRange: false });
    };
    PredicateDescription.prototype.cancelRangeChanges = function () {
        this.setState({ editingDomain: false, rangeValue: this.props.range });
    };
    //  <label className='small'>Property Class</label>
    //   <section className='class'>
    //     <input type='radio' name='property-class' value='ObjectProperty' /> Object Property <small>Links to another entity</small><br/>
    //     <input type='radio' name='property-class' value='DataTypeProperty' /> Data Type Property <small>Links to some data, like text or a date</small><br/>
    //     <input type='radio' name='property-class' value='SourceProperty' /> Source Property <small>Links to a source</small><br/>
    //   </section>
    //   <label className='small'>Typing</label>
    PredicateDescription.prototype.render = function () {
        var _this = this;
        var domainChanged = this.props.mode === 'editAll' ?
            this.props.domainChanged : function (c) { return _this.setState({ domainValue: c }); };
        var rangeChanged = this.props.mode === 'editAll' ?
            this.props.rangeChanged : function (c) { return _this.setState({ rangeValue: c }); };
        return (React.createElement("div", { className: 'predicate-function-description' },
            React.createElement("div", { className: 'typing' },
                React.createElement("div", { className: 'domain' }, this.props.mode === 'editAll' || this.state.editingDomain ? (React.createElement("div", null,
                    React.createElement("label", { className: 'small' }, "Domain"),
                    React.createElement(ComboDropdown_1.NumberComboDropdown, { options: this.props.domainOptions, typeName: 'entity type', allowNew: false, value: this.state.domainValue, setValue: domainChanged, createNewValue: lodash_1.noop }),
                    this.props.mode === 'editSingle' ? (React.createElement("div", null,
                        React.createElement("button", { onClick: this.acceptDomainChanges.bind(this) },
                            React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
                        React.createElement("button", { onClick: this.cancelDomainChanges.bind(this) },
                            React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' })))) : null)) : (React.createElement("div", null,
                    this.props.domain.key,
                    " ",
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: function () { return _this.setState({ editingDomain: true }); } })))),
                React.createElement("div", { className: 'arrow' },
                    React.createElement("i", { className: 'fa fa-long-arrow-right', "aria-hidden": 'true' })),
                React.createElement("div", { className: 'range' }, this.props.mode === 'editAll' || this.state.editingRange ? (React.createElement("div", null,
                    React.createElement("label", { className: 'small' }, "Range"),
                    React.createElement(PredicateRangeComboDropdown, { options: this.props.rangeOptions, typeName: 'entity type', allowNew: false, value: this.state.rangeValue, setValue: rangeChanged, createNewValue: lodash_1.noop }),
                    this.props.mode === 'editSingle' ? (React.createElement("div", null,
                        React.createElement("button", { onClick: this.acceptRangeChanges.bind(this) },
                            React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
                        React.createElement("button", { onClick: this.cancelRangeChanges.bind(this) },
                            React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' })))) : null)) : (React.createElement("div", null,
                    this.props.range.key,
                    " ",
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: function () { return _this.setState({ editingRange: true }); } })))))));
    };
    return PredicateDescription;
}(React.Component));
exports.PredicateDescription = PredicateDescription;
//# sourceMappingURL=PredicateDescription.js.map