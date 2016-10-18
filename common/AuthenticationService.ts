/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

export interface AuthenticationService {
    getCanonicalName : (uid: number) => Promise<string>;
}