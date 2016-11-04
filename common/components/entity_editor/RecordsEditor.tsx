/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { ApiService, AppUrls } from '../../ApiService';
import { DataStore } from '../../DataStore';
import { Record, Predicate, Source } from '../../../common/datamodel/datamodel';
import { EditableFieldComponent } from '../fields/EditableFieldComponent';

import { SearchBar } from '../SearchBar';

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
	filterFunc: (p: Predicate) => boolean;
}

export class RecordsEditor extends React.Component<RecordsEditorProps, RecordsEditorState> {

	constructor() {
		super();
		this.state = {
			filterFunc: () => true
		};
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
		this.props.api.putItem(Record, AppUrls.record, this.props.id, record.serialize());
	}

	public render() {

		const predicates = this.props.predicates;

		return (
		<div>
			<div>
				<div>
					<h4>Records</h4>
					<SearchBar
						getValue={(p: Predicate) => p.name}
						setFilterFunc={(filterFunc) => this.setState({ filterFunc })}
					 />
					<div>
						{Object.keys(this.props.records).map((section) => {

							const currentPredicate = predicates.find((pred) => {
								if (pred.uid === null) {
									throw new Error('encountered predicate with null id');
								}
								return pred.uid.toString() === section;
							});

							if(currentPredicate === undefined) {
								throw new Error('Could not find predicate');
							}

							if (!this.state.filterFunc(currentPredicate)) {
								return null;
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