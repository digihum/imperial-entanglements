/**
 * @fileOverview Toast controller
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
class Toast extends React.Component {
    constructor() {
        super();
        this.state = {
            toasts: [],
            nextId: 0
        };
    }
    addToast(title, message, level = 'warning', lifeTime = 3000) {
        const id = this.state.nextId;
        this.setState({
            toasts: this.state.toasts.concat([{ title, message, level, lifeTime, id }]),
            nextId: id + 1
        });
        setTimeout(() => {
            this.setState({
                toasts: this.state.toasts.filter((toast) => toast.id !== id)
            });
        }, lifeTime);
    }
    render() {
        return (React.createElement("span", null, this.state.toasts.map((toast, i) => (React.createElement("div", { key: `toast-${toast.id}`, style: { bottom: (1 + 7 * i) + 'em' }, className: `toast ${toast.level}` },
            React.createElement("div", { className: 'title' }, toast.title),
            React.createElement("div", { className: 'message' }, toast.message))))));
    }
}
exports.Toast = Toast;
//# sourceMappingURL=Toast.js.map