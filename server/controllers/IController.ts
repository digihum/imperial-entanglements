/**
 * @fileOverview Generic controller interface
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

export interface IController<T> {

    getItemPage(uid: number) : PromiseLike<string>;
    getItemEditPage(uid: number) : PromiseLike<string>;
    getItemJson(uid: number) : PromiseLike<T>;

    getCollectionPage() : PromiseLike<string>;
    getCollectionEditPage() : PromiseLike<string>;
    getCollectionJson(params: Object) : PromiseLike<string>;

    // create
    postItem(data: any) : PromiseLike<string>;

    // replace
    putItem(uid: number, data: any) : PromiseLike<string>;

    // delete
    deleteItem(uid: number) : PromiseLike<string>;

    // update
    patchItem(uid: number, data: any);
}