/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

export interface AuthenticationService {
    getCanonicalName : (uid: number) => Promise<string>;
}