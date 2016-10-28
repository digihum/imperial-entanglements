/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { omit } from 'lodash';

import { EditableSubfieldProps } from './EditableFieldComponent';

interface SameAsEditorState {
    temporaryValue: string;
    urls: string[];
}

export class SameAsEditor extends React.Component<EditableSubfieldProps<string>, SameAsEditorState> {

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

    public render() {

        return (
        <div>
            <h3>Same as:</h3>
            {this.props.edit ? (
                <div>
                    <input type='text' value={this.state.temporaryValue}
                        onChange={(e) => this.setState({ temporaryValue: e.target.value })} />
                    <i className='fa fa-plus' onClick={this.addItemToList.bind(this)}></i>
                    <button onClick={this.props.acceptChanges}><i className='fa fa-check' aria-hidden='true'></i></button>
                    <button onClick={this.props.cancelChanges}><i className='fa fa-times' aria-hidden='true'></i></button>
                </div>
            ) : (
                <div>
                    <sup>
                        <i className='fa fa-pencil-square-o'
                            aria-hidden='true'
                            onClick={this.props.setEdit}>
                        </i>
                    </sup>
                </div>
            )}
            <ul>
                {this.state.urls.map((url, i) => (
                    <li key={`li-${url}`}><a href={url}>{url}</a> {this.props.edit ? (<i 
                        className='fa fa-times' onClick={this.removeItemFromList.bind(this,i)}></i>) : null}</li>
                ))}
            </ul>
        </div>);
    }
}