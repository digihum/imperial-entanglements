/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';

import { SameAsEditor } from '../fields/SameAsEditor';
import { Loading } from '../Loading';
import { AppUrls } from '../../ApiService';

import { Source, Serializer, Element, SourceElement, Record } from 'falcon-core';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';
import { EditableComboDropdown } from '../fields/EditableComboDropdown';
import { ComboDropdownOption } from '../ComboDropdown';

import { keyBy, Dictionary } from 'lodash';

import { inject, observer } from 'mobx-react';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';

import { AddTabButton } from '../AddTabButton';

import { ModalDefinition } from '../modal/ModalDefinition';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}
class ComboEditableFieldComponent extends EditableFieldComponent<ComboDropdownOption> {}

interface SourceEditorProps {
    id: number;
    dataStore?: DataController;
    modalStore?: ModalStore;
}

interface SourceEditorState {
    metaData: Dictionary<SourceElement>;
}

// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
@inject('dataStore', 'modalStore')
@observer
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

        const source = props.dataStore!.dataStore.tabs.source.get('source-' + this.props.id).value.source;

        this.setState({
            metaData: keyBy(source.metaData, 'name')
        });
    }

    public updateSource(field: string, value: string) {

      const source = this.props.dataStore!.dataStore.tabs.source.get('source-' + this.props.id).value.source;

      if (source.uid === null) {
        throw new Error('source uid should not be null');
      }

      this.props.dataStore!.patchItem(Source, AppUrls.source, source.uid, { [field]: value });
    }

    public updateSourceElement(element: Element, value: string | null) {

        const source = this.props.dataStore!.dataStore.tabs.source.get('source-' + this.props.id).value.source;


        if (element.uid === null) {
          throw new Error('source element uid should not be null');
        }

        const compositeKey = {
            order: ['source', 'element'],
            values: {
                source: this.props.id,
                element: element.uid
            }
        };

        if (source.metaData[element.label] !== undefined
            && source.metaData[element.label].values.find((a) => a.source === this.props.id) !== undefined) {

            this.props.dataStore!.patchItem(SourceElement, AppUrls.source_element,
            compositeKey,
                Serializer.fromJson(SourceElement, {
                    uid: compositeKey,
                    element: source.metaData[element.label].element_uid,
                    source: this.props.id,
                    value
                }));
        } else {
            this.props.dataStore!.postItem(SourceElement, AppUrls.source_element,
                Serializer.fromJson(SourceElement, {
                    uid: compositeKey,
                    value: value
                }), {});
        }
    }

    public del() {
        this.props.dataStore!.delItem(Source, AppUrls.source, this.props.id)
        .then(() => this.context.router.transitionTo('/edit/notfound'))
        .catch((e) => {
           if (e.code === 404) {
              this.context.router.transitionTo('/edit/notfound');
           }

           if (e.code === 422) {
            e.data.then((data) => {

                const conflictResolutionModal : ModalDefinition = {
                    name: 'conflict_resolution',
                    cancel: () => {},
                    complete: (result) => {
                        if (result === 'addToWorkspace') {
                            data.source.forEach((datum) => {
                                 this.props.dataStore!.createTab('source', datum.uid, 'item');
                            });
                        }

                        if (result === 'deleteAll') {
                            Promise.all(data.source.map((datum) => this.props.dataStore!.delItem(Source, AppUrls.source, datum.uid)))
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

                this.props.modalStore!.addModal(conflictResolutionModal);
            });
           }
        });
    }


    public createChild() {

        const source = this.props.dataStore!.dataStore.tabs.source.get('source-' + this.props.id).value.source;

        const newSource = Serializer.fromJson(Source,
            Object.assign({}, Serializer.toJson(source), { label: 'Child of ' + source.label, parent: this.props.id }));

        this.props.dataStore!.postItem(Source, AppUrls.source, newSource, {})
            .then(([id]) => {
                this.props.dataStore!.createTab('source', id, 'item');
        });
    }

    // create entity with 'mentioned in' already set to this source
    public createEntity() {
        const a : ModalDefinition = {
            name: 'preset_record',
            complete: ([id]) => {
                 this.props.dataStore!.createTab('entity', id, 'item');
            },
            cancel: () => { },
            settings: {
                source: this.props.dataStore!.dataStore.tabs.source.get('source-' + this.props.id).value.source
            }
        };

        this.props.modalStore!.addModal(a);
    }

    public render() {

        const source = this.props.dataStore!.dataStore.tabs.source.get('source-' + this.props.id).value.source;
        const potentialParents = this.props.dataStore!.dataStore.all.source.value;

        let parentName = '';
        if (potentialParents !== null && source.parent !== undefined) {
            const found = potentialParents.find((par) => par.uid === source.parent);
            if (found !== undefined) {
                parentName = found.label;
            }
        }

        return (
            <div className='workspace-editor'>
                <header className='editor-header source'>
                  <div className='primary-toolbar'>
                    <div className='main-toolbar'>
                        <div className='bread-crumbs'>
                            {source.parents
                                .slice()
                                .reverse()
                                .map((child) => this.props.dataStore!.dataStore.all.source.value.find((et) => et.uid === child))
                                .map((parent, i) => {
                                  if(parent === undefined) {
                                    throw new Error('Encountered undefined parent');
                                  }
                                  if(parent.uid === null) {
                                    throw new Error('Encountered parent with null uid');
                                  }
                                return (
                                <span key={`breadcrumb-${parent.uid}`}>
                                    <span>  {parent.label} <AddTabButton
                                        tabType='source'
                                        uid={parent.uid} /> </span>
                                    <i className='fa fa-angle-right'></i>
                                </span>
                                )})}
                        </div>
                        <i className='fa fa-sun-o item-icon'></i>
                        <StringEditableFieldComponent
                            value={source.label}
                            component={EditableHeader}
                            onChange={(value) => this.updateSource('label', value)}  />
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
                  </div>
                  <div className='secondary-toolbar'>
                      <div className='tab-bar'>
                        <div className={'source selected'}>DUBLIN CORE</div>
                        <div className={'source'}>DETAILS</div>
                        <div className={'source'}>MEDIA</div>
                      </div>
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
                                options: potentialParents.map((par) => ({ key: par.label, value: par.uid})),
                                typeName: 'Source'
                            }}} />
                            {source.parent !== null ? (<AddTabButton
                                tabType='source'
                                uid={source.parent} />) : null}
                    </div>

                    <div className='edit-group'>
                        <StringEditableFieldComponent
                            value={source.sameAs}
                            component={SameAsEditor}
                            onChange={(value) => this.updateSource('sameAs', value)} />
                    </div>

                    {this.props.dataStore!.dataStore.all.dublinCore.value.elements!.map((element) => {

                        const values = source.metaData.hasOwnProperty(element.label) ?
                            source.metaData[element.label].values : [{ source: this.props.id, value: ''}];
                        const editableValue = values[0].source == this.props.id ? values[0].value : '';

                        return (
                            <div key={`${element.label}-edit`}>
                                <h5 className='section-header'>{element.label} <small><a href={element.uri}>{element.uri}</a></small></h5>
                                <p className='element-description'>{element.description}</p>
                                <ul>
                                    {values.map((value) => value.source != this.props.id ? (
                                        <li key={`${element.uid}-${value.source}`}>{
                                            this.props.dataStore!.dataStore.all.source.value.find((s) => s.uid === value.source)!.label
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
                            .map((child) => this.props.dataStore!.dataStore.all.source.value.find((et) => et.uid === child))
                            .map((childEt) =>
                                (<li key={`dc-${childEt!.uid}`}>{childEt!.label} <AddTabButton
                                    tabType='source'
                                       uid={childEt!.uid!} /></li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        );
    }
}
