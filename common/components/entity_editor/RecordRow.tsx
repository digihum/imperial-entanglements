/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { Record } from '../../../common/datamodel/datamodel';

interface RecordRowProps {
    record: Record;
    dimension: string;
    deleteRecord: (recordUid: number) => void;
}

export const RecordRow = (props: RecordRowProps) => (
    <div className='record-row'>
        <div className='record-row-item uid'>#{props.record.uid}</div>
        <div className='record-row-item'>{props.record.value}</div>
        <div className='record-row-item'>{props.record.source}</div>
        <div className='record-row-item score'>
            <i className='fa fa-star-o' aria-hidden='true'></i>
            <i className='fa fa-star-o' aria-hidden='true'></i>
            <i className='fa fa-star-o' aria-hidden='true'></i>
            <i className='fa fa-star-o' aria-hidden='true'></i>
            <i className='fa fa-star-o' aria-hidden='true'></i>
        </div>
        <div className='record-row-item buttons'>
            <button><i className='fa fa-pencil-square-o' aria-hidden='true'></i></button>
            <button><i className='fa fa-times' aria-hidden='true' onClick={() => props.deleteRecord(props.record.uid)}></i></button>
        </div>
    </div>
); 