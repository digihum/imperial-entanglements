/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';

import * as lev from 'levenshtein';

import { AppUrls } from '../../ApiService';

import { Entity, EntityType, Predicate, Record } from '@digihum/falcon-core';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { noop, cloneDeep, isUndefined } from 'lodash';

import { AddTabButton } from '../AddTabButton';

import { ModalDefinition } from '../modal/ModalDefinition';

import { formatDate } from '../../helper/formatDate';

import { inject, observer } from 'mobx-react';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';

interface EntityListProps {
    dataStore?: DataController;
    modalStore?: ModalStore;
    query: any;
}

export interface ColumnSettings {
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
    entityType: ComboDropdownOption;
    queryData: any;
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
                comboValue.key = thisPred.label;
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
                            setValue={(value) => updateColumnParams(id, 'p' , value === null ? null : value.value)}
                            options={predicates.map((pred) => ({ key: pred.label, value: pred.uid.toString()}))}
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

@inject('dataStore', 'modalStore')
@observer
export class EntityList extends React.Component<EntityListProps, EntityListState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

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
            entityType: { key: 'Any', value: 0}
        };
    }

    public componentDidMount() {
      this.update(this.props);
    }

    public componentWillReceiveProps(newProps: EntityListProps) {
      this.update(newProps);
    }

    public update(props: EntityListProps) {
        const queryStringOptions = props.query;
        const columns = cloneDeep(this.state.columns);
        if (queryStringOptions !== null) {
            for (let i = 1; i < 4; i += 1 ) {
              columns[i - 1].predicate = queryStringOptions[`col${i}p`] || null;
              columns[i - 1].sort = queryStringOptions[`col${i}s`] || null;
              columns[i - 1].filterType = queryStringOptions[`col${i}f`] || '';
              columns[i - 1].filterValue = queryStringOptions[`col${i}v`] || '';
              columns[i - 1].invertFilter = queryStringOptions[`col${i}i`] || null;
            }
        }
         this.setState({
            columns,
            queryData: queryStringOptions === null ? {} : queryStringOptions
        });
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

        this.props.modalStore!.addModal(a);
    }

    public updateColumnParams(colId: number, key: string, value: any) {
        this.context.router.transitionTo({
          pathname: '/edit/entity',
          query: Object.assign(this.state.queryData, { [`col${colId + 1}${key}`]: value })
        });
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
        });
    }

    public addViewTab() {
      const tabData = {};

      const mapping = [
        { key: 'p', display: 'Predicate', mod: (data) => this.props.dataStore!.dataStore.all.predicate.value.find((pred) => pred.uid == data)!.label },
        { key: 's', display: 'Sort', mod: (data) => data },
        { key: 'f', display: 'filterType', mod: (data) => data },
        { key: 'v', display: 'filterValue', mod: (data) => data },
        { key: 'i', display: 'invertFilter', mod: (data) => data }
      ];

      for (let i = 1; i < 4; i += 1) {
        for (let j = 0; j < mapping.length; j += 1) {
          if (this.state.queryData[`col${i}${mapping[j].key}`] !== undefined) {
            if (tabData[`Column ${i}`] === undefined) {
              tabData[`Column ${i}`] = {};
            }
            tabData[`Column ${i}`][mapping[j].display] = mapping[j].mod(this.state.queryData[`col${i}${mapping[j].key}`]);
          }
        }
      }

       this.props.dataStore!.createTab('entity', Date.now(), 'view', tabData, this.props.query);
    }

    public render() {

        const entities = this.props.dataStore!.dataStore.all.entity.value;
        const predicates = this.props.dataStore!.dataStore.all.predicate.value;
        const entityTypes = this.props.dataStore!.dataStore.all.entity_type.value;

        const entityTypeOptions = entityTypes.map((entityType) => ({ key: entityType.label, value: entityType.uid}));

        const tableData = entities.map((entity) => {
            const entityType = entityTypes.find((t) => t.uid === entity.entityType);
            const entityData = this.props.dataStore!.dataStore.records.filter((res) => res.entity === entity.uid);

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
                                        if (pred.value === null) {
                                            return 'Not set';
                                        }
                                        return this.props.dataStore!.dataStore.all.source.value.find((source) => source.uid === pred.value)!.label;
                                    }

                                    if (pred.valueType === 'entity') {
                                        if (pred.value === null) {
                                            return 'Not set';
                                        }
                                        return this.props.dataStore!.dataStore.all.entity.value.find((entity) => entity.uid === pred.value)!.label;
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
                    if (row.columns[i]!.toLowerCase().indexOf(col.filterValue.toLowerCase()) === -1) {
                        keepRow = false;
                    }
                }

                if (col.filterType === 'exists' && col.predicate !== null) {
                    if (row.columns[i]!.length === 0) {
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
              <div className='primary-toolbar'>
                <div className='main-toolbar'>
                    <h2>All Entities <i
                            className='fa fa-plus-circle add button'
                            title='Add new entity'
                            aria-hidden='true'
                            onClick={this.addNew.bind(this)}
                    ></i></h2>
                </div>
                 <div className='sub-toolbar'>
                        <i
                            className='fa fa-folder-open-o'
                            aria-hidden='true'
                            onClick={this.addViewTab.bind(this)}
                        ></i>
                    </div>
              </div>
              <div className='secondary-toolbar'>
                  <div className='tab-bar'>
                    <div className={'entity selected'}>LIST</div>
                  </div>
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
                                                    onChange={(e) => this.updateColumnParams(id, 'f', e.target.value)}>
                                                <option value='any'>Any</option>
                                                <option value='exists'>Exists</option>
                                                <option value='contains'>Contains</option>
                                                <option value='similar'>Similar</option>
                                            </select>
                                        </div>
                                        <div>
                                            <input type='text'
                                                disabled={col.filterType === 'any' || col.filterType === 'exists'}
                                                onChange={(e) => this.updateColumnParams(id, 'v', e.target.value)}
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
                                    uid={row.uid!}
                                    tabType='entity'/></td>
                                <td>{row.entityType ? row.entityType.label : ''}</td>
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
