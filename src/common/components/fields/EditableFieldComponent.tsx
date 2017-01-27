/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';

export interface EditableSubfieldProps<T> {
    edit?: boolean;
    value?: T | null;
    onChange?: (updated: T | null) => void;
    setEdit?: () => void;
    acceptChanges?: () => void;
    cancelChanges?: () => void;
    // TODO: check this
    onDelete?: (val: T) => void;
}

interface EditableFieldProps<T> {
    value: T;
    onChange: (s: T | null) => void;
    onDelete?: (val: T) => void;
}

interface EditableFieldState<T> {
    edit: boolean;
    internalValue: T | null;
}

export class EditableFieldComponent<T> extends React.Component<EditableFieldProps<T>, EditableFieldState<T>> {

    public static propTypes = {
      children: React.PropTypes.element.isRequired
    };

    constructor() {
        super();
        this.state = {
            edit: false,
            internalValue: null
        };
    }

    public componentWillMount() {
      this.setState({internalValue: this.props.value === undefined ? null : this.props.value});
    }

    public componentWillReceiveProps(newProps: EditableFieldProps<T>) {
        this.setState({internalValue: newProps.value});
    }

    public switchToEditState() {
        this.setState({edit: true, internalValue: this.props.value});
    }

    public setInternalValue(internalValue: T) {
        this.setState({ internalValue });
    }

    public acceptChanges() {
        this.props.onChange(this.state.internalValue);
        this.setState({edit: false});
    }

    public cancelChanges() {
        this.setState({edit: false, internalValue: this.props.value});
    }

    public render() {

      return (<span>
        {React.Children.map(this.props.children, (child) => React.cloneElement(child as any, {
          edit: this.state.edit,
          value: this.state.internalValue,
          onChange: this.setInternalValue.bind(this),
          setEdit: this.switchToEditState.bind(this),
          acceptChanges: this.acceptChanges.bind(this),
          cancelChanges: this.cancelChanges.bind(this),
          onDelete: (e) => this.props.onDelete !== undefined ? this.props.onDelete(this.props.value) : null
        }))}
        </span>
      );
    }
}
