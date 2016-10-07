# WALK UP
WITH RECURSIVE parent_of(slug, parent) AS  (SELECT slug, parent FROM entity_types),
	ancestor(slug) AS (
	SELECT parent FROM parent_of WHERE slug='address'
	UNION ALL
	SELECT parent FROM parent_of JOIN ancestor USING(slug) )
	
	SELECT *
	FROM ancestor;

# WALK DOWN
WITH RECURSIVE parent_of(slug, parent) AS  (SELECT slug, parent FROM entity_types),
	ancestor(parent) AS (
	SELECT slug FROM parent_of WHERE slug='any'
	UNION ALL
	SELECT slug FROM parent_of JOIN ancestor USING(parent) )
	
	SELECT *
	FROM ancestor;

# GET properties from source
SELECT sources.name, elements.name, source_elements.value, elements.description, elements.comment
FROM sources
LEFT JOIN source_elements ON sources.uid = source_elements.source
LEFT JOIN elements ON source_elements.element = elements.uid;
