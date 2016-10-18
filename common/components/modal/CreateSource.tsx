/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Source } from '../../../common/datamodel/datamodel';
import { ApiService, AppUrls } from '../../ApiService';


interface CreateSourceProps {
    api: ApiService;
    create: (s: string) => void;
    close: () => void;
}

interface CreateSourceState {
    internalValue: string;
}

export class CreateSource extends React.Component<CreateSourceProps, CreateSourceState> {

    constructor() {
        super();
        this.state = {
            internalValue: ''
        };
    }

    public createSource() {
        this.props.api.postItem(Source, AppUrls.source,
            new Source().deserialize({
                name: this.state.internalValue
            }))
        .then(this.props.create);
    }

    public render() {
        return (
        <Overlay>
            <input type='text' value={this.state.internalValue}
                onChange={(e) => this.setState({ internalValue: e.target.value })} />
            <button onClick={() => this.props.close()}>Cancel</button>
            <button onClick={() => this.createSource.bind(this)}>Create Source</button>
        </Overlay>
        );
    }
};