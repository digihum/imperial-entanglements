/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Entity, EntityType, Serializer } from 'falcon-core';
import { ApiService, AppUrls } from '../../ApiService';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';

import { noop } from 'lodash';

interface CreateEntityProps {
    api: ApiService;
    complete: (s: string) => void;
    cancel: () => void;
    initialName?: string,
    initialType?: number
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
        .then((allEntityTypes) => {
            if (this.props.initialType !== undefined) {
                const initialType = allEntityTypes.find((et) => et.uid === this.props.initialType);
                this.setState({
                    entityType:  { key: initialType.name, value: initialType.uid.toString() }
                })
            }
            this.setState({ allEntityTypes });
        });
    }

    public CreateEntity() {
        this.props.api.postItem(Entity, AppUrls.entity,
            Serializer.fromJson(Entity, {
                label: this.state.label,
                entityType: this.state.entityType.value
            }))
        .then(this.props.complete);
    }

    public render() {
        return (
        <Overlay>
            <h2>Create Entity</h2>

            <label className='small'>Label</label>
            <input type='text'
                value={this.state.label}
                ref={(a) => { if(a !== null) a.focus(); }}
                name='new-entity-name'
                className='gap'
                onChange={(e) => this.setState({ label: e.target.value })} />

            <label className='small'>Type</label>
            <ComboDropdown
                options={this.state.allEntityTypes.map((t) => ({ key: t.name, value: t.uid.toString() }))}
                typeName='entity type'
                value={this.state.entityType}
                setValue={(entityType) => this.setState({entityType})}
                createNewValue={noop}
                allowNew={false}
            />
            <button name='cancel-modal' onClick={() => this.props.cancel()} className='pull-left'>Cancel</button>
            <button name='create-entity' onClick={this.CreateEntity.bind(this)} className='pull-right'>Create Entity</button>
        </Overlay>
        );
    }
};
