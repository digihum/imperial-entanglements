/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import { AppUrls } from '../../ApiService';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';

import { Record, Predicate, Source } from '@digihum/falcon-core';
import { EditableFieldComponent } from '../fields/EditableFieldComponent';

import { SearchBar } from '../SearchBar';

import { RecordPredicate } from './RecordPredicate';

import { findParentTree } from '../../helper/findParentTree';

import { ModalDefinition } from '../modal/ModalDefinition';

import { groupBy, Dictionary } from 'lodash';

import { inject, observer } from 'mobx-react';

class RecordEditableFieldComponent extends EditableFieldComponent<Record> {}

interface RecordsEditorProps {
  id: number;
	dimension: string;
	entityTypeId: number;
	entityExists: boolean;
	records: Dictionary<Record[]>;
	onChange: () => void;
	predicates : Predicate[];
	sources: Source[];
	dataStore?: DataController;
  modalStore?: ModalStore;
}

interface RecordsEditorState {
	filterFunc: (p: Predicate) => boolean;
}

@inject('dataStore', 'modalStore')
@observer

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

		this.props.dataStore!.delItem(Record, AppUrls.record, record.uid)
		.then(() => {
			this.props.onChange();
		});
	}

	public createNewRecord() {

        const entity = this.props.dataStore!.dataStore.tabs.entity[this.props.id].value.entity;

        const entityType = this.props.dataStore!.dataStore.all.entity_type.value.find((t) => t.uid === entity.entityType);

        const entityTypeParents = findParentTree(entity.entityType, this.props.dataStore!.dataStore.all.entity_type.value);
        const predicates = this.props.dataStore!.dataStore.all.predicate
            .value.filter((pred) => entityTypeParents.indexOf(pred.domain) !== -1);

        const modalDef: ModalDefinition = {
            name: 'record',
            complete: (data) => {
                console.log('Records editor called complete');
                //this.loadData(this.props);
            },
            cancel: () => {
                console.log('Records editor called cancel');
            },
            settings: {
                options: predicates.map((pred) => ({ key: pred.label, value: pred.uid, meta: pred})),
                entityUid: this.props.id,
                entityType: this.props.entityTypeId
            }
        };

        this.props.modalStore!.addModal(modalDef);
    }

	public render() {

		const predicates = this.props.predicates;

		return (
		<div>
			<div>
				<div>
					<label className='small'>Records</label>
					<div style={{ display: 'flex' }}>
						<div style={{ flex: '1' }}>
							<SearchBar
								getValue={(p: Predicate) => p.label}
								setFilterFunc={(filterFunc) => this.setState({ filterFunc })}
							/>
						</div>
						<div style={{padding: '0.1em 0.4em', fontSize: '2em'}}>
							<i
								className='fa fa-plus-circle add button'
								aria-hidden='true'
								onClick={this.createNewRecord.bind(this)}
								title='Add new record'
							>
                    		</i>
						</div>
					 </div>
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
								dataStore={this.props.dataStore!}
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
