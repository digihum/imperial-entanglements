# Merging SQL Algorithm

The merge should be all or nothing. 
## Tables to merge
- Sources
- Source Elements
- Entity Types
- Predicates
- Entities
- Records

## CRUD

### Sources
Create: Calculate new ids and copy data
- ISSUE: The parent may no longer exist
- It is unlikely that the user will input a duplicate source

Update: Find the source with the same ID and update it 
- ISSUE: The source may have been deleted
- ISSUE: The source may have been updated, possibly even a direct conflict

Delete: Find the source with the ID and delete it
- ISSUE: Records rely on Sources will be affected (there may be new once since the fork)
- ISSUE: Sources may have this set as their parent
- ISSUE: The source may have been updated by another user in their absense
- ISSUE: The source may have already been deleted!

### Entity Types

Create:
    - ISSUE: The parent may no longer exist
    - ISSUE: It is likely that another user may have added an entity type since the fork

Update:

Delete: