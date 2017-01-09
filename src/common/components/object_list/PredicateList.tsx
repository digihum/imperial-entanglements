/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService } from '../../ApiService';
import { Predicate } from 'falcon-core';

import { AddTabButton } from '../AddTabButton';
import { DataStore } from '../../DataStore';

import { showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';

import { SearchBar } from '../SearchBar';


interface PredicateListProps {
    api: ApiService;
    dataStore: DataStore;
}

interface PredicateListState {
    filterFunc: (p: Predicate) => boolean;
}

interface ColumnSettings {
    name: string;
    nullable: boolean;

}

export class PredicateList extends React.Component<PredicateListProps, PredicateListState> {

    constructor() {
        super();
        this.state = {
            filterFunc: () => true
        };
    }

    public addNew() {
        const a : ModalDefinition = {
            name: 'predicate',
            complete: () => {
            },
            cancel: () => { console.log('cancel')},
            settings: {
                initialName: ''
            }
        };

        showModal.dispatch(a);
    }

    public render() {
        return (
        <div className='workspace-editor'>
            <header className='editor-header predicate'>
              <div className='primary-toolbar'>
                <div className='main-toolbar'>
                    <h2>All Properties <i
                        className='fa fa-plus-circle add button'
                        title='Add new property'
                        aria-hidden='true'
                        onClick={this.addNew.bind(this)}
                    ></i></h2>
                </div>
              </div>
               <div className='secondary-toolbar'>
                  <div className='tab-bar'>
                    <div className={'predicate selected'}>LIST</div>
                  </div>
              </div>
            </header>

            <section className='editor-body'>

                <SearchBar
                    getValue={(a: Predicate) => a.label}
                    setFilterFunc={(f) => this.setState({ filterFunc: f })}
                />

                <table className='table gap'>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Label</td>
                            <td>Domain</td>
                            <td>Range</td>
                            <td>Uses</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.dataStore.all.predicate.value.filter(this.state.filterFunc).map((predicate) => {
                        const entityType = this.props.dataStore.all.entity_type.value.find((t) => t.uid === predicate.domain);
                        const rangeType = predicate.rangeIsReference ?
                            this.props.dataStore.all.entity_type.value.find((t) => t.uid === predicate.range) :
                            predicate.range;
                        return (
                            <tr key={`predicate-${predicate.uid}`}>
                                <td>{predicate.uid} <AddTabButton
                                    dataStore={this.props.dataStore}
                                    uid={predicate.uid}
                                    tabType='predicate' /></td>
                                <td>{predicate.label}</td>
                                <td>{entityType ? entityType.label : ''}</td>
                                <td>{predicate.rangeIsReference ? rangeType ? rangeType.label : '' : rangeType}</td>
                                <td>{predicate.uses}</td>
                            </tr>
                        );}
                    )}
                    </tbody>
                </table>
            </section>
        </div>
        );
    }
}
