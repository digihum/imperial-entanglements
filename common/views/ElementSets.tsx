/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
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
