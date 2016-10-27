/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService, AppUrls } from '../../ApiService';
import { DataStore } from '../../DataStore';
import { Entity, EntityType, Predicate, Record } from '../../../common/datamodel/datamodel';
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
    sort: 'none' | 'asc' | 'desc';
}

interface EntityListState {
    entities: Entity[];
    entityTypes: EntityType[];
    predicates: Predicate[];
    columns: ColumnSettings[];
    results: Record[];
}

const sortIcons = {
    'none': 'fa fa-sort',
    'asc': 'fa fa-sort-asc',
    'desc': 'fa fa-sort-desc'
};

const customColumns = (predicates, columns, setColumnPredicate, rotateSort) => {
    return [0,1,2].map((id) => {

        let comboValue = { key: '', value: ''};

        if (columns[id].predicate !== -1) {
            const thisPred = predicates.find((pred) => pred.uid == columns[id].predicate);
            if (thisPred !== undefined) {
                comboValue.key = thisPred.name;
            }
            comboValue.value = columns[id].predicate;
        }

        return (
            <td key={`col-${id}`}>
                <ComboDropdown
                    value={comboValue}
                    typeName='predicate'
                    allowNew={false}
                    setValue={(value) => setColumnPredicate(id, value.value)}
                    options={predicates.map((pred) => ({ key: pred.name, value: pred.uid.toString()}))}
                    createNewValue={noop}
                />
                <i className={sortIcons[columns[id].sort]} onClick={() => rotateSort(id)}></i>
            </td>
        );
    })
};

export class EntityList extends React.Component<EntityListProps, EntityListState> {

    constructor() {
        super();
        this.state = {
            entities: [],
            entityTypes: [],
            predicates: [],
            columns: [
                { predicate: -1, sort: 'none' },
                { predicate: -1, sort: 'none' },
                { predicate: -1, sort: 'none' }
            ],
            results: []
        };
    }

    public componentDidMount() {
        this.reload();
    }

    public reload() {

        let predicatesQuery = '';
        const setColumns = this.state.columns.filter((col) => col.predicate != -1);

        this.props.api.getCollection(Record, AppUrls.record, {
            predicate: setColumns.map((col) => col.predicate),
            entity: this.props.dataStore.all.entity.value.map((entity) => entity.uid)
        })
        .then((results) => this.setState({ results });
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

    public rotateSort(colId: number) {
        const columns = cloneDeep(this.state.columns);
        switch (columns[colId].sort) {
            case 'none':
                columns[colId].sort = 'asc';
                break;
            case 'asc':
                columns[colId].sort = 'desc';
                break;
            case 'desc':
                columns[colId].sort = 'none';
        }
        this.setState({
            columns
        }, this.reload.bind(this));
    }

    public render() {

        const entities = this.props.dataStore.all.entity.value;
        const predicates = this.props.dataStore.all.predicate.value;
        const entityTypes = this.props.dataStore.all.entity_type.value;

        const tableData = entities.map((entity) => {
            const entityType = entityTypes.find((t) => t.uid === entity.entityType);
            const entityData = this.state.results.filter((res) => res.entity === entity.uid);

            return {
                uid: entity.uid,
                label: entity.label,
                entityType,
                columns: this.state.columns.map((col) => {
                        let value = '';

                        if (entityData !== undefined && col.predicate !== -1) {
                            const predicateData = entityData
                            .filter((record) => record.predicate == col.predicate);

                            if (predicateData !== undefined) {
                                value = predicateData.map((pred) => pred.value).join(', ');
                            }
                            return value;
                        }
                })
            };
        }).sort((row1, row2) => {
            let score = 0;
            this.state.columns.forEach((col, i) => {
                if (col.sort !== 'none' && row1.columns[i] !== row2.columns[i]) {
                    score += (row1.columns[i] > row2.columns[i] ? 1 : -1) * (Math.pow(10, 3 - i)) * (col.sort === 'asc' ? -1 : 1);
                }
            });
            return score;
        });

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
                        { customColumns(predicates, this.state.columns, this.setColumnPredicate.bind(this), this.rotateSort.bind(this))}
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
                {tableData.map((row) => (
                        <tr key={`entity-${row.uid}`}>
                            <td>{row.uid} <AddTabButton
                                uid={row.uid}
                                tabType='entity'/></td>
                            <td>{row.label}</td>
                            <td>{row.entityType ? row.entityType.name : ''}</td>
                             {[0,1,2].map((id) => (<td key={`col-val-${id}`}>{row.columns[id]}</td>))}
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </section>
        );
    }
}