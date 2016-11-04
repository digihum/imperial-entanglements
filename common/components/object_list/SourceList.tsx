/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService, AppUrls } from '../../ApiService';
import { Source } from '../../../common/datamodel/datamodel';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { noop } from 'lodash';

import { AddTabButton } from '../AddTabButton';

import { showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';

import { SearchBar } from '../SearchBar';

interface SourceListProps {
    api: ApiService;
}

interface SourceListState {
    sources: Source[];
    filterFunc: (p: Source) => boolean;
}

interface ColumnSettings {
    name: string;
    nullable: boolean;

}

export class SourceList extends React.Component<SourceListProps, SourceListState> {

    constructor() {
        super();
        this.state = {
            sources: [],
            filterFunc: () => true
        };
    }

    public componentWillMount() {
        this.loadData();
    }

    public loadData() {
        Promise.all([
            this.props.api.getCollection(Source, AppUrls.source, {})
        ])
        .then(([sources]) => this.setState({ sources }));
    }

    public addNew() {
        const a : ModalDefinition = {
            name: 'source',
            complete: () => {
                this.loadData();
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
                <div className='main-toolbar'>
                    <h2>All Sources <i
                        className='fa fa-plus-circle add button'
                        aria-hidden='true'
                        onClick={this.addNew.bind(this)}
                    ></i></h2>
                </div>
            </header>

            <section className='editor-body'>

                <SearchBar
                    getValue={(a: Source) => a.name}
                    setFilterFunc={(f) => this.setState({ filterFunc: f })}
                />

                <table className='table'>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Label</td>
                            <td>Type</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.sources.filter(this.state.filterFunc).map((source) => {
                        return (
                            <tr key={`source-${source.uid}`}>
                                <td>{source.uid} <AddTabButton
                                    uid={source.uid}
                                    tabType='source' /></td>
                                <td>{source.name}</td>
                                <td></td>
                            </tr>
                        )}
                    )}
                    </tbody>
                </table>
            </section>
        </div>
        );
    }
}