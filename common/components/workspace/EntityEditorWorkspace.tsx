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

import { Dictionary, groupBy } from 'lodash';

import { createTab } from '../../Signaller';

interface EntityEditorProps {
    api: ApiService;
    id: number;
}

interface EntityEditorState {
    entity : Entity | null;
    predicates : Predicate[] | null;
    comboValue: ComboDropdownOption;
    comboSearchValue: string;
    creatingPredicate: boolean;
    creatingRecord: boolean;
    creatingSource: boolean;
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
            creatingPredicate: false,
            creatingRecord: false,
            creatingSource: false,
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
        this.props.api.getCollection(Predicate, AppUrls.predicate, { domain: entityType })
        .then((predicateData) => {
            this.setState({ predicates: predicateData });
        });
    }

    public createdPredicate(newPredicate: Predicate) {
        this.setState({creatingPredicate: false}, () => {

            if (this.state.entity === null) {
                throw new Error('Missing entity!');
            }

            this.loadPredicates(this.state.entity.entityType);

            createTab.dispatch(`Predicate #${newPredicate.uid}`, '', `/${AppUrls.predicate}/${newPredicate.uid}`);

            this.props.api.postItem(Record, AppUrls.record,
            new Record().deserialize({
                predicate: newPredicate.uid,
                entity: this.props.id,
                valueType: newPredicate.rangeIsReference ? 'entity' : newPredicate.range
            })).then(this.loadRecords.bind(this));
        });
    }

    public setComboValue(opt: ComboDropdownOption) {
        this.setState({ comboValue: opt });
    }

    public render() {

        if (this.state.entity === null || this.state.predicates === null) {
            return (<Loading />);
        }

        const options = this.state.predicates.map((pred) => ({ key: pred.name, value: pred.uid, meta: pred}));

        return (
            <div className='workspace-editor'>
                <h2>Predicates <i
                    className='fa fa-plus-circle add-button'
                     aria-hidden='true'
                     onClick={() => this.setState({ creatingRecord : true })}
                ></i><i
                    className='fa fa-trash delete-button'
                     aria-hidden='true'
                     onClick={() => this.setState({ creatingRecord : true })}
                ></i></h2>

                {this.state.creatingPredicate ?
                    (<CreatePredicate
                        initialName={this.state.comboSearchValue}
                        cancel={() => this.setState({creatingPredicate: false})}
                        complete={this.createdPredicate.bind(this)}
                        api={this.props.api}
                        initialDomain={this.state.entity.entityType}
                    />) : null}

                {this.state.creatingRecord ?
                    (<CreateRecord
                        options={options}
                        api={this.props.api}
                        entityUid={this.props.id}
                        create={(s) => this.setState({ creatingPredicate: true, comboSearchValue: s, creatingRecord: false})}
                        close={() => { this.setState({ creatingRecord: false }); this.loadRecords() }}
                    />) : null}

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