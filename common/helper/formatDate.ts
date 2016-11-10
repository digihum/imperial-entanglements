/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as moment from 'moment';

export const formatDate : (s: string) => string = (str: string) => {
      const modifier = {
            '=': '',
            '>': 'After ',
            '<': 'Before '
        }[str[0]];

        return modifier + moment({
            year: str.substr(1, 4),
            month: parseInt(str.substr(5, 2)) - 1,
            day: str.substr(7, 2)
        }).format('Do MMM YYYY');
};