/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService, AppUrls } from '../../ApiService';
import { EntityType } from '../../../common/datamodel/datamodel';

import { AddTabButton } from '../AddTabButton';

import { showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';

interface EntityTypeListProps {
    api: ApiService;
}

interface EntityTypeListState {
    entityTypes: EntityType[];
}

export class EntityTypeList extends React.Component<EntityTypeListProps, EntityTypeListState> {

    constructor() {
        super();
        this.state = {
            entityTypes: []
        };
    }

    public componentWillMount() {
        this.loadData();
    }

    public loadData() {
        Promise.all([
            this.props.api.getCollection(EntityType, AppUrls.entity_type, {})
        ])
        .then(([entityTypes]) => this.setState({ entityTypes }));
    }

    public addNew() {
        const a : ModalDefinition = {
            name: 'entity_type',
            complete: () => {
                this.loadData();
            },
            cancel: () => { console.log('cancel')},
            settings: {}
        };

        showModal.dispatch(a);
    }


    public render() {
        return (
        <div className='workspace-editor'>

            <header className='editor-header entity_type'>
                <div className='main-toolbar'>
                    <h2>All Entity Types <i
                        className='fa fa-plus-circle add button'
                        aria-hidden='true'
                        onClick={this.addNew.bind(this)}
                    ></i></h2>
                </div>
            </header>

            <section className='editor-body'>
                <table className='table'>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Label</td>
                            <td>Type</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.entityTypes.map((entityType) => {
                        return (
                            <tr key={`entityType-${entityType.uid}`}>
                                <td>{entityType.uid} <AddTabButton
                                    uid={entityType.uid}
                                    tabType='entity_type' /></td>
                                <td>{entityType.name}</td>
                                <td></td>
                            </tr>
                        )}
                    )}
                    </tbody>
                </table>
            </section>
        </div>
        );
    }
}