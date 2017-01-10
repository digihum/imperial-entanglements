/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { ApiService } from '../ApiService';
import { DataController } from '../stores/DataController';
import { Loading } from './Loading';

import { } from 'mobx';
import { inject, observer } from 'mobx-react';

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
    dataStore?: DataController;
    loading: boolean;
    location: { pathname: string, search: string };
}

interface WorkspaceState {
    searchString: string;
}

@inject('dataStore')
@observer
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
                query={this.props.location.query}
                listType={this.props.workspace}
                dataStore={this.props.dataStore} />);
        }

        let workspaceComponent : any = EmptyWorkspace;

        switch (this.props.workspace) {
            case 'entity':
                workspaceComponent = EntityEditorWorkspace;
                break;
            case 'predicate':
                workspaceComponent = PredicateEditorWorkspace;
                break;
            case 'source':
                workspaceComponent = SourceEditorWorkspace;
                break;
            case 'entity_type':
                workspaceComponent = EntityTypeWorkspace;
                break;
            case 'search':
                workspaceComponent = AdvancedSearchWorkspace;
                break;
        }

        return (
            <div className='flex-fill workspace-outer-wrapper'>
                <div className='workspace-inner-wrapper flex-fill'>
                    {React.createElement(workspaceComponent, {api: this.props.api, dataStore: this.props.dataStore, id:this.props.id})}
                </div>
            </div>
        );


    }
}
