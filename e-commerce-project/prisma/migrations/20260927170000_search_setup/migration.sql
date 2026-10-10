-- Enable trigram support used by the product-name search index
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Existing product search vector
ALTER TABLE "ecommerce"."Product"
ADD COLUMN "search_vector" tsvector
GENERATED ALWAYS AS (
    setweight(
        to_tsvector('english', COALESCE(name, '')),
        'A'
    )
    ||
    setweight(
        to_tsvector('english', COALESCE(description, '')),
        'B'
    )
) STORED;

-- Full-text search index
CREATE INDEX "products_search_idx"
ON "ecommerce"."Product"
USING GIN ("search_vector");

-- Fuzzy/trigram name search index
CREATE INDEX "products_name_trgm_idx"
ON "ecommerce"."Product"
USING GIN ("name" gin_trgm_ops);

