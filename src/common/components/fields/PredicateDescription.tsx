/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { noop } from 'lodash';

interface PredicateDescriptionProps {
    domain: ComboDropdownOption;
    range: ComboDropdownOption;
    mode: 'editAll' | 'editSingle';
    domainChanged: (s: ComboDropdownOption) => void;
    rangeChanged: (s: ComboDropdownOption) => void;
    domainOptions: ComboDropdownOption[];
    rangeOptions: ComboDropdownOption[];
}

interface PredicateDescriptionState {
    editingDomain: boolean;
    editingRange: boolean;
    domainValue: ComboDropdownOption;
    rangeValue: ComboDropdownOption;
}

export class PredicateDescription extends React.Component<PredicateDescriptionProps, PredicateDescriptionState> {

    constructor() {
        super();
        this.state = {
            editingDomain: false,
            editingRange: false,
            rangeValue: {key: '', value: ''},
            domainValue: {key: '', value: ''}
        };
    }

    public componentWillMount() {
        this.setState({
            rangeValue: this.props.range,
            domainValue: this.props.domain
        });
    }

    public componentWillReceiveProps(newProps: PredicateDescriptionProps) {
        this.setState({
            rangeValue: newProps.range,
            domainValue: newProps.domain
        });
    }

    public acceptDomainChanges() {
        this.props.domainChanged(this.state.domainValue);
        this.setState({ editingDomain: false});
    }

    public cancelDomainChanges() {
        this.setState({ editingDomain: false, domainValue: this.props.domain});
    }

    public acceptRangeChanges() {
        this.props.rangeChanged(this.state.rangeValue);
        this.setState({ editingRange: false});
    }

    public cancelRangeChanges() {
        this.setState({ editingDomain: false, rangeValue: this.props.range});
    }

        //  <label className='small'>Property Class</label>
        //   <section className='class'>
        //     <input type='radio' name='property-class' value='ObjectProperty' /> Object Property <small>Links to another entity</small><br/>
        //     <input type='radio' name='property-class' value='DataTypeProperty' /> Data Type Property <small>Links to some data, like text or a date</small><br/>
        //     <input type='radio' name='property-class' value='SourceProperty' /> Source Property <small>Links to a source</small><br/>
        //   </section>
        //   <label className='small'>Typing</label>

    public render() {

        const domainChanged = this.props.mode === 'editAll' ?
            this.props.domainChanged : (c) => this.setState({ domainValue: c });

        const rangeChanged = this.props.mode === 'editAll' ?
            this.props.rangeChanged : (c) => this.setState({ rangeValue: c });

        return (
        <div className='predicate-function-description'>
          <div className='typing'>
            <div className='domain'>
                {this.props.mode === 'editAll' || this.state.editingDomain ? (
                <div>
                    <label className='small'>Domain</label>
                    <ComboDropdown
                        options={this.props.domainOptions}
                        typeName='entity type'
                        allowNew={false}
                        value={this.state.domainValue}
                        setValue={domainChanged}
                        createNewValue={noop} />
                    {this.props.mode === 'editSingle' ? (
                        <div>
                            <button onClick={this.acceptDomainChanges.bind(this)}>
                                <i className='fa fa-check' aria-hidden='true'></i>
                            </button>
                            <button onClick={this.cancelDomainChanges.bind(this)}>
                                <i className='fa fa-times' aria-hidden='true'></i>
                            </button>
                        </div>
                    ) : null}
                </div>
                ) : (<div>{this.props.domain.key} <i className='fa fa-pencil-square-o'
                    title='Edit'
                    aria-hidden='true'
                    onClick={() => this.setState({ editingDomain: true })}>
                </i></div>)}
            </div>
            <div className='arrow'><i className='fa fa-long-arrow-right' aria-hidden='true'></i></div>
            <div className='range'>
                {this.props.mode === 'editAll' || this.state.editingRange ? (
                    <div>
                        <label className='small'>Range</label>
                        <ComboDropdown
                            options={this.props.rangeOptions}
                            typeName='entity type'
                            allowNew={false}
                            value={this.state.rangeValue}
                            setValue={rangeChanged}
                            createNewValue={noop} />
                        {this.props.mode === 'editSingle' ? (
                        <div>
                            <button  onClick={this.acceptRangeChanges.bind(this)}>
                                <i className='fa fa-check' aria-hidden='true'></i>
                            </button>
                            <button  onClick={this.cancelRangeChanges.bind(this)}>
                                <i className='fa fa-times' aria-hidden='true'></i>
                            </button>
                        </div>
                    ) : null}
                    </div>
                ) : (<div>{this.props.range.key} <i className='fa fa-pencil-square-o'
                    title='Edit'
                    aria-hidden='true'
                    onClick={() => this.setState({ editingRange: true })}>
                </i></div>)}
            </div>
          </div>
        </div>);
    }
}
