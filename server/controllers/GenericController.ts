/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { IController } from './IController';
import { PersistentObject } from '../../common/datamodel/PersistentObject';
import { loadItem, createItem, deleteItem, updateItem, loadCollection } from '../core/Database';

export class GenericController<T extends PersistentObject> implements IController<T> {

    private tableName: string;
    private viewComponent : React.ComponentClass<T> | React.StatelessComponent<T>;
    private editComponent : React.ComponentClass<T> | React.StatelessComponent<T>;

    constructor(table: string,
        view: React.ComponentClass<T> | React.StatelessComponent<T>,
        edit: React.ComponentClass<T> | React.StatelessComponent<T>) {
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
        return loadItem(this.tableName, uid);
    }

    public getCollectionPage() : PromiseLike<string> {
        return Promise.resolve('');
    }

    public getCollectionEditPage() : PromiseLike<string> {
        return Promise.resolve('');
    }

    public getCollectionJson(params: Object = {}) : PromiseLike<string> {
        return loadCollection(this.tableName, params);
    }

    public postItem(data: T) : PromiseLike<string> {
        return createItem(data);
    }

    public putItem(uid: number, data: T) : PromiseLike<string> {
        return updateItem(data);
    }

    public patchItem(uid: number, data: T) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public deleteItem(uid: number) : PromiseLike<string> {
        return deleteItem(this.tableName, uid);
    }
}