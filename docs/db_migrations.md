# Write your own database migration tool
call it dunkey, build it with bubbletea

## Features
- [ ] Write migrations in SQL, CLI should create a new migration file with a timestamp and the migration name
- [ ] Migrations table in the database should have - 
  - filename text primary key
  - applied_at timestamp
- [ ] When applying migrations, the CLI should be verbose
  - integrity check
    - filesystem migrations match db migrations table (check if file changed after migration applied)
  - check db table for last applied migration
  - apply migrations if any are pending
- [ ] clean database command