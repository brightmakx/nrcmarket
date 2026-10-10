
CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE "ecommerce"."Service"
ADD COLUMN IF NOT EXISTS "search_vector" tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE("name", '')), 'A')
    ||
    setweight(to_tsvector('english', COALESCE("description", '')), 'B')
) STORED;

CREATE INDEX IF NOT EXISTS "services_search_idx"
ON "ecommerce"."Service" USING GIN ("search_vector");

CREATE INDEX IF NOT EXISTS "services_name_trgm_idx"
ON "ecommerce"."Service" USING GIN ("name" public.gin_trgm_ops);
