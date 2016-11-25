/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Source } from '../../../common/datamodel/datamodel';
import { ApiService, AppUrls } from '../../ApiService';

import * as mousetrap from 'mousetrap';

interface CreateSourceProps {
    api: ApiService;
    complete: (s: string) => void;
    cancel: () => void;
    initialValue: string;
}

interface CreateSourceState {
    internalValue: string;
}

export class CreateSource extends React.Component<CreateSourceProps, CreateSourceState> {

    private keyboardShortcuts;

    public static defaultProps : CreateSourceProps = {
       initialValue: ''
    }

    constructor() {
        super();
        this.state = {
            internalValue: ''
        };
    }

    public componentWillMount() {
        this.setState({ internalValue: this.props.initialValue});
    }

    public createSource() {
        this.props.api.postItem(Source, AppUrls.source,
            new Source().deserialize({
                name: this.state.internalValue
            }))
        .then(this.props.complete);
    }

    public inputRef(val: HTMLElement | null) {
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.createSource.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancel);
        } else {
            this.keyboardShortcuts.unbind('return');
            this.keyboardShortcuts.unbind('escape');
        }
    }

    public render() {
        return (
        <Overlay>
            <h2>Create Source</h2>
            <label className='small'>Name</label>
            <input type='text'
                value={this.state.internalValue}
                ref={this.inputRef.bind(this)}
                onChange={(e) => this.setState({ internalValue: e.target.value })} />
            <button onClick={() => this.props.cancel()} className='pull-left'>Cancel</button>
            <button onClick={this.createSource.bind(this)} className='pull-right'>Create Source</button>
        </Overlay>
        );
    }
}