/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

import { Loading } from '../Loading';

import { RecordsEditor } from '../entity_editor/records/RecordsEditor';
import { ApiService, AppUrls } from '../../ApiService';

import { Entity, Predicate } from '../../../common/datamodel/datamodel';

interface EntityEditorProps {
    api: ApiService;
    id: number;
}

interface EntityEditorState {
    entity : Entity | null;
    predicates : Predicate[] | null;
}

// What can I do?
// Entity Operations
// - Delete the entity
// - Merge the entity
// - Split the entity
// - Add 'same-as-ses' to the entity
// Records 
// - Order records by type, source and date
// - Add new records
export class EntityEditorWorkspace extends React.Component<EntityEditorProps, EntityEditorState> {

    constructor() {
        super();
        this.state = {
            entity: null,
            predicates: null
        };
    }

    public componentDidMount() {

        this.props.api.getItem(Entity, AppUrls.entity, this.props.id).then((data) => {
            this.setState({ entity: data });
            this.props.api.getCollection(Predicate, AppUrls.predicate, { domain: data.entityType})
            .then((predicateData) => {
                this.setState({ predicates: predicateData });
            });
        });
    }

    public render() {

        if (this.state.entity === null || this.state.predicates === null) {
            return (<Loading />);
        }

        return (
            <div className='workspace-editor'>
                <h2>Predicates <i className='fa fa-plus-circle' aria-hidden='true'></i></h2>
                <RecordsEditor dimension='predicates' entityExists={true} id={this.props.id} api={this.props.api} />
            </div>
        );
    }
}