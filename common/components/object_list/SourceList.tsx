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

interface SourceListProps {
    api: ApiService;
}

interface SourceListState {
    sources: Source[];
}

interface ColumnSettings {
    name: string;
    nullable: boolean;

}

export class SourceList extends React.Component<SourceListProps, SourceListState> {

    constructor() {
        super();
        this.state = {
            sources: []
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
        <section>
            <h2>All Sources <i
                className='fa fa-plus-circle add-button'
                aria-hidden='true'
                onClick={this.addNew.bind(this)}
            ></i></h2>
            <table className='table'>
                <thead>
                    <tr>
                        <td>#</td>
                        <td>Label</td>
                        <td>Type</td>
                    </tr>
                </thead>
                <tbody>
                {this.state.sources.map((source) => {
                    return (
                        <tr key={`source-${source.uid}`}>
                            <td>{source.uid} <AddTabButton
                                title={source.name}
                                subtitle={`Source ${source.uid}`}
                                url={`/${AppUrls.source}/${source.uid}`} /></td>
                            <td>{source.name}</td>
                            <td></td>
                        </tr>
                    )}
                )}
                </tbody>
            </table>
        </section>
        );
    }
}