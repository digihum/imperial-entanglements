/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */
import { renderToStaticMarkup } from 'react-dom/server';

import { IController } from './IController';
import { ElementSet } from '../datamodel/AbstractSource';
import { load } from '../datamodel/PersistentObject';
import { view, edit } from '../../common/views/ElementSets';

export class ElementSetController implements IController {

    public getItemPage(uid: number) : PromiseLike<string> {
        return this.getItemJson(uid)
        .then((data) => renderToStaticMarkup(view(data)));
    }

    public getItemEditPage(uid: number) : PromiseLike<string> {
        return this.getItemJson(uid)
        .then((data) => renderToStaticMarkup(edit(data)));
    }

    public getItemJson(uid: number) : PromiseLike<string> {
        return load(new ElementSet(), uid);
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

    public postItem(data: any) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public pushItem(uid: number, data: any) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public deleteItem(uid: number) : PromiseLike<string> {
        return Promise.resolve('');
    }
}