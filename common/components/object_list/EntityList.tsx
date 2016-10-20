/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService, AppUrls } from '../../ApiService';
import { Entity, EntityType, Predicate } from '../../../common/datamodel/datamodel';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { noop } from 'lodash';

import { AddTabButton } from '../AddTabButton';

import { showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';


interface EntityListProps {
    api: ApiService;
}

interface EntityListState {
    entities: Entity[];
    entityTypes: EntityType[];
    predicates: Predicate[];
}

interface ColumnSettings {
    name: string;
    nullable: boolean;

}

export class EntityList extends React.Component<EntityListProps, EntityListState> {

    constructor() {
        super();
        this.state = {
            entities: [],
            entityTypes: [],
            predicates: []
        };
    }

    public componentWillMount() {
        this.loadData();
    }

    public loadData() {
        Promise.all([
            this.props.api.getCollection(Entity, AppUrls.entity, {}),
            this.props.api.getCollection(EntityType, AppUrls.entityType, {}),
            this.props.api.getCollection(Predicate, AppUrls.predicate, {})
        ])
        .then(([entities, entityTypes, predicates]) => this.setState({ entities, entityTypes, predicates }));
    }

    public addNew() {
        const a : ModalDefinition = {
            name: 'entity',
            complete: () => {
                this.loadData();
            },
            cancel: () => { console.log('cancel')},
            settings: {
                initialName: ''
            }
        };

        showModal.dispatch(a);
    }


    public render() {
        return (
        <section>
            <h2>All Entities <i
                    className='fa fa-plus-circle add-button'
                    aria-hidden='true'
                    onClick={this.addNew.bind(this)}
            ></i></h2>
            <table className='table'>
                <thead>
                    <tr>
                        <td>#</td>
                        <td>Label</td>
                        <td>Type</td>
                        {[1,2,3].map((id) => (
                            <td key={`col-${id}`}><ComboDropdown
                                value={{key: '', value: ''}}
                                typeName='predicate'
                                allowNew={false}
                                setValue={(a) => console.log(a)}
                                options={this.state.predicates.map((pred) => ({ key: pred.name, value: pred.uid.toString()}))}
                                createNewValue={noop}
                            /></td>
                        ))}
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>

                        {[1,2,3].map((id) => (
                            <td key={`col-${id}`}>
                                <div>
                                    <select>
                                        <option>Exists</option>
                                        <option>Equals</option>
                                        <option>Similar</option>
                                    </select>
                                    <input type='text' />
                                </div>
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {this.state.entities.map((entity) => {
                    const entityType = this.state.entityTypes.find((t) => t.uid === entity.entityType);
                    return (
                        <tr key={`entity-${entity.uid}`}>
                            <td>{entity.uid} <AddTabButton
                                title={entity.label}
                                subtitle={`Entity ${entity.uid}`}
                                url={`/${AppUrls.entity}/${entity.uid}`} /></td>
                            <td>{entity.label}</td>
                            <td>{entityType ? entityType.name : ''}</td>
                            <td>Col1</td>
                            <td>Col2</td>
                            <td>Col3</td>
                        </tr>
                    )}
                )}
                </tbody>
            </table>
        </section>
        );
    }
}