/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const ComboDropdown_1 = require("../ComboDropdown");
const lodash_1 = require("lodash");
class PredicateRangeComboDropdown extends ComboDropdown_1.ComboDropdown {
}
exports.PredicateRangeComboDropdown = PredicateRangeComboDropdown;
class PredicateDescription extends React.Component {
    constructor() {
        super();
        this.state = {
            editingDomain: false,
            editingRange: false,
            rangeValue: { key: '', value: null },
            domainValue: { key: '', value: null }
        };
    }
    componentWillMount() {
        this.setState({
            rangeValue: this.props.range,
            domainValue: this.props.domain
        });
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            rangeValue: newProps.range,
            domainValue: newProps.domain
        });
    }
    acceptDomainChanges() {
        this.props.domainChanged(this.state.domainValue);
        this.setState({ editingDomain: false });
    }
    cancelDomainChanges() {
        this.setState({ editingDomain: false, domainValue: this.props.domain });
    }
    acceptRangeChanges() {
        this.props.rangeChanged(this.state.rangeValue);
        this.setState({ editingRange: false });
    }
    cancelRangeChanges() {
        this.setState({ editingDomain: false, rangeValue: this.props.range });
    }
    //  <label className='small'>Property Class</label>
    //   <section className='class'>
    //     <input type='radio' name='property-class' value='ObjectProperty' /> Object Property <small>Links to another entity</small><br/>
    //     <input type='radio' name='property-class' value='DataTypeProperty' /> Data Type Property <small>Links to some data, like text or a date</small><br/>
    //     <input type='radio' name='property-class' value='SourceProperty' /> Source Property <small>Links to a source</small><br/>
    //   </section>
    //   <label className='small'>Typing</label>
    render() {
        const domainChanged = this.props.mode === 'editAll' ?
            this.props.domainChanged : (c) => this.setState({ domainValue: c });
        const rangeChanged = this.props.mode === 'editAll' ?
            this.props.rangeChanged : (c) => this.setState({ rangeValue: c });
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
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: () => this.setState({ editingDomain: true }) })))),
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
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: () => this.setState({ editingRange: true }) })))))));
    }
}
exports.PredicateDescription = PredicateDescription;
//# sourceMappingURL=PredicateDescription.js.map