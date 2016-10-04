/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Config as KnexConfig } from 'knex';

import { AbstractController } from './IController';
import { PersistentObject } from '../../common/datamodel/PersistentObject';

export class GenericController<T extends PersistentObject> extends AbstractController<T> {

    private tableName: string;
    private viewComponent : React.ComponentClass<T> | React.StatelessComponent<T>;
    private editComponent : React.ComponentClass<T> | React.StatelessComponent<T>;

    constructor(
        databaseConfig: KnexConfig,
        table: string,
        view: React.ComponentClass<T> | React.StatelessComponent<T>,
        edit: React.ComponentClass<T> | React.StatelessComponent<T>) {
        super(databaseConfig);
        this.tableName = table;
        this.viewComponent = view;
        this.editComponent = edit;
    }


    public getItemPage(uid: number) : PromiseLike<string> {
        return this.getItemJson(uid)
        .then((data) => renderToStaticMarkup(React.createElement(this.viewComponent, data)));
    }

    public getItemEditPage(uid: number) : PromiseLike<string> {
        return this.getItemJson(uid)
        .then((data) => renderToStaticMarkup(React.createElement(this.editComponent, data)));
    }

    public getItemJson(uid: number) : PromiseLike<T> {
        return this.db.loadItem(this.tableName, uid);
    }

    public getCollectionPage() : PromiseLike<string> {
        return Promise.resolve('');
    }

    public getCollectionEditPage() : PromiseLike<string> {
        return Promise.resolve('');
    }

    public getCollectionJson(params: Object = {}) : PromiseLike<string> {
        return this.db.loadCollection(this.tableName, params);
    }

    public postItem(data: T) : PromiseLike<string> {
        return this.db.createItem(data);
    }

    public putItem(uid: number, data: T) : PromiseLike<string> {
        return this.db.updateItem(data);
    }

    public patchItem(uid: number, data: T) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public deleteItem(uid: number) : PromiseLike<string> {
        return this.db.deleteItem(this.tableName, uid);
    }
}