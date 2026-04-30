/**
 * Añade la lista_compra al reto Microhábitos en Supabase.
 * Uso: node scripts/patch-lista-compra-microhabitos.mjs
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const LISTA_COMPRA = [
  {
    categoria: 'Fermentados y probióticos',
    items: [
      'Kéfir (de vaca, cabra o vegano) — 1 litro',
      'Kombucha embotellada al natural — 2 botellas',
      'Agua de kéfir — 500ml (o gránulos para preparar en casa)',
      'Leche de avena fermentada — 500ml (o leche de avena normal)',
    ],
  },
  {
    categoria: 'Frutas frescas y secas',
    items: [
      'Limones frescos — 6 unidades',
      'Limas — 3 unidades',
      'Arándanos — 150g',
      'Frambuesas — 150g',
      'Fresas — 200g',
      'Mango (fresco o congelado) — 2 unidades',
      'Plátanos — 4 unidades',
      'Pera madura — 2 unidades',
      'Naranja sanguina — 2 unidades (o naranja normal)',
      'Manzana — 2 unidades',
      'Frutos rojos mezclados — 200g (frescos o congelados)',
      'Cerezas — 150g (frescas o congeladas)',
      'Dátiles medjool — 6 unidades',
      'Membrillo — 1 unidad (o mermelada de membrillo)',
    ],
  },
  {
    categoria: 'Verduras, raíces y aromáticas',
    items: [
      'Jengibre fresco — 1 raíz grande',
      'Menta fresca — 1 manojo',
      'Albahaca fresca — 1 manojo',
      'Apio — 2 tallos',
      'Pepino — 1 unidad',
      'Nueces — 50g',
    ],
  },
  {
    categoria: 'Especias y polvos funcionales',
    items: [
      'Cúrcuma en polvo',
      'Pimienta negra molida',
      'Canela en polvo o en rama',
      'Cardamomo en polvo o vainas',
      'Cacao puro en polvo (sin azúcar)',
      'Vainilla en polvo o extracto puro',
      'Lavanda comestible seca (opcional)',
      'Flores de hibisco secas — 20g',
    ],
  },
  {
    categoria: 'Adaptógenos y superalimentos',
    items: [
      'Ashwagandha en polvo — 100g',
      'Maca en polvo — 100g',
      'Hongos reishi en polvo — 50g (opcional)',
      'Tahini (pasta de sésamo) — 1 bote pequeño',
    ],
  },
  {
    categoria: 'Endulzantes y extras',
    items: [
      'Miel cruda — 1 tarro',
      'Miel de manuka (opcional, para día 15)',
      'Agua de rosas comestible — 1 botella pequeña',
      'Agua con gas — 2 litros',
      'Pétalos de rosa comestibles secos (opcional, día 21)',
    ],
  },
]

const { error } = await supabase
  .from('challenges')
  .update({ lista_compra: LISTA_COMPRA })
  .eq('slug', 'microhabitos')

if (error) {
  console.error('❌', error.message)
  process.exit(1)
}

console.log('✅ lista_compra actualizada para el reto Microhábitos')
