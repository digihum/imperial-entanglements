/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';

import { SameAsEditor } from '../fields/SameAsEditor';
import { Loading } from '../Loading';
import { ApiService, AppUrls } from '../../ApiService';

import { EntityType } from '../../../common/datamodel/datamodel';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';
import { EditableComboDropdown } from '../fields/EditableComboDropdown';
import { ComboDropdownOption } from '../ComboDropdown';

import { keyBy, Dictionary } from 'lodash';

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

                <StringEditableFieldComponent
                    value={entityType.name}
                    component={EditableHeader}
                    onChange={(value) => this.update({'name': value})}  />

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
            </div>
        );
    }
}