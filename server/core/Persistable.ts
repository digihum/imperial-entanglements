/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from '../../common/datamodel/Serializable';

export interface Persistable extends Serializable {
    getTableName() : string;
    uid: number | null;
    toSchema() : any;
    fromSchema(data: any) : Persistable;
}