/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as Koa from 'koa';
import { message } from './views/home';
import * as render from 'mithril-node-render';

export class Server {

    private app: Koa;

    public init() : void {
        this.app = new Koa();
        // uses async arrow functions
        this.app.use(function* (){
        this.body = render(message);
        });
    }

    public listen() : void {
        this.app.listen(8080);
    }
}
