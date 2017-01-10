/**
 * @fileOverview Toast controller
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

interface SingleToast {
    id: number;
    title: string;
    message: string;
    level: string;
    lifeTime: number;
}

interface ToastProps {
}

interface ToastState {
    toasts: SingleToast[];
    nextId: number;
}

export class Toast extends React.Component<ToastProps, ToastState> {

    constructor() {
        super();
        this.state = {
            toasts: [],
            nextId: 0
       };
    }

    public addToast(title: string, message: string, level: string = 'warning', lifeTime: number = 3000) {

        const id = this.state.nextId;

        this.setState({
            toasts: this.state.toasts.concat([{ title, message, level, lifeTime, id }]),
            nextId: id + 1
        });

        setTimeout(() => {
            this.setState({
                toasts: this.state.toasts.filter((toast) => toast.id !== id)
            })
        }, lifeTime);
    }

    public render() {
        return (<span>
            {this.state.toasts.map((toast, i) => (
                <div key={`toast-${toast.id}`} style={{bottom: (1 + 7 * i) + 'em'}} className={`toast ${toast.level}`}>
                    <div className='title'>
                        {toast.title}
                    </div>
                    <div className='message'>
                        {toast.message}
                    </div>
                </div>
            ))}
        </span>);
    }
}
