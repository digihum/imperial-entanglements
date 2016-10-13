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
}

export const RecordRow = (props: RecordRowProps) => (
    <div>
        <div>#{props.record.uid}</div>
        <div>{props.record.source}</div>
        <div>{props.record.predicate}</div>
        <div>{props.record.value}</div>
        <div>{props.record.score}</div>
    </div>
); 