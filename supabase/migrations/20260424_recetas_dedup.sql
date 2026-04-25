-- Deduplicate recetas table: keep one row per nombre_es, delete the rest
-- Strategy: keep the row with the highest completeness (non-null fields),
-- tiebreak by lowest id (earliest inserted)

-- 1. Identify duplicates and which id to keep
WITH ranked AS (
  SELECT
    id,
    nombre_es,
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(TRIM(nombre_es))
      ORDER BY
        -- prefer rows with more filled fields
        (
          (CASE WHEN contexto_es    IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN nota_food_mood_es IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN chef_inspiracion IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN jsonb_array_length(ingredientes_es) > 0 THEN 1 ELSE 0 END)
        ) DESC,
        id ASC
    ) AS rn
  FROM public.recetas
),
to_delete AS (
  SELECT id FROM ranked WHERE rn > 1
)
DELETE FROM public.recetas
WHERE id IN (SELECT id FROM to_delete);

-- 2. Verify: show any remaining duplicates
SELECT LOWER(TRIM(nombre_es)) AS nombre_norm, COUNT(*) AS cnt
FROM public.recetas
GROUP BY nombre_norm
HAVING COUNT(*) > 1
ORDER BY cnt DESC;
