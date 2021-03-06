/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { ApiService, AppUrls } from '../../ApiService';
import { DataStore } from '../../dataStore';
import { Record, Predicate, Source, Entity } from '../../../common/datamodel/datamodel';
import { EditableFieldComponent } from '../fields/EditableFieldComponent';

import { RecordRow } from './RecordRow';

import { AddTabButton } from '../AddTabButton';

class RecordEditableFieldComponent extends EditableFieldComponent<Record> {}

interface RecordPredicateProps {
    entity_id: number;
	api: ApiService;
	dimension: string;
	records: Record[];
	predicate : Predicate;
	sources: Source[];
    onChange: () => void;
    dataStore: DataStore;
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
            this.props.api.getCollection(Entity, AppUrls.entity, { type: this.props.predicate.range })
            .then((potentialValues) => this.setState({ potentialValues }));
        }
    }

    public createNewRecord() {
        this.props.api.postItem(Record, AppUrls.record,
        new Record().deserialize({
            predicate: this.props.predicate.uid,
            entity: this.props.entity_id,
            valueType: this.props.predicate.rangeIsReference ? 'entity' : this.props.predicate.range,
            score: 3
        }));
    }

	public deleteRecord(record: Record) {

		if (record.uid === null) {
			throw new Error('Trying to delete a record with null id');
		}

		this.props.api.delItem(Record, AppUrls.record, record.uid)
		.then(() => {
			this.props.onChange();
		});
	}

	public recordChanged(record: Record) {
		this.props.api.putItem(Record, AppUrls.record, this.props.entity_id, record.serialize());
	}

	public render() {

        return (<section>
            <h5 className='section-header'>{this.props.predicate.name} <i
                    className='fa fa-plus-circle add button'
                     aria-hidden='true'
                     onClick={this.createNewRecord.bind(this)}
                     title={`Add new ${this.props.predicate.name} record`}
                ></i>
            <AddTabButton
                dataStore={this.props.dataStore}
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
                                dataStore: this.props.dataStore
                            }}
                        />
                    ))}
                </tbody>
            </table>
        </section>
    );
	}
}