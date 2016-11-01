DROP TABLE IF EXISTS entity_types;
CREATE TABLE entity_types (
    uid <%= auto_increment %> NOT NULL,
    name varchar(255) NOT NULL,
    description varchar(255),

    parent INTEGER 
        REFERENCES entity_types(uid)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    same_as varchar(255),
    colour varchar(255),
    icon varchar(255),
    readonly char(1) DEFAULT FALSE
);