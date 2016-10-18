/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { RouteNotFound } from './views/RouteNotFound';

import { ObjectEditor } from './views/ObjectEditor';

import { AppUrls } from './ApiService';

export interface PageProps {
    url: string;
}

interface ComponentRoute {
    url: string;
    workspaceType: string;

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
        workspaceType: '',
        itemView: RouteNotFound,
        itemEdit: RouteNotFound,
        collectionView: RouteNotFound,
        collectionEdit: RouteNotFound
    },

    [AppUrls.record]: {
        url: 'record',
        name: 'Record',
        plural: 'Records',
        workspaceType: '',
        itemView: RouteNotFound,
        itemEdit: RouteNotFound,
        collectionView: ObjectEditor,
        collectionEdit: ObjectEditor
    },

    [AppUrls.entity]:  {
        url: 'entity',
        name: 'Entity',
        plural: 'Entities',
        workspaceType: 'entity',
        itemView: ObjectEditor,
        itemEdit: ObjectEditor,
        collectionView: ObjectEditor,
        collectionEdit: ObjectEditor
    },

    [AppUrls.entityType]: {
        url: 'entity_type',
        workspaceType: '',
        itemView: RouteNotFound,
        itemEdit: RouteNotFound,
        collectionView: RouteNotFound,
        collectionEdit: RouteNotFound
    },

    [AppUrls.predicate]: {
        url: 'predicate',
        name: 'Predicate',
        plural: 'Predicates',
        workspaceType: 'predicate',
        itemView: ObjectEditor,
        itemEdit: ObjectEditor,
        collectionView: ObjectEditor,
        collectionEdit: ObjectEditor
    },

    [AppUrls.source]: {
        url: 'source',
        name: 'Source',
        plural: 'Sources',
        workspaceType: 'source',
        itemView: ObjectEditor,
        itemEdit: ObjectEditor,
        collectionView: ObjectEditor,
        collectionEdit: ObjectEditor
    }
};