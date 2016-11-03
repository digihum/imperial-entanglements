/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Entity, EntityType } from '../../../common/datamodel/datamodel';
import { ApiService, AppUrls } from '../../ApiService';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';

import { noop } from 'lodash';

interface CreateEntityProps {
    api: ApiService;
    complete: (s: string) => void;
    cancel: () => void;
}

interface CreateEntityState {
    label: string;
    entityType: ComboDropdownOption;
    allEntityTypes: EntityType[];
}

export class CreateEntity extends React.Component<CreateEntityProps, CreateEntityState> {

    constructor() {
        super();
        this.state = {
            label: '',
            entityType: { key: '', value: ''},
            allEntityTypes: []
        };
    }

    public componentWillMount() {
        this.props.api.getCollection(EntityType, AppUrls.entity_type, {})
        .then((allEntityTypes) => this.setState({ allEntityTypes }));
    }

    public CreateEntity() {
        this.props.api.postItem(Entity, AppUrls.entity,
            new Entity().deserialize({
                label: this.state.label,
                entityType: this.state.entityType.value
            }))
        .then(this.props.complete);
    }

    public render() {
        return (
        <Overlay>
            <input type='text' value={this.state.label} name='new-entity-name'
                onChange={(e) => this.setState({ label: e.target.value })} />
            <ComboDropdown
                options={this.state.allEntityTypes.map((t) => ({ key: t.name, value: t.uid.toString() }))}
                typeName='entity type'
                value={this.state.entityType}
                setValue={(entityType) => this.setState({entityType})}
                createNewValue={noop}
                allowNew={false}
            />
            <button name='cancel-modal' onClick={() => this.props.cancel()}>Cancel</button>
            <button name='create-entity' onClick={this.CreateEntity.bind(this)}>Create Entity</button>
        </Overlay>
        );
    }
};