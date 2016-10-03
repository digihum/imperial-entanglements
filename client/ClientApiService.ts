/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { ApiService } from '../common/ApiService';

export class ClientApiService implements ApiService {

    public getCanonicalName(uid: number) : Promise<string> {
        return fetch('/noidea')
        .then((response) => response.text());
    }


}