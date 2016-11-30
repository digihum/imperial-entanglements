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

interface EntityWorkspaceReferenceViewProps {
    api: ApiService;
    id: number;
    dataStore: DataStore;
}

interface EntityWorkspaceReferenceViewState {
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
export class EntityWorkspaceReferenceView extends React.Component<EntityWorkspaceReferenceViewProps, EntityWorkspaceReferenceViewState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props : EntityWorkspaceReferenceViewProps, context: any) {
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

        return (
          <section className='editor-body'>
            <h2>References</h2>
          </section>
        );
    }
}
