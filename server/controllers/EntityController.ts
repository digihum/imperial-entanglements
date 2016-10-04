/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Config as KnexConfig } from 'knex';

import { AbstractController } from './IController';
import { Entity } from '../../common/datamodel/Entity';
export class EntityController extends AbstractController<Entity> {

    constructor(databaseConfig: KnexConfig) {
        super(databaseConfig);
    }

    public getItemJson(uid: number) : PromiseLike<Entity> {
        return this.db.loadItem<Entity>('entities', uid);
    }

    public getCollectionJson(params: Object = {}) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public postItem(data: Entity) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public putItem(uid: number, data: Entity) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public patchItem(uid: number, data: Entity) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public deleteItem(uid: number) : PromiseLike<string> {
        return Promise.resolve('');
    }
}