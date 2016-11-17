/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';

import { SameAsEditor } from '../fields/SameAsEditor';
import { ApiService, AppUrls } from '../../ApiService';

import { EntityType } from '../../../common/datamodel/datamodel';

import { AddTabButton } from '../AddTabButton';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';
import { EditableComboDropdown } from '../fields/EditableComboDropdown';
import { ComboDropdownOption } from '../ComboDropdown';

import { showModal, createTab } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';

import { DataStore } from '../../DataStore';


class StringEditableFieldComponent extends EditableFieldComponent<string> {}
class ComboEditableFieldComponent extends EditableFieldComponent<ComboDropdownOption> {}

interface EntityTypeWorkspaceProps {
    api: ApiService;
    id: number;
    dataStore: DataStore;
}

interface EntityTypeWorkspaceState {
}

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
        const entityType = this.props.dataStore.tabs.entity_type.get('entity_type-' + this.props.id).value;
        this.props.api.patchItem(EntityType, AppUrls.entity_type, this.props.id, data)
        .then(() => this.setState({ entityType: Object.assign({}, entityType, data)}));
    }


    public copy() {

        const entityType = this.props.dataStore.tabs.entity_type.get('entity_type-' + this.props.id).value;

        const newEntityType = new EntityType().deserialize(
            Object.assign({}, entityType.serialize(), { name: 'Copy of ' + entityType.name}));

        this.props.api.postItem(EntityType, AppUrls.entity_type, newEntityType)
            .then(([id]) => {
                createTab.dispatch('entity_type', id);
        });
    }

    public del() {
        this.props.api.delItem(EntityType, AppUrls.entity_type, this.props.id)
        .then(() => this.context.router.transitionTo('/edit/notfound'))
        .catch((e) => {
            e.data.then((data) => {

                const conflictResolutionModal : ModalDefinition = {
                    name: 'conflict_resolution',
                    cancel: () => {},
                    complete: (result) => {
                        if (result === 'addToWorkspace') {
                            data.data.entityType.forEach((datum) => {
                                 createTab.dispatch('entity_type', datum.uid);
                            });
                            data.data.predicate.forEach((datum) => {
                                 createTab.dispatch('predicate', datum.uid);
                            });
                            data.data.entity.forEach((datum) => {
                                 createTab.dispatch('entity', datum.uid);
                            });
                        }
                    },
                    settings: {
                        conflictingItems: data.data,
                        message: 'Deleting Entity Type'
                    }
                };

                showModal.dispatch(conflictResolutionModal);
            });
        });
    }

    public createEntity() {
        const a : ModalDefinition = {
            name: 'entity',
            complete: ([id]) => {
                 createTab.dispatch('entity', id);
            },
            cancel: () => { console.log('cancel'); },
            settings: {
                initialName: '',
                initialType: this.props.id
            }
        };

        showModal.dispatch(a);
    }

    public render() {

        const entityType = this.props.dataStore.tabs.entity_type.get('entity_type-' + this.props.id).value;
        const potentialParents = this.props.dataStore.all.entity_type.value;


        let parentName = '';
        if (potentialParents !== null && entityType.parent !== undefined) {
            const found = potentialParents.find((par) => par.uid === entityType.parent);
            if (found !== undefined) {
                parentName = found.name;
            }
        }

        return (
            <div className='workspace-editor'>

                <header className='editor-header entity_type'>
                    <div className='main-toolbar'>
                        <div className='bread-crumbs'>
                            {entityType.parents.map((parent, i) => (
                                <span key={`breadcrumb-${parent.uid}`}>
                                    <span>  {parent.name} <AddTabButton tabType='entity_type' uid={parent.uid} /> </span>
                                    <i className='fa fa-angle-right'></i>
                                </span>
                            ))}
                        </div>
                        <i className='fa fa-tag item-icon'></i>
                        <StringEditableFieldComponent
                            value={entityType.name}
                            component={EditableHeader}
                            onChange={(value) => this.update({'name': value})}  />
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
                </header>

                <section className='editor-body'>
                    <span>Parent:</span>
                    <ComboEditableFieldComponent
                        value={entityType.parent === null ? null : {key: parentName, value: entityType.parent}}
                        component={EditableComboDropdown}
                        onChange={(value) => this.update({'parent': value === null ? null : value.value})}
                        additionalProps={{ comboSettings: {
                            options: potentialParents.map((par) => ({ key: par.name, value: par.uid})),
                            typeName: 'EntityType'
                        }}} />
                    {entityType.parent !== null ? (<AddTabButton tabType='entity_type' uid={entityType.parent} />) : null}

                    <label className='small'>Description</label>
                    <StringEditableFieldComponent
                        value={entityType.description}
                        component={EditableParagraph}
                        onChange={(value) => this.update({'description': value})}  />

                    <div>
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
                                (<li key={`dc-${childEt.name}`}>{childEt.name} <AddTabButton tabType='entity_type' uid={childEt.uid} /></li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        );
    }
}