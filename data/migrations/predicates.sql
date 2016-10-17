DROP TABLE IF EXISTS predicates;
CREATE TABLE predicates (
    uid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name varchar(255) NOT NULL,
    description varchar(255),
    same_as varchar(255),

    domain INTEGER NOT NULL REFERENCES entity_types(uid),

    range_type char(3) NOT NULL CHECK(range_type IN ('val', 'ref')),
    range_val varchar(255) CHECK(range_type != 'val' OR ((range_ref is NULL) AND (range_val is not NULL))),
    range_ref varchar(255) CHECK(range_type != 'ref' OR ((range_val is NULL) AND (range_ref is not NULL))),
    readonly char(1) DEFAULT FALSE
);