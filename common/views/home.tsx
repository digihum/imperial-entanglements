/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { EntityEditor } from '../components/entity_editor/EntityEditor';

export const home = (props) => (
    <div id='main'>
        <header>
        </header>
        <section>
            <EntityEditor id={0} service={
                {
                    getCanonicalName(id) { return Promise.resolve('fred'); }
                }
            } />
            <h1>hi</h1>
        </section>
    </div>
) ;
