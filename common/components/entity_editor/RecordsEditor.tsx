/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { ApiService, AppUrls } from '../../ApiService';
import { Record } from '../../../common/datamodel/datamodel';

import { RecordRow } from './RecordRow';

import { groupBy, Dictionary } from 'lodash';

interface RecordsEditorProps {
    id: number;
	api: ApiService;
	dimension: string;
	entityExists: boolean;
	records: Dictionary<Record[]>;
	onChange: () => void;
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

	public deleteRecord(recordUid: number) {
		this.props.api.delItem(Record, AppUrls.record, recordUid)
		.then(() => {
			this.props.onChange();
		});
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
						{Object.keys(this.props.records).map((section) => (
							<section key={`section-${section}`}>
								<h5 className='section-header'>{section}
									<span className='fa-stack'>
										<i className='fa fa-th-list fa-stack-1x'></i>
										<i className='fa fa-plus fa-stack-1x' style={{ color: 'green' }}></i>
									</span>
								</h5>
								<div className='record-row title'>
									<div className='record-row-item uid'>ID</div>
									<div className='record-row-item'>Value</div>
									<div className='record-row-item'>Source</div>
									<div className='record-row-item score'>Score</div>
									<div className='record-row-item buttons'>Actions</div>
								</div>
								{this.props.records[section].map((record) => (
									<RecordRow
										key={`record-${record.uid}`}
										record={record}
										dimension={this.props.dimension}
										deleteRecord={this.deleteRecord.bind(this)}
									 />
								))}
							</section>
						))}
					</div>
				</div>
			</div>
		</div>
		);
	}
}