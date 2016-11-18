/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';

import { SameAsEditor } from '../fields/SameAsEditor';
import { Loading } from '../Loading';
import { ApiService, AppUrls } from '../../ApiService';

import { Source, ElementSet, Element, SourceElement, Record } from '../../../common/datamodel/datamodel';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';
import { EditableComboDropdown } from '../fields/EditableComboDropdown';
import { ComboDropdownOption } from '../ComboDropdown';

import { keyBy, Dictionary } from 'lodash';

import { showModal, createTab } from '../../Signaller';

import { DataStore } from '../../DataStore';
import { AddTabButton } from '../AddTabButton';

import { ModalDefinition } from '../modal/ModalDefinition';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}
class ComboEditableFieldComponent extends EditableFieldComponent<ComboDropdownOption> {}

interface SourceEditorProps {
    api: ApiService;
    id: number;
    dataStore: DataStore;
}

interface SourceEditorState {
    metaData: _.Dictionary<SourceElement>;
}

// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them 
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
export class SourceEditorWorkspace extends React.Component<SourceEditorProps, SourceEditorState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            metaData: {}
        };
    }

    public componentDidMount() {
        this.loadData(this.props);
    }

    public componentWillReceiveProps(newProps: SourceEditorProps)  {
        this.loadData(newProps);
    }


    public loadData(props: SourceEditorProps) {

        const source = props.dataStore.tabs.source.get('source-' + this.props.id).value.source;

        this.setState({
            metaData: keyBy(source.metaData, 'name')
        });
    }

    public updateSource(field: string, value: string) {

        const source = this.props.dataStore.tabs.source.get('source-' + this.props.id).value.source;

        this.props.api.patchItem(Source, AppUrls.source, source.uid, { [field]: value })
        //.then((success) => {

            // const updatedSource = new Source().deserialize(Object.assign({},
            //     source.serialize(), { [field]: value }));

            // this.setState({
            //     source: updatedSource,
            //     metaData: keyBy(updatedSource.metaData, 'name')
            // });
        //});
    }

    public updateSourceElement(element: Element, value: string) {

        const source = this.props.dataStore.tabs.source.get('source-' + this.props.id).value.source;

        const compositeKey = {
            order: ['source', 'element'],
            values: {
                source: this.props.id,
                element: element.uid
            }
        };

        if (source.metaData[element.name] !== undefined
            && source.metaData[element.name].values.find((a) => a.source === this.props.id) !== undefined) {

            this.props.api.patchItem(SourceElement, AppUrls.source_element,
            compositeKey,
                new SourceElement().deserialize({
                    uid: compositeKey,
                    element: source.metaData[element.name].element_uid,
                    source: this.props.id,
                    value
                }));
        } else {
            this.props.api.postItem(SourceElement, AppUrls.source_element,
                new SourceElement().deserialize({
                    uid: compositeKey,
                    value: value
                }));
        }
    }

    public del() {
        this.props.api.delItem(Source, AppUrls.source, this.props.id)
        .then(() => this.context.router.transitionTo('/edit/notfound'))
        .catch((e) => {
            e.data.data.then((data) => {

                const conflictResolutionModal : ModalDefinition = {
                    name: 'conflict_resolution',
                    cancel: () => {},
                    complete: (result) => {
                        if (result === 'addToWorkspace') {
                            data.source.forEach((datum) => {
                                 createTab.dispatch('source', datum.uid);
                            });
                        }

                        if (result === 'deleteAll') {
                            Promise.all(data.source.map((datum) => this.props.api.delItem(Source, AppUrls.source, datum.uid)))
                            .then(() => {
                                this.del();
                            });
                        }
                    },
                    settings: {
                        conflictingItems: data,
                        message: 'Deleting Source'
                    }
                };

                showModal.dispatch(conflictResolutionModal);
            });
        });
    }


    public createChild() {

        const source = this.props.dataStore.tabs.source.get('source-' + this.props.id).value.source;

        const newSource = new Source().deserialize(
            Object.assign({}, source.serialize(), { name: 'Child of ' + source.name, parent: this.props.id }));

        this.props.api.postItem(Source, AppUrls.source, newSource)
            .then(([id]) => {
                createTab.dispatch('source', id);
        });
    }

    // create entity with 'mentioned in' already set to this source
    public createEntity() {
        const a : ModalDefinition = {
            name: 'preset_record',
            complete: ([id]) => {
                 createTab.dispatch('entity', id);
            },
            cancel: () => { },
            settings: {
                source: this.props.dataStore.tabs.source.get('source-' + this.props.id).value.source
            }
        };

        showModal.dispatch(a);
    }

    public render() {

        const source = this.props.dataStore.tabs.source.get('source-' + this.props.id).value.source;
        const potentialParents = this.props.dataStore.all.source.value;

        let parentName = '';
        if (potentialParents !== null && source.parent !== undefined) {
            const found = potentialParents.find((par) => par.uid === source.parent);
            if (found !== undefined) {
                parentName = found.name;
            }
        }

        return (
            <div className='workspace-editor'>
                <header className='editor-header source'>
                    <div className='main-toolbar'>
                        <div className='bread-crumbs'>
                            {source.parents
                                .slice()
                                .reverse()
                                .map((child) => this.props.dataStore.all.source.value.find((et) => et.uid === child))
                                .map((parent, i) => (
                                <span key={`breadcrumb-${parent.uid}`}>
                                    <span>  {parent.name} <AddTabButton
                                        dataStore={this.props.dataStore}
                                        tabType='source' 
                                        uid={parent.uid} /> </span>
                                    <i className='fa fa-angle-right'></i>
                                </span>
                            ))}
                        </div>
                        <i className='fa fa-sun-o item-icon'></i>
                        <StringEditableFieldComponent
                            value={source.name}
                            component={EditableHeader}
                            onChange={(value) => this.updateSource('name', value)}  />
                    </div>
                    <div className='sub-toolbar'>
                        <i
                            className='fa fa-plus add button'
                            aria-hidden='true'
                            onClick={this.createEntity.bind(this)}
                        ></i>
                        <i
                            className='fa fa-trash delete button'
                            aria-hidden='true'
                            onClick={() => this.del()}
                        ></i>
                        <i
                            className='fa fa-arrow-circle-o-down button'
                            aria-hidden='true'
                            onClick={this.createChild.bind(this)}
                        ></i>
                    </div>
                </header>

                <section className='editor-body'>

                    <div className='edit-group'>
                        <label className='small'>Parent</label>
                        <ComboEditableFieldComponent
                            value={{key: parentName, value: source.parent}}
                            component={EditableComboDropdown}
                            onChange={(value) => this.updateSource('parent', value.value)}
                            additionalProps={{ comboSettings: {
                                options: potentialParents.map((par) => ({ key: par.name, value: par.uid})),
                                typeName: 'Source'
                            }}} /> 
                            {source.parent !== null ? (<AddTabButton 
                                dataStore={this.props.dataStore}
                                tabType='source' 
                                uid={source.parent} />) : null}
                    </div>

                    <div className='edit-group'>
                        <StringEditableFieldComponent
                            value={source.sameAs}
                            component={SameAsEditor}
                            onChange={(value) => this.updateSource('sameAs', value)} />
                    </div>

                    {this.props.dataStore.all.dublinCore.value.elements.map((element) => {

                        const values = source.metaData.hasOwnProperty(element.name) ? 
                            source.metaData[element.name].values : [{ source: this.props.id, value: ''}];
                        const editableValue = values[0].source == this.props.id ? values[0].value : '';
                           
                        return (
                            <div key={`${element.name}-edit`}>
                                <h5 className='section-header'>{element.name} <small><a href={element.url}>{element.uri}</a></small></h5>
                                <p className='element-description'>{element.description}</p>
                                <ul>
                                    {values.map((value) => value.source != this.props.id ? (
                                        <li key={`${element.uid}-${value.source}`}>{
                                            this.props.dataStore.all.source.value.find((s) => s.uid === value.source).name
                                        }: {value.value}</li>
                                    ) : null)}
                                </ul>
                                <StringEditableFieldComponent
                                    value={editableValue}
                                    component={EditableParagraph}
                                    onChange={(value) => this.updateSourceElement(element, value)}  />
                            </div>
                        );
                    })}

                    <div>
                        <h4>Direct Children</h4>
                        <ul>
                        {source.children
                            .map((child) => this.props.dataStore.all.source.value.find((et) => et.uid === child))
                            .map((childEt) =>
                                (<li key={`dc-${childEt.uid}`}>{childEt.name} <AddTabButton 
                                    tabType='source' 
                                    dataStore={this.props.dataStore}
                                    uid={childEt.uid} /></li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        );
    }
}