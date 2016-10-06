WITH RECURSIVE parent_of(slug, parent) AS  (SELECT slug, parent FROM entity_types),
	ancestor(slug) AS (
	SELECT parent FROM parent_of WHERE slug='address'
	UNION ALL
	SELECT parent FROM parent_of JOIN ancestor USING(slug) )
	
	SELECT *
	FROM ancestor;
