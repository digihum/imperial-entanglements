/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const moment = require("moment");
exports.formatDate = (str) => {
    if (str === null || str.length === 0) {
        return '';
    }
    const modifier = {
        '=': '',
        '>': 'After ',
        '<': 'Before '
    }[str[0]];
    const year = str.substr(1, 4);
    const rawMonth = parseInt(str.substr(5, 2)) - 1;
    const month = rawMonth === -1 || isNaN(rawMonth) ? 'Unknown' : moment.months()[rawMonth];
    const rawDay = parseInt(str.substr(7, 2));
    const day = rawDay > 0 ? rawDay : '';
    return `${modifier} ${day} ${month} ${year}`;
};
//# sourceMappingURL=formatDate.js.map