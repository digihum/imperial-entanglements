/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { EntityType, Serializer } from '@digihum/falcon-core';
import { AppUrls } from '../../ApiService';

import { DataController } from '../../stores/DataController';
import { inject, observer } from 'mobx-react';

import * as mousetrap from 'mousetrap';

interface CreateEntityTypeProps {
    dataStore?: DataController;
    complete: (s: string) => void;
    cancel: () => void;
}

interface CreateEntityTypeState {
    internalValue: string;
}

@inject('dataStore')
@observer
export class CreateEntityType extends React.Component<CreateEntityTypeProps, CreateEntityTypeState> {

    private keyboardShortcuts;

    constructor() {
        super();
        this.state = {
            internalValue: ''
        };
    }

    public createEntityType() {
        this.props.dataStore!.postItem(EntityType, AppUrls.entity_type,
            Serializer.fromJson(EntityType, {
                label: this.state.internalValue
            }), {})
        .then(this.props.complete);
    }

    public inputRef(val: HTMLElement | null) {
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.createEntityType.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancel);
        } else {
            this.keyboardShortcuts.unbind('return');
        }
    }

    public render() {
        return (
        <Overlay>
            <h2>Create Entity Type</h2>
            <label className='small'>Name</label>
            <input type='text'
                value={this.state.internalValue}
                ref={this.inputRef.bind(this)}
                onChange={(e) => this.setState({ internalValue: e.target.value })} />
            <button onClick={() => this.props.cancel()} className='pull-left'>Cancel</button>
            <button onClick={this.createEntityType.bind(this)} className='pull-right'>Create Entity Type</button>
        </Overlay>
        );
    }
};
