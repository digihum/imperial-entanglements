/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { IController } from './IController';
import { ElementSet } from '../datamodel/AbstractSource';

export class ElementSetController implements IController {

    public getItemPage(uid: number) : PromiseLike<string> {
        return Promise.resolve('<h1>hello</h1>');
    }

    public getItemJson(uid: number) : PromiseLike<string> {
        return ElementSet.LOAD(uid);
    }

    public getCollectionPage() : PromiseLike<string> {
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