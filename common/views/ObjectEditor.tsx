/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { Link } from 'react-router';
import { Map } from 'immutable';
import * as moment from 'moment';

import { ApiService, AppUrls } from '../ApiService';

import { ElementSet, EntityType, Entity, Predicate, Record, Source } from '../datamodel/datamodel';

import { Sidebar, Tab } from '../components/Sidebar';
import { Workspace } from '../components/Workspace';

import { createTab, closeTab, showModal } from '../Signaller';
import { find, tail } from 'lodash';

import { CreatePredicate } from '../components/modal/CreatePredicate';
import { CreateRecord } from '../components/modal/CreateRecord';
import { CreateSource } from '../components/modal/CreateSource';
import { CreateEntity } from '../components/modal/CreateEntity';
import { CreateEntityType } from '../components/modal/CreateEntityType';

import { ModalDefinition } from '../components/modal/ModalDefinition';

import { DataStore, DataStoreEntry } from '../DataStore';

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
    tabs: Tab[];
    inBrowser: boolean;
    modalQueue: ModalDefinition[];
    dataStore: DataStore;
    loading: boolean;
}

export class ObjectEditor extends React.Component<EntityEditorProps, EntityEditorState> {

    private boundCreateTab: any;
    private boundCloseTab: any;
    private boundAddModal: any;

    constructor(props: EntityEditorProps, context: any) {
        super();
        this.state = {
            tabs: [],
            inBrowser: (typeof window !== 'undefined'),
            modalQueue: [],
            dataStore: {
                entity: Map<string, DataStoreEntry<Entity>>(),
                entityType: Map<string, DataStoreEntry<EntityType>>(),
                predicate: Map<string, DataStoreEntry<Predicate>>(),
                record: Map<string, DataStoreEntry<Record>>(),
                source: Map<string, DataStoreEntry<Source>>()
            },
            loading: true
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

    public componentDidMount() {

        const toUpdate = [
            ['predicate', Predicate, AppUrls.predicate, {}],
            ['source', Source, AppUrls.source, {}],
            ['entity', Entity, AppUrls.entity, {}],
            ['entityType', EntityType, AppUrls.entityType, {}]
        ].filter((entry) => {
            if (!this.state.dataStore[entry[0]].has(entry[2])) return true;
            const a = this.state.dataStore[entry[0]].get(entry[2]);
            return a.lastUpdate === null ? true : a.lastUpdate.diff(moment(), 'minutes') > 5;
        }).map((entry) => {
            return this.props.api.getCollection(entry[1], entry[2], {});
        });

        Promise.all(toUpdate)
        .then(([predicates, sources, entities, entityType]) => {
            this.setState({
                dataStore: Object.assign({}, 
                    this.state.dataStore,
                    {
                        predicate: this.state.dataStore['predicate'].set(AppUrls.predicate, { value: predicates, lastUpdate: moment()}),
                        source: this.state.dataStore['source'].set(AppUrls.source, { value: sources, lastUpdate: moment() }),
                        entity: this.state.dataStore['entity'].set(AppUrls.entity, { value: entities, lastUpdate: moment()}),
                        entityType: this.state.dataStore['entityType'].set(AppUrls.entityType, { value: entityType, lastUpdate: moment()})
                    }),
                loading: false
            });
        });
    }

    public createTab(title: string, subtitle: string, url: string, tabType: string) {
        if (find(this.state.tabs, (tab) => tab.url === url) === undefined) {
            this.setState({
                tabs: this.state.tabs.concat([{ title, subtitle, url, tabType}])
            }, this.saveTabs.bind(this));
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
        this.setState({ modalQueue: [def].concat(this.state.modalQueue)});
    }

    public modalComplete(data: any) {
        if (this.state.modalQueue.length === 0) {
            throw new Error('Attempted to complete non-existent modal');
        }
        this.state.modalQueue[0].complete(data);
        if (this.state.modalQueue.length > 0) {
            this.setState({ modalQueue: tail(this.state.modalQueue) });
        }
    }

    public modalCancel() {
        if (this.state.modalQueue.length === 0) {
            throw new Error('Attempted to cancel non-existent modal');
        }
        this.state.modalQueue[0].cancel();
        this.setState({
            modalQueue: []
        });
    }

    public setDatastore<T>(itemType: string, key: string, data: T[]) {
        this.setState({
            dataStore: Object.assign({}, 
                this.state.dataStore,
                {
                    [itemType]: this.state.dataStore[itemType].set(key, data)
                } 
        });
    }

    public componentWillUnmount() {
        this.saveTabs();
        createTab.remove(this.boundCreateTab);
        closeTab.remove(this.boundCloseTab);
        showModal.remove(this.boundAddModal);
    }

    public requestUrls(urls: [{base: string, params: { [s: string]: string }}]) {
        console.log("oot");
    }

    public render() {
        return (
            <section id='entity-editor' className='flex-fill'>
                <Sidebar tabs={this.state.tabs} />
                <Workspace {...this.props} id={this.props.params.id} dataStore={this.state.dataStore} loading={this.state.loading} />
                {(() => {
                    if (this.state.modalQueue.length === 0) {
                        return null;
                    }

                    const sharedProps = {
                        api: this.props.api,
                        dataStore: this.state.dataStore,
                        complete: this.modalComplete.bind(this),
                        cancel: this.modalCancel.bind(this)
                    };

                    switch(this.state.modalQueue[0].name) {
                        case 'predicate':
                            return (<CreatePredicate {...sharedProps} {...this.state.modalQueue[0].settings} />);

                        case 'record':
                            return (<CreateRecord {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                        case 'source':
                            return (<CreateSource {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                        case 'entity':
                            return (<CreateEntity {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                        case 'entity_type':
                            return (<CreateEntityType {...sharedProps} {...this.state.modalQueue[0].settings}/>);
                    }
                })()}
            </section>
        );
    }
}