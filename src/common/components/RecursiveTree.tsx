/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { FalconItem, HierarchicalItem } from 'falcon-core';
import { AddTabButton } from './AddTabButton';
import { DataController } from '../stores/DataController';

interface RecursiveTreeProps<T extends FalconItem & HierarchicalItem> {
  data: T[];
  parentId: null | number;
  dataStore: DataController;
  tabType: string;
}

interface RecursiveTreeState {
  collapsed: boolean;
}

export class RecursiveTree<T extends FalconItem & HierarchicalItem> extends React.Component<RecursiveTreeProps<T>, RecursiveTreeState> {

  constructor() {
    super();
    this.state = { collapsed: false };
  }

  render() {
    const filtered = this.props.data.filter((datum) => datum.parent === this.props.parentId);
    if (filtered.length === 0) {
      return null;
    }

    return (
      <div>
        {
          filtered.map((item) => (
            <div key={item.label}>
              <div className='tree-label' onClick={() => this.setState({ collapsed: !this.state.collapsed})}>
                - {item.label} <AddTabButton uid={item.uid as number} tabType={this.props.tabType} />
              </div>
              {!this.state.collapsed ? (
                <div className='tree-children'>
                  <RecursiveTree
                    dataStore={this.props.dataStore}
                    data={this.props.data}
                    tabType={this.props.tabType}
                    parentId={item.uid as number | null} />
                </div>
              ) : null}
            </div>
          ))
        }
      </div>
    );
  }
}
