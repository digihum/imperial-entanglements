/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService, AppUrls } from '../../../ApiService';
import { Entity } from '../../../../common/datamodel/datamodel';

import { AddTabButton } from '../../AddTabButton';

import { DataStore } from '../../../DataStore';

interface EntityWorkspaceReferenceViewProps {
    api: ApiService;
    id: number;
    dataStore: DataStore;
}

interface EntityWorkspaceReferenceViewState {

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
            <table className='table'>
              <thead>
                <tr>
                  <th>Entity</th>
                  <th>Property</th>
                </tr>
              </thead>
              <tbody>
                {this.props.dataStore.tabs.entity.get('entity-' + this.props.id).value.referenceRecords.map((record) => {
                  return (<tr key={`record-${record.uid}`}>
                    <td>{record.entity} <AddTabButton tabType={'entity'} uid={record.entity} dataStore={this.props.dataStore}/></td>
                    <td>{record.predicate} <AddTabButton
                      tabType={'predicate'}
                      uid={record.predicate}
                      dataStore={this.props.dataStore}/></td>
                  </tr>);
                })}
              </tbody>
            </table>
          </section>
        );
    }
}
