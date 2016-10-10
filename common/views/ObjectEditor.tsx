/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { Link } from 'react-router';
import { ApiService, AppUrls } from '../ApiService';


import { ElementSet } from '../datamodel/ElementSet';
import { EntityType } from '../datamodel/EntityType';
import { Entity } from '../datamodel/Entity';

import { Sidebar } from '../components/Sidebar';
import { Workspace } from '../components/Workspace';



interface ExpectedParams {
    id: number;
}

interface EntityEditorProps {
    id: number;
    api: ApiService;
    params: ExpectedParams;
    workspace: string;
}

interface EntityEditorState {
    entity: Entity;
    tmp: string;
    entityTypes: EntityType[];
    options: any[];
    tabs: Tab[];
}

class Tab {
    public name: string;
    public url: string;
}

export class ObjectEditor extends React.Component<EntityEditorProps, EntityEditorState> {

    constructor() {
        super();
        this.state = {
            entity: new Entity(),
            tmp: '',
            entityTypes: [],
            options: [],
            tabs: []
        };

        if (typeof window !== 'undefined') {
            console.log("browser!");
        } else {
            console.log("server");
        }
    }

    public render() {
        return (
            <section id='entity-editor' className='flex-fill'>
                <Sidebar />
                <Workspace api={this.props.api} workspaceType={this.props.workspace} id={this.props.params.id} />
            </section>
        );
    }
}