/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Config as KnexConfig } from 'knex';

import { IController } from '../controllers/IController';
// import { ElementSetController } from '../controllers/ElementSetController';
import { EntityController } from '../controllers/EntityController';
import { GenericController } from '../controllers/GenericController';

import { ElementSet } from '../../common/datamodel/AbstractSource';
import { view, edit } from '../../common/views/ElementSets';

import { Record } from '../../common/datamodel/Record';

import { routeUrls as routes } from '../../common/RouteUrls';

export const api : (s: KnexConfig) => Map<string, IController<any>> = (databaseConfig: KnexConfig) => new Map<string, IController<any>>([
    [routes.elementSet.url, new GenericController<ElementSet>(databaseConfig, 'element_sets', view, edit)],
    [routes.record.url, new GenericController<Record>(databaseConfig, 'records', view, edit)],
    [routes.entity.url, new EntityController(databaseConfig)]
]);