/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

import { SameAsEditor } from '../SameAsEditor';
import { Loading } from '../Loading';
import { ApiService, AppUrls } from '../../ApiService';

import { Predicate } from '../../datamodel/Predicate';

interface PredicateEditorProps {
    api: ApiService;
    id: number;
}

interface PredicateEditorState {
    predicate : Predicate | null;
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
export class PredicateEditorWorkspace extends React.Component<PredicateEditorProps, PredicateEditorState> {

    constructor() {
        super();
        this.state = {
            predicate: null
        };
    }

    public componentDidMount() {

        this.props.api.getItem(Predicate, AppUrls.predicate, this.props.id).then((data) => {
            this.setState({ predicate: data });
        });
    }

    public render() {

        if (this.state.predicate === null) {
            return (<Loading />);
        }

        return (
            <div className='workspace-editor'>
                <h2>{this.state.predicate.name} {this.state.predicate.readonly ? (<i className='fa fa-lock'></i>) : null}</h2>
                <p>{this.state.predicate.description}</p>
                <div className='predicate-function-description'>
                    <div className='domain'>{this.state.predicate.domain}</div>
                    <div className='arrow'><i className='fa fa-long-arrow-right' aria-hidden='true'></i></div>
                    <div className='range'>{this.state.predicate.range}Any</div>
                </div>
                <div>
                    <SameAsEditor sameAsString='a,b,c,woot,list' />
                </div>
            </div>
        );
    }
}