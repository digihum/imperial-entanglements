/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';

import { ApiService, AppUrls } from '../../../ApiService';
import { Entity } from '@digihum/falcon-core';

import { AddTabButton } from '../../AddTabButton';

import { DataController } from '../../../stores/DataController';

interface EntityWorkspaceReferenceViewProps {
    id: number;
    dataStore: DataController;
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
        this.props.dataStore!.patchItem(Entity, AppUrls.entity, this.props.id, data);
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
                {this.props.dataStore.dataStore.tabs.entity[this.props.id].value.referenceRecords.map((record) => {
                  return (<tr key={`record-${record.uid}`}>
                    <td>{this.props.dataStore.dataStore.all.entity.value.find((entity) => entity.uid === record.entity)!.label} <AddTabButton tabType={'entity'} uid={record.entity} /></td>
                    <td>{this.props.dataStore.dataStore.all.predicate.value.find((predicate) => predicate.uid === record.predicate)!.label} <AddTabButton
                      tabType={'predicate'}
                      uid={record.predicate} /></td>
                  </tr>);
                })}
              </tbody>
            </table>
          </section>
        );
    }
}
