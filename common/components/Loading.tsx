/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

interface LoadingProps {
}

export const Loading : React.StatelessComponent<LoadingProps>
    = (props: LoadingProps) => {

    return (
    <div>
        <p>Loading...</p>
    </div>);
};