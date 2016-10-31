DROP VIEW predicate_usage;

CREATE VIEW predicate_usage AS
SELECT predicate, COUNT(*) as 'count'
FROM records
GROUP BY predicate;