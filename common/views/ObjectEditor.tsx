/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { Link } from 'react-router';
import { ApiService, AppUrls } from '../ApiService';


import { ElementSet, EntityType, Entity } from '../datamodel/datamodel';

import { Sidebar, Tab } from '../components/Sidebar';
import { Workspace } from '../components/Workspace';

import { createTab, closeTab } from '../Signaller';
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
    private boundCloseTab: any;

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
        this.boundCloseTab = this.closeTab.bind(this);

        createTab.add(this.boundCreateTab);
        closeTab.add(this.boundCloseTab);
    }

    public createTab(title: string, subtitle: string, url: string) {
        if (find(this.state.tabs, (tab) => tab.title === title) === undefined) {
            this.setState({
                tabs: this.state.tabs.concat([{ title, subtitle, url}])
            });
        }
    }

    public closeTab(url: string) {
        this.setState({
            tabs: this.state.tabs.filter((a) => a.url !== url)
        }, () => this.saveTabs());
    }

    public saveTabs() {
        const tabsString = JSON.stringify(this.state.tabs);
        if (this.state.inBrowser) {
            window.localStorage.setItem('open_tabs', tabsString);
        }
    }

    // public componentWillMount() {
    //     this.setState({
    //         tabs: [{ title: 'Entity 1', subtitle: 'Person', url: '/entity/1'}]
    //     });
    // }

    public componentWillUnmount() {
        this.saveTabs();
        createTab.remove(this.boundCreateTab);
        closeTab.remove(this.boundCloseTab);
    }

    public render() {
        return (
            <section id='entity-editor' className='flex-fill'>
                <Sidebar tabs={this.state.tabs} />
                <Workspace {...this.props} id={this.props.params.id}/>
            </section>
        );
    }
}