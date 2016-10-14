/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';

import { SameAsEditor } from '../SameAsEditor';
import { Loading } from '../Loading';
import { ApiService, AppUrls } from '../../ApiService';

import { Source, ElementSet, Element } from '../../../common/datamodel/datamodel';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';

import { keyBy } from 'lodash';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}

interface SourceEditorProps {
    api: ApiService;
    id: number;
}

interface SourceEditorState {
    source : Source | null;
    dublinCore: ElementSet | null;
}

// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them 
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
export class SourceEditorWorkspace extends React.Component<SourceEditorProps, SourceEditorState> {

    constructor() {
        super();
        this.state = {
            source: null,
            dublinCore: null
        };
    }

    public componentDidMount() {
        this.props.api.getItem(Source, AppUrls.source, this.props.id).then((data) => {
            this.setState({ source: data });
        });

        //TODO: make sure this is ALWAYS dublin core
        this.props.api.getItem(ElementSet, AppUrls.elementSet, 1).then((data) => {
            this.setState({ dublinCore: data });
        });
    }

    public updateSource(field: string, value: string) {

        if (this.state.source === null) {
            console.warn('Tried to edit unready source');
            return;
        }

        this.props.api.patchItem(Source, AppUrls.source, this.state.source.uid, { [field]: value })
        .then((success) => {
            this.setState({
                source: new Source().deserialize(Object.assign({}, this.state.source.serialize(), { [field]: value }))
            });
        });
    }

    public updateSourceElement(element: Element, value: string) {

    }

    public render() {

        if (this.state.source === null || this.state.dublinCore === null) {
            return (<Loading />);
        }

        const metaDataValues = keyBy(this.state.source.metaData, 'name');

        return (
            <div className='workspace-editor'>

                <StringEditableFieldComponent
                    value={this.state.source.name}
                    component={EditableHeader}
                    onChange={(value) => this.updateSource('name', value)}  />

                {this.state.dublinCore.elements.map((element) => (
                    <div key={`${element.name}-edit`}>
                        <h5 className='section-header'>{element.name} <small><a href={element.url}>{element.uri}</a></small></h5>
                        <p className='element-description'>{element.description}</p>
                         <StringEditableFieldComponent
                            value={metaDataValues.hasOwnProperty(element.name) ? (metaDataValues[element.name].value) : ''}
                            component={EditableParagraph}
                            onChange={(value) => this.updateSourceElement(element, value)}  />
                    </div>
                ))}

                <div>
                    <SameAsEditor sameAsString='a,b,c,woot,list' />
                </div>
            </div>
        );
    }
}