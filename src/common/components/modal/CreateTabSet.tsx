/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';


import { DataController } from '../../stores/DataController';
import { inject, observer } from 'mobx-react';

import * as mousetrap from 'mousetrap';

interface CreateTabSetProps {
  dataStore?: DataController;
  complete: (s: string) => void;
  cancel: () => void;
}

interface CreateEntityTypeState {
    internalValue: string;
}

@inject('dataStore')
@observer
export class CreateTabSet extends React.Component<CreateTabSetProps, CreateEntityTypeState> {

    private keyboardShortcuts;

    constructor() {
        super();
        this.state = {
            internalValue: ''
        };
    }

    public createTabSet() {
      return fetch('/admin/tabset', {
          method: 'POST',
          body: JSON.stringify({
            name: this.state.internalValue,
            tabs: this.props.dataStore!.tabs
          }),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          credentials: 'same-origin'
      })
      .then((response) => {
          return response.json();
      }).then(() => this.props.complete(''));
    }

    public inputRef(val: HTMLElement | null) {
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.createTabSet.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancel);
        } else {
            this.keyboardShortcuts.unbind('return');
        }
    }

    public render() {
        return (
        <Overlay>
            <h2>Save Tab Set</h2>
            <label className='small'>Name</label>
            <input type='text'
                value={this.state.internalValue}
                ref={this.inputRef.bind(this)}
                onChange={(e) => this.setState({ internalValue: e.target.value })} />
            <button onClick={() => this.props.cancel()} className='pull-left'>Cancel</button>
            <button onClick={this.createTabSet.bind(this)} className='pull-right'>Create Tab Set</button>
        </Overlay>
        );
    }
};
