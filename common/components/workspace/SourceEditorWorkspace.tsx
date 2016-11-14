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
    source : Source | null;
    dublinCore: ElementSet | null;
    potentialParents: Source[];
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
            source: null,
            dublinCore: null,
            potentialParents: []
        };
    }

    public componentDidMount() {
        this.loadData(this.props);
    }

    public componentWillReceiveProps(newProps: SourceEditorProps)  {
        this.loadData(newProps);
    }


    public loadData(props: SourceEditorProps) {

        Promise.all([
            props.api.getItem(Source, AppUrls.source, props.id),
            props.api.getItem(ElementSet, AppUrls.element_set, 1), //TODO: make sure this is ALWAYS dublin core
            props.api.getCollection(Source, AppUrls.source, {})
        ])
        .then(([data, dublinCore, potentialParents]) => {
            this.setState({
                source: data,
                metaData: keyBy(data.metaData, 'name'),
                dublinCore,
                potentialParents
            });
        });
    }

    public updateSource(field: string, value: string) {

        const source = this.props.dataStore.tabs.source.get('source-' + this.props.id).value.source;

        this.props.api.patchItem(Source, AppUrls.source, source.uid, { [field]: value })
        .then((success) => {

            const updatedSource = new Source().deserialize(Object.assign({},
                source.serialize(), { [field]: value }));

            this.setState({
                source: updatedSource,
                metaData: keyBy(updatedSource.metaData, 'name')
            });
        });
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
            e.data.then((data) => {

                const conflictResolutionModal : ModalDefinition = {
                    name: 'conflict_resolution',
                    cancel: () => {},
                    complete: (result) => {
                        if (result === 'addToWorkspace') {
                            data.data.source.forEach((datum) => {
                                 createTab.dispatch('source', datum.uid);
                            });
                        }

                        if (result === 'deleteAll') {
                            Promise.all(data.data.source.map((datum) => this.props.api.delItem(Source, AppUrls.source, datum.uid)))
                            .then(() => {
                                this.del();
                            });
                        }
                    },
                    settings: {
                        conflictingItems: data.data,
                        message: 'Deleting Source'
                    }
                };

                showModal.dispatch(conflictResolutionModal);
            });
        });
    }

    public render() {

        if (this.state.dublinCore === null) {
            return (<Loading />);
        }

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
                                .map((child) => this.props.dataStore.all.source.value.find((et) => et.uid === child))
                                .map((parent, i) => (
                                <span key={`breadcrumb-${parent.uid}`}>
                                    <span>  {parent.name} <AddTabButton tabType='source' uid={parent.uid} /> </span>
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
                            className='fa fa-trash delete button'
                            aria-hidden='true'
                            onClick={() => this.del()}
                        ></i>
                        <i
                            className='fa fa-clone button'
                            aria-hidden='true'
                            onClick={() => console.log('copy')}
                        ></i>
                        <i
                            className='fa fa-arrow-circle-o-down'
                            aria-hidden='true'
                            onClick={() => console.log('copy')}
                        ></i>
                    </div>
                </header>

                <section className='editor-body'>

                    <span>Parent:</span>
                    <ComboEditableFieldComponent
                        value={{key: parentName, value: source.parent}}
                        component={EditableComboDropdown}
                        onChange={(value) => this.updateSource('parent', value.value)}
                        additionalProps={{ comboSettings: {
                            options: potentialParents.map((par) => ({ key: par.name, value: par.uid})),
                            typeName: 'Source'
                        }}} />
                        {source.parent !== null ? (<AddTabButton tabType='source' uid={source.parent} />) : null}

                    <div>
                        <StringEditableFieldComponent
                            value={source.sameAs}
                            component={SameAsEditor}
                            onChange={(value) => this.updateSource('sameAs', value)} />
                    </div>

                    {this.state.dublinCore.elements.map((element) => (
                        <div key={`${element.name}-edit`}>
                            <h5 className='section-header'>{element.name} <small><a href={element.url}>{element.uri}</a></small></h5>
                            <p className='element-description'>{element.description}</p>
                            <StringEditableFieldComponent
                                value={source.metaData.hasOwnProperty(element.name) ? (source.metaData[element.name].values[0].value) : ''}
                                component={EditableParagraph}
                                onChange={(value) => this.updateSourceElement(element, value)}  />
                        </div>
                    ))}

                    <div>
                        <h4>Direct Children</h4>
                        <ul>
                        {source.children
                            .map((child) => this.props.dataStore.all.source.value.find((et) => et.uid === child))
                            .map((childEt) =>
                                (<li key={`dc-${childEt.name}`}>{childEt.name} <AddTabButton tabType='entity_type' uid={childEt.uid} /></li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        );
    }
}