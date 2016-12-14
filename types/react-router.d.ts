// Type definitions for react-router v2.0.0
// Project: https://github.com/rackt/react-router
// Definitions by: Sergey Buturlakin <https://github.com/sergey-buturlakin>, Yuichi Murata <https://github.com/mrk21>, Václav Ostrožlík <https://github.com/vasek17>, Nathan Brown <https://github.com/ngbrown>, Alex Wendland <https://github.com/awendland>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


/// <reference path="../globals/react/index.d.ts" />

import * as React from 'react';

declare module 'react-router' {

    export interface LinkProps extends React.HTMLAttributes {
        to: string;
    }

    export interface LinkElement extends React.ComponentClass<LinkProps> {}
    export const Link: LinkElement

    export interface MissProps extends React.HTMLAttributes {
        component: React.ComponentClass<any> | React.StatelessComponent<any>
    }

    export interface MissElement extends React.ComponentClass<MissProps> {}
    export const Miss: MissElement


    export interface MatchProps extends React.HTMLAttributes{
        component?: React.ComponentClass<any> | React.StatelessComponent<any>
        render?: React.StatelessComponent<any>
    }

    export interface MatchElement extends React.ComponentClass<MatchProps> {}
    export const Match: MatchElement

    export interface BrowserRouterProps extends React.HTMLAttributes {
        basename: string
    }

    export interface BrowserRouterElement extends React.ComponentClass<BrowserRouterProps> {}
    export const BrowserRouter: BrowserRouterElement

    export interface MemoryRouterProps extends React.HTMLAttributes {
        initialEntries: string[],
        initialIndex: number
    }

    export interface MemoryRouterElement extends React.ComponentClass<MemoryRouterProps> {}
    export const MemoryRouter: MemoryRouterElement

    export interface ServerRouterProps extends React.HTMLAttributes {
        location: string,
        context: ServerRenderContext
    }

    export interface ServerRouterElement extends React.ComponentClass<ServerRouterProps> {}
    export const ServerRouter: ServerRouterElement

    export interface ServerRenderContext {}
    export function createServerRenderContext() : ServerRenderContext
}