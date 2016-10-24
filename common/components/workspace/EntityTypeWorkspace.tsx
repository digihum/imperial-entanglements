/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';

import { SameAsEditor } from '../fields/SameAsEditor';
import { Loading } from '../Loading';
import { ApiService, AppUrls } from '../../ApiService';

import { EntityType } from '../../../common/datamodel/datamodel';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';
import { EditableComboDropdown } from '../fields/EditableComboDropdown';
import { ComboDropdownOption } from '../ComboDropdown';

import { keyBy, Dictionary } from 'lodash';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}
class ComboEditableFieldComponent extends EditableFieldComponent<ComboDropdownOption> {}

interface EntityTypeWorkspaceProps {
    api: ApiService;
    id: number;
}

interface EntityTypeWorkspaceState {
    entityType : EntityType | null;
    potentialParents: EntityType[] | null;
}

export class EntityTypeWorkspace extends React.Component<EntityTypeWorkspaceProps, EntityTypeWorkspaceState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            entityType: null,
            potentialParents: []
        };
    }

    public componentDidMount() {
        this.loadData(this.props);
    }

    public componentWillReceiveProps(newProps: EntityTypeWorkspaceProps) {
        this.loadData(newProps);
    }

    public loadData(props: EntityTypeWorkspaceProps) {
        Promise.all([
            props.api.getItem(EntityType, AppUrls.entityType, props.id),
            props.api.getCollection(EntityType, AppUrls.entityType, {})
        ])
        .then(([entityType, potentialParents]) => {
            this.setState({ entityType, potentialParents });
        });
    }

    public update(data: any) {
        this.props.api.patchItem(EntityType, AppUrls.entityType, this.props.id, data)
        .then(() => this.setState({ entityType: Object.assign({}, this.state.entityType, data)}));
    }

    public render() {

        const entityType = this.state.entityType;

        if (entityType === null) {
            return (<Loading />);
        }

        let parentName = '';
        if (this.state.potentialParents !== null && entityType.parent !== undefined) {
            const found = this.state.potentialParents.find((par) => par.uid === entityType.parent);
            if (found !== undefined) {
                parentName = found.name;
            }
        }

        return (
            <div className='workspace-editor'>

                <StringEditableFieldComponent
                    value={this.state.entityType.name}
                    component={EditableHeader}
                    onChange={(value) => this.update({'name': value})}  />

                <span>Parent:</span>
                <ComboEditableFieldComponent
                    value={{key: parentName, value: entityType.parent}}
                    component={EditableComboDropdown}
                    onChange={(value) => this.update({'parent': value.value})}
                    additionalProps={{ comboSettings: {
                        options: this.state.potentialParents.map((par) => ({ key: par.name, value: par.uid})),
                        typeName: 'EntityType'
                    }}} />

                <StringEditableFieldComponent
                    value={this.state.entityType.description}
                    component={EditableParagraph}
                    onChange={(value) => this.update({'description': value})}  />

                <div>
                    <StringEditableFieldComponent
                        value={this.state.entityType.sameAs}
                        component={SameAsEditor}
                        onChange={(value) => this.update({'sameAs': value})} />
                </div>
            </div>
        );
    }
}