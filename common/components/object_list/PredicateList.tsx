/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService } from '../../ApiService';
import { Predicate } from '../../../common/datamodel/datamodel';

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
                <div className='main-toolbar'>
                    <h2>All Properties <i
                        className='fa fa-plus-circle add button'
                        title='Add new property'
                        aria-hidden='true'
                        onClick={this.addNew.bind(this)}
                    ></i></h2>
                </div>
            </header>

            <section className='editor-body'>

                <SearchBar
                    getValue={(a: Predicate) => a.name}
                    setFilterFunc={(f) => this.setState({ filterFunc: f })}
                />

                <table className='table gap'>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Label</td>
                            <td>Domain</td>
                            <td>Range</td>
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
                                <td>{predicate.name}</td>
                                <td>{entityType ? entityType.name : ''}</td>
                                <td>{predicate.rangeIsReference ? rangeType ? rangeType.name : '' : rangeType}</td>
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