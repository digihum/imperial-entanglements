/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

export class TreeElement extends React.Component<any,any> {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  render() {
    return (<div></div>);
  }
}
