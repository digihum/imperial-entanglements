/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

export interface AuthenticationService {
    getCanonicalName : (uid: number) => Promise<string>;
}
