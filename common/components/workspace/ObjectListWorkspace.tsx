/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { ApiService } from '../../ApiService';

import { EntityList } from '../object_list/EntityList';

interface ObjectListWorkspaceProps {
    api: ApiService;
    name: string;
}

export const ObjectListWorkspace : React.StatelessComponent<ObjectListWorkspaceProps> =
    (props: ObjectListWorkspaceProps) => (
    <div className='workspace-editor'>
        <h2>All {props.name}</h2>
        <EntityList api={props.api} />
    </div>
);