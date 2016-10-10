/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { ApiService } from '../ApiService';
import {
    EmptyWorkspace,
    SourceEditorWorkspace,
    EntityEditorWorkspace,
    PredicateEditorWorkspace} from './workspace/workspace';

interface WorkspaceProps {
    api: ApiService;
    workspaceType: string;
    id: number;
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


    // public componentDidMount() {
    //     this.props.api.getItem(Entity, AppUrls.entity, this.props.params.id)
    //     .then((data) => {
    //         this.setState({ entity: data });
    //     });

    //     this.props.api.getCollection(EntityType, AppUrls.entityType)
    //     .then((data) => {
    //         this.setState({entityTypes: data, options: this.getOptions(data)});
    //     });
    // }

    // public getOptions(baseData: any) {
    //     return [{ label: '+ Add new Entity Type', value: 'ADD_NEW_ENTITY_TYPE'}]
    //         .concat(baseData.map((entityType) => ({ label: entityType.name, value: entityType.name })));
    // }

    // public setSelectedEntityType(data) {
    //     if (data.value === 'ADD_NEW_ENTITY_TYPE') {
    //         const newName = prompt('What do you want your new entity type to be called?');
    //         if (newName === null) {
    //             this.setState({ tmp: this.state.tmp });
    //         } else {
    //             this.setState({
    //                 options: this.state.options.concat([{ label: newName, value: newName}]),
    //                 tmp: newName                
    //             });
    //         }

    //     } else {
    //         this.setState({ tmp: data.value })
    //     }
    // }

    public render() {
        switch (this.props.workspaceType) {
            case 'entity':
                return (<EntityEditorWorkspace api={this.props.api} id={this.props.id} />);
            case 'predicate':
                return (<PredicateEditorWorkspace api={this.props.api} id={this.props.id} />);
            default:
                return (<EmptyWorkspace />);

        }
    }
}


// <Select
//                     name='form-field-name'
//                     value={this.state.tmp}
//                     onChange={this.setSelectedEntityType.bind(this)}
//                     options={this.state.options}
//                 />