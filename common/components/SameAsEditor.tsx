/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

interface SameAsEditorProps {
    sameAsString: string;
}

export const SameAsEditor : React.StatelessComponent<SameAsEditorProps>
    = (props: SameAsEditorProps) => {

    const sameAsUrls = props.sameAsString.split(',');

    return (
    <div>
        <h3>Same as:</h3>
        <ul>
            {sameAsUrls.map((url) => (
                <li key={`li-${url}`}><a href={url}>{url}</a></li>
            ))}
        </ul>
    </div>);
};