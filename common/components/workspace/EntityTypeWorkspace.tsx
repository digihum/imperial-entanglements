/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';

import { SameAsEditor } from '../SameAsEditor';
import { Loading } from '../Loading';
import { ApiService, AppUrls } from '../../ApiService';

import { EntityType } from '../../../common/datamodel/datamodel';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';

import { keyBy, Dictionary } from 'lodash';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}

interface EntityTypeWorkspaceProps {
    api: ApiService;
    id: number;
}

interface EntityTypeWorkspaceState {
    entityType : EntityType | null;
}

export class EntityTypeWorkspace extends React.Component<EntityTypeWorkspaceProps, EntityTypeWorkspaceState> {

    constructor() {
        super();
        this.state = {
            entityType: null
        };
    }

    public componentDidMount() {
        this.props.api.getItem(EntityType, AppUrls.entityType, this.props.id).then((entityType) => {
            this.setState({ entityType });
        });
    }

    // public updateSource(field: string, value: string) {

    //     if (this.state.source === null) {
    //         console.warn('Tried to edit unready source');
    //         return;
    //     }

    //     this.props.api.patchItem(Source, AppUrls.source, this.state.source.uid, { [field]: value })
    //     .then((success) => {

    //         const updatedSource = new Source().deserialize(Object.assign({},
    //             this.state.source.serialize(), { [field]: value }));

    //         this.setState({
    //             source: updatedSource,
    //             metaData: keyBy(updatedSource.metaData, 'name')
    //         });
    //     });
    // }

    // public updateSourceElement(element: Element, value: string) {

    //     if (this.state.metaData.hasOwnProperty(element.name)) {
    //         this.props.api.patchItem(SourceElement, AppUrls.sourceElement,
    //         this.state.metaData[element.name].uid,
    //             new SourceElement().deserialize({
    //                 value: value
    //             }));
    //     } else {
    //         this.props.api.postItem(SourceElement, AppUrls.sourceElement,
    //             new SourceElement().deserialize({
    //                 element: element.uid,
    //                 source: this.props.id,
    //                 value: value
    //             }));
    //     }
    // }

    // public deleteSource() {
    //     this.props.api.delItem(Source, AppUrls.source, this.props.id)
    //     .then(() => {
    //         window.location = '/';
    //     });
    // }

    public update(data: any) {
        this.props.api.patchItem(EntityType, AppUrls.entityType, this.props.id, data)
        .then(() => this.setState({ entityType: Object.assign({}, this.state.entityType, data)}));
    }

    public render() {

        if (this.state.entityType === null) {
            return (<Loading />);
        }

        return (
            <div className='workspace-editor'>

                <StringEditableFieldComponent
                    value={this.state.entityType.name}
                    component={EditableHeader}
                    onChange={(value) => this.update({'name': value})}  />

                <div>
                    <SameAsEditor sameAsString='a,b,c,woot,list' />
                </div>
            </div>
        );
    }
}