/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import { KeyNotFoundException } from './Exceptions';

export function mapGet<T, S>(map: Map<T, S>, key: T) : S {
    const val = map.get(key);
    if (val === undefined) {
        throw new KeyNotFoundException();
    }
    return val;
}