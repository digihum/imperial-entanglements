/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { IController } from '../controllers/IController';
// import { ElementSetController } from '../controllers/ElementSetController';
import { EntityController } from '../controllers/EntityController';
import { GenericController } from '../controllers/GenericController';

import { ElementSet } from '../../common/datamodel/AbstractSource';
import { view, edit } from '../../common/views/ElementSets';

import { Record } from '../../common/datamodel/Record';

export const api : Map<string, IController<any>> = new Map<string, IController<any>>([
    ['element_set', new GenericController<ElementSet>('element_sets', view, edit)],
    ['record', new GenericController<Record>('records', view, edit)],
    ['entity', new EntityController()]
]);