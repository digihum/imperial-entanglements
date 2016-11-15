/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import * as lev from 'levenshtein';

import { ApiService, AppUrls } from '../../ApiService';
import { DataStore } from '../../DataStore';
import { Entity, EntityType, Predicate, Record } from '../../../common/datamodel/datamodel';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { noop, cloneDeep } from 'lodash';

import { AddTabButton } from '../AddTabButton';

import { showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';

import { formatDate } from '../../helper/formatDate';

import * as queryString from 'querystring';


interface EntityListProps {
    api: ApiService;
    dataStore: DataStore;
}

interface ColumnSettings {
    predicate: number;
    sort: 'none' | 'asc' | 'desc';
    filterType: 'any' | 'exists' | 'contains' | 'similar';
    invertFilter: boolean;
    filterValue: string;
}

interface EntityListState {
    entities: Entity[];
    entityTypes: EntityType[];
    predicates: Predicate[];
    columns: ColumnSettings[];
    results: Record[];
    entityType: ComboDropdownOption;
}

const sortIcons = {
    'none': 'fa fa-sort',
    'asc': 'fa fa-sort-asc',
    'desc': 'fa fa-sort-desc'
};

const customColumns = (predicates, columns, updateColumnParams, rotateSort) => {
    return [0, 1, 2].map((id) => {

        const comboValue = { key: '', value: ''};

        if (columns[id].predicate !== -1) {
            const thisPred = predicates.find((pred) => pred.uid == columns[id].predicate);
            if (thisPred !== undefined) {
                comboValue.key = thisPred.name;
            }
            comboValue.value = columns[id].predicate;
        }

        return (
            <td key={`col-${id}`}>
                <div className='list-combo-header'>
                    <div className='combo-wrapper'>
                        <ComboDropdown
                            value={comboValue}
                            typeName='predicate'
                            allowNew={false}
                            setValue={(value) => updateColumnParams(id, { predicate: value.value })}
                            options={predicates.map((pred) => ({ key: pred.name, value: pred.uid.toString()}))}
                            createNewValue={noop}
                            compact={true}
                        />
                    </div>
                    <div className='order-wrapper'>
                        <i className={sortIcons[columns[id].sort]} onClick={() => rotateSort(id)}></i>
                    </div>
                </div>
            </td>
        );
    });
};

export class EntityList extends React.Component<EntityListProps, EntityListState> {

    constructor(props: EntityListProps) {
        super();
        this.state = {
            entities: [],
            entityTypes: [],
            predicates: [],
            columns: [
                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' },
                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' },
                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' }
            ],
            results: [],
            entityType: { key: 'Any', value: 0}
        };
    }

    public componentDidMount() {
        const queryStringOptions = queryString.parse(window.location.search.substr(1));
        const columns = cloneDeep(this.state.columns);
        for (let i = 1; i < 4; i += 1 ) {
            if (queryStringOptions.hasOwnProperty('col' + i)) {
                const args = queryStringOptions['col' + i].split(',');
                columns[i - 1].predicate = args[0];
                if (args.length === 2) {
                    columns[i - 1].filterType = args[1];
                }
            }
        }
         this.setState({
            columns
        }, this.reload.bind(this));
    }

    public reload() {

        const setColumns = this.state.columns.filter((col) => col.predicate != -1);

        this.props.api.getCollection(Record, AppUrls.record, {
            predicate: setColumns.map((col) => col.predicate),
            entity: this.props.dataStore.all.entity.value.map((entity) => entity.uid)
        })
        .then((results) => this.setState({ results }));
    }

    public addNew() {
        const a : ModalDefinition = {
            name: 'entity',
            complete: () => {
            },
            cancel: () => { console.log('cancel'); },
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

    public updateColumnParams(colId: number, updateData: { [s: string]: any }) {
        const columns = cloneDeep(this.state.columns);
        columns[colId] = Object.assign(columns[colId], updateData);
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

        const entityTypeOptions = entityTypes.map((entityType) => ({ key: entityType.name, value: entityType.uid}));

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
                                value = predicateData.map((pred) => {

                                    if (pred.valueType === 'date') {
                                        return formatDate(pred.value);
                                    }

                                    if (pred.valueType === 'source') {
                                        return this.props.dataStore.all.source.value.find((source) => source.uid === pred.value).name;
                                    }

                                    if (pred.valueType === 'entity') {
                                        return this.props.dataStore.all.entity.value.find((entity) => entity.uid === pred.value).label;
                                    } 

                                    return pred.value;
                                }).join(', ');
                            }
                            return value;
                        }
                })
            };
        })
        .filter((row) => {
            let keepRow = true;
            this.state.columns.forEach((col, i) => {
                if (col.filterType === 'contains' && col.filterValue.length > 0 && col.predicate !== null) {
                    if (row.columns[i].toLowerCase().indexOf(col.filterValue.toLowerCase()) === -1) {
                        keepRow = false;
                    }
                }

                if (col.filterType === 'exists' && col.predicate !== null) {
                    if (row.columns[i].length === 0) {
                        keepRow = false;
                    }
                }

                if (col.filterType === 'similar' && col.predicate !== null && col.filterValue.length > 0) {
                    if (new lev(row.columns[i], col.filterValue).distance >= col.filterValue.length + 2) {
                        keepRow = false;
                    }
                }

                
            });
            return keepRow;
        })
        .sort((row1, row2) => {
            let score = 0;
            this.state.columns.forEach((col, i) => {
                if (col.sort !== 'none' && row1.columns[i] !== row2.columns[i]) {
                    score += (row1.columns[i] > row2.columns[i] ? 1 : -1) * (Math.pow(10, 3 - i)) * (col.sort === 'asc' ? -1 : 1);
                }
            });
            return score;
        });

        return (
        <div className='workspace-editor'>
            <header className='editor-header entity'>
                <div className='main-toolbar'>
                    <h2>All Entities <i
                            className='fa fa-plus-circle add button'
                            aria-hidden='true'
                            onClick={this.addNew.bind(this)}
                    ></i></h2>
                </div>
            </header>

            <section className='editor-body'>
                <table className='table'>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Label</td>
                            <td>Type</td>
                            { customColumns(predicates, this.state.columns, this.updateColumnParams.bind(this), this.rotateSort.bind(this))}
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td>
                                <ComboDropdown
                                    value={this.state.entityType}
                                    typeName='entity type'
                                    allowNew={false}
                                    setValue={(entityType) => this.setState({ entityType })}
                                    options={entityTypeOptions}
                                    createNewValue={noop}
                                    compact={true}
                                />
                            </td>

                            {this.state.columns.map((col, id) => (
                                <td key={`col-${id}`}>
                                    <div className='flex-fill'>
                                        <div>
                                            <select value={col.filterType}
                                                    className='padded'
                                                    onChange={(e) => this.updateColumnParams(id, { filterType: e.target.value})}>
                                                <option value='any'>Any</option>
                                                <option value='exists'>Exists</option>
                                                <option value='contains'>Contains</option>
                                                <option value='similar'>Similar</option>
                                            </select>
                                        </div>
                                        <div>
                                            <input type='text'
                                                disabled={col.filterType === 'any' || col.filterType === 'exists'}
                                                onChange={(e) => this.updateColumnParams(id, { filterValue: e.target.value})}
                                                value={col.filterValue} />
                                        </div>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                    {tableData.map((row) => (
                            <tr key={`entity-${row.uid}`}>
                                <td>{row.uid}</td>
                                <td>{row.label} <AddTabButton
                                    uid={row.uid}
                                    tabType='entity'/></td>
                                <td>{row.entityType ? row.entityType.name : ''}</td>
                                {[0,1,2].map((id) => (<td key={`col-val-${id}`}>{row.columns[id]}</td>))}
                            </tr>
                        )
                    )}
                    </tbody>
                </table>
            </section>
        </div>
        );
    }
}