/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { omit } from 'lodash';

interface SameAsEditorProps {
    sameAsString: string;
}

interface SameAsEditorState {
    temporaryValue: string;
    urls: string[];
}

export class SameAsEditor extends React.Component<SameAsEditorProps, SameAsEditorState> {

    constructor(props: SameAsEditorProps) {
        super();
        this.state = {
            temporaryValue: '',
            urls: props.sameAsString.split(',')
        };
    }

    public addItemToList() {
        if (this.state.temporaryValue.length === 0) {
            return;
        }
        this.setState({ urls: this.state.urls.concat([this.state.temporaryValue]), temporaryValue: ''});
    }

    public removeItemFromList(itemId: number) {
        this.setState({
            urls: this.state.urls.filter((val, i) => i !== itemId);
        })
    }

    public render() {

        return (
        <div>
            <h3>Same as:</h3>
            <div>
                <input type='text' value={this.state.temporaryValue}
                    onChange={(e) => this.setState({ temporaryValue: e.target.value })} />
                <i className='fa fa-plus' onClick={this.addItemToList.bind(this)}></i>
            </div>
            <ul>
                {this.state.urls.map((url, i) => (
                    <li key={`li-${url}`}><a href={url}>{url}</a> <i 
                        className='fa fa-times' onClick={this.removeItemFromList.bind(this,i)}></i></li>
                ))}
            </ul>
        </div>);
    }
}