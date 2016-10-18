/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

import { ApiService, AppUrls } from '../../ApiService';
import { Entity, EntityType, Predicate } from '../../../common/datamodel/datamodel';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { noop } from 'lodash';

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
        Promise.all([
            this.props.api.getCollection(Entity, AppUrls.entity, {}),
            this.props.api.getCollection(EntityType, AppUrls.entityType, {}),
            this.props.api.getCollection(Predicate, AppUrls.predicate, {})
        ])
        .then(([entities, entityTypes, predicates]) => this.setState({ entities, entityTypes, predicates }));
    }

    public render() {
        return (
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
                        <td>{entity.uid}</td>
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
        );
    }
}