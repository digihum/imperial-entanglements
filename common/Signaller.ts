/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as signals from 'signals';

export const globalClick = new signals.Signal();
export const createTab = new signals.Signal();
export const closeTab = new signals.Signal();

export const Signaller = {
    globalClick,
    createTab,
    closeTab
};