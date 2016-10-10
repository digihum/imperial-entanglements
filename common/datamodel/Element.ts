/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';
import { ElementSet } from './ElementSet';

export class Element implements Serializable {
    public uri: URL;
    public elementSet: ElementSet;
    public name: string;
    public description: string;
    public comment: string;
}
