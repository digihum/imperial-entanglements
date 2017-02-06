"use strict";
var React = require("react");
exports.Login = function (props) { return (React.createElement("html", null,
    React.createElement("head", null,
        React.createElement("link", { href: '/app.css', rel: 'stylesheet' }),
        React.createElement("link", { href: 'https://fonts.googleapis.com/css?family=Roboto', rel: 'stylesheet' })),
    React.createElement("body", null,
        React.createElement("section", { className: 'loginform' },
            React.createElement("h1", null, "Login:"),
            React.createElement("form", { name: 'login', action: '/login', method: 'post', "accept-charset": 'utf-8' },
                React.createElement("ul", null,
                    React.createElement("li", null,
                        React.createElement("label", { htmlFor: 'username' }, "Username"),
                        React.createElement("input", { type: 'text', name: 'username', placeholder: 'username', required: true })),
                    React.createElement("li", null,
                        React.createElement("label", { htmlFor: 'password' }, "Password"),
                        React.createElement("input", { type: 'password', name: 'password', placeholder: 'password', required: true })),
                    React.createElement("li", null,
                        React.createElement("input", { type: 'submit', value: 'Login' })))))))); };
//# sourceMappingURL=Login.js.map