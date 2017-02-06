/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { PredicateDescription } from '../fields/PredicateDescription';
import { Predicate, EntityType, Serializer } from '@digihum/falcon-core';
import { literalTypes } from '../../literalTypes';
import { AppUrls } from '../../ApiService';

import { ComboDropdownOption } from '../ComboDropdown';

import { DataController } from '../../stores/DataController';
import { inject, observer } from 'mobx-react';

interface CreatePredicateProps {
    initialName: string;
    cancel: () => void;
    complete: (newPredicate: Predicate) => void;
    initialDomain?: number;
    dataStore?: DataController;
}

interface CreatePredicateState {
    label: string;
    domain: ComboDropdownOption<number>;
    range: ComboDropdownOption<{isReference: boolean, value: number | string}>;
    domainOptions: ComboDropdownOption<number>[];
    rangeOptions: ComboDropdownOption<{isReference: boolean, value: number | string}>[];
}

@inject('dataStore')
@observer
export class CreatePredicate extends React.Component<CreatePredicateProps, CreatePredicateState> {

    constructor() {
        super();
        this.state = {
            label: '',
            domain: {key: '', value: null},
            range: {key: '', value: null},
            domainOptions: [],
            rangeOptions: []
        };
    }

    public componentWillMount() {
        this.setState({ label: this.props.initialName });
    }

    public componentDidMount() {
        if (this.props.initialDomain !== undefined) {
             this.props.dataStore!.getItem(EntityType, AppUrls.entity_type, this.props.initialDomain)
            .then((result) => {

                if (result.uid === null) {
                    throw new Error('Unexpected null uid');
                }

                this.setState({
                domain: { key: result.label, value: result.uid},
                domainOptions: [
                    { key: result.label, value: result.uid}
                ].concat(result.parents.map((entityTypeId) => {
                    const parentEntityType = this.props.dataStore!.dataStore.all.entity_type.value.find((e) => e.uid === entityTypeId)!;
                    return { key: parentEntityType.label, value: entityTypeId };
                }))});
            });
        }

        const results = this.props.dataStore!.dataStore.all.entity_type.value;
        const entityTypeMap : ComboDropdownOption<number>[] = results.map((entityType) => {
            if (entityType.uid === null) {
                throw new Error('Unexpected null uid');
            }
            return { key: entityType.label, value: entityType.uid };
        });

        const entityTypeMap2 : ComboDropdownOption<{isReference: boolean, value: number | string}>[] =
          entityTypeMap.map((e) => ({ key: e.key, value: { isReference: true, value: e.value!.toString()}}));

        const literalTypesMap : ComboDropdownOption<{isReference: boolean, value: number | string}>[] =
          literalTypes.map((lit) => ({ key: lit.label, value: { isReference: false, value: lit.value } }));

        if (this.props.initialDomain === undefined) {
            this.setState({ domainOptions: entityTypeMap });
        }

        this.setState({
            rangeOptions:  literalTypesMap.concat(entityTypeMap2)
        });
    }

    public create() {

      if(this.state.range.value === null || this.state.domain.value === null) {
        throw new Error('Domain and range must be set');
      }

        const newPredicate = Serializer.fromJson(Predicate, {
            label: this.state.label,
            domain: this.state.domain.value,
            range: this.state.range.value.value,
            rangeIsReference: this.state.range.value.isReference
        });

        this.props.dataStore!.postItem(Predicate, AppUrls.predicate, newPredicate, {})
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
                ref={(a) =>  {
                  if (a !== null) {
                    a.focus();
                  }
                }}
                value={this.state.label}
                onChange={(e) => this.setState({ label: (e.target as HTMLInputElement).value })} />

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
