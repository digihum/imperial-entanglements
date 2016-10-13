/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { PredicateDescription } from '../fields/PredicateDescription';
import { Predicate, EntityType } from '../../../common/datamodel/datamodel';
import { literalTypes } from '../../literalTypes';
import { ApiService, AppUrls } from '../../ApiService';
import { ComboDropdownOption } from '../ComboDropdown';


interface CreatePredicateProps {
    initialName: string;
    cancel: () => void;
    complete: (newId: number) => void;
    api: ApiService;
    initialDomain?: number;
}

interface CreatePredicateState {
    name: string;
    domain: ComboDropdownOption;
    range: ComboDropdownOption;
    domainOptions: ComboDropdownOption[];
    rangeOptions: ComboDropdownOption[];
}

export class CreatePredicate extends React.Component<CreatePredicateProps, CreatePredicateState> {

    constructor() {
        super();
        this.state = {
            name: '',
            domain: {key: '', value: ''},
            range: {key: '', value: ''},
            domainOptions: [],
            rangeOptions: []
        };
    }

    public componentWillMount() {
        this.setState({ name: this.props.initialName });
    }

    public componentDidMount() {
        if (this.props.initialDomain !== undefined) {
            this.props.api.getItem(EntityType, AppUrls.entityType, this.props.initialDomain)
            .then((result) => {
 
                if (result.uid === null) {
                    throw new Error('Unexpected null uid');
                }

                this.setState({ domainOptions: [
                    { key: result.name, value: result.uid.toString()}
                ].concat(result.parents.map((entityType) => {
                    if (entityType.uid === null) {
                        throw new Error('Unexpected null uid');
                    }
                    return { key: entityType.name, value: entityType.uid.toString() }
                }))});
            });
        }

        this.props.api.getCollection(EntityType, AppUrls.entityType, {})
        .then((results) => {
            const entityTypeMap : ComboDropdownOption[] = results.map((entityType) => {
                if (entityType.uid === null) {
                    throw new Error('Unexpected null uid');
                }
                return { key: entityType.name, value: entityType.uid.toString() }
            });

            if (this.props.initialDomain === undefined) {
                this.setState({ domainOptions: entityTypeMap });
            }

            this.setState({
                rangeOptions:  literalTypes.map((lit) => ({ key: lit.name, value: lit.name, meta: 'literal'})).concat(entityTypeMap)
            });
        });
    }

    public create() {
        this.props.api.postItem(Predicate, AppUrls.predicate, new Predicate().deserialize({
            name: this.state.name,
            domain: this.state.domain.value,
            range: this.state.range.value,
            rangeIsReference: this.state.range.meta !== 'literal'
        })).then(this.props.complete);
    }

    public render() {
        return (
        <Overlay>
            <div className='create-predicate-modal'>
                <h3><i className='fa fa-plus' aria-hidden='true'></i> Create new predicate</h3>
                <input type='text' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
                <PredicateDescription
                    domain={this.state.domain}
                    range={this.state.range}
                    domainChanged={(s) => this.setState({ domain: s })}
                    rangeChanged={(s) => this.setState({ range: s })}
                    domainOptions={this.state.domainOptions}
                    rangeOptions={this.state.rangeOptions}
                    mode='editAll' />
                <div className='modal-toolbar'>
                    <button onClick={this.props.cancel}>Cancel</button>
                    <button onClick={this.create.bind(this)}>Create Predicate</button>
                </div>
            </div>
        </Overlay>
        );
    }
};