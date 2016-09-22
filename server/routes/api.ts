/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { IController } from '../controllers/IController';
import { ElementSetController } from '../controllers/ElementSetController';

export const api : Map<string, IController> = new Map([
    ['element_sets', new ElementSetController()]
]);