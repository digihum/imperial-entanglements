/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { ApiService } from '../../ApiService';

interface AdvancedSearchWorkspaceProps {
    api: ApiService;
}

export const AdvancedSearchWorkspace : React.StatelessComponent<AdvancedSearchWorkspaceProps> =
    (props: AdvancedSearchWorkspaceProps) => (
    <div className='workspace-editor'>
        <h2>Advanced Search</h2>
    </div>
);