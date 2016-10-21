/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import { ApiService, AppUrls } from './ApiService';
import { Predicate, EntityType } from '../common/datamodel/datamodel';

export class DataStore {

    private api: ApiService;

    private update: () => void;

    private predicates: Predicate[];
    private entityTypes: EntityType[];

    constructor(api: ApiService, update: () => void) {
        this.api = api;
        this.predicates = [];
        this.update = update;
    }

    public loadPredicates() : Promise<Predicate[]> {
        return this.api.getCollection(Predicate, AppUrls.predicate, {})
        .then((predicates) => {
            this.predicates = predicates;
            this.update();
            return predicates;
        });
    }

    public getPredicates() : Predicate[] {
        return this.predicates;
    }

    public loadEntityTypes() : Promise<EntityType[]> {
        return this.api.getCollection(EntityType, AppUrls.entityType, {})
        .then((entityTypes) => {
            this.entityTypes = entityTypes;
            this.update();
            return entityTypes;
        });
    }

    public getEntityTypes() : EntityType[] {
        return this.entityTypes;
    }
}