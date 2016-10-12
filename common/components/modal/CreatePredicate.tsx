/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { Overlay } from '../Overlay';
import { PredicateDescription } from '../fields/PredicateDescription';

interface CreatePredicateProps {
    initialName: string;
    cancel: () => void;
}

interface CreatePredicateState{
    name: string;
    domain: string;
    range: string;
}

export class CreatePredicate extends React.Component<CreatePredicateProps, CreatePredicateState> {

    constructor() {
        super();
        this.state = { name: '', domain: '', range: '' };
    }

    public componentWillMount() {
        this.setState({ name: this.props.initialName });
    }

    public render() {
        return (
        <Overlay>
            <div className='create-predicate-modal'>
                <h3>Create new predicate</h3>
                <input type='text' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
                <PredicateDescription
                    domain={this.state.domain}
                    range={this.state.range}
                    domainChanged={(s) => this.setState({ domain: s })}
                    rangeChanged={(s) => this.setState({ range: s})}
                    mode='editAll' />
                <div className='modal-toolbar'>
                    <button onClick={this.props.cancel}>Cancel</button>
                    <button onClick={this.props.cancel}>Create Predicate</button>
                </div>
            </div>
        </Overlay>
        );
    }
};