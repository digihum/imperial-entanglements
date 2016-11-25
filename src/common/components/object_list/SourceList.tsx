/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService } from '../../ApiService';
import { DataStore } from '../../DataStore';

import { Source } from '../../../common/datamodel/datamodel';

import { AddTabButton } from '../AddTabButton';

import { showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';

import { SearchBar } from '../SearchBar';

interface SourceListProps {
    api: ApiService;
    dataStore: DataStore;
}

interface SourceListState {
    filterFunc: (p: Source) => boolean;
    mode: 'list' | 'tree';
}

interface ColumnSettings {
    name: string;
    nullable: boolean;

}

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

        showModal.dispatch(a);
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
                  <div onClick={() => this.setState({ mode: 'list' })}>LIST</div>
                  <div onClick={() => this.setState({ mode: 'tree' })}>TREE</div>
                </div>
              </div>
            </header>

            <section className='editor-body'>

                <SearchBar
                    getValue={(a: Source) => a.name}
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
                    {this.props.dataStore.all.source.value.filter(this.state.filterFunc).map((source) => {
                        return (
                            <tr key={`source-${source.uid}`}>
                                <td>{source.uid} <AddTabButton
                                    dataStore={this.props.dataStore}
                                    uid={source.uid}
                                    tabType='source' /></td>
                                <td>{source.name}</td>
                                <td>{source.parent}</td>
                            </tr>
                        );}
                    )}
                    </tbody>
                  </table>
                ) : null}


            </section>
        </div>
        );
    }
}
