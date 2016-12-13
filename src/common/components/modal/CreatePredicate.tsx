/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { PredicateDescription } from '../fields/PredicateDescription';
import { Predicate, EntityType, Serializer } from 'falcon-core';
import { literalTypes } from '../../literalTypes';
import { ApiService, AppUrls } from '../../ApiService';
import { DataStore } from '../../DataStore';
import { ComboDropdownOption } from '../ComboDropdown';


interface CreatePredicateProps {
    initialName: string;
    cancel: () => void;
    complete: (newPredicate: Predicate) => void;
    api: ApiService;
    initialDomain?: number;
    dataStore: DataStore;
}

interface CreatePredicateState {
    name: string;
    domain: ComboDropdownOption;
    range: ComboDropdownOption;
    domainOptions: ComboDropdownOption[];
    rangeOptions: ComboDropdownOption[];
}

export class CreatePredicate extends React.Component<CreatePredicateProps, CreatePredicateState> {

    constructor() {
        super();
        this.state = {
            name: '',
            domain: {key: '', value: ''},
            range: {key: '', value: ''},
            domainOptions: [],
            rangeOptions: []
        };
    }

    public componentWillMount() {
        this.setState({ name: this.props.initialName });
    }

    public componentDidMount() {
        if (this.props.initialDomain !== undefined) {
             this.props.api.getItem(EntityType, AppUrls.entity_type, this.props.initialDomain)
            .then((result) => {

                if (result.uid === null) {
                    throw new Error('Unexpected null uid');
                }

                this.setState({
                domain: { key: result.label, value: result.uid.toString()},
                domainOptions: [
                    { key: result.label, value: result.uid.toString()}
                ].concat(result.parents.map((entityType) => {
                    if (entityType.uid === null) {
                        throw new Error('Unexpected null uid');
                    }
                    return { key: entityType.label, value: entityType.uid.toString() }
                }))});
            });
        }

        const results = this.props.dataStore.all.entity_type.value;
        const entityTypeMap : ComboDropdownOption[] = results.map((entityType) => {
            if (entityType.uid === null) {
                throw new Error('Unexpected null uid');
            }
            return { key: entityType.label, value: entityType.uid.toString() }
        });

        if (this.props.initialDomain === undefined) {
            this.setState({ domainOptions: entityTypeMap });
        }

        this.setState({
            rangeOptions:  literalTypes.map((lit) => ({ key: lit.label, value: lit.value, meta: 'literal'})).concat(entityTypeMap)
        });
    }

    public create() {

        const newPredicate = Serializer.fromJson(Predicate, {
            name: this.state.name,
            domain: this.state.domain.value,
            range: this.state.range.value,
            rangeIsReference: this.state.range.meta !== 'literal'
        });

        this.props.api.postItem(Predicate, AppUrls.predicate, newPredicate)
            .then((result) => {
                newPredicate.uid = result[0];
                this.props.complete(newPredicate);
            });
    }

    public render() {
        return (
        <Overlay>
            <h2><i className='fa fa-plus' aria-hidden='true'></i> Create Property</h2>
            <label className='small'>Name</label>

            <input type='text'
                className='gap'
                ref={(a) =>  { if(a !== null) a.focus(); }}
                value={this.state.name}
                onChange={(e) => this.setState({ name: (e.target as HTMLInputElement).value })} />

            <PredicateDescription
                domain={this.state.domain}
                range={this.state.range}
                domainChanged={(s) => this.setState({ domain: s })}
                rangeChanged={(s) => this.setState({ range: s })}
                domainOptions={this.state.domainOptions}
                rangeOptions={this.state.rangeOptions}
                mode='editAll' />
            <div className='modal-toolbar'>
                <button onClick={this.props.cancel} className='pull-left'>Cancel</button>
                <button onClick={this.create.bind(this)} className='pull-right'>Create Property</button>
            </div>
        </Overlay>
        );
    }
};
