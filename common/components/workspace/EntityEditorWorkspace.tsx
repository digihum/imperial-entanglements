/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Loading } from '../Loading';

import { RecordsEditor } from '../entity_editor/RecordsEditor';
import { ApiService, AppUrls } from '../../ApiService';

import { Entity, Predicate, Record, Source, EntityType } from '../../../common/datamodel/datamodel';

import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { ModalDefinition } from '../modal/ModalDefinition';

import { Dictionary, groupBy, noop } from 'lodash';

import { createTab, showModal } from '../../Signaller';
import { AddTabButton } from '../AddTabButton';

import { connect } from 'react-redux';
import { loadEntity } from '../../actions';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableComboDropdown } from '../fields/EditableComboDropdown';

import { DataStore } from '../../DataStore';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}
class ComboEditableFieldComponent extends EditableFieldComponent<ComboDropdownOption> {}

interface EntityEditorProps {
    api: ApiService;
    id: number;
    dataStore: DataStore;
}

interface EntityEditorState {
    entity : Entity | null;
    predicates : Predicate[] | null;
    comboValue: ComboDropdownOption;
    comboSearchValue: string;
    records: Dictionary<Record[]>;
    sources: Source[];
    potentialParents: Entity[];
    entityType: EntityType | null;
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

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props : EntityEditorProps, context: any) {
        super();
        this.state = {
            entity: null,
            predicates: null,
            comboValue: { key: 'test', value: ''},
            comboSearchValue: '',
            records: {},
            sources: [],
            potentialParents: [],
            entityType: null
        };
    }

    public componentDidMount() {
        this.loadData(this.props);
    }

    // loads
    // data from the entity
    // predicates with a domain of this type
    // records for this entity
    // all sources

    public componentWillReceiveProps(newProps: EntityEditorProps)  {
        this.loadData(newProps);
    }

    // loads
    // data from the entity
    // predicates with a domain of this type
    // records for this entity
    // all sources
    public loadData(props: EntityEditorProps) {

        props.api.getItem(Entity, AppUrls.entity, props.id).then((entity) => {
            createTab.dispatch(`Entity #${props.id}`, entity.entityType, `/${AppUrls.entity}/${props.id}`, 'entity');
            return Promise.all([
                props.api.getCollection(Record, AppUrls.record, { entity: props.id })
            ])
            .then(([records]) => {
                this.setState({
                    entity,
                    records: groupBy(records, 'predicate'),
                });
            });
        }).catch((err) => {
            console.log(err);
            this.context.router.transitionTo('/');
        });
    }

    public del() {
        this.props.api.delItem(Entity, AppUrls.entity, this.props.id)
        .then(() => {
            this.context.router.transitionTo('/');
        });
    }

    public createNewRecord() {
        const modalDef: ModalDefinition = {
            name: 'record',
            complete: (data) => {
                console.log('Records editor called complete');
                this.loadData(this.props);
            },
            cancel: () => {
                console.log('Records editor called cancel');
            },
            settings: {
                options: this.state.predicates.map((pred) => ({ key: pred.name, value: pred.uid, meta: pred})),
                entityUid: this.props.id,
                entityType: this.state.entityType.uid
            }
        };

        showModal.dispatch(modalDef);
    }

    public update(data: any) {
        this.props.api.patchItem(Entity, AppUrls.entity, this.props.id, data)
        .then(() => this.setState({ entity: Object.assign({}, this.state.entity, data)}));
    }

    public render() {

        const entity = this.state.entity;

        if (entity === null) {
            return (<Loading />);
        }

        const entityType = this.props.dataStore.entityType.get(AppUrls.entityType).value.find((t) => t.uid === entity.entityType);
        const potentialParents = this.props.dataStore.entity.get(AppUrls.entity).value;

        const predicates = this.props.dataStore.predicate.get(AppUrls.predicate)
            .value.filter((pred) => pred.domain === entity.entityType);

        const sources = this.props.dataStore.source.get(AppUrls.source).value;

        const options = predicates.map((pred) => ({ key: pred.name, value: pred.uid, meta: pred}));

        let parentName = '';
        if (potentialParents !== null && entity.parent !== undefined) {
            const found = potentialParents.find((par) => par.uid === entity.parent);
            if (found !== undefined) {
                parentName = found.label;
            }
        }

        return (
            <div className='workspace-editor'>
                <h2>Edit Entity {this.props.id} <i
                    className='fa fa-plus-circle add-button'
                     aria-hidden='true'
                     onClick={this.createNewRecord.bind(this)}
                ></i><i
                    className='fa fa-trash delete-button'
                     aria-hidden='true'
                     onClick={this.del.bind(this)}
                ></i>
                <i
                    className='fa fa-clone'
                     aria-hidden='true'
                     onClick={() => console.log('copy')}
                ></i></h2>

                <div className='edit-group'>
                    <label>Label</label>
                    <StringEditableFieldComponent
                        value={entity.label}
                        component={EditableHeader}
                        onChange={(value) => this.update({ 'label': value })}  />
                </div>

                <div>{entityType.name} <AddTabButton
                    title={entityType.name}
                    subtitle={`Entity type ${entityType.uid}`}
                    url={`/${AppUrls.entityType}/${entityType.uid}`}
                    tabType='entity_type'
                /></div>

                <span>Parent:</span>
                <ComboEditableFieldComponent
                    value={{key: parentName, value: entity.parent}}
                    component={EditableComboDropdown}
                    onChange={(value) => this.update({'parent': value.value})}
                    additionalProps={{ comboSettings: {
                        options: this.state.potentialParents.map((par) => ({ key: par.label, value: par.uid})),
                        typeName: 'Entity'
                    }}} />


                <RecordsEditor
                    dimension='predicates'
                    entityExists={true}
                    id={this.props.id}
                    api={this.props.api}
                    records={this.state.records}
                    onChange={this.loadData.bind(this, this.props)}
                    predicates={predicates}
                    sources={sources}
                />
            </div>
        );
    }
}