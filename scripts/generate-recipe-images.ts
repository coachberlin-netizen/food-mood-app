// scripts/generate-recipe-images.ts
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';
import { recipesData } from '../src/data/recipes';

// Setup Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Setup Gemini Image Generation
async function generateImage(recipeName: string, moodId: string, ingredients: string[]) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  const moodStyling: Record<string, string> = {
    activacion: 'bright morning light, citrus colors, energetic composition',
    calma: 'soft diffused light, muted purples and creams, minimal composition',
    focus: 'clean composition, green tones, sharp focus on center',
    social: 'multiple plates, convivial setting, warm golden hour light',
    reset: 'bright and clean, white and turquoise tones, fresh ingredients visible',
    confort: 'warm candlelight, amber tones, steam rising, cozy setting',
  };
  const style = moodStyling[moodId] || 'beautiful presentation';
  const ings = ingredients.length ? ` featuring ${ingredients.slice(0,3).join(', ')}` : '';
  const prompt = `Professional food photography of ${recipeName}${ings}. ${style}.
Shot from above at 45 degrees. Natural light from the left. 
On a handmade ceramic plate. Rustic wooden table background.
Warm tones, shallow depth of field. No text, no logos.
Style: editorial food magazine, Kinfolk aesthetic.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1, outputOptions: { mimeType: 'image/jpeg' } }
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  return {
    base64: data.predictions?.[0]?.bytesBase64Encoded || data.predictions?.[0]?.bytesBase64,
    mimeType: data.predictions?.[0]?.mimeType || 'image/jpeg'
  };
}

async function main() {
  const mapPath = path.join(__dirname, '../src/data/recipe-image-map.json');
  let imageMap: Record<string, string> = {};
  if (fs.existsSync(mapPath)) {
    const raw = fs.readFileSync(mapPath, 'utf8');
    if (raw.trim()) imageMap = JSON.parse(raw);
  }

  console.log(`Starting generation for ${recipesData.length} recipes...`);

  for (const recipe of recipesData) {
    console.log(`\nProcessing: [${recipe.moodId}] ${recipe.title}`);
    const safeName = recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `${safeName}-${recipe.moodId}.jpg`;

    // Check if exists
    const { data: existingFiles } = await supabase.storage.from('recipe-images').list('', { search: filename });
    if (existingFiles && existingFiles.find(f => f.name === filename)) {
      console.log(`  -> EXISTS! Using cached.`);
      const { data } = supabase.storage.from('recipe-images').getPublicUrl(filename);
      imageMap[recipe.id] = data.publicUrl;
    } else {
      try {
        console.log(`  -> Generating new image via Gemini Imagen...`);
        const { base64, mimeType } = await generateImage(recipe.title, recipe.moodId, recipe.ingredients.map(i => i.name));
        const buffer = Buffer.from(base64, 'base64');
        
        console.log(`  -> Uploading to Supabase...`);
        const { error } = await supabase.storage.from('recipe-images').upload(filename, buffer, {
          contentType: mimeType, upsert: true
        });
        
        if (error) {
           console.error(`  -> UPLOAD ERROR:`, error.message);
        } else {
           const { data } = supabase.storage.from('recipe-images').getPublicUrl(filename);
           imageMap[recipe.id] = data.publicUrl;
           console.log(`  -> SUCCESS: ${data.publicUrl}`);
        }
      } catch (err: any) {
        console.error(`  -> GENERATION ERROR:`, err.message);
      }
      
      // Artificial delay for rate limiting
      console.log('  -> Waiting 2 seconds...');
      await new Promise(r => setTimeout(r, 2000));
    }
    
    // Write incrementally so we don't lose data on crash
    fs.writeFileSync(mapPath, JSON.stringify(imageMap, null, 2));
  }
  
  console.log('\n--- BATCH GENERATION COMPLETE! ---');
}

main().catch(console.error);
