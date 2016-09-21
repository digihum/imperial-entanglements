/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { FuzzyLocation } from './FuzzyLocation';

class SourceMetaData {
    public metaDataSchema: string;
    public key: string;
    public value: string;
}

class SourceTag {
    public id: string;
}

interface AbstractSource {
    locationType: 'physical' | 'digital';
    metaData: SourceMetaData[];
    creationDate: Date;
    tags: SourceTag[];
    location: FuzzyLocation;
}