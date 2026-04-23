-- Update reto copy: benefit-focused energy title + broader hormonal scope

UPDATE public.challenges
SET
  title    = 'Recupera tu energía en 7 días',
  subtitle = 'Sin cafeína forzada, sin azúcares de rebote. Resultados medibles en 7 días.'
WHERE slug = 'recupera-tu-energia';

UPDATE public.challenges
SET
  title       = 'Equilibrio hormonal — Protocolo de 28 días',
  subtitle    = 'Perimenopausia, SOP, tiroides, estrés hormonal. Estrobioma, fitoestrógenos, urolitinas.',
  description = 'Un programa de 28 días para equilibrar hormonas a través de la alimentación. Para la perimenopausia, desequilibrios por estrés crónico, SOP o tiroides.'
WHERE slug = 'equilibrio-hormonal-45';
