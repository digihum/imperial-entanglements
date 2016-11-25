/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { Map } from 'immutable';
import * as moment from 'moment';

import { ApiService, AppUrls } from '../ApiService';

import { EntityType, Entity, Predicate, Record, Source, SourceElement, ElementSet } from '../../common/datamodel/datamodel';

import { Sidebar, Tab } from '../components/Sidebar';
import { Workspace } from '../components/Workspace';
import { Toast } from '../components/Toast';

import { createTab, closeTab, showModal, triggerReload, reorderTabs } from '../Signaller';
import { find, tail, cloneDeep, groupBy, findIndex } from 'lodash';

import { CreatePredicate } from '../components/modal/CreatePredicate';
import { CreateRecord } from '../components/modal/CreateRecord';
import { CreatePresetRecord } from '../components/modal/CreatePresetRecord';
import { CreateSource } from '../components/modal/CreateSource';
import { CreateEntity } from '../components/modal/CreateEntity';
import { CreateEntityType } from '../components/modal/CreateEntityType';
import { ConflictResolution } from '../components/modal/ConflictResolution';

import { ModalDefinition } from '../components/modal/ModalDefinition';

import { DataStore, emptyDataStore, emptyTabs } from '../DataStore';

interface ExpectedParams {
    id: string;
}

interface EntityEditorProps {
    api: ApiService;
    params: ExpectedParams;
    workspace: string;
    location: { pathname: string };
    pathname: string;
}

interface EntityEditorState {
    tabs: Tab[];
    inBrowser: boolean;
    modalQueue: ModalDefinition[];
    dataStore: DataStore;
    loading: boolean;
    loadingWheel: boolean;

    id: number;
    list: boolean;
}

