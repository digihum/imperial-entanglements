/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

import { SameAsEditor } from '../SameAsEditor';
import { Loading } from '../Loading';
import { ApiService, AppUrls } from '../../ApiService';

import { Predicate } from '../../../common/datamodel/datamodel';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}

interface PredicateEditorProps {
    api: ApiService;
    id: number;
}

interface PredicateEditorState {
    predicate : Predicate | null;
}

// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them 
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
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

    public updatePredicate(field: string, value: string) {

        if (this.state.predicate === null) {
            console.warn('Tried to edit unready predicate');
            return;
        }

        this.props.api.patchItem(Predicate, AppUrls.predicate, this.state.predicate.uid, { [field]: value })
        .then((success) => {
            this.setState({
                predicate: new Predicate().deserialize(Object.assign({}, this.state.predicate.serialize(), { [field]: value }))
            });
        });
    }

    public render() {

        if (this.state.predicate === null) {
            return (<Loading />);
        }

        return (
            <div className='workspace-editor'>

                <StringEditableFieldComponent
                    value={this.state.predicate.name}
                    component={EditableHeader}
                    onChange={(value) => this.updatePredicate('name', value)}  />

                <StringEditableFieldComponent
                    value={this.state.predicate.description}
                    component={EditableParagraph}
                    onChange={(value) => this.updatePredicate('description', value)}  />

                <div className='predicate-function-description'>
                    <div className='domain'>{this.state.predicate.domain}</div>
                    <div className='arrow'><i className='fa fa-long-arrow-right' aria-hidden='true'></i></div>
                    <div className='range'>{this.state.predicate.range}</div>
                </div>
                <div>
                    <SameAsEditor sameAsString='a,b,c,woot,list' />
                </div>
            </div>
        );
    }
}