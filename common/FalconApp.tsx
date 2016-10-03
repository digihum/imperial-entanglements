/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

//https://react-router.now.sh/Match

import * as React from 'react';
import { BrowserRouter, Match, Link } from 'react-router';

import { ApiService } from './ApiService';

interface FalconAppProps {
    router: any;
    api: ApiService;
    location: string;
}

export const FalconApp = (props) => (
    <props.router />
);