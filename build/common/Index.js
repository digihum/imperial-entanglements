"use strict";
var React = require("react");
exports.Index = function (props) { return (React.createElement("html", null,
    React.createElement("head", null,
        React.createElement("title", null, "Imperial Entanglements"),
        React.createElement("script", { src: 'https://unpkg.com/react@15.3.2/dist/react.js' }),
        React.createElement("script", { src: 'https://unpkg.com/react-dom@15.3.2/dist/react-dom.js' }),
        React.createElement("script", { src: 'https://cdn.jsdelivr.net/lodash/4.16.1/lodash.js' }),
        React.createElement("script", { src: 'https://code.jquery.com/jquery-3.1.1.slim.min.js', integrity: 'sha256-/SIrNqv8h6QGKDuNoLGA4iret+kyesCkHGzVUUV0shc=', crossOrigin: 'anonymous' }),
        React.createElement("link", { href: '/app.css', rel: 'stylesheet' })),
    React.createElement("body", { className: 'flex-fill' },
        React.createElement("div", { id: 'falcon-container', className: 'flex-fill' }, props.children),
        React.createElement("script", { src: '/mobx.bundle.js' }),
        React.createElement("script", { src: '/utility.bundle.js' }),
        React.createElement("script", { src: '/ui.bundle.js' }),
        React.createElement("script", { src: '/react.bundle.js' }),
        React.createElement("script", { src: '/vendor.dist.js' }),
        React.createElement("script", { src: '/main.dist.js' })))); };
//# sourceMappingURL=Index.js.map