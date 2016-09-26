/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { IController } from './IController';
import { IElementSet, ElementSet } from '../datamodel/AbstractSource';
import { loadItem, createItem, deleteItem, updateItem } from '../datamodel/PersistentObject';
import { EntityEditor } from '../../common/views/entityEditor';

export class EntityController implements IController {

    public getItemPage(uid: number) : PromiseLike<string> {
        return Promise.resolve(renderToStaticMarkup(<EntityEditor id={1} />));
    }

    public getItemEditPage(uid: number) : PromiseLike<string> {
        return Promise.resolve(renderToStaticMarkup(<EntityEditor id={1} />));
    }

    public getItemJson(uid: number) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public getCollectionPage() : PromiseLike<string> {
        return Promise.resolve('');
    }

    public getCollectionEditPage() : PromiseLike<string> {
        return Promise.resolve('');
    }

    public getCollectionJson() : PromiseLike<string> {
        return Promise.resolve('');
    }

    public postItem(data: IElementSet) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public putItem(data: ElementSet) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public deleteItem(uid: number) : PromiseLike<string> {
        return Promise.resolve('');
    }
}