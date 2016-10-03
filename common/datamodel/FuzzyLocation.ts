/**
 * @fileOverview Abstract interface for locations
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

export class FuzzyLocation {
    public level: 'world' | 'country' | 'region' | 'settlement' | 'street' | 'address';
    public displayType: 'point' | 'area';
}