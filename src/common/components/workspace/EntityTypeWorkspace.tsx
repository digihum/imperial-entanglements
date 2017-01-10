/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';

import { SameAsEditor } from '../fields/SameAsEditor';
import { ApiService, AppUrls } from '../../ApiService';

import { EntityType, Serializer } from 'falcon-core';

import { AddTabButton } from '../AddTabButton';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';
import { EditableComboDropdown } from '../fields/EditableComboDropdown';
import { ComboDropdownOption } from '../ComboDropdown';

import { ModalDefinition } from '../modal/ModalDefinition';

import { inject, observer } from 'mobx-react';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';


class StringEditableFieldComponent extends EditableFieldComponent<string> {}
class ComboEditableFieldComponent extends EditableFieldComponent<ComboDropdownOption> {}

interface EntityTypeWorkspaceProps {
    api: ApiService;
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
        const entityType = this.props.dataStore!.dataStore.tabs.entity_type.get('entity_type-' + this.props.id).value;
        this.props.api.patchItem(EntityType, AppUrls.entity_type, this.props.id, data)
        .then(() => this.setState({ entityType: Object.assign({}, entityType, data)}));
    }


    public copy() {

        const entityType = this.props.dataStore!.dataStore.tabs.entity_type.get('entity_type-' + this.props.id).value;

        const newEntityType = Serializer.fromJson(EntityType,
            Object.assign({}, Serializer.toJson(entityType), { name: 'Copy of ' + entityType.label}));

        this.props.api.postItem(EntityType, AppUrls.entity_type, newEntityType)
            .then(([id]) => {
                this.props.dataStore!.createTab('entity_type', id, 'item');
        });
    }

    public del() {
        this.props.api.delItem(EntityType, AppUrls.entity_type, this.props.id)
        .then(() => this.context.router.transitionTo('/edit/notfound'))
        .catch((e) => {
            e.data.data.then((data) => {

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

        const entityType = this.props.dataStore!.dataStore.tabs.entity_type.get('entity_type-' + this.props.id).value;
        const potentialParents = this.props.dataStore!.dataStore.all.entity_type.value;


        let parentName = '';
        if (potentialParents !== null && entityType.parent !== undefined) {
            const found = potentialParents.find((par) => par.uid === entityType.parent);
            if (found !== undefined) {
                parentName = found.label;
            }
        }

        return (
            <div className='workspace-editor'>

                <header className='editor-header entity_type'>
                  <div className='primary-toolbar'>
                    <div className='main-toolbar'>
                        <div className='bread-crumbs'>
                            {entityType.parents.map((parent, i) => (
                                <span key={`breadcrumb-${parent.uid}`}>
                                    <span>  {parent.label} <AddTabButton
                                        dataStore={this.props.dataStore}
                                        tabType='entity_type'
                                        uid={parent.uid} /> </span>
                                    <i className='fa fa-angle-right'></i>
                                </span>
                            ))}
                        </div>
                        <i className='fa fa-tag item-icon'></i>
                        <StringEditableFieldComponent
                            value={entityType.label}
                            component={EditableHeader}
                            onChange={(value) => this.update({'label': value})}  />
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
                            value={entityType.parent === null ? null : {key: parentName, value: entityType.parent}}
                            component={EditableComboDropdown}
                            onChange={(value) => this.update({'parent': value === null ? null : value.value})}
                            additionalProps={{ comboSettings: {
                                options: potentialParents.map((par) => ({ key: par.label, value: par.uid})),
                                typeName: 'EntityType'
                            }}} />
                        {entityType.parent !== null ? (<AddTabButton
                            tabType='entity_type'
                            dataStore={this.props.dataStore}
                            uid={entityType.parent} />) : null}
                    </div>

                    <div className='edit-group'>
                        <label className='small'>Description</label>
                        <StringEditableFieldComponent
                            value={entityType.description}
                            component={EditableParagraph}
                            onChange={(value) => this.update({'description': value})}  />
                    </div>

                    <div className='edit-group'>
                        <StringEditableFieldComponent
                            value={entityType.sameAs}
                            component={SameAsEditor}
                            onChange={(value) => this.update({'sameAs': value})} />
                    </div>

                    <div>
                        <h4>Direct Children</h4>
                        <ul>
                        {entityType.children
                            .map((child) => this.props.dataStore.all.entity_type.value.find((et) => et.uid === child))
                            .map((childEt) =>
                                (<li key={`dc-${childEt.label}`}>{childEt.label} <AddTabButton
                                    tabType='entity_type'
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
