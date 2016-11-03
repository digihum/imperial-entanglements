/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';

import { SameAsEditor } from '../fields/SameAsEditor';
import { ApiService, AppUrls } from '../../ApiService';

import { EntityType } from '../../../common/datamodel/datamodel';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';
import { EditableComboDropdown } from '../fields/EditableComboDropdown';
import { ComboDropdownOption } from '../ComboDropdown';

import { showModal } from '../../Signaller';
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

    public del() {
        this.props.api.delItem(EntityType, AppUrls.entity_type, this.props.id)
        .then(() => this.context.router.transitionTo('/edit/notfound'))
        .catch((e) => {
            e.data.then((data) => {

                const conflictResolutionModal : ModalDefinition = {
                    name: 'conflict_resolution',
                    cancel: () => {},
                    complete: (result) => {

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
                        <i className='fa fa-tag item-icon'></i>
                        <StringEditableFieldComponent
                            value={entityType.name}
                            component={EditableHeader}
                            onChange={(value) => this.update({'name': value})}  />
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
                    <span>Parent:</span>
                    <ComboEditableFieldComponent
                        value={{key: parentName, value: entityType.parent}}
                        component={EditableComboDropdown}
                        onChange={(value) => this.update({'parent': value.value})}
                        additionalProps={{ comboSettings: {
                            options: potentialParents.map((par) => ({ key: par.name, value: par.uid})),
                            typeName: 'EntityType'
                        }}} />

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
                </section>
            </div>
        );
    }
}