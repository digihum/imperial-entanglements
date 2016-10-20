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