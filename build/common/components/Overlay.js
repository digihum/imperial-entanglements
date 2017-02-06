/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
class Overlay extends React.Component {
    render() {
        return (React.createElement("div", { className: 'full-page-overlay' },
            React.createElement("div", { className: 'overlay-container' }, this.props.children)));
    }
}
exports.Overlay = Overlay;
;
//# sourceMappingURL=Overlay.js.map