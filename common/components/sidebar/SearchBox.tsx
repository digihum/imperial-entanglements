/**
 * @fileOverview Searchboc for sidebar
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

interface SearchBoxProps {
    onChange : React.EventHandler<React.FormEvent>;
    searchString: string;
}

export const SearchBox = (props : SearchBoxProps) => (
    <span>
        <div className='input-addon-formgroup'>
            <span className='input-addon-icon'><i className='fa fa-search fa-fw'></i></span>
            <input  type='text' onChange={props.onChange} value={props.searchString} className='form-control with-addon' />
        </div>
    </span>
);
