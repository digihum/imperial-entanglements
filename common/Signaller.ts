/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
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