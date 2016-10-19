/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Loading } from '../Loading';

import { RecordsEditor } from '../entity_editor/RecordsEditor';
import { ApiService, AppUrls } from '../../ApiService';

import { Entity, Predicate, Record, Source } from '../../../common/datamodel/datamodel';

import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { CreatePredicate } from '../modal/CreatePredicate';
import { CreateRecord } from '../modal/CreateRecord';
import { CreateSource } from '../modal/CreateSource';
import { ModalDefinition } from '../modal/ModalDefinition';

import { Dictionary, groupBy, noop } from 'lodash';

import { createTab, showModal } from '../../Signaller';

interface EntityEditorProps {
    api: ApiService;
    id: number;
}

interface EntityEditorState {
    entity : Entity | null;
    predicates : Predicate[] | null;
    comboValue: ComboDropdownOption;
    comboSearchValue: string;
    records: Dictionary<Record[]>;
    sources: Source[];
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
export class EntityEditorWorkspace extends React.Component<EntityEditorProps, EntityEditorState> {

    constructor() {
        super();
        this.state = {
            entity: null,
            predicates: null,
            comboValue: { key: 'test', value: ''},
            comboSearchValue: '',
            records: [],
            sources: []
        };
    }

    public componentDidMount() {

        this.props.api.getItem(Entity, AppUrls.entity, this.props.id).then((data) => {
            this.setState({ entity: data });
            this.loadPredicates(data.entityType);
            createTab.dispatch(`Entity #${this.props.id}`, data.entityType, `/${AppUrls.entity}/${this.props.id}`);
        });

        this.loadRecords();

        this.props.api.getCollection(Source, AppUrls.source, {})
        .then((data) => this.setState({ sources: data }));
    }

    public componentWillReceiveProps(newProps: EntityEditorProps)  {

        newProps.api.getItem(Entity, AppUrls.entity, newProps.id).then((data) => {
            this.setState({ entity: data });
            this.loadPredicates(data.entityType);
            createTab.dispatch(`Entity #${newProps.id}`, data.entityType, `/${AppUrls.entity}/${newProps.id}`);
        });

        this.props.api.getCollection(Record, AppUrls.record, { entity: newProps.id })
		.then((data) => {
			this.setState({ records: groupBy(data, 'predicate') });
		});

        newProps.api.getCollection(Source, AppUrls.source, {})
        .then((data) => this.setState({ sources: data }));
    }

    public loadRecords() {
        this.props.api.getCollection(Record, AppUrls.record, { entity: this.props.id })
		.then((data) => {
			this.setState({ records: groupBy(data, 'predicate') });
		});
    }

    public loadPredicates(entityType: number) {
        return this.props.api.getCollection(Predicate, AppUrls.predicate, { domain: entityType })
        .then((predicateData) => {
            return new Promise((res) => {
                this.setState({ predicates: predicateData }, res);
            });
        });
    }

    public setComboValue(opt: ComboDropdownOption) {
        this.setState({ comboValue: opt });
    }

    public createNewRecord() {
        const modalDef: ModalDefinition = {
            name: 'record',
            complete: (data) => {
                console.log('Records editor called complete');
                this.loadPredicates(this.state.entity.entityType)
                .then(() => this.loadRecords());
            },
            cancel: () => {
                console.log('Records editor called cancel');
            },
            settings: {
                options: this.state.predicates.map((pred) => ({ key: pred.name, value: pred.uid, meta: pred})),
                entityUid: this.props.id
            }
        };

        showModal.dispatch(modalDef);
    }

    public render() {

        if (this.state.entity === null || this.state.predicates === null) {
            return (<Loading />);
        }

        const options = this.state.predicates.map((pred) => ({ key: pred.name, value: pred.uid, meta: pred}));

        return (
            <div className='workspace-editor'>
                <h2>Edit Entity {this.props.id} <i
                    className='fa fa-plus-circle add-button'
                     aria-hidden='true'
                     onClick={this.createNewRecord.bind(this)}
                ></i><i
                    className='fa fa-trash delete-button'
                     aria-hidden='true'
                     onClick={() => this.setState({ creatingRecord : true })}
                ></i></h2>

                <RecordsEditor
                    dimension='predicates'
                    entityExists={true}
                    id={this.props.id}
                    api={this.props.api}
                    records={this.state.records}
                    onChange={this.loadRecords.bind(this)}
                    predicates={this.state.predicates}
                    sources={this.state.sources}
                />
            </div>
        );
    }
}