/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { ApiService } from '../../ApiService';
import { RecordsEditor } from './records/RecordsEditor';

interface EntityEditorProps {
    id: number;
	service: ApiService;
}

interface EntityEditorState {
    dimension: 'predicates' | 'time' | 'source';
}

export class EntityEditor extends React.Component<EntityEditorProps, EntityEditorState> {

    constructor() {
        super();
        this.state = {
            dimension: 'predicates'
        };
    }

    public render() {
        const woo = 1;
        if (woo === 2) {
            return (
                <div>
                    <section id='select-entity-type'>
                        <i className='fa fa-question-circle big-icon' aria-hidden='true'></i>
                        <form>
                            <label>Please select a type for this entity:</label>
                            <select>
                                <option>Person</option>
                            </select>
                            <button>Add New</button>
                        </form>
                    </section>
                </div>);
        } else {
            return (
                <section id='entity-editor' className='flex-fill'>
                    <section id='sidebar'>
                    </section>
                    <section id='workspace'>
                        <h2>Predicates <i className='fa fa-plus-circle' aria-hidden='true'></i></h2>
                         <RecordsEditor {...this.props} dimension={this.state.dimension} entityExists={true} />
                    </section>
                </section>
            );
        }
    }
}