/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService } from '../../ApiService';

import { Source } from 'falcon-core';

import { AddTabButton } from '../AddTabButton';

import { inject, observer } from 'mobx-react';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';

import { ModalDefinition } from '../modal/ModalDefinition';

import { SearchBar } from '../SearchBar';

import { RecursiveTree } from '../RecursiveTree';

interface SourceListProps {
    api: ApiService;
    dataStore?: DataController;
    modalStore?: ModalStore;
}

interface SourceListState {
    filterFunc: (p: Source) => boolean;
    mode: 'list' | 'tree';
}

interface ColumnSettings {
    name: string;
    nullable: boolean;
}

@inject('dataStore', 'modalStore')
@observer
export class SourceList extends React.Component<SourceListProps, SourceListState> {

    constructor() {
        super();
        this.state = {
            filterFunc: () => true,
            mode: 'list'
        };
    }

    public addNew() {
        const a : ModalDefinition = {
            name: 'source',
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
            <header className='editor-header source'>
              <div className='primary-toolbar'>
                <div className='main-toolbar'>
                    <h2>All Sources <i
                        className='fa fa-plus-circle add button'
                        aria-hidden='true'
                        title='Add new source'
                        onClick={this.addNew.bind(this)}
                    ></i></h2>
                </div>
              </div>
              <div className='secondary-toolbar'>
                <div className='tab-bar'>

                  <div className={'source ' + (this.state.mode === 'list' ? 'selected' : '')}
                    onClick={() => this.setState({ mode: 'list' })}>LIST</div>

                  <div  className={'source ' + (this.state.mode === 'tree' ? 'selected' : '')}
                    onClick={() => this.setState({ mode: 'tree' })}>TREE</div>

                </div>
              </div>
            </header>

            <section className='editor-body'>

                <SearchBar
                    getValue={(a: Source) => a.label}
                    setFilterFunc={(f) => this.setState({ filterFunc: f })}
                />

                {this.state.mode === 'list' ? (
                  <table className='table gap'>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Name</td>
                            <td>Parent</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.dataStore!.dataStore.all.source.value.filter(this.state.filterFunc).map((source) => {
                        return (
                            <tr key={`source-${source.uid}`}>
                                <td>{source.uid} <AddTabButton
                                     uid={source.uid}
                                    tabType='source' /></td>
                                <td>{source.label}</td>
                                <td>{source.parent}</td>
                            </tr>
                        );}
                    )}
                    </tbody>
                  </table>
                ) : (
                  <div className='tree-root'>
                   <RecursiveTree
                    data={this.props.dataStore!.dataStore.all.source.value}
                    tabType={'source'}
                    parentId={null}
                    dataStore={this.props.dataStore} />
                  </div>
                )}


            </section>
        </div>
        );
    }
}
