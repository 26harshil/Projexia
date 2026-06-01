ALTER TABLE "projectgroup"
ADD COLUMN IF NOT EXISTS "projectdeadline" TIMESTAMP(6) DEFAULT (CURRENT_TIMESTAMP + INTERVAL '3 months'),
ADD COLUMN IF NOT EXISTS "projectprogress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "projectmarks" DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS "projectfeedback" TEXT;

UPDATE "projectgroup"
SET "projectdeadline" = COALESCE("projectdeadline", "created" + INTERVAL '3 months'),
    "projectprogress" = COALESCE("projectprogress", 0)
WHERE "projectdeadline" IS NULL
   OR "projectprogress" IS NULL;
