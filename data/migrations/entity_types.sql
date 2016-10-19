DROP TABLE IF EXISTS entity_types;
CREATE TABLE entity_types (
    uid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,

    parent INTEGER 
        REFERENCES entity_types(uid)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    same_as varchar(255) NOT NULL,
    colour varchar(255) NOT NULL,
    icon varchar(255) NOT NULL,
    readonly char(1) DEFAULT FALSE
);