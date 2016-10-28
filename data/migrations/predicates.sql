DROP TABLE IF EXISTS predicates;
CREATE TABLE predicates (
    uid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name varchar(255) NOT NULL,
    description varchar(255),
    same_as varchar(255),

    domain INTEGER NOT NULL 
        REFERENCES entity_types(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    range_type varchar(255) NOT NULL,
    range_ref INTEGER CHECK(range_type != 'entity' OR range_ref is not NULL)
        REFERENCES entity_types(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
        
    readonly char(1) DEFAULT FALSE
);