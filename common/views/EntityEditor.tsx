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

function logChange(val) {
    console.log("Selected: " + val);
}

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
}

export class EntityEditor extends React.Component<EntityEditorProps, EntityEditorState> {

    constructor() {
        super();
        this.state = {
            dimension: 'predicates',
            entity: new Entity()
        };
    }

    public componentDidMount() {
        this.props.api.getItem(Entity, AppUrls.entity, this.props.params.id)
        .then((data) => {
            this.setState({ entity: data });
        });
    }


    private getData(input, callback)  {
        this.props.api.getCollection(EntityType, AppUrls.entityType)
        .then((data) => {
            console.log(data[0]);
            callback(null, {
                options: data.map((entityType) => ({ label: entityType.name, value: entityType.name })),
                // CAREFUL! Only set this to true when there are no more options,
                // or more specific queries will not be sent to the server.
                complete: true
            });
        });
    }

    public render() {
        const woo = 1;
        const getData = this.getData.bind(this);
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
                        <Select.Async
                            name='form-field-name'
                            value='one'
                            onChange={logChange}
                            loadOptions={getData}
                        />
                    </section>
                </section>
            );
        }
    }
}