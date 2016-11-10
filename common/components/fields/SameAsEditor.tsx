/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { omit } from 'lodash';

import * as mousetrap from 'mousetrap';

import { EditableSubfieldProps } from './EditableFieldComponent';

interface SameAsEditorState {
    temporaryValue: string;
    urls: string[];
}

export class SameAsEditor extends React.Component<EditableSubfieldProps<string>, SameAsEditorState> {

    private keyboardShortcuts;

    constructor(props: EditableSubfieldProps<string>) {
        super();
        this.state = {
            temporaryValue: '',
            urls: props.value === null ? [] : props.value.split(',')
        };
    }

    public componentWillReceiveProps(props: EditableSubfieldProps<string>) {
        this.setState({
            temporaryValue: '',
            urls: props.value === null ? [] : props.value.split(',')
        })
    }

    public addItemToList() {
        if (this.state.temporaryValue.length === 0) {
            return;
        }
        this.setState({ urls: this.state.urls.concat([this.state.temporaryValue]), temporaryValue: ''},
            () => this.props.onChange(this.state.urls.join(',')));
    }

    public removeItemFromList(itemId: number) {
        this.setState({
            urls: this.state.urls.filter((val, i) => i !== itemId)
        }, () => this.props.onChange(this.state.urls.join(',')));
    }

    public setupKeyboardShortcuts(val: null | HTMLElement ) {
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.addItemToList.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancelChanges);
        } else {
            this.keyboardShortcuts.unbind('return');
            this.keyboardShortcuts.unbind('escape');
        }
    }

    public render() {

        return (
        <div className='same-as-box'>
            <h3>Same as: {!this.props.edit ? (
                <sup>
                    <i className='fa fa-pencil-square-o'
                        aria-hidden='true'
                        onClick={this.props.setEdit}>
                    </i>
                </sup>
            ) : (
                <span>
                    <button onClick={this.props.acceptChanges}><i className='fa fa-check' aria-hidden='true'></i></button>
                    <button onClick={this.props.cancelChanges}><i className='fa fa-times' aria-hidden='true'></i></button>
                </span>
            )}</h3>
            {this.props.edit ? (
                <div>
                    <div className='input-addon-formgroup'>
                        <input type='text' value={this.state.temporaryValue}
                            ref={this.setupKeyboardShortcuts.bind(this)}
                            onChange={(e) => this.setState({ temporaryValue: e.target.value })}
                            className='form-control with-addon' />
                        <span className='input-addon-icon right button' onClick={this.addItemToList.bind(this)}>
                            <i className='fa fa-plus'></i>
                        </span>
                    </div>
                </div>
            ) : null}
            <ul className='same-as-list'>
                {this.state.urls.map((url, i) => (
                    <li key={`li-${url}`}><a href={url}>{url}</a> {this.props.edit ? (<i 
                        className='fa fa-times close-button'
                        onClick={this.removeItemFromList.bind(this,i)}></i>) : null}</li>
                ))}
            </ul>
        </div>);
    }
}