/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as Koa from 'koa';
import * as koaStatic from 'koa-static';
import { home } from '../../common/views/home';
import * as render from 'mithril-node-render';
import {template} from 'lodash';
import {readFileSync} from 'fs';

export class Server {

    private app: Koa;
    private skeleton: _.TemplateExecutor;

    public init() : void {

        this.app = new Koa();
        this.app.use(koaStatic('build/static'));

        this.skeleton = template(readFileSync('./common/index.html', 'utf8'));
        
        const self = this;        
        this.app.use(function* (){
            this.body = self.skeleton({ body: render(home) + "<script src='home.dist.js'></script>"});
        });
    }

    public listen() : void {
        this.app.listen(8080);
    }
}
