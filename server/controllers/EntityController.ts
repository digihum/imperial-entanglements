/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';
import { AbstractController } from './IController';
import { Entity } from '../../common/datamodel/Entity';

export class EntityController extends AbstractController {

    constructor(db: Database) {
        super(db);
    }

    public getItemJson<Entity>(obj: { new(): Entity; }, uid: number) : Promise<Entity> {
        return this.db.loadItem('entities', uid);
    }

    public getCollectionJson(obj: { new(): Entity; }, params: Object = {}) : Promise<Entity[]> {
        return Promise.resolve('');
    }

    public postItem(data: Entity) : Promise<string> {
        return Promise.resolve('');
    }

    public putItem(uid: number, data: Entity) : Promise<string> {
        return Promise.resolve('');
    }

    public patchItem(uid: number, data: Entity) : Promise<string> {
        return Promise.resolve('');
    }

    public deleteItem(uid: number) : Promise<string> {
        return Promise.resolve('');
    }
}