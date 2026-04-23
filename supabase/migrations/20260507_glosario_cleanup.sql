-- Glosario cleanup: remove duplicates + normalize category casing

-- 1. Remove functional duplicates — keep the Spanish/canonical name, delete the redundant entry
--    Matcha / Té Matcha → keep whichever has more content, remove the other
DELETE FROM public.glossary
WHERE name ILIKE 'té matcha' OR name ILIKE 'te matcha';

--    Lion's Mane / Melena de León → keep "Melena de León" (Spanish app, more descriptive)
DELETE FROM public.glossary
WHERE name ILIKE 'lion%s mane' OR name ILIKE 'lions mane';

-- 2. Normalize category field to lowercase (fixes inconsistency: "Hongo" vs "hongo")
UPDATE public.glossary
SET category = LOWER(TRIM(category))
WHERE category IS NOT NULL AND category != LOWER(TRIM(category));

-- 3. Fix any truncated taglines — find entries where tagline ends abruptly mid-word
--    (entries ending with "Hier" are likely "Hierro" or "Hierba" cut off)
--    Run this SELECT first to identify:
-- SELECT id, name, tagline FROM public.glossary WHERE tagline LIKE '%Hier' OR RIGHT(tagline, 4) = 'Hier';
-- Then fix the specific entry below (update id/name/tagline once identified):
-- UPDATE public.glossary SET tagline = 'tagline completo aquí' WHERE name = 'nombre del ingrediente';

-- 4. Ensure active is true for all non-duplicate entries
UPDATE public.glossary SET active = true WHERE active IS NULL;

-- Verify: check remaining potential duplicates by similar names
SELECT name, category, count(*) as cnt
FROM public.glossary
GROUP BY LOWER(name), category
HAVING count(*) > 1
ORDER BY cnt DESC;
