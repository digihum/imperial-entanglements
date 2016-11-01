DROP TABLE IF EXISTS entities;
CREATE TABLE entities (
    uid <%= auto_increment %> NOT NULL,
    label varchar(255) NOT NULL,

    type INTEGER NOT NULL
        REFERENCES entity_types(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    parent INTEGER 
        REFERENCES entities(uid)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    readonly INTEGER DEFAULT 0
);