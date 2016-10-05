/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { RouteNotFound } from './views/RouteNotFound';

import { EntityEditor } from './views/EntityEditor';

export class AppUrls {
    public static elementSet: string = 'element_set';
    public static record: string = 'record';
    public static entity: string = 'entity';
    public static entityType: string = 'entityType';

    public tmp: string;
}

export interface PageProps {
    url: string;
}

interface ComponentRoute {
    url: string;

    itemView: React.ComponentClass<PageProps> | React.StatelessComponent<PageProps>;
    itemEdit: React.ComponentClass<PageProps> | React.StatelessComponent<PageProps>;

    collectionView: React.ComponentClass<PageProps> | React.StatelessComponent<PageProps>;
    collectionEdit: React.ComponentClass<PageProps> | React.StatelessComponent<PageProps>;
}

interface RouteUrls {
    (key: string) : ComponentRoute;
}

export const routeUrls : RouteUrls = {

    [AppUrls.elementSet]: {
        url: 'element_set',
        itemView: RouteNotFound,
        itemEdit: RouteNotFound,
        collectionView: RouteNotFound,
        collectionEdit: RouteNotFound
    },

    [AppUrls.record]: {
        url: 'record',
        itemView: RouteNotFound,
        itemEdit: RouteNotFound,
        collectionView: RouteNotFound,
        collectionEdit: RouteNotFound
    },

    [AppUrls.entity]:  {
        url: 'entity',
        itemView: EntityEditor,
        itemEdit: EntityEditor,
        collectionView: RouteNotFound,
        collectionEdit: RouteNotFound
    },

    [AppUrls.entityType]: {
        url: 'entity_type',
        itemView: RouteNotFound,
        itemEdit: RouteNotFound,
        collectionView: RouteNotFound,
        collectionEdit: RouteNotFound
    }
};