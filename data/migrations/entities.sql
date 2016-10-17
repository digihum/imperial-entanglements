DROP TABLE IF EXISTS entities;
CREATE TABLE entities (
    uid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    label varchar(255) NOT NULL,

    type INTEGER NOT NULL REFERENCES entity_types(uid),

    parent INTEGER REFERENCES entities(uid),

    readonly char(1) DEFAULT FALSE
);