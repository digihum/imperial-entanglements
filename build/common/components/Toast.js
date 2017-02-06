/**
 * @fileOverview Toast controller
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Toast = (function (_super) {
    __extends(Toast, _super);
    function Toast() {
        var _this = _super.call(this) || this;
        _this.state = {
            toasts: [],
            nextId: 0
        };
        return _this;
    }
    Toast.prototype.addToast = function (title, message, level, lifeTime) {
        var _this = this;
        if (level === void 0) { level = 'warning'; }
        if (lifeTime === void 0) { lifeTime = 3000; }
        var id = this.state.nextId;
        this.setState({
            toasts: this.state.toasts.concat([{ title: title, message: message, level: level, lifeTime: lifeTime, id: id }]),
            nextId: id + 1
        });
        setTimeout(function () {
            _this.setState({
                toasts: _this.state.toasts.filter(function (toast) { return toast.id !== id; })
            });
        }, lifeTime);
    };
    Toast.prototype.render = function () {
        return (React.createElement("span", null, this.state.toasts.map(function (toast, i) { return (React.createElement("div", { key: "toast-" + toast.id, style: { bottom: (1 + 7 * i) + 'em' }, className: "toast " + toast.level },
            React.createElement("div", { className: 'title' }, toast.title),
            React.createElement("div", { className: 'message' }, toast.message))); })));
    };
    return Toast;
}(React.Component));
exports.Toast = Toast;
//# sourceMappingURL=Toast.js.map