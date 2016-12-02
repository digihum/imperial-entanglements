/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import { FalconItem } from 'falcon-core';

export class Wrapper {
  private item: FalconItem;
  private hydrated: boolean;

  constructor(item: FalconItem) {
    this.item = item;
    this.hydrated = false;
  }
}
