/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
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

    [AppUrls.element_set]: {
        url: 'element_set',
        workspaceType: '',
        itemView: RouteNotFound,
        collectionView: RouteNotFound
    },

    [AppUrls.record]: {
        url: 'record',
        name: 'Record',
        plural: 'Records',
        workspaceType: '',
        itemView: RouteNotFound,
        collectionView: ObjectEditor
    },

    [AppUrls.entity]:  {
        url: 'entity',
        name: 'Entity',
        plural: 'Entities',
        workspaceType: 'entity',
        itemView: ObjectEditor,
        collectionView: ObjectEditor
    },

    [AppUrls.entity_type]: {
        url: 'entity_type',
        name: 'Entity Type',
        plural: 'Entity Types',
        workspaceType: 'entity_type',
        itemView: ObjectEditor,
        collectionView: ObjectEditor
    },

    [AppUrls.predicate]: {
        url: 'predicate',
        name: 'Predicate',
        plural: 'Predicates',
        workspaceType: 'predicate',
        itemView: ObjectEditor,
        collectionView: ObjectEditor
    },

    [AppUrls.source]: {
        url: 'source',
        name: 'Source',
        plural: 'Sources',
        workspaceType: 'source',
        itemView: ObjectEditor,
        collectionView: ObjectEditor
    }
};