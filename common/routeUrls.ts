/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

interface PageProps {
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
    elementSet: { 'element_set',
    record: 'record',
    entity: 'entity'
};