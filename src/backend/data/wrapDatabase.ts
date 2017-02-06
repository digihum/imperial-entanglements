/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */
import { itemTypes } from '../../common/itemTypes';

// Controllers
import { IController } from '../controllers/IController';

import { Database } from './Database';

import { ServerApiService } from '../ServerApiService';
import { QueryEngine } from '../QueryEngine';

import {
    EntityController,
    EntityTypeController,
    ElementSetController,
    PredicateController,
    SourceController,
    RecordController,
    ElementController,
    SourceElementController
} from '../../backend/controllers/controllers';

export const wrapDatabase : (s: Database, fakeCreator: boolean) => ServerApiService =
    (db: Database, fakeCreator: boolean) => {
    const routes = new Map<string, IController>([
        [itemTypes.element_set.machineName, new ElementSetController(db)],
        [itemTypes.record.machineName, new RecordController(db)],
        [itemTypes.entity_type.machineName, new EntityTypeController(db)],
        [itemTypes.entity.machineName, new EntityController(db)],
        [itemTypes.predicate.machineName, new PredicateController(db)],
        [itemTypes.source.machineName, new SourceController(db)],
        [itemTypes.element.machineName, new ElementController(db)],
        [itemTypes.source_element.machineName, new SourceElementController(db)]
    ]);

    return new ServerApiService(db, routes, new QueryEngine(db), fakeCreator);
};
