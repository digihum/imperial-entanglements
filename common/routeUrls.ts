/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { RouteNotFound } from './views/RouteNotFound';

import { EntityEditor } from './views/EntityEditor';

export interface PageProps {
    url: string;
}

interface ComponentRoute {
    url: string;

    itemView: React.ComponentClass<PageProps>;
    itemEdit: React.ComponentClass<PageProps>;

    collectionView: React.ComponentClass<PageProps>;
    collectionEdit: React.ComponentClass<PageProps>;
}

interface RouteUrls {
    elementSet: ComponentRoute;
    record: ComponentRoute;
    entity: ComponentRoute;
}

export const routeUrls : RouteUrls = {

    elementSet: {
        url: 'element_set',
        itemView: RouteNotFound,
        itemEdit: RouteNotFound,
        collectionView: RouteNotFound,
        collectionEdit: RouteNotFound
    },

    record: {
        url: 'record',
        itemView: RouteNotFound,
        itemEdit: RouteNotFound,
        collectionView: RouteNotFound,
        collectionEdit: RouteNotFound
    },

    entity:  {
        url: 'entity',
        itemView: EntityEditor,
        itemEdit: EntityEditor,
        collectionView: RouteNotFound,
        collectionEdit: RouteNotFound
    }
};