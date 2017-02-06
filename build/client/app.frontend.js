/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const react_dom_1 = require("react-dom");
const react_1 = require("react");
const FalconApp_1 = require("../common/FalconApp");
const ClientApiService_1 = require("./ClientApiService");
const react_router_1 = require("react-router");
document.addEventListener('DOMContentLoaded', (event) => {
    react_dom_1.render(react_1.createElement(FalconApp_1.FalconApp, {
        api: new ClientApiService_1.ClientApiService(),
        router: react_router_1.BrowserRouter,
        routerSettings: {},
        environment: 'website',
        connected: true
    }), document.getElementById('main'));
});
//# sourceMappingURL=app.frontend.js.map