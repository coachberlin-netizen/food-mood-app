-- Añadir columnas de ingredientes y elaboración a ferments_world
ALTER TABLE ferments_world
  ADD COLUMN IF NOT EXISTS ingredients text[],
  ADD COLUMN IF NOT EXISTS recipe_elaboration text;
