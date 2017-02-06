/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as React from 'react';

interface AdvancedSearchWorkspaceProps {
}

export const AdvancedSearchWorkspace : React.StatelessComponent<AdvancedSearchWorkspaceProps> =
    (props: AdvancedSearchWorkspaceProps) => (
    <div className='workspace-editor'>
        <h2>Advanced Search</h2>
    </div>
);
