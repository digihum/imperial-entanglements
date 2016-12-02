DROP TABLE IF EXISTS sources;
CREATE TABLE sources (
    uid <%= auto_increment %> NOT NULL,
    label varchar(255) NOT NULL,
    same_as varchar(255),
    parent INTEGER 
        REFERENCES sources(uid)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    readonly INTEGER DEFAULT 0,
    
    creator INTEGER NOT NULL
        REFERENCES users(uid),

    creation_timestamp varchar(255) NOT NULL,
    lastmodified_timestamp varchar(255) NOT NULL
);

DROP TABLE IF EXISTS element_sets;
CREATE TABLE element_sets (
    uid <%= auto_increment %> NOT NULL,
    uri varchar(255),
    label varchar(255),
    description varchar(255)
);

DROP TABLE IF EXISTS elements;
CREATE TABLE elements (
    uid <%= auto_increment %> NOT NULL,
    uri varchar(255),

    element_set INTEGER NOT NULL
        REFERENCES element_sets(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    label varchar(255) NOT NULL,
    description varchar(255),
    comment varchar(255)
);

DROP TABLE IF EXISTS source_elements;
CREATE TABLE source_elements (

    source INTEGER NOT NULL 
        REFERENCES sources(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    element INTEGER NOT NULL 
        REFERENCES elements(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    value varchar(255),

    creator INTEGER NOT NULL
        REFERENCES users(uid),

    creation_timestamp varchar(255) NOT NULL,
    lastmodified_timestamp varchar(255) NOT NULL,

    PRIMARY KEY (source, element)
);
