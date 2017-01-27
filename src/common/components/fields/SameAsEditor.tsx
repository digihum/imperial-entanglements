/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
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
            urls: props.value === null || props.value!.length === 0 ? [] : props.value!.split(',')
        };
    }

    public componentWillReceiveProps(props: EditableSubfieldProps<string>) {
        this.setState({
            temporaryValue: '',
            urls: props.value === null || props.value!.length === 0 ? [] : props.value!.split(',')
        });
    }

    public addItemToList() {
        if (this.state.temporaryValue.length === 0) {
            return;
        }
        this.setState({ urls: this.state.urls.concat([this.state.temporaryValue]), temporaryValue: ''},
            () => this.props.onChange!(this.state.urls.join(',')));
    }

    public removeItemFromList(itemId: number) {
        this.setState({
            urls: this.state.urls.filter((val, i) => i !== itemId)
        }, () => this.props.onChange!(this.state.urls.join(',')));
    }

    public setupKeyboardShortcuts(val: null | HTMLElement ) {
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.addItemToList.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancelChanges);
            this.keyboardShortcuts.bind('ctrl+s', (e) => {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    // internet explorer
                    e.returnValue = false;
                }
                this.props.acceptChanges!();
            });
        } else {
            this.keyboardShortcuts.unbind('return');
            this.keyboardShortcuts.unbind('escape');
            this.keyboardShortcuts.unbind('ctrl+s');
        }
    }

    public render() {

        return (
        <div className='same-as-box'>
            <label className='small'>Same As {!this.props.edit ? (
                <sup>
                    <i className='fa fa-pencil-square-o'
                        title='Edit'
                        aria-hidden='true'
                        onClick={this.props.setEdit}>
                    </i>
                </sup>
            ) : null }</label>
            {this.props.edit ? (
                <div className='edit-group'>
                    <button onClick={this.props.acceptChanges}><i className='fa fa-check' aria-hidden='true'></i></button>
                    <button onClick={this.props.cancelChanges}><i className='fa fa-times' aria-hidden='true'></i></button>
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
                    <li key={`li-${url}`}><a target='_blank' href={url}>{url}</a> {this.props.edit ? (<i
                        className='fa fa-times close-button'
                        onClick={this.removeItemFromList.bind(this,i)}></i>) : null}</li>
                ))}
            </ul>
        </div>);
    }
}
