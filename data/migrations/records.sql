DROP TABLE IF EXISTS records;
CREATE TABLE records (
    uid <%= auto_increment %> NOT NULL,

    source INTEGER 
        REFERENCES sources(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    predicate INTEGER NOT NULL 
        REFERENCES predicates(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    entity INTEGER NOT NULL 
        REFERENCES entities(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    score INTEGER CHECK(score IN (1,2,3,4,5))
        NOT NULL
        DEFAULT 3,

    period varchar(255),

    value_type varchar(7) 
        NOT NULL
        CHECK(value_type in ('entity', 'string', 'date', 'integer', 'point', 'region')),

    value_entity INTEGER 
        REFERENCES entities(uid)
        ON UPDATE CASCADE
        ON DELETE CASCADE
        CHECK(value_type != 'entity' OR (

            (value_string is NULL) AND
            (value_date is NULL) AND 
            (value_integer is NULL) AND 
            (value_point is NULL) AND 
            (value_region is NULL))),

    value_string varchar(255)
        CHECK(value_type != 'string' OR (
            (value_entity is NULL) AND

            (value_date is NULL) AND 
            (value_integer is NULL) AND 
            (value_point is NULL) AND 
            (value_region is NULL))),

    value_date varchar(255)
        CHECK(value_type != 'date' OR (
            (value_entity is NULL) AND
            (value_string is NULL) AND

            (value_integer is NULL) AND 
            (value_point is NULL) AND 
            (value_region is NULL))),

    value_integer INTEGER
        CHECK(value_type != 'integer' OR (
            (value_entity is NULL) AND
            (value_string is NULL) AND
            (value_date is NULL) AND 

            (value_point is NULL) AND 
            (value_region is NULL))),

    value_point varchar(255)
        CHECK(value_type != 'point' OR (
            (value_entity is NULL) AND
            (value_string is NULL) AND
            (value_date is NULL) AND 
            (value_integer is NULL) AND 

            (value_region is NULL))),

    value_region varchar(255)
        CHECK(value_type != 'region' OR (
            (value_entity is NULL) AND
            (value_string is NULL) AND
            (value_date is NULL) AND 
            (value_integer is NULL) AND 
            (value_point is NULL))),

    creator INTEGER NOT NULL
        REFERENCES users(uid)
);