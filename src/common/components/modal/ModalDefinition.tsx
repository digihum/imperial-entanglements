/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

export interface ModalDefinition {
    name: string;
    cancel: () => void;
    complete: (arg?: any) => void;
    settings: {
        [s: string]: any;
    };
}