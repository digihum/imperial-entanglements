/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService } from '../../ApiService';
import { DataStore } from '../../DataStore';

import { Source } from 'falcon-core';

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

interface RecursiveTreeProps {
  sources: Source[];
  parentId: null | number;
  dataStore: DataStore;
}

interface RecursiveTreeState {
  collapsed: boolean;
}

class RecursiveTree extends React.Component<RecursiveTreeProps, RecursiveTreeState> {

  constructor() {
    super();
    this.state = { collapsed: false };
  }

  render() {
    const filtered = this.props.sources.filter((source) => source.parent === this.props.parentId);
    if (filtered.length === 0) {
      return null;
    }

    return (
      <div>
        {
          filtered.map((source) => (
            <div key={source.label}>
              <div className='tree-label' onClick={() => this.setState({ collapsed: !this.state.collapsed})}>
                - {source.label} <AddTabButton dataStore={this.props.dataStore} uid={source.uid} tabType='source' />
              </div>
              {!this.state.collapsed ? (
                <div className='tree-children'>
                  <RecursiveTree dataStore={this.props.dataStore} sources={this.props.sources} parentId={source.uid} />
                </div>
              ) : null}
            </div>
          ))
        }
      </div>
    );
  }
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
                    {this.props.dataStore.all.source.value.filter(this.state.filterFunc).map((source) => {
                        return (
                            <tr key={`source-${source.uid}`}>
                                <td>{source.uid} <AddTabButton
                                    dataStore={this.props.dataStore}
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
                   <RecursiveTree sources={this.props.dataStore.all.source.value} parentId={null} dataStore={this.props.dataStore} />
                  </div>
                )}


            </section>
        </div>
        );
    }
}
