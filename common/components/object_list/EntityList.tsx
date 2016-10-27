/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService, AppUrls } from '../../ApiService';
import { DataStore } from '../../DataStore';
import { Entity, EntityType, Predicate } from '../../../common/datamodel/datamodel';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { noop } from 'lodash';

import { AddTabButton } from '../AddTabButton';

import { showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';


interface EntityListProps {
    api: ApiService;
    dataStore: DataStore;
}

interface ColumnSettings {
    predicate: number;
}

interface EntityListState {
    entities: Entity[];
    entityTypes: EntityType[];
    predicates: Predicate[];
    columns: ColumnSettings[];
}



export class EntityList extends React.Component<EntityListProps, EntityListState> {

    constructor() {
        super();
        this.state = {
            entities: [],
            entityTypes: [],
            predicates: [],
            columns: []
        };
    }

    public addNew() {
        const a : ModalDefinition = {
            name: 'entity',
            complete: () => {
            },
            cancel: () => { console.log('cancel')},
            settings: {
                initialName: ''
            }
        };

        showModal.dispatch(a);
    }

    public setColumnPredicate(colId: number, predicateId: number) {

    }

    public render() {

        const entities = this.props.dataStore.all.entity.value;
        const predicates = this.props.dataStore.all.predicate.value;
        const entityTypes = this.props.dataStore.all.entity_type.value;

        return (
        <section>
            <h2>All Entities <i
                    className='fa fa-plus-circle add-button'
                    aria-hidden='true'
                    onClick={this.addNew.bind(this)}
            ></i></h2>
            <table className='table'>
                <thead>
                    <tr>
                        <td>#</td>
                        <td>Label</td>
                        <td>Type</td>
                        {[1,2,3].map((id) => (
                            <td key={`col-${id}`}><ComboDropdown
                                value={{key: '', value: ''}}
                                typeName='predicate'
                                allowNew={false}
                                setValue={(a) => console.log(a)}
                                options={predicates.map((pred) => ({ key: pred.name, value: pred.uid.toString()}))}
                                createNewValue={noop}
                            /></td>
                        ))}
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>

                        {[1,2,3].map((id) => (
                            <td key={`col-${id}`}>
                                <div>
                                    <select>
                                        <option>Exists</option>
                                        <option>Equals</option>
                                        <option>Similar</option>
                                    </select>
                                    <input type='text' />
                                </div>
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {entities.map((entity) => {
                    const entityType = entityTypes.find((t) => t.uid === entity.entityType);
                    return (
                        <tr key={`entity-${entity.uid}`}>
                            <td>{entity.uid} <AddTabButton
                                uid={entity.uid}
                                tabType='entity'/></td>
                            <td>{entity.label}</td>
                            <td>{entityType ? entityType.name : ''}</td>
                            <td>Col1</td>
                            <td>Col2</td>
                            <td>Col3</td>
                        </tr>
                    )}
                )}
                </tbody>
            </table>
        </section>
        );
    }
}