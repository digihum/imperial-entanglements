/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as React from 'react';

interface LoadingProps {
}

export const Loading : React.StatelessComponent<LoadingProps>
    = (props: LoadingProps) => {

    return (
    <div className='loader-wrapper'>
        <div className='loader'></div>
    </div>);
};
