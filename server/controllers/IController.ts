/**
 * @fileOverview Generic controller interface
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

export interface IController {

    getItemPage(uid: number) : PromiseLike<string>;
    getItemEditPage(uid: number) : PromiseLike<string>;
    getItemJson(uid: number) : PromiseLike<string>;

    getCollectionPage() : PromiseLike<string>;
    getCollectionEditPage() : PromiseLike<string>;
    getCollectionJson() : PromiseLike<string>;

    postItem(data: any) : PromiseLike<string>;
    pushItem(uid: number, data: any) : PromiseLike<string>;
    deleteItem(uid: number) : PromiseLike<string>;
}