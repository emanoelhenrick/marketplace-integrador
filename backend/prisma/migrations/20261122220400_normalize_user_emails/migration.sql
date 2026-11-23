DO $$
BEGIN
  IF EXISTS (
    SELECT LOWER(BTRIM(email))
    FROM "users"
    GROUP BY LOWER(BTRIM(email))
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Cannot normalize emails: duplicate normalized email addresses exist';
  END IF;
END $$;

UPDATE "users"
SET "email" = LOWER(BTRIM("email")),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "email" <> LOWER(BTRIM("email"));
