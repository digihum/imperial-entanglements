// Type definitions for react-router v2.0.0
// Project: https://github.com/rackt/react-router
// Definitions by: Sergey Buturlakin <https://github.com/sergey-buturlakin>, Yuichi Murata <https://github.com/mrk21>, Václav Ostrožlík <https://github.com/vasek17>, Nathan Brown <https://github.com/ngbrown>, Alex Wendland <https://github.com/awendland>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


/// <reference path="../globals/react/react.d.ts" />
/// <reference path="./history.d.ts"/>

import * as React from 'react';

declare module "react-router" {

    export const BrowserRouter : any;
    export const Match: any;

    interface LinkProps extends React.HTMLAttributes, React.Props<Link> {
        activeStyle?: React.CSSProperties
        activeClassName?: string
        onlyActiveOnIndex?: boolean
    }

    interface Link extends React.ComponentClass<LinkProps> {}
    interface LinkElement extends React.ReactElement<LinkProps> {}
    const Link: Link

    export {
        Link
    }
}