/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

// Vendor
import { Config as KnexConfig } from 'knex';

// Controllers
import { IController } from '../controllers/IController';

import { EntityController } from '../controllers/EntityController';
import { GenericController } from '../controllers/GenericController';

// Models
import { ElementSet } from '../../common/datamodel/AbstractSource';
import { Record } from '../../common/datamodel/Record';
import { EntityType } from '../../common/datamodel/EntityType';

// Routes
import { routeUrls as routes } from '../../common/RouteUrls';

export const api : (s: KnexConfig) => Map<string, IController<any>> = (databaseConfig: KnexConfig) => new Map<string, IController<any>>([
    [routes.elementSet.url, new GenericController<ElementSet>(databaseConfig, 'element_sets')],
    [routes.record.url, new GenericController<Record>(databaseConfig, 'records')],
    [routes.entityType.url, new GenericController<EntityType>(databaseConfig, 'entity_types')],
    [routes.entity.url, new EntityController(databaseConfig)]
]);