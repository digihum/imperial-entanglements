/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import Form from 'react-jsonschema-form';
import { elementSetsSchema } from '../../data/schema/elementSetsSchema';

export const view = (props) => (
    <div id='main'>
        <section>
            <h1>{ props.name }</h1>
            <small><a href={ props.uri }>{ props.uri }</a></small>
            <p>{ props.description }</p>
        </section>
    </div>
);

const log = (t) => console.log.bind(console, t);

export const edit = (props) => {

    const uiSchema = {
        'uid': {
            'ui:readonly': true
        },
        'description': {
            'ui:widget': 'textarea'
        }
    };

    return (<div id='main'>
        <section>
            <Form schema={elementSetsSchema()}
                uiSchema={uiSchema}
                onChange={log('changed')}
                onSubmit={log('submitted')}
                onError={log('errors')} />
        </section>
    </div>);
};

export const ElementSets = { view, edit };
