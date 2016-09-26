/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

interface EntityEditorProps {
    id: number;
}

interface EntityEditorState {
    dimension: 'predicates' | 'time' | 'source';
}

export class EntityEditor extends React.Component<EntityEditorProps, EntityEditorState> {
    public render() {
        const woo = 1;
        if (woo === 2) {
            return (
                <section id='select-entity-type'>
                    <i className='fa fa-question-circle big-icon' aria-hidden='true'></i>
                    <form>
                        <label>Please select a type for this entity:</label>
                        <select>
                            <option>Person</option>
                        </select>
                        <button>Add New</button>
                    </form>
                </section>);
        } else {
            return (
                <section id='entity-editor' className='flex-fill'>
                    <section id='sidebar'>
                    </section>
                    <section id='workspace'>
                        <h2>Predicates <i className='fa fa-plus-circle' aria-hidden='true'></i></h2>
                    </section>
                </section>
            );
        }
    }
}