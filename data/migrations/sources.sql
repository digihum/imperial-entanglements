DROP TABLE IF EXISTS sources;
CREATE TABLE sources (
    uid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name varchar(255) NOT NULL,
    same_as varchar(255),
    readonly char(1) DEFAULT FALSE
);

DROP TABLE IF EXISTS element_sets;
CREATE TABLE element_sets (
    uid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    uri varchar(255),
    name varchar(255),
    description varchar(255)
);

DROP TABLE IF EXISTS elements;
CREATE TABLE elements (
    uid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    uri varchar(255),

    element_set INTEGER NOT NULL
        REFERENCES element_sets(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    name varchar(255) NOT NULL,
    description varchar(255),
    comment varchar(255)
);

DROP TABLE IF EXISTS source_elements;
CREATE TABLE source_elements (
    uid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

    source INTEGER NOT NULL 
        REFERENCES sources(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    element INTEGER NOT NULL 
        REFERENCES elements(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    value varchar(255)
);