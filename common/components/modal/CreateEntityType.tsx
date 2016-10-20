/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { EntityType } from '../../../common/datamodel/datamodel';
import { ApiService, AppUrls } from '../../ApiService';


interface CreateEntityTypeProps {
    api: ApiService;
    complete: (s: string) => void;
    cancel: () => void;
}

interface CreateEntityTypeState {
    internalValue: string;
}

export class CreateEntityType extends React.Component<CreateEntityTypeProps, CreateEntityTypeState> {

    constructor() {
        super();
        this.state = {
            internalValue: ''
        };
    }

    public createEntityType() {
        this.props.api.postItem(EntityType, AppUrls.entityType,
            new EntityType().deserialize({
                name: this.state.internalValue
            }))
        .then(this.props.complete);
    }

    public render() {
        return (
        <Overlay>
            <input type='text' value={this.state.internalValue}
                onChange={(e) => this.setState({ internalValue: e.target.value })} />
            <button onClick={() => this.props.cancel()}>Cancel</button>
            <button onClick={this.createEntityType.bind(this)}>Create Entity Type</button>
        </Overlay>
        );
    }
};