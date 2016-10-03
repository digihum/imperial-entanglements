/**
 * @fileOverview Abstract interface for locations
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

export class Property {
    public domain : 'Any';
    public range: 'Any';
    public name: string;
    public description: string;
    public sameAs: string[];
}