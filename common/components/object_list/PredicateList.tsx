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

import { SearchBar } from '../SearchBar';


interface PredicateListProps {
    api: ApiService;
}

interface PredicateListState {
    entityTypes: EntityType[];
    predicates: Predicate[];
    filterFunc: (p: Predicate) => boolean;
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
            predicates: [],
            filterFunc: () => true
        };
    }

    public componentWillMount() {
        this.loadData();
    }

    public loadData() {
         Promise.all([
            this.props.api.getCollection(EntityType, AppUrls.entity_type, {}),
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
        <div className='workspace-editor'>
            <header className='editor-header predicate'>
                <div className='main-toolbar'>
                    <h2>All Properties <i
                        className='fa fa-plus-circle add button'
                        aria-hidden='true'
                        onClick={this.addNew.bind(this)}
                    ></i></h2>
                </div>
            </header>

            <SearchBar
                getValue={(a: Predicate) => a.name}
                setFilterFunc={(f) => this.setState({ filterFunc: f })}
            />

            <section className='editor-body'>
                <table className='table'>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Label</td>
                            <td>Domain</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.predicates.filter(this.state.filterFunc).map((predicate) => {
                        const entityType = this.state.entityTypes.find((t) => t.uid === predicate.domain);
                        return (
                            <tr key={`predicate-${predicate.uid}`}>
                                <td>{predicate.uid} <AddTabButton
                                    uid={predicate.uid}
                                    tabType='predicate' /></td>
                                <td>{predicate.name}</td>
                                <td>{entityType ? entityType.name : ''}</td>
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