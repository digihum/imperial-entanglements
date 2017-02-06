/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Source, Serializer } from '@digihum/falcon-core';
import { AppUrls } from '../../ApiService';

import { DataController } from '../../stores/DataController';
import { inject, observer } from 'mobx-react';

import * as mousetrap from 'mousetrap';

interface CreateSourceProps {
    complete: (s: string) => void;
    cancel: () => void;
    initialValue: string;
    dataStore?: DataController;
}

interface CreateSourceState {
    internalValue: string;
}

@inject('dataStore')
@observer
export class CreateSource extends React.Component<CreateSourceProps, CreateSourceState> {

    private keyboardShortcuts;

    public static defaultProps : Partial<CreateSourceProps> = {
       initialValue: ''
    };

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
        this.props.dataStore!.postItem(Source, AppUrls.source,
            Serializer.fromJson(Source, {
                label: this.state.internalValue
            }), {})
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
                onChange={(e) => this.setState({ internalValue: (e.target as HTMLInputElement).value })} />
            <button onClick={() => this.props.cancel()} className='pull-left'>Cancel</button>
            <button onClick={this.createSource.bind(this)} className='pull-right'>Create Source</button>
        </Overlay>
        );
    }
}
