ALTER TABLE venture
ALTER COLUMN program_areas TYPE text[]
USING program_areas::text[];
