/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

export interface EditableSubfieldProps<T> {
    edit: boolean;
    value: T | null;
    onChange: React.EventHandler<React.FormEvent>;
    setEdit: () => void;
    acceptChanges: () => void;
    cancelChanges: () => void;
    onDelete: React.EventHandler<React.FormEvent>;
}

interface EditableFieldProps<T> {
    value: T;
    onChange: (s: T) => void;
    onDelete?: (val: T) => void;
    component: React.StatelessComponent<EditableSubfieldProps<T>>;
    additionalProps?: any;
}

interface EditableFieldState<T> {
    edit: boolean;
    internalValue: T | null;
}

export class EditableFieldComponent<T> extends React.Component<EditableFieldProps<T>, EditableFieldState<T>> {

    constructor() {
        super();
        this.state = {
            edit: false,
            internalValue: null
        };
    }

    public componentWillMount() {
        this.setState({internalValue: this.props.value});
    }

    public componentWillReceiveProps(newProps: EditableFieldProps<T>) {
        this.setState({internalValue: newProps.value});
    }

    public switchToEditState() {
        this.setState({edit: true, internalValue: this.props.value});
    }

    public acceptChanges() {
        if (this.state.internalValue !== null) {
            this.props.onChange(this.state.internalValue);
            this.setState({edit: false});
        }
    }

    public cancelChanges() {
        this.setState({edit: false});
    }

    public render() {
       return (<this.props.component
        edit={this.state.edit}
        value={this.state.internalValue}
        onChange={(e) => this.setState({internalValue: e.target.value}) }
        setEdit={this.switchToEditState.bind(this)}
        acceptChanges={this.acceptChanges.bind(this)}
        cancelChanges={this.cancelChanges.bind(this)}
        onDelete={(e) => this.props.onDelete !== undefined ? this.props.onDelete(this.props.value) : null}
        {...this.props.additionalProps} />);
    }
}