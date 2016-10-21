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


import { RecordPredicate } from './RecordPredicate';

import { groupBy, Dictionary } from 'lodash';

import { AddTabButton } from '../AddTabButton';

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

							return (<RecordPredicate
								key={`section-${section}`}
								entity_id={this.props.id}
								api={this.props.api}
								dimension='predicate'
								records={this.props.records[section]}
								predicate={currentPredicate}
								sources={this.props.sources}
								onChange={this.props.onChange}
							 />);

						})}
					</div>
				</div>
			</div>
		</div>
		);
	}
}