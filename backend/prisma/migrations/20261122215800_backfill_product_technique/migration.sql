UPDATE "products"
SET "technique" = 'Barro'
WHERE "technique" IS NULL
  AND "category" LIKE '%Barro%';

UPDATE "products"
SET "technique" = 'Renda'
WHERE "technique" IS NULL
  AND "category" LIKE '%Renda%';

UPDATE "products"
SET "technique" = 'Xilogravura'
WHERE "technique" IS NULL
  AND "category" LIKE '%Xilogravura%';

UPDATE "products"
SET "technique" = 'Entalhe'
WHERE "technique" IS NULL
  AND "category" LIKE '%Madeira%';
