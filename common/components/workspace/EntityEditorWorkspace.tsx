/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

import { Loading } from '../Loading';

import { RecordsEditor } from '../entity_editor/RecordsEditor';
import { ApiService, AppUrls } from '../../ApiService';

import { Entity, Predicate } from '../../../common/datamodel/datamodel';

import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { CreatePredicate } from '../modal/CreatePredicate';

interface EntityEditorProps {
    api: ApiService;
    id: number;
}

interface EntityEditorState {
    entity : Entity | null;
    predicates : Predicate[] | null;
    comboValue: ComboDropdownOption;
    comboSearchValue: string;
    creatingPredicate: boolean;
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
// - Adding a new predicate creates a new record with the 
//   entity set, the predicate set, the score set to 3, the period set to null, source set to null
//   it also creates a blank entry in the records sub table based on the range of the predicate.
// - New predicates must have a name. The domain is set to the current entitytype but can be changed
//   to one of its parents. The range MUST be set.
export class EntityEditorWorkspace extends React.Component<EntityEditorProps, EntityEditorState> {

    constructor() {
        super();
        this.state = {
            entity: null,
            predicates: null,
            comboValue: { key: 'test', value: ''},
            creatingPredicate: false,
            comboSearchValue: ''
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

    public setComboValue(opt: ComboDropdownOption) {
        this.setState({ comboValue: opt });
    }

    public render() {

        if (this.state.entity === null || this.state.predicates === null) {
            return (<Loading />);
        }

        const options = this.state.predicates.map((pred) => ({ key: pred.name, value: pred.name}));

        return (
            <div className='workspace-editor'>
                <h2>Predicates <i className='fa fa-plus-circle' aria-hidden='true'></i></h2>
                <div>
                    <label>Add new predicate:</label>
                    <ComboDropdown
                        options={options}
                        typeName='predicate'
                        value={this.state.comboValue}
                        setValue={this.setComboValue.bind(this)}
                        createNewValue={(s) => this.setState({ creatingPredicate: true, comboSearchValue: s})}
                     />
                </div>
                {this.state.creatingPredicate ?
                    (<CreatePredicate
                        initialName={this.state.comboSearchValue}
                        cancel={() => this.setState({creatingPredicate: false})}
                        api={this.props.api}
                        initialDomain={this.state.entity.entityType}
                    />) : null}
                <RecordsEditor dimension='predicates' entityExists={true} id={this.props.id} api={this.props.api} />
            </div>
        );
    }
}