DROP VIEW IF EXISTS predicate_complete;

CREATE VIEW predicate_complete AS
SELECT predicates.*, predicate_counts.count as uses
FROM predicates
LEFT JOIN (
	SELECT predicate, COUNT(*) as count
	FROM records
	GROUP BY predicate
) AS predicate_counts ON predicate_counts.predicate = predicates.uid;
