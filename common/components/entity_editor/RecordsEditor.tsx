/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { ApiService, AppUrls } from '../../ApiService';
import { Record, Predicate, Source } from '../../../common/datamodel/datamodel';
import { EditableFieldComponent } from '../fields/EditableFieldComponent';

import { RecordRow } from './RecordRow';

import { createTab } from '../../Signaller';

import { groupBy, Dictionary } from 'lodash';

class RecordEditableFieldComponent extends EditableFieldComponent<Record> {}

interface RecordsEditorProps {
    id: number;
	api: ApiService;
	dimension: string;
	entityExists: boolean;
	records: Dictionary<Record[]>;
	onChange: () => void;
	predicates : Predicate[];
	sources: Source[];
}

interface RecordsEditorState {
	
}

export class RecordsEditor extends React.Component<RecordsEditorProps, RecordsEditorState> {

	// public updateRecords() {
	// 	this.props.service.getPerson(this.props.id)
	// 	.then((data) => {
	// 		this.setState({
	// 			data: data
	// 		});
	// 	});

	// 	this.props.service.getFields()
	// 	.then((data) => {
	// 		this.setState({
	// 			fields: data
	// 		});
	// 	});
	// }

	// public postChange(updatedRecord) {
	// 	return this.props.service.changeRecord(this.props.id, updatedRecord)
	// 	.then(this.updateRecords);
	// }

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
		this.props.api.putItem(Record, AppUrls.record, this.props.id, record.serialize());
	}

	// public postAdd(newRecord) {
	// 	return this.props.service.addRecord(this.props.id, newRecord)
	// 	.then(this.updateRecords);
	// }

	// public changeFilter(event) {
	// 	this.setState({filter: event.target.value});
	// }

	public render() {

		return (
		<div>
			<div>
				<div>
					<h4>Records</h4>
					<div>
						<div className='input-addon-formgroup'>
							<span className='input-addon-icon'><i className='fa fa-search fa-fw'></i></span>
							<input type='text' className='form-control with-addon' />
						</div>

					</div>
					<div>
						{Object.keys(this.props.records).map((section) => {

							const currentPredicate = this.props.predicates.find((pred) => {
								if (pred.uid === null) {
									throw new Error('encountered predicate with null id');
								}
								return pred.uid.toString() === section;
							});

							if (currentPredicate === undefined) {
								throw new Error('Could not find predicate');
							}

							return (<section key={`section-${section}`}>
								<h5 className='section-header'>{currentPredicate.name}
									<i className='icon-list-add add-button'
									onClick={() => createTab.dispatch(currentPredicate.name, 
											currentPredicate.uid,
											 `/${AppUrls.predicate}/${currentPredicate.uid}`)}></i>
								</h5>
								<div className='record-row title'>
									<div className='record-row-item uid'>ID</div>
									<div className='record-row-item'>Value</div>
									<div className='record-row-item'>Source</div>
									<div className='record-row-item score'>Score</div>
									<div className='record-row-item buttons'>Actions</div>
								</div>
								{this.props.records[section].map((record) => (
									<RecordEditableFieldComponent
										key={`row-${record.uid}`}
										value={record}
										onChange={this.recordChanged.bind(this)}
										onDelete={this.deleteRecord.bind(this)}
										component={RecordRow}
										additionalProps={{
											dimension: 'predicates',
											sources: this.props.sources
										}}
									/>
								))}
							</section>
						)})}
					</div>
				</div>
			</div>
		</div>
		);
	}
}