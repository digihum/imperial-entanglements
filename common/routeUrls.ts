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

    itemView: React.ComponentClass<PageProps> | React.StatelessComponent<PageProps>;
    itemEdit: React.ComponentClass<PageProps> | React.StatelessComponent<PageProps>;

    collectionView: React.ComponentClass<PageProps> | React.StatelessComponent<PageProps>;
    collectionEdit: React.ComponentClass<PageProps> | React.StatelessComponent<PageProps>;
}

interface RouteUrls {
    elementSet: ComponentRoute;
    record: ComponentRoute;
    entity: ComponentRoute;
    entityType: ComponentRoute;
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
    },

    entityType: {
        url: 'entity_type',
        itemView: RouteNotFound,
        itemEdit: RouteNotFound,
        collectionView: RouteNotFound,
        collectionEdit: RouteNotFound
    },
};