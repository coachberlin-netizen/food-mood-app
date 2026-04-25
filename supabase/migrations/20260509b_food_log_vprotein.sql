-- Añadir proteína vegetal a la tabla food_log
ALTER TABLE public.food_log
  ADD COLUMN IF NOT EXISTS vprotein_count int NOT NULL DEFAULT 0;
