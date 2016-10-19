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

import { createTab, closeTab, showModal } from '../Signaller';
import { find, tail } from 'lodash';

import { CreatePredicate } from '../components/modal/CreatePredicate';
import { CreateRecord } from '../components/modal/CreateRecord';
import { CreateSource } from '../components/modal/CreateSource';

import { ModalDefinition } from '../components/modal/ModalDefinition';

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
    modal: ModalDefinition | null;
    modalQueue: ModalDefinition[];
}

export class ObjectEditor extends React.Component<EntityEditorProps, EntityEditorState> {

    private boundCreateTab: any;
    private boundCloseTab: any;
    private boundAddModal: any;

    constructor() {
        super();
        this.state = {
            entity: new Entity(),
            tmp: '',
            entityTypes: [],
            options: [],
            tabs: [],
            inBrowser: (typeof window !== 'undefined'),
            modal: null,
            modalQueue: []
        };

        if (this.state.inBrowser) {
            const tabsString = window.localStorage.getItem('open_tabs');
            if (tabsString !== null) {
                this.state.tabs = JSON.parse(tabsString);
            }
        }

        this.boundCreateTab = this.createTab.bind(this);
        this.boundCloseTab = this.closeTab.bind(this);
        this.boundAddModal = this.addModal.bind(this);

        createTab.add(this.boundCreateTab);
        closeTab.add(this.boundCloseTab);
        showModal.add(this.boundAddModal);
    }

    public createTab(title: string, subtitle: string, url: string) {
        if (find(this.state.tabs, (tab) => tab.url === url) === undefined) {
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

    public addModal(def: ModalDefinition) {
        this.setState({ modalQueue: this.state.modalQueue.concat([def])}, () => {
            if (this.state.modal === null) {
                this.setState({ modal: this.state.modalQueue[0], modalQueue: tail(this.state.modalQueue)});
            }
        });
    }

    public modalComplete(data: any) {
        if (this.state.modal === null) {
            throw new Error('Attempted to complete non-existent modal');
        }
        this.state.modal.complete(data);
        if (this.state.modalQueue.length > 0) {
            this.setState({ modal: this.state.modalQueue[0], modalQueue: tail(this.state.modalQueue)});
        } else {
            this.setState({ modal: null });
        }
    }

    public modalCancel() {
        if (this.state.modal === null) {
            throw new Error('Attempted to cancel non-existent modal');
        }
        this.state.modal.cancel();
        this.setState({ modal: null, modalQueue: [] });
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
        showModal.remove(this.boundAddModal);
    }

    public render() {
        return (
            <section id='entity-editor' className='flex-fill'>
                <Sidebar tabs={this.state.tabs} />
                <Workspace {...this.props} id={this.props.params.id}/>
                {(() => {
                    if (this.state.modal === null) {
                        return null;
                    }

                    const sharedProps = {
                        api: this.props.api,
                        complete: this.modalComplete.bind(this),
                        cancel: this.modalCancel.bind(this)
                    };

                    switch(this.state.modal.name) {
                        case 'predicate':
                            return (<CreatePredicate {...sharedProps} {...this.state.modal.settings} />);

                        case 'record':
                            return (<CreateRecord {...sharedProps} {...this.state.modal.settings}/>);

                        case 'source':
                            return (<CreateSource {...sharedProps} {...this.state.modal.settings}/>);
                    }
                })()}
            </section>
        );
    }
}