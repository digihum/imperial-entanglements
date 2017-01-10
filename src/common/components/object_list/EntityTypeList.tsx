/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService } from '../../ApiService';
import { EntityType } from 'falcon-core';

import { AddTabButton } from '../AddTabButton';

import { ModalDefinition } from '../modal/ModalDefinition';

import { SearchBar } from '../SearchBar';

import { RecursiveTree } from '../RecursiveTree';

import { inject, observer } from 'mobx-react';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';

interface EntityTypeListProps {
    api: ApiService;
    dataStore?: DataController;
    modalStore?: ModalStore;
}

interface EntityTypeListState {
    filterFunc: (t: EntityType) => boolean;
    mode: 'list' | 'tree';
}

@inject('dataStore', 'modalStore')
@observer
export class EntityTypeList extends React.Component<EntityTypeListProps, EntityTypeListState> {

    constructor() {
        super();
        this.state = {
            filterFunc: () => true,
            mode: 'list'
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

        this.props.modalStore!.addModal(a);
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
               <div className='secondary-toolbar'>
                  <div className='tab-bar'>
                    <div className={'entity_type ' + (this.state.mode === 'list' ? 'selected' : '')}
                      onClick={() => this.setState({ mode: 'list' })}>LIST</div>

                    <div  className={'entity_type ' + (this.state.mode === 'tree' ? 'selected' : '')}
                      onClick={() => this.setState({ mode: 'tree' })}>TREE</div>
                  </div>
              </div>
            </header>

            <section className='editor-body'>

                <SearchBar
                    getValue={(a: EntityType) => a.label}
                    setFilterFunc={(f) => this.setState({ filterFunc: f })}
                />

                {this.state.mode === 'list' ? (
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
                                  <td>{entityType.label}</td>
                                  <td>{entityType.parent}</td>
                                  <td>{entityType.description}</td>
                              </tr>
                          );}
                      )}
                    </tbody>
                  </table>

                ) : (<div className='tree-root'>
                   <RecursiveTree
                    data={this.props.dataStore.all.entity_type.value}
                    tabType={'entity_type'}
                    parentId={null}
                    dataStore={this.props.dataStore} />
                  </div>)}

            </section>
        </div>
        );
    }
}
