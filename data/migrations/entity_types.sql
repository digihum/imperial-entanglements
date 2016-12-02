DROP TABLE IF EXISTS entity_types;
CREATE TABLE entity_types (
    uid <%= auto_increment %> NOT NULL,
    label varchar(255) NOT NULL,
    description varchar(255),

    parent INTEGER 
        REFERENCES entity_types(uid)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    same_as varchar(255),
    colour varchar(255),
    icon varchar(255),
    readonly INTEGER DEFAULT 0,

    creator INTEGER NOT NULL
        REFERENCES users(uid),

    creation_timestamp varchar(255) NOT NULL,
    lastmodified_timestamp varchar(255) NOT NULL
);
