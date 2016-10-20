/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

export const LOAD_ENTITY = Symbol('load_entity');


export const loadEntity = (id: number) {
    return {
        id,
        type: loadEntity
    };
};

export const actions = {
    LOAD_ENTITY
};