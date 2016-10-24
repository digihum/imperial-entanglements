/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';

import { SameAsEditor } from '../fields/SameAsEditor';
import { Loading } from '../Loading';
import { ApiService, AppUrls } from '../../ApiService';

import { Source, ElementSet, Element, SourceElement } from '../../../common/datamodel/datamodel';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';

import { keyBy, Dictionary } from 'lodash';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}

interface SourceEditorProps {
    api: ApiService;
    id: number;
}

interface SourceEditorState {
    source : Source | null;
    metaData: Dictionary<SourceElement> | null;
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

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            source: null,
            dublinCore: null,
            metaData: null
        };
    }

    public componentDidMount() {
        this.loadData(this.props);
    }

    public componentWillReceiveProps(newProps: SourceEditorProps)  {
        this.loadData(newProps);
    }


    public loadData(props: SourceEditorProps) {
        props.api.getItem(Source, AppUrls.source, props.id).then((data) => {
            this.setState({ source: data, metaData: keyBy(data.metaData, 'name') });
        });

        //TODO: make sure this is ALWAYS dublin core
        props.api.getItem(ElementSet, AppUrls.elementSet, 1).then((data) => {
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

            const updatedSource = new Source().deserialize(Object.assign({},
                this.state.source.serialize(), { [field]: value }));

            this.setState({
                source: updatedSource,
                metaData: keyBy(updatedSource.metaData, 'name')
            });
        });
    }

    public updateSourceElement(element: Element, value: string) {

        if (this.state.metaData.hasOwnProperty(element.name)) {
            this.props.api.putItem(SourceElement, AppUrls.sourceElement,
            this.state.metaData[element.name].uid,
                new SourceElement().deserialize({
                    uid: this.state.metaData[element.name].uid,
                    element: this.state.metaData[element.name].element_uid,
                    source: this.props.id,
                    value
                }));
        } else {
            this.props.api.postItem(SourceElement, AppUrls.sourceElement,
                new SourceElement().deserialize({
                    element: element.uid,
                    source: this.props.id,
                    value: value
                }));
        }
    }

    public deleteSource() {
        this.props.api.delItem(Source, AppUrls.source, this.props.id)
        .then(() => {
            window.location = '/';
        });
    }

    public render() {

        if (this.state.source === null || this.state.dublinCore === null) {
            return (<Loading />);
        }

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
                            value={this.state.metaData.hasOwnProperty(element.name) ? (this.state.metaData[element.name].value) : ''}
                            component={EditableParagraph}
                            onChange={(value) => this.updateSourceElement(element, value)}  />
                    </div>
                ))}

                <div>
                    <StringEditableFieldComponent
                        value={this.state.source.sameAs}
                        component={SameAsEditor}
                        onChange={(value) => this.updateSource('sameAs', value)} />
                </div>
            </div>
        );
    }
}