/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { Link } from 'react-router';
import { ApiService } from '../ApiService';

var Select = require('react-select');

function logChange(val) {
    console.log("Selected: " + val);
}

interface EntityEditorProps {
    id: number;
    api: ApiService;
}

interface EntityEditorState {
    dimension: 'predicates' | 'time' | 'source';
}

export class EntityEditor extends React.Component<EntityEditorProps, EntityEditorState> {


    private getData(input, callback)  {
        this.props.api.getCanonicalName(2)
        .then((data) => {
            callback(null, {
                options: [
                    { value: 'one', label: 'One' },
                    { value: 'two', label: 'Two' }
                ],
                // CAREFUL! Only set this to true when there are no more options,
                // or more specific queries will not be sent to the server.
                complete: true
            });
        });
    }

    public render() {
        const woo = 1;
        const getData = this.getData.bind(this);
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
                        <Link to='/'>Home</Link>
                    </section>
                    <section id='workspace'>
                        <h2>Predicates <i className='fa fa-plus-circle' aria-hidden='true'></i></h2>
                        <Select.Async
                            name="form-field-name"
                            value="one"
                            onChange={logChange}
                            loadOptions={getData}
                        />
                    </section>
                </section>
            );
        }
    }
}