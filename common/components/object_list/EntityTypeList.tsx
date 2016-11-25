/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService } from '../../ApiService';
import { DataStore } from '../../DataStore';
import { EntityType } from '../../../common/datamodel/datamodel';

import { AddTabButton } from '../AddTabButton';

import { showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';

import { SearchBar } from '../SearchBar';

interface EntityTypeListProps {
    api: ApiService;
    dataStore: DataStore;
}

interface EntityTypeListState {
    filterFunc: (t: EntityType) => boolean;
}

export class EntityTypeList extends React.Component<EntityTypeListProps, EntityTypeListState> {

    constructor() {
        super();
        this.state = {
            filterFunc: () => true
        };
    }

    public addNew() {
        const a : ModalDefinition = {
            name: 'entity_type',
            complete: () => {
            },
            cancel: () => { console.log('cancel')},
            settings: {}
        };

        showModal.dispatch(a);
    }


    public render() {
        return (
        <div className='workspace-editor'>

            <header className='editor-header entity_type'>
              <div className='primary-toolbar'>
                <div className='main-toolbar'>
                    <h2>All Entity Types <i
                        className='fa fa-plus-circle add button'
                        aria-hidden='true'
                        title='Add new entity type'
                        onClick={this.addNew.bind(this)}
                    ></i></h2>
                </div>
              </div>
            </header>

            <section className='editor-body'>

                <SearchBar
                    getValue={(a: EntityType) => a.name}
                    setFilterFunc={(f) => this.setState({ filterFunc: f })}
                />

                <table className='table gap'>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Name</td>
                            <td>Parent</td>
                            <td>Description</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.dataStore.all.entity_type.value.filter(this.state.filterFunc).map((entityType) => {
                        return (
                            <tr key={`entityType-${entityType.uid}`}>
                                <td>{entityType.uid} <AddTabButton
                                    dataStore={this.props.dataStore}
                                    uid={entityType.uid}
                                    tabType='entity_type' /></td>
                                <td>{entityType.name}</td>
                                <td>{entityType.parent}</td>
                                <td>{entityType.description}</td>
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
