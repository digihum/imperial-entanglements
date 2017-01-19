`
SELECT records.value_type, predicates.range_type
FROM records
INNER JOIN predicates ON records.predicate = predicates.uid
`

//should be 0 - checks that record types are in sync with their predicates
`
SELECT SUM((records.value_type != predicates.range_type)) AS test
FROM records
INNER JOIN predicates ON records.predicate = predicates.uid
`


// checks that predicate ranges are being respected
`
SELECT predicates.range_ref, entities.type, (

 entities.type in (
	WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
                ancestor(parent) AS (
                SELECT uid FROM parent_of WHERE uid=predicates.range_ref
                UNION ALL
                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
				SELECT * from ancestor
)

) as valid
FROM records
INNER JOIN predicates ON predicates.uid = records.predicate
INNER JOIN entities ON entities.uid = predicates.range_ref
WHERE records.value_type = 'entity';
`

// checks that predicate domains are being respected
`
SELECT SUM((

 entities.type in (
	WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
                ancestor(parent) AS (
                SELECT uid FROM parent_of WHERE uid=predicates.range_ref
                UNION ALL
                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
				SELECT * from ancestor
)

)) as valid
FROM records
INNER JOIN predicates ON predicates.uid = records.predicate
INNER JOIN entities ON entities.uid = predicates.range_ref
WHERE records.value_type = 'entity';
`
