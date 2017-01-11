/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { ApiService, AppUrls } from '../../ApiService';
import { DataController } from '../../stores/DataController';

import { Record, Predicate, Source, Entity, Serializer } from 'falcon-core';
import { EditableFieldComponent } from '../fields/EditableFieldComponent';

import { RecordRow } from './RecordRow';

import { AddTabButton } from '../AddTabButton';

class RecordEditableFieldComponent extends EditableFieldComponent<Record> {}

interface RecordPredicateProps {
  entity_id: number;
	dataStore: DataController;
	dimension: string;
	records: Record[];
	predicate : Predicate;
	sources: Source[];
  onChange: () => void;
}

interface RecordPredicateState {
	potentialValues: Entity[];
}

export class RecordPredicate extends React.Component<RecordPredicateProps, RecordPredicateState> {

    constructor() {
        super();
        this.state = {
            potentialValues: []
        };
    }

    public componentDidMount() {
        if (this.props.predicate.rangeIsReference) {
            this.props.dataStore!.getCollection(Entity, AppUrls.entity, { type: this.props.predicate.range })
            .then((potentialValues) => this.setState({ potentialValues }));
        }
    }

    public createNewRecord() {
        this.props.dataStore!.postItem(Record, AppUrls.record,
        Serializer.fromJson(Record, {
            predicate: this.props.predicate.uid,
            entity: this.props.entity_id,
            valueType: this.props.predicate.rangeIsReference ? 'entity' : this.props.predicate.range,
            score: 3,
            source: this.props.dataStore!.defaultSource
        }));
    }

	public deleteRecord(record: Record) {

		if (record.uid === null) {
			throw new Error('Trying to delete a record with null id');
		}

		this.props.dataStore!.delItem(Record, AppUrls.record, record.uid)
		.then(() => {
			this.props.onChange();
		});
	}

	public recordChanged(record: Record) {
		this.props.dataStore!.putItem(Record, AppUrls.record, this.props.entity_id, Serializer.toJson(record));
	}

	public render() {

    if (this.props.predicate.uid === null) {
      throw new Error('Expected uid to be a number, it was null');
    }

    return (
      <section>
            <h5 className='section-header'>{this.props.predicate.label} <i
                    className='fa fa-plus-circle add button'
                      aria-hidden='true'
                      onClick={this.createNewRecord.bind(this)}
                      title={`Add new ${this.props.predicate.label} record`}
                ></i>
            <AddTabButton
                uid={this.props.predicate.uid}
                tabType='predicate' />
            </h5>
            <table className='record-editing-table'>
                <thead>
                    <tr className='record-row title'>
                        <th className='record-row-item uid'>ID</th>
                        {this.props.predicate.range !== 'source' ? (<th className='record-row-item'>Value</th>) : null}
                        <th className='record-row-item'>Source</th>
                        <th className='record-row-item score'>Score</th>
                        <th className='record-row-item score'>Period</th>
                        <th className='record-row-item buttons'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.records.map((record) => (
                        <RecordEditableFieldComponent
                            key={`row-${record.uid}`}
                            value={record}
                            onChange={this.recordChanged.bind(this)}
                            onDelete={this.deleteRecord.bind(this)}
                            component={RecordRow}
                            additionalProps={{
                                dimension: 'predicates',
                                sources: this.props.sources,
                                entities: this.state.potentialValues,
                            }}
                        />
                    ))}
                </tbody>
            </table>
        </section>
    );
	}
}
