/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Entity, EntityType, Serializer } from '@digihum/falcon-core';
import { AppUrls } from '../../ApiService';
import { NumberComboDropdown, ComboDropdownOption } from '../ComboDropdown';

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
    entityType: ComboDropdownOption<number> | null;
    allEntityTypes: EntityType[];
}

@inject('dataStore')
@observer
export class CreateEntity extends React.Component<CreateEntityProps, CreateEntityState> {

    constructor() {
        super();
        this.state = {
            label: '',
            entityType: { key: '', value: null},
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
                    entityType:  { key: initialType.label, value: initialType.uid }
                })
            }
            this.setState({ allEntityTypes });
        });
    }

    public createEntity() {

      if (this.state.entityType === null) {
        throw new Error('Cannot create entity with null type');
      }

        this.props.dataStore!.postItem(Entity, AppUrls.entity,
            Serializer.fromJson(Entity, {
                label: this.state.label,
                entityType: this.state.entityType.value
            }), {})
        .then((a) => this.props.complete(a[0].toString()));
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
            <NumberComboDropdown
                options={this.state.allEntityTypes.map((t) => ({ key: t.label, value: t.uid }))}
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
