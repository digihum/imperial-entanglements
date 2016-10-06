/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { Link } from 'react-router';
import { ApiService } from '../ApiService';
import { AppUrls } from '../routeUrls';
import * as Select from 'react-select';

import { ElementSet } from '../datamodel/AbstractSource';
import { EntityType } from '../datamodel/EntityType';
import { Entity } from '../datamodel/Entity';

interface ExpectedParams {
    id: number;
}

interface EntityEditorProps {
    id: number;
    api: ApiService;
    params: ExpectedParams;
}

interface EntityEditorState {
    dimension: 'predicates' | 'time' | 'source';
    entity: Entity;
    tmp: string;
    entityTypes: EntityType[];
    options: any[];
}

export class EntityEditor extends React.Component<EntityEditorProps, EntityEditorState> {

    constructor() {
        super();
        this.state = {
            dimension: 'predicates',
            entity: new Entity(),
            tmp: '',
            entityTypes: [],
            options: []
        };
    }

    public componentDidMount() {
        this.props.api.getItem(Entity, AppUrls.entity, this.props.params.id)
        .then((data) => {
            this.setState({ entity: data });
        });

        this.props.api.getCollection(EntityType, AppUrls.entityType)
        .then((data) => {
            this.setState({entityTypes: data, options: this.getOptions(data)});
        });
    }

    public getOptions(baseData: any) {
        return [{ label: '+ Add new Entity Type', value: 'ADD_NEW_ENTITY_TYPE'}]
            .concat(baseData.map((entityType) => ({ label: entityType.name, value: entityType.name })));
    }

    public setSelectedEntityType(data) {
        if (data.value === 'ADD_NEW_ENTITY_TYPE') {
            const newName = prompt('What do you want your new entity type to be called?');
            if (newName === null) {
                this.setState({ tmp: this.state.tmp });
            } else {
                this.setState({
                    options: this.state.options.concat([{ label: newName, value: newName}]),
                    tmp: newName                
                });
            }

        } else {
            this.setState({ tmp: data.value })
        }
    }

    public render() {
        const woo = 1;
        if (woo === 2) {
            return (
                <section id='select-entity-type'>
                    <i className='fa fa-question-circle big-icon' aria-hidden='true'></i>
                    <form>
                        <label>Please select a type for this entity:</label>
                        <select>
                            <option>Person</option>
                        </select>
                        <button>Add New</button>
                    </form>
                </section>);
        } else {
            return (
                <section id='entity-editor' className='flex-fill'>
                    <section id='sidebar'>
                    <h2>Entity #{this.props.params.id}<br /><small>{this.state.entity.entityType}</small></h2>
                    </section>
                    <section id='workspace'>
                        <h2>Predicates <i className='fa fa-plus-circle' aria-hidden='true'></i></h2>
                        <Select
                            name='form-field-name'
                            value={this.state.tmp}
                            onChange={this.setSelectedEntityType.bind(this)}
                            options={this.state.options}
                        />
                    </section>
                </section>
            );
        }
    }
}