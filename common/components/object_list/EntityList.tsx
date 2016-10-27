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
import { noop, cloneDeep } from 'lodash';

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
    results: any[];
}



export class EntityList extends React.Component<EntityListProps, EntityListState> {

    constructor() {
        super();
        this.state = {
            entities: [],
            entityTypes: [],
            predicates: [],
            columns: [
                { predicate: -1 },
                { predicate: -1 },
                { predicate: -1 }
            ],
            results: []
        };
    }

    public componentDidMount() {
        this.reload();
    }

    public reload() {

        let predicatesQuery = '';

        if (this.state.columns.length > 0) {
             const colUids = this.state.columns.map((col) => `"${col.predicate}"`).join(', ');
             predicatesQuery = `, predicates(uids: [${colUids}]) { uid, values }`;
        }

        const queryString = `{ entity { uid, type${predicatesQuery} } }`;

        this.props.api.query(queryString).then((results) => this.setState({ results: results.data.entity });
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
        const columns = cloneDeep(this.state.columns);
        columns[colId].predicate = predicateId;
        this.setState({
            columns
        }, this.reload.bind(this));
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
                        {[0,1,2].map((id) => {

                            let comboValue = { key: '', value: ''};

                            if (this.state.columns[id].predicate !== -1) {
                                const thisPred = predicates.find((pred) => pred.uid == this.state.columns[id].predicate);
                                if (thisPred !== undefined) {
                                    comboValue.key = thisPred.name;
                                }
                                comboValue.value = this.state.columns[id].predicate;
                            }

                            return (
                                <td key={`col-${id}`}><ComboDropdown
                                    value={comboValue}
                                    typeName='predicate'
                                    allowNew={false}
                                    setValue={(value) => this.setColumnPredicate(id, value.value)}
                                    options={predicates.map((pred) => ({ key: pred.name, value: pred.uid.toString()}))}
                                    createNewValue={noop}
                                /></td>
                            );
                        }
                        )}
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>

                        {[0,1,2].map((id) => (
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
                    const entityData = this.state.results.find((res) => res.uid == entity.uid);
                    return (
                        <tr key={`entity-${entity.uid}`}>
                            <td>{entity.uid} <AddTabButton
                                uid={entity.uid}
                                tabType='entity'/></td>
                            <td>{entity.label}</td>
                            <td>{entityType ? entityType.name : ''}</td>

                             {[0,1,2].map((id) => {

                                 let value = '';

                                 if (entityData !== undefined && this.state.columns[id].predicate !== -1) {
                                     const predicateData = entityData.predicates
                                        .find((pred) => pred.uid == this.state.columns[id].predicate);

                                    if(predicateData !== undefined) {
                                        value = predicateData.values.join(', ');
                                    }
                                 }

                                 return (<td key={`col-val-${id}`}>{value}</td>);
                            })}
                        </tr>
                    )}
                )}
                </tbody>
            </table>
        </section>
        );
    }
}