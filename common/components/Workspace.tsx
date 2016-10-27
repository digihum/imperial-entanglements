/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { ApiService } from '../ApiService';
import { DataStore } from '../DataStore';
import { Loading } from './Loading';

import {
    EmptyWorkspace,
    SourceEditorWorkspace,
    EntityEditorWorkspace,
    EntityTypeWorkspace,
    PredicateEditorWorkspace,
    AdvancedSearchWorkspace,
    ObjectListWorkspace } from './workspace/workspace';

interface WorkspaceProps {
    api: ApiService;
    workspace: string;
    id: number;
    name?: string;
    list: boolean;
    dataStore: DataStore;
    loading: boolean;
}

interface WorkspaceState {
    searchString: string;
}

export class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {

    constructor() {
        super();
        this.state = {
            searchString: ''
        };
    }

    public render() {

        if (this.props.loading) {
            return (<Loading />);
        }

        if (this.props.list) {
            return (<ObjectListWorkspace
                api={this.props.api}
                name={this.props.name}
                listType={this.props.workspace}
                dataStore={this.props.dataStore} />);
        }

        switch (this.props.workspace) {
            case 'entity':
                return (<EntityEditorWorkspace api={this.props.api} id={this.props.id} dataStore={this.props.dataStore} />);
            case 'predicate':
                return (<PredicateEditorWorkspace api={this.props.api} id={this.props.id} />);
            case 'source':
                return (<SourceEditorWorkspace api={this.props.api} id={this.props.id} />);
            case 'entity_type':
                return (<EntityTypeWorkspace api={this.props.api} id={this.props.id} />);
            case 'search':
                return (<AdvancedSearchWorkspace api={this.props.api} />);
            default:
                return (<EmptyWorkspace />);

        }
    }
}