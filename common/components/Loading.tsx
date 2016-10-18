/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
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