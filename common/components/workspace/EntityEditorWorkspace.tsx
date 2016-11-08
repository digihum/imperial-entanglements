/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { RecordsEditor } from '../entity_editor/RecordsEditor';
import { ApiService, AppUrls } from '../../ApiService';

import { Entity, Record } from '../../../common/datamodel/datamodel';

import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { ModalDefinition } from '../modal/ModalDefinition';

import { Dictionary, groupBy } from 'lodash';

import { showModal, createTab } from '../../Signaller';
import { AddTabButton } from '../AddTabButton';

import { findParentTree } from '../../helper/findParentTree';


import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableComboDropdown } from '../fields/EditableComboDropdown';

import { DataStore } from '../../DataStore';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}
class ComboEditableFieldComponent extends EditableFieldComponent<ComboDropdownOption> {}

interface EntityEditorProps {
    api: ApiService;
    id: number;
    dataStore: DataStore;
}

interface EntityEditorState {
    comboValue: ComboDropdownOption;
    comboSearchValue: string;
}

// What can I do?
// Entity Operations
// - Delete the entity
// - Merge the entity
// - Split the entity
// - Add 'same-as-ses' to the entity
// Records 
// - Order records by type, source and date
// - Add new records
// - Adding a new predicate creates a new record with the 
//   entity set, the predicate set, the score set to 3, the period set to null, source set to null
//   it also creates a blank entry in the records sub table based on the range of the predicate.
// - New predicates must have a name. The domain is set to the current entitytype but can be changed
//   to one of its parents. The range MUST be set.
// Visualisations: 
// - Network graph of entity relationships
export class EntityEditorWorkspace extends React.Component<EntityEditorProps, EntityEditorState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props : EntityEditorProps, context: any) {
        super();
        this.state = {
            comboValue: { key: 'test', value: ''},
            comboSearchValue: ''
        };
    }

    public del() {
        this.props.api.delItem(Entity, AppUrls.entity, this.props.id)
        .then(() => {
            this.context.router.transitionTo('/edit/notfound');
        })
         .catch((e) => {
            e.data.then((data) => {

                const conflictResolutionModal : ModalDefinition = {
                    name: 'conflict_resolution',
                    cancel: () => {},
                    complete: (result) => {
                        if (result === 'addToWorkspace') {
                            data.data.record.forEach((datum) => {
                                 createTab.dispatch('entity', datum.entity);
                            });
                            data.data.entity.forEach((datum) => {
                                 createTab.dispatch('entity', datum.uid);
                            });
                        }

                        if (result === 'deleteAll') {
                            Promise.all(
                                data.data.record.map((datum) => this.props.api.delItem(Record, AppUrls.record, datum.uid))
                            )
                            .then(() => {
                                this.del();
                            });
                        }
                    },
                    settings: {
                        conflictingItems: data.data,
                        message: 'Deleting Entity'
                    }
                };

                showModal.dispatch(conflictResolutionModal);
            });
        });
    }

    public createNewRecord() {

        const entity = this.props.dataStore.tabs.entity.get('entity-' + this.props.id).value.entity;

        const entityType = this.props.dataStore.all.entity_type.value.find((t) => t.uid === entity.entityType);

        const entityTypeParents = findParentTree(entity.entityType, this.props.dataStore.all.entity_type.value);
        const predicates = this.props.dataStore.all.predicate
            .value.filter((pred) => entityTypeParents.indexOf(pred.domain) !== -1);

        const modalDef: ModalDefinition = {
            name: 'record',
            complete: (data) => {
                console.log('Records editor called complete');
                //this.loadData(this.props);
            },
            cancel: () => {
                console.log('Records editor called cancel');
            },
            settings: {
                options: predicates.map((pred) => ({ key: pred.name, value: pred.uid, meta: pred})),
                entityUid: this.props.id,
                entityType: entityType.uid
            }
        };

        showModal.dispatch(modalDef);
    }

    public update(data: any) {
        this.props.api.patchItem(Entity, AppUrls.entity, this.props.id, data);
    }

    public render() {

        const entity = this.props.dataStore.tabs.entity.get('entity-' + this.props.id).value.entity;

        const entityType = this.props.dataStore.all.entity_type.value.find((t) => t.uid === entity.entityType);
        const potentialParents = this.props.dataStore.all.entity.value;

        const entityTypeParents = findParentTree(entity.entityType, this.props.dataStore.all.entity_type.value);
        const predicates = this.props.dataStore.all.predicate
            .value.filter((pred) => entityTypeParents.indexOf(pred.domain) !== -1);

        const sources = this.props.dataStore.all.source.value;
        const records = groupBy(this.props.dataStore.tabs.entity.get('entity-' + this.props.id).value.records, 'predicate');


        const options = predicates.map((pred) => ({ key: pred.name, value: pred.uid, meta: pred}));

        let parentName = '';
        if (potentialParents !== null && entity.parent !== undefined) {
            const found = potentialParents.find((par) => par.uid === entity.parent);
            if (found !== undefined) {
                parentName = found.label;
            }
        }

        return (
            <div className='workspace-editor'>
                <header className='editor-header entity'>
                    <div className='main-toolbar'>
                        <i className='fa fa-cube item-icon'></i>
                        <StringEditableFieldComponent
                            value={entity.label}
                            component={EditableHeader}
                            onChange={(value) => this.update({ 'label': value })}  />

                    </div>
                    <div className='sub-toolbar'>
                        <i
                            className='fa fa-trash delete button'
                            aria-hidden='true'
                            onClick={this.del.bind(this)}
                        ></i>
                        <i
                            className='fa fa-clone button'
                            aria-hidden='true'
                            onClick={() => console.log('copy')}
                        ></i>
                    </div>
                </header>

                <section className='editor-body'>

                    <div className='flex-fill'>
                        <div className='flex-fill'>
                            <div><strong>Type: </strong>{entityType.name} <AddTabButton
                                uid={entityType.uid}
                                tabType='entity_type'
                            /></div>
                        </div>

                        <div className='flex-fill'>
                            <span><strong>Parent: </strong></span>
                            <ComboEditableFieldComponent
                                value={{key: parentName, value: entity.parent}}
                                component={EditableComboDropdown}
                                onChange={(value) => this.update({'parent': value.value})}
                                additionalProps={{ comboSettings: {
                                    options: potentialParents.map((par) => ({ key: par.label, value: par.uid})),
                                    typeName: 'Entity'
                                }}} />
                            {entity.parent !== null ? (<AddTabButton tabType='entity' uid={entity.parent} />) : null}
                        </div>
                    </div>

                    <i
                        className='fa fa-plus-circle add button lower-large-icon'
                        aria-hidden='true'
                        onClick={this.createNewRecord.bind(this)}
                    >
                    </i>

                    <RecordsEditor
                        dimension='predicates'
                        entityExists={true}
                        id={this.props.id}
                        api={this.props.api}
                        records={records}
                        onChange={() => {}}
                        predicates={predicates}
                        sources={sources}
                    />
                </section>
            </div>
        );
    }
}