export class ObjectEditor extends React.Component<EntityEditorProps, EntityEditorState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    private boundCreateTab: any;
    private boundCloseTab: any;
    private boundAddModal: any;
    private boundReload: any;
    private boundReorderTabs: any;

    constructor(props: EntityEditorProps, context: any) {
        super();

        this.state = {
            tabs: [],
            inBrowser: (typeof window !== 'undefined'),
            modalQueue: [],
            dataStore: cloneDeep(emptyDataStore),
            loadingWheel: true,
            loading: false,
            id: NaN,
            list: false
        };

        this.boundCreateTab = this.createTab.bind(this);
        this.boundCloseTab = this.closeTab.bind(this);
        this.boundAddModal = this.addModal.bind(this);
        this.boundReload = this.callReload.bind(this);
        this.boundReorderTabs = this.reorderTabs.bind(this);

        createTab.add(this.boundCreateTab);
        closeTab.add(this.boundCloseTab);
        showModal.add(this.boundAddModal);
        triggerReload.add(this.boundReload);
        reorderTabs.add(this.boundReorderTabs);
    }

    public componentDidMount() {
        this.reload(this.props);
    }

    public callReload() {
        this.reload(this.props, true);
    }

    public reload(props: EntityEditorProps, force: boolean = false) {

        const newId = parseInt(props.location.pathname.substr(props.pathname.length + 1));
        const newWorkspace = props.workspace;

        if (['entity', 'source', 'predicate', 'entity_type', 'notfound'].indexOf(newWorkspace) === -1) {
            this.context.router.transitionTo('/edit/notfound');
        }

        if (this.state.loading && !force) {
            this.setState({
                id: newId,
                list: props.location.pathname.substr(props.pathname.length + 1).length === 0
            });
            return;
        }

        this.setState({
            loading: true,
            loadingWheel: (this.state.id !== newId && !(isNaN(this.state.id) && isNaN(newId))) || this.props.workspace !== newWorkspace,
            id: newId,
            list: props.location.pathname.substr(props.pathname.length + 1).length === 0
    }, () => {
            // load data required by the current tabs
            let tabPromise = Promise.resolve(cloneDeep(emptyTabs));

            if (this.state.inBrowser) {
                const tabsString = window.localStorage.getItem('open_tabs');
                if (tabsString !== null) {
                    this.state.tabs = JSON.parse(tabsString);

                    if (!this.state.list &&
                            ['entity', 'predicate', 'entity_type', 'source'].indexOf(props.workspace) !== -1 &&
                            find(this.state.tabs, (tab) => tab.tabType === props.workspace
                        && tab.uid == this.state.id) === undefined) {
                            this.state.tabs.push({ tabType: props.workspace, uid: this.state.id});
                            this.saveTabs();
                    }

                    const groupedTabs = groupBy(this.state.tabs, 'tabType');

                    tabPromise = Promise.all(
                        Object.keys(groupedTabs).map((tabType) =>

                            Promise.all(groupedTabs[tabType].map((tab) =>
                                this.loadTabData(tab.tabType, tab.uid)
                                .then((value) => {
                                    return { [`${tab.tabType}-${tab.uid}`]: { value, lastUpdate: moment() }};
                                })
                                .catch((err) => {
                                    console.warn(`Attempted to load missing resource ${tab.tabType}/${tab.uid}`);
                                    this.closeTab(tab.tabType, tab.uid);
                                    if (tab.tabType === props.workspace && tab.uid === this.state.id) {
                                        this.context.router.transitionTo('/edit/notfound');
                                    }
                                })
                            ))
                            .then((tabData) => {
                                return { [tabType]: Map(Object.assign({}, ...tabData)) };
                            })
                        )
                    );
                }
            }

            // load lists of data commonly required by views
            const allPromise = Promise.all([
                props.api.getCollection(Predicate, AppUrls.predicate, {}),
                props.api.getCollection(Source, AppUrls.source, {}),
                props.api.getCollection(Entity, AppUrls.entity, {}),
                props.api.getCollection(EntityType, AppUrls.entity_type, {}),
                props.api.getItem(ElementSet, AppUrls.element_set, 1)
            ])
            .then(([predicates, sources, entities, entityType, dublinCore]) => {

                return {
                    predicate: { value: predicates, lastUpdate: moment() },
                    source: { value: sources, lastUpdate: moment() },
                    entity: { value: entities, lastUpdate: moment() },
                    entity_type: { value: entityType, lastUpdate: moment() },
                    dublinCore: { value: dublinCore, lastUpdate: moment() }
                };
            });

            Promise.all([tabPromise, allPromise])
            .then(([tabsArray, all]) => {
                const tabs = Object.assign({}, ...tabsArray);
                this.setState({
                    dataStore: Object.assign({}, this.state.dataStore, { tabs, all }),
                    loading: false,
                    loadingWheel: false
                });
            });
        });
    }

    public loadTabData(tabType: string, uid: number) {
        switch (tabType) {
            case 'entity':
                return Promise.all([
                    this.props.api.getItem(Entity, AppUrls.entity, uid),
                    this.props.api.getCollection(Record, AppUrls.record, { entity: uid })
                ]).then(([entity, records]) => ({ entity, records }));
            case 'predicate':
                return this.props.api.getItem(Predicate, AppUrls.predicate, uid);
            case 'entity_type':
                return this.props.api.getItem(EntityType, AppUrls.entity_type, uid);
            case 'source':
                return Promise.all([
                    this.props.api.getItem(Source, AppUrls.source, uid),
                    this.props.api.getCollection(SourceElement, AppUrls.source_element, { source: uid })
                ]).then(([source, source_element]) => ({ source, source_element }));
            default:
                throw new Error('Unexpected tab type requested');
        }
    }

    public createTab(tabType: string, uid: number, data?: any) {
        // don't add a tab if it already exists
        if (find(this.state.tabs, (tab) => tab.tabType === tabType && tab.uid == uid) === undefined) {
            this.setState({
                tabs: this.state.tabs.concat([{ tabType, uid, data }])
            }, () => {
                this.saveTabs();
                this.reload(this.props);
            });
        }
    }

    public updateTab(tabType: string, uid: number, data: any) {
        const tabs = cloneDeep(this.state.tabs);
        const tabId = findIndex(tabs, (tab) => tab.tabType === tabType && tab.uid === uid);
        if (tabId !== -1) {
            tabs[tabId].data = data;
            this.setState({ tabs });
        }
    }

    public closeTab(tabType: string, uid: number) {
        this.setState({
            tabs: this.state.tabs.filter((a) => a.tabType !== tabType || a.uid !== uid)
        }, () => {
            this.saveTabs();
            this.reload(this.props);
        });
    }

    public saveTabs() {
        const tabsString = JSON.stringify(this.state.tabs);
        if (this.state.inBrowser) {
            window.localStorage.setItem('open_tabs', tabsString);
        }
    }

    public clearAllTabs() {
        this.setState({tabs: []}, () => {
            this.saveTabs();
            this.reload(this.props);
        });
    }

    public reorderTabs(reorderFunc: (tabs: Tab[]) => Tab[]) {
      this.setState({tabs: reorderFunc(this.state.tabs)}, () => {
            this.saveTabs();
            this.reload(this.props);
        });
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

    public componentWillUnmount() {
        this.saveTabs();
        createTab.remove(this.boundCreateTab);
        closeTab.remove(this.boundCloseTab);
        showModal.remove(this.boundAddModal);
        triggerReload.remove(this.boundReload);
        reorderTabs.remove(this.boundReorderTabs);
    }

    public componentWillReceiveProps(props: EntityEditorProps) {
        this.reload(props);
    }

    public render() {
        return (
            <section id='entity-editor' className='flex-fill'>
                <span className={'header-colour ' + this.props.workspace}></span>
                    <span className='flex-fill'>
                    <Sidebar
                        tabs={this.state.tabs}
                        dataStore={this.state.dataStore}
                        loading={false}
                        clearTabs={this.clearAllTabs.bind(this)}
                        list={this.state.list}
                        id={this.state.id}
                        workspace={this.props.workspace}
                    />

                    <Workspace {...this.props}
                        id={this.state.id}
                        dataStore={this.state.dataStore}
                        loading={this.state.loadingWheel}
                        list={this.state.list}/>

                    <Toast />

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

                            case 'preset_record':
                                return (<CreatePresetRecord {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                            case 'source':
                                return (<CreateSource {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                            case 'entity':
                                return (<CreateEntity {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                            case 'entity_type':
                                return (<CreateEntityType {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                            case 'conflict_resolution':
                                return (<ConflictResolution {...sharedProps} {...this.state.modalQueue[0].settings} />);
                        }
                    })()}
                </span>
                <span className={'header-colour ' + this.props.workspace}></span>
            </section>
        );
    }
}
