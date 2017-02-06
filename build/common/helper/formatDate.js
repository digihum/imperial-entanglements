/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var moment = require("moment");
exports.formatDate = function (str) {
    if (str === null || str.length === 0) {
        return '';
    }
    var modifier = {
        '=': '',
        '>': 'After ',
        '<': 'Before '
    }[str[0]];
    var year = str.substr(1, 4);
    var rawMonth = parseInt(str.substr(5, 2)) - 1;
    var month = rawMonth === -1 || isNaN(rawMonth) ? 'Unknown' : moment.months()[rawMonth];
    var rawDay = parseInt(str.substr(7, 2));
    var day = rawDay > 0 ? rawDay : '';
    return modifier + " " + day + " " + month + " " + year;
};
//# sourceMappingURL=formatDate.js.map