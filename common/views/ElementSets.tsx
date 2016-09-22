/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

export const view = (props) => (
    <div id='main'>
        <section>
            <h1>{ props.name }</h1>
            <small><a href={ props.uri }>{ props.uri }</a></small>
            <p>{ props.description }</p>
        </section>
    </div>
);

export const edit = (props) => (
    <div id='main'>
        <section>
            <h1>Editing { props.name }</h1>
            <form>
                <p>
                    <label for="size_1">Name</label>
                    <input type="text" name="name" id="size_1" value={ props.name } />
                </p>
                <p>
                    <label for="size_2">URI</label>
                    <input type="url" name="name" id="size_2" value={ props.uri } />
                </p>
                <p>
                    <label for="size_3">Description</label>
                    <textarea name="name" id="size_3" value={ props.description }>
                    </textarea>
                </p>
            </form>
        </section>
    </div>
);

export const ElementSets = { view, edit };
