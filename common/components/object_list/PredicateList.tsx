/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService, AppUrls } from '../../ApiService';
import { Entity, EntityType, Predicate } from '../../../common/datamodel/datamodel';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { noop } from 'lodash';

import { AddTabButton } from '../AddTabButton';

import { showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';


interface PredicateListProps {
    api: ApiService;
}

interface PredicateListState {
    entityTypes: EntityType[];
    predicates: Predicate[];
}

interface ColumnSettings {
    name: string;
    nullable: boolean;

}

export class PredicateList extends React.Component<PredicateListProps, PredicateListState> {

    constructor() {
        super();
        this.state = {
            entityTypes: [],
            predicates: []
        };
    }

    public componentWillMount() {
        this.loadData();
    }

    public loadData() {
         Promise.all([
            this.props.api.getCollection(EntityType, AppUrls.entityType, {}),
            this.props.api.getCollection(Predicate, AppUrls.predicate, {})
        ])
        .then(([entityTypes, predicates]) => this.setState({ entityTypes, predicates }));
    }

    public addNew() {
        const a : ModalDefinition = {
            name: 'predicate',
            complete: () => {
                this.loadData();
            },
            cancel: () => { console.log('cancel')},
            settings: {
                initialName: ''
            }
        };

        showModal.dispatch(a);
    }

    public render() {
        return (
        <section>
            <h2>All Predicates <i
                className='fa fa-plus-circle add-button'
                aria-hidden='true'
                onClick={this.addNew.bind(this)}
            ></i></h2>
            <table className='table'>
                <thead>
                    <tr>
                        <td>#</td>
                        <td>Label</td>
                        <td>Domain</td>
                    </tr>
                </thead>
                <tbody>
                {this.state.predicates.map((predicate) => {
                    const entityType = this.state.entityTypes.find((t) => t.uid === predicate.domain);
                    return (
                        <tr key={`predicate-${predicate.uid}`}>
                            <td>{predicate.uid} <AddTabButton
                                title={predicate.name}
                                subtitle={`Predicate ${predicate.uid}`}
                                url={`/${AppUrls.predicate}/${predicate.uid}`}
                                tabType='predicate' /></td>
                            <td>{predicate.name}</td>
                            <td>{entityType ? entityType.name : ''}</td>
                        </tr>
                    )}
                )}
                </tbody>
            </table>
        </section>
        );
    }
}