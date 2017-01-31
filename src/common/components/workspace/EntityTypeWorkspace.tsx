/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';

import { SameAsEditor } from '../fields/SameAsEditor';
import { AppUrls } from '../../ApiService';

import { EntityType, Serializer } from '@digihum/falcon-core';

import { AddTabButton } from '../AddTabButton';

import { EditableHeader } from '../fields/EditableHeader';
import { EditableFieldHOC } from '../fields/EditableFieldComponent';
import { EditableParagraph } from '../fields/EditableParagraph';
import { EditableComboDropdown } from '../fields/EditableComboDropdown';
import { ComboDropdownOption } from '../ComboDropdown';

import { ModalDefinition } from '../modal/ModalDefinition';

import { inject, observer } from 'mobx-react';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';


const HeaderEditableFieldComponent = EditableFieldHOC(EditableHeader);
const ParagraphEditableFieldComponent = EditableFieldHOC(EditableParagraph);
const SameAsEditableFieldComponent = EditableFieldHOC(SameAsEditor);
const ComboEditableFieldComponent = EditableFieldHOC(EditableComboDropdown);

interface EntityTypeWorkspaceProps {
    id: number;
    dataStore?: DataController;
    modalStore?: ModalStore;
}

interface EntityTypeWorkspaceState {
}

@inject('dataStore', 'modalStore')
@observer
export class EntityTypeWorkspace extends React.Component<EntityTypeWorkspaceProps, EntityTypeWorkspaceState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
        };
    }

    public update(data: any) {
        const entityType = this.props.dataStore!.dataStore.tabs.entity_type[this.props.id].value;
        this.props.dataStore!.patchItem(EntityType, AppUrls.entity_type, this.props.id, data)
        .then(() => this.setState({ entityType: Object.assign({}, entityType, data)}));
    }


    public copy() {

        const entityType = this.props.dataStore!.dataStore.tabs.entity_type[this.props.id].value;

        const newEntityType = Serializer.fromJson(EntityType,
            Object.assign({}, Serializer.toJson(entityType), { label: 'Copy of ' + entityType.label}));

        this.props.dataStore!.postItem(EntityType, AppUrls.entity_type, newEntityType, {})
            .then(([id]) => {
                this.props.dataStore!.createTab('entity_type', id, 'item');
        });
    }

    public del() {
        this.props.dataStore!.delItem(EntityType, AppUrls.entity_type, this.props.id)
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
                            data.entityType.forEach((datum) => {
                                 this.props.dataStore!.createTab('entity_type', datum.uid, 'item');
                            });
                            data.predicate.forEach((datum) => {
                                 this.props.dataStore!.createTab('predicate', datum.uid, 'item');
                            });
                            data.entity.forEach((datum) => {
                                 this.props.dataStore!.createTab('entity', datum.uid, 'item');
                            });
                        }
                    },
                    settings: {
                        conflictingItems: data,
                        message: 'Deleting Entity Type'
                    }
                };

                this.props.modalStore!.addModal(conflictResolutionModal);
            });
           }
        });
    }

    public createEntity() {
        const a : ModalDefinition = {
            name: 'entity',
            complete: ([id]) => {
                 this.props.dataStore!.createTab('entity', id, 'item');
            },
            cancel: () => { console.log('cancel'); },
            settings: {
                initialName: '',
                initialType: this.props.id
            }
        };

        this.props.modalStore!.addModal(a);
    }

    public render() {

        const entityType = this.props.dataStore!.dataStore.tabs.entity_type[this.props.id].value;
        const potentialParents = this.props.dataStore!.dataStore.all.entity_type.value;


        let parentName = '';
        if (potentialParents !== null && entityType.parent !== undefined) {
            const found = potentialParents.find((par) => par.uid === entityType.parent);
            if (found !== undefined) {
                parentName = found.label;
            }
        }

        const potentialParentOptions : ComboDropdownOption<number>[] = potentialParents.map((par) => ({ key: par.label, value: par.uid}));

        return (
            <div className='workspace-editor'>

                <header className='editor-header entity_type'>
                  <div className='primary-toolbar'>
                    <div className='main-toolbar'>
                        <div className='bread-crumbs'>
                            {entityType.parents.map((parent, i) => {

                              const parentEntityType = this.props.dataStore!.dataStore.all.entity_type.value.find((e) => e.uid === parent)!;

                              return (
                                <span key={`breadcrumb-${parent}`}>
                                    <span>  {parentEntityType.label} <AddTabButton
                                        tabType='entity_type'
                                        uid={parent} /> </span>
                                    <i className='fa fa-angle-right'></i>
                                </span>
                            )})}
                        </div>
                        <i className='fa fa-tag item-icon'></i>
                        <HeaderEditableFieldComponent
                            value={entityType.label}
                            onChange={(value) => this.update({'label': value})} />
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
                            onClick={this.del.bind(this)}
                        ></i>
                        <i
                            className='fa fa-clone button'
                            aria-hidden='true'
                            onClick={this.copy.bind(this)}
                        ></i>
                    </div>
                  </div>
                  <div className='secondary-toolbar'>
                      <div className='tab-bar'>
                        <div className={'entity_type selected'}>CORE</div>
                      </div>
                  </div>
                </header>

                <section className='editor-body'>

                    <div className='edit-group'>

                        <label className='small'>Parent</label>
                        <ComboEditableFieldComponent
                            value={entityType.parent === null ? {key: '', value: null} : {key: parentName, value: entityType.parent}}
                            onChange={(value) => this.update({'parent': value === null ? null : value.value})}
                             comboSettings={{
                               options: potentialParentOptions,
                                typeName: 'EntityType'
                              }}
                            />
                        {entityType.parent !== null ? (<AddTabButton
                            tabType='entity_type'
                            uid={entityType.parent} />) : null}
                    </div>

                    <div className='edit-group'>
                        <label className='small'>Description</label>
                        <ParagraphEditableFieldComponent
                            value={entityType.description}
                            onChange={(value) => this.update({'description': value})} />
                    </div>

                    <div className='edit-group'>
                        <SameAsEditableFieldComponent
                            value={entityType.sameAs}
                            onChange={(value) => this.update({'sameAs': value})} />
                    </div>

                    <div>
                        <h4>Direct Children</h4>
                        <ul>
                        {entityType.children
                            .map((child) => this.props.dataStore!.dataStore.all.entity_type.value.find((et) => et.uid === child))
                            .map((childEt) => {
                              if(childEt === undefined) {
                                return null;
                              }
                              //TODO: REMOVE !
                                return (<li key={`dc-${childEt.label}`}>{childEt.label} <AddTabButton
                                    tabType='entity_type'
                                    uid={childEt.uid!} /></li>
                            );})}
                        </ul>
                    </div>
                </section>
            </div>
        );
    }
}
