/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';

import { AppUrls } from '../../ApiService';

import { Entity, Record, Serializer } from '@digihum/falcon-core';

import { ModalDefinition } from '../modal/ModalDefinition';


import { findParentTree } from '../../helper/findParentTree';


import { EditableHeader } from '../fields/EditableHeader';
import { EditableFieldHOC } from '../fields/EditableFieldComponent';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';

import { EntityWorkspaceCoreView } from './entity/EntityWorkspaceCoreView';
import { EntityWorkspaceReferenceView } from './entity/EntityWorkspaceReferenceView';

import { inject, observer } from 'mobx-react';

const HeaderEditableFieldComponent = EditableFieldHOC(EditableHeader);

interface EntityEditorProps {
    id: number;
    dataStore?: DataController;
    modalStore?: ModalStore;
}

interface EntityEditorState {
    tab: number;
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
@inject('dataStore', 'modalStore')
@observer
export class EntityEditorWorkspace extends React.Component<EntityEditorProps, EntityEditorState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired,
        manager: React.PropTypes.object.isRequired
    };

    constructor(props : EntityEditorProps, context: any) {
        super();
        this.state = {
            tab: 0
        };
    }

    public del() {
        this.props.dataStore!.delItem(Entity, AppUrls.entity, this.props.id)
        .then(() => {
          this.props.dataStore!.closeTab('entity', this.props.id);
          this.context.router.transitionTo('/edit/notfound');
        })
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
                            data.record.forEach((datum) => {
                                 this.props.dataStore!.createTab('entity', datum.entity, 'item');
                            });
                            data.entity.forEach((datum) => {
                                 this.props.dataStore!.createTab('entity', datum.uid, 'item');
                            });
                        }

                        if (result === 'deleteAll') {
                            Promise.all(
                                data.record.map((datum) => this.props.dataStore!.delItem(Record, AppUrls.record, datum.uid))
                            )
                            .then(() => {
                                this.del();
                            });
                        }
                    },
                    settings: {
                        conflictingItems: data,
                        message: 'Deleting Entity'
                    }
                };

                this.props.modalStore!.addModal(conflictResolutionModal);
            });
           }
        });
    }

    public createNewRecord() {

        const entity = this.props.dataStore!.dataStore.tabs.entity[this.props.id].value.entity;

        const entityType = this.props.dataStore!.dataStore.all.entity_type.value.find((t) => t.uid === entity.entityType);

        const entityTypeParents = findParentTree(entity.entityType, this.props.dataStore!.dataStore.all.entity_type.value);
        const predicates = this.props.dataStore!.dataStore.all.predicate
            .value.filter((pred) => entityTypeParents.indexOf(pred.domain) !== -1);

        if (entityType === undefined) {
          throw new Error('Encountered undefined entity type!');
        }


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
                options: predicates.map((pred) => ({ key: pred.label, value: pred })),
                entityUid: this.props.id,
                entityType: entityType.uid
            }
        };

        this.props.modalStore!.addModal(modalDef);
    }

    public update(data: any) {
        this.props.dataStore!.patchItem(Entity, AppUrls.entity, this.props.id, data);
    }

    public clone() {

      const entity = this.props.dataStore!.dataStore.tabs.entity[this.props.id].value.entity;

      this.props.dataStore!.postItem(Entity, AppUrls.entity,
          Serializer.fromJson(Entity, {
              label: 'Copy of ' + entity.label,
              entityType: entity.entityType
          }), { clone: this.props.id }).then(([id]) => this.props.dataStore!.createTab('entity', id, 'item'));
    }

    public render() {

        const entity = this.props.dataStore!.dataStore.tabs.entity[this.props.id].value.entity;
        const potentialParents = this.props.dataStore!.dataStore.all.entity.value;

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
                  <div className='primary-toolbar'>
                    <div className='main-toolbar'>
                        <i className='fa fa-cube item-icon'></i>
                        <HeaderEditableFieldComponent
                            value={entity.label}
                            onChange={(value) => this.update({ 'label': value })} />
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
                            onClick={this.clone.bind(this)}
                        ></i>
                    </div>
                  </div>
                  <div className='secondary-toolbar'>
                      <div className='tab-bar'>
                        <div className={'entity ' + (this.state.tab === 0 ? 'selected' : '')} onClick={() => this.setState({ tab: 0 })}>CORE</div>
                        <div className={'entity ' + (this.state.tab === 1 ? 'selected' : '')} onClick={() => this.setState({ tab: 1 })}>REFERENCED BY</div>
                      </div>
                  </div>
                </header>

                {this.state.tab === 0 ? (
                  <EntityWorkspaceCoreView
                  dataStore={this.props.dataStore}
                  id={this.props.id}
                 />
                ) : (
                  <EntityWorkspaceReferenceView
                  dataStore={this.props.dataStore!}
                  id={this.props.id}
                 />
                )}

            </div>
        );
    }
}
