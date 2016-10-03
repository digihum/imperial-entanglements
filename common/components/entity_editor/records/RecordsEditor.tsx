/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { ApiService } from '../../../ApiService';
import { Record } from '../../../datamodel/Record';

import { RecordRow } from './RecordRow';

interface RecordsEditorProps {
    id: number;
	service: ApiService;
	dimension: string;
	entityExists: boolean;
}

interface RecordsEditorState {
	records: { [s: string]: Record[] } ;
}

export class RecordsEditor extends React.Component<RecordsEditorProps, RecordsEditorState> {

	constructor() {
		super();
		this.state = {
			records: {
				'forename': [ new Record() ]
			}
		};
	}

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

	// public componentDidMount() {
	// 	this.updateRecords();
	// }

	// public postChange(updatedRecord) {
	// 	return this.props.service.changeRecord(this.props.id, updatedRecord)
	// 	.then(this.updateRecords);
	// }

	// public postDelete(deletedRecord) {
	// 	return this.props.service.deleteRecord(this.props.id, deletedRecord)
	// 	.then(this.updateRecords);
	// }

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
			<div className='row'>
				<div className='col-md-12'>
					<h4 className='tab-header'>Records</h4>
					<div className='input-group margin-bottom-sm  mega-search'>
						<span className='input-group-addon'><i className='fa fa-search fa-fw'></i></span>
						<input type='text' className='form-control' />
					</div>
					<div className='well'>
						{Object.keys(this.state.records).map((section) => (
							<section key={`section-${section}`}>
								<h5>{section}</h5>
								{this.state.records[section].map((record) => (
									<RecordRow key={`record-${record.uid}`} record={record} dimension={this.props.dimension} />
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