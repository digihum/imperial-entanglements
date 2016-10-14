/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { Link } from 'react-router';
import { ApiService, AppUrls } from '../ApiService';


import { ElementSet, EntityType, Entity } from '../datamodel/datamodel';

import { Sidebar, Tab } from '../components/Sidebar';
import { Workspace } from '../components/Workspace';

import { createTab } from '../Signaller';
import { find } from 'lodash';



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
    inBrowser: boolean;
}

export class ObjectEditor extends React.Component<EntityEditorProps, EntityEditorState> {

    private boundCreateTab: any;

    constructor() {
        super();
        this.state = {
            entity: new Entity(),
            tmp: '',
            entityTypes: [],
            options: [],
            tabs: [],
            inBrowser: (typeof window !== 'undefined')
        };

        if (this.state.inBrowser) {
            const tabsString = window.localStorage.getItem('open_tabs');
            if (tabsString !== null) {
                this.state.tabs = JSON.parse(tabsString);
            }
        }

        this.boundCreateTab = this.createTab.bind(this);

        createTab.add(this.boundCreateTab);
    }

    public createTab(title: string, subtitle: string, url: string) {
        if (find(this.state.tabs, (tab) => tab.title === title) === undefined) {
            this.setState({
                tabs: this.state.tabs.concat([{ title, subtitle, url}])
            });
        }
    }

    // public componentWillMount() {
    //     this.setState({
    //         tabs: [{ title: 'Entity 1', subtitle: 'Person', url: '/entity/1'}]
    //     });
    // }

    public componentWillUnmount() {
        const tabsString = JSON.stringify(this.state.tabs);
        if (this.state.inBrowser) {
            window.localStorage.setItem('open_tabs', tabsString);
        }
        createTab.remove(this.boundCreateTab);
    }

    public render() {
        return (
            <section id='entity-editor' className='flex-fill'>
                <Sidebar tabs={this.state.tabs} />
                <Workspace api={this.props.api} workspaceType={this.props.workspace} id={this.props.params.id} />
            </section>
        );
    }
}