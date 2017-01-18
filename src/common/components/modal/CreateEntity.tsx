/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Entity, EntityType, Serializer } from 'falcon-core';
import { AppUrls } from '../../ApiService';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';

import { noop } from 'lodash';

import { DataController } from '../../stores/DataController';
import { inject, observer } from 'mobx-react';

interface CreateEntityProps {
    dataStore?: DataController;
    complete: (s: string) => void;
    cancel: () => void;
    initialName?: string;
    initialType?: number;
}

interface CreateEntityState {
    label: string;
    entityType: ComboDropdownOption;
    allEntityTypes: EntityType[];
}

@inject('dataStore')
@observer
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
        this.props.dataStore!.getCollection(EntityType, AppUrls.entity_type, {})
        .then((allEntityTypes) => {
            if (this.props.initialType !== undefined) {
                const initialType = allEntityTypes.find((et) => et.uid === this.props.initialType);

                if (initialType === undefined) {
                  throw new Error('Invalid initial type');
                }

                if (initialType.uid === null) {
                  throw new Error('found entity type with null uid');
                }

                this.setState({
                    entityType:  { key: initialType.label, value: initialType.uid.toString() }
                })
            }
            this.setState({ allEntityTypes });
        });
    }

    public createEntity() {
        this.props.dataStore!.postItem(Entity, AppUrls.entity,
            Serializer.fromJson(Entity, {
                label: this.state.label,
                entityType: this.state.entityType.value
            }), {})
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
                onChange={(e) => this.setState({ label: (e.target as HTMLInputElement).value })} />

            <label className='small'>Type</label>
            <ComboDropdown
                options={this.state.allEntityTypes.map((t) => ({ key: t.label, value: t.uid.toString() }))}
                typeName='entity type'
                value={this.state.entityType}
                setValue={(entityType) => this.setState({entityType})}
                createNewValue={noop}
                allowNew={false}
            />
            <button name='cancel-modal' onClick={() => this.props.cancel()} className='pull-left'>Cancel</button>
            <button name='create-entity' onClick={this.createEntity.bind(this)} className='pull-right'>Create Entity</button>
        </Overlay>
        );
    }
};
