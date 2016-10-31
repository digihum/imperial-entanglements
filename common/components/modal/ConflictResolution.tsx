/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Entity, EntityType, Record } from '../../../common/datamodel/datamodel';
import { ApiService, AppUrls } from '../../ApiService';
import { DataStore } from '../../DataStore';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';

import { noop } from 'lodash';

interface ConflictResolutionProps {
    api: ApiService;
    dataStore: DataStore;
    complete: (s: string) => void;
    cancel: () => void;
    message: string;
    conflictingRecords: Record[];
}

interface ConflictResolutionState {
    label: string;
    entityType: ComboDropdownOption;
    allEntityTypes: EntityType[];
}

export class ConflictResolution extends React.Component<ConflictResolutionProps, ConflictResolutionState> {

    constructor() {
        super();
        this.state = {
            label: '',
            entityType: { key: '', value: ''},
            allEntityTypes: []
        };
    }


    public render() {
        return (
        <Overlay>
            <h2><i className='fa fa-exclamation-triangle warning'></i> Conflict: {this.props.message}</h2>
            <p>The following records conflict with your request change.</p>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Entity</th>
                        <th>Predicate</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                {this.props.conflictingRecords.map((record) => {

                    const entityName = this.props.dataStore.all.entity.value
                        .find((entity) => entity.uid == record.entity).label;

                    const predicateName = this.props.dataStore.all.predicate.value
                        .find((predicate) => predicate.uid == record.predicate).name;
                        

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