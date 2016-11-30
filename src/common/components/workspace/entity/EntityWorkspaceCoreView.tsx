/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { RecordsEditor } from '../../entity_editor/RecordsEditor';
import { ApiService, AppUrls } from '../../../ApiService';

import { Entity } from '../../../../common/datamodel/datamodel';

import { ComboDropdownOption } from '../../ComboDropdown';

import { groupBy } from 'lodash';

import { AddTabButton } from '../../AddTabButton';

import { findParentTree } from '../../../helper/findParentTree';


import { EditableFieldComponent } from '../../fields/EditableHeader';
import { EditableComboDropdown } from '../../fields/EditableComboDropdown';

import { DataStore } from '../../../DataStore';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}
class ComboEditableFieldComponent extends EditableFieldComponent<ComboDropdownOption> {}

interface EntityWorkspaceCoreViewProps {
    api: ApiService;
    id: number;
    dataStore: DataStore;
}

interface EntityWorkspaceCoreViewState {
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
export class EntityWorkspaceCoreView extends React.Component<EntityWorkspaceCoreViewProps, EntityWorkspaceCoreViewState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props : EntityWorkspaceCoreViewProps, context: any) {
        super();
        this.state = {
            comboValue: { key: 'test', value: ''},
            comboSearchValue: ''
        };
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
          <section className='editor-body'>

            <div className='flex-fill'>
                <div className='flex-fill'>
                    <div><label className='small'>Type</label>{entityType.name} <AddTabButton
                        dataStore={this.props.dataStore}
                        uid={entityType.uid}
                        tabType='entity_type'
                    /></div>
                </div>

                <div style={{ flex: 1 }}>
                    <label className='small'>Parent</label>
                    <ComboEditableFieldComponent
                        value={{key: parentName, value: entity.parent}}
                        component={EditableComboDropdown}
                        onChange={(value) => this.update({'parent': value.value})}
                        additionalProps={{ comboSettings: {
                            options: potentialParents.map((par) => ({ key: par.label, value: par.uid})),
                            typeName: 'Entity'
                        }}} />
                    {entity.parent !== null ? (<AddTabButton dataStore={this.props.dataStore}
                        tabType='entity'
                        uid={entity.parent} />) : null}
                </div>
            </div>

            <div className='edit-group'>
                <RecordsEditor
                    dimension='predicates'
                    entityExists={true}
                    id={this.props.id}
                    api={this.props.api}
                    records={records}
                    onChange={() => {}}
                    predicates={predicates}
                    sources={sources}
                    entityTypeId={entityType.uid}
                    dataStore={this.props.dataStore}
                />
            </div>
          </section>
        );
    }
}
