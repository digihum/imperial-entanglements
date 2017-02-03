/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
exports.findParentTree = (uid, data, ancestors = []) => {
    const current = data.find((datum) => datum.uid === uid);
    if (current === undefined) {
        console.warn('Couldn\'t find parent');
        return ancestors;
    }
    else {
        if (current.parent === null || current.uid === null) {
            if (current.uid === null) {
                console.warn('Found entity will null uid');
                return ancestors;
            }
            else {
                return ancestors.concat([current.uid]);
            }
        }
        else {
            return exports.findParentTree(current.parent, data, ancestors.concat([current.uid]));
        }
    }
};
//# sourceMappingURL=findParentTree.js.map