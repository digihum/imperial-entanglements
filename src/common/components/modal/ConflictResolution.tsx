/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Entity, EntityType, Record, Predicate, Source } from '@digihum/falcon-core';

import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';

import { noop } from 'lodash';

import { DataController } from '../../stores/DataController';
import { inject, observer } from 'mobx-react';

interface ConflictResolutionProps {
    dataStore?: DataController;
    complete: (s: string) => void;
    cancel: () => void;
    message: string;
    conflictingItems: {
        record: Record[];
        entity: Entity[];
        predicate: Predicate[];
        entityType: EntityType[];
        source: Source[];
    };
}

interface ConflictResolutionState {
    label: string;
    entityType: ComboDropdownOption<number>;
    allEntityTypes: EntityType[];
}

@inject('dataStore')
@observer
export class ConflictResolution extends React.Component<ConflictResolutionProps, ConflictResolutionState> {

    constructor() {
        super();
        this.state = {
            label: '',
            entityType: { key: '', value: null},
            allEntityTypes: []
        };
    }


    public render() {
        return (
        <Overlay>
            <h2><i className='fa fa-exclamation-triangle warning'></i> Conflict: {this.props.message}</h2>
            {this.props.conflictingItems.record !== undefined && this.props.conflictingItems.record.length > 0 ? (
                <span>
                    <p>The following records conflict with your request change:</p>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Entity</th>
                                <th>Predicate</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.conflictingItems.record.map((record) => {

                            const entityName = this.props.dataStore!.dataStore.all.entity.value
                                .find((entity) => entity.uid == record.entity)!.label;

                            const predicateName = this.props.dataStore!.dataStore.all.predicate.value
                                .find((predicate) => predicate.uid == record.predicate)!.label;


                            return (
                            <tr key={`row-${record.uid}`}>
                                <td>
                                    {entityName}
                                </td>
                                <td>
                                    {predicateName}
                                </td>
                                <td>
                                    {record.value}
                                </td>
                            </tr>);
                        })}
                        </tbody>
                    </table>
                </span>
            ) : null }


            {this.props.conflictingItems.entity !== undefined && this.props.conflictingItems.entity.length > 0 ? (
                <span>
                    <p>The following entities conflict with your request change:</p>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Entity</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.conflictingItems.entity.map((entity) => {
                            return (
                            <tr key={`row-${entity.uid}`}>
                                <td>
                                    {entity.label}
                                </td>
                            </tr>);
                        })}
                        </tbody>
                    </table>
                </span>
            ) : null }

            {this.props.conflictingItems.entityType !== undefined && this.props.conflictingItems.entityType.length > 0 ? (
                <span>
                    <p>The following entity types conflict with your request change:</p>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Entity Type</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.conflictingItems.entityType.map((entityType) => {
                            return (
                            <tr key={`row-${entityType.uid}`}>
                                <td>
                                    {entityType.label}
                                </td>
                            </tr>);
                        })}
                        </tbody>
                    </table>
                </span>
            ) : null }

             {this.props.conflictingItems.source !== undefined && this.props.conflictingItems.source.length > 0 ? (
                <span>
                    <p>The following sources conflict with your request change:</p>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Sources</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.conflictingItems.source.map((source) => {
                            return (
                            <tr key={`row-${source.uid}`}>
                                <td>
                                    {source.label}
                                </td>
                            </tr>);
                        })}
                        </tbody>
                    </table>
                </span>
            ) : null }


            <div className='block-buttons'>
                <button onClick={() => this.props.cancel()}>Cancel</button>
                <button onClick={() => this.props.complete('addToWorkspace')}>
                    <i className='icon-list-add'></i>Cancel and add conflicting records to workspace
                </button>
                <button onClick={() => this.props.complete('deleteAll')}>
                    <i className='fa fa-trash'></i> Continue and delete all conflicting records
                </button>
            </div>

        </Overlay>
        );
    }
};
