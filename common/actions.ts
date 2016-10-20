/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

export const LOAD_ENTITY = Symbol('load_entity');
export const ADD_TAB = Symbol('add_tab');

export const AddTab = (name: string, uid: number) => {
    return {
        type: ADD_TAB
    };
}

export const loadEntity = (id: number)  => {
    return {
        id,
        type: LOAD_ENTITY
    };
};

export const actions = {
    LOAD_ENTITY
};