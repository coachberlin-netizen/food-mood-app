import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateRecipeImage } from '@/lib/ai/image-generator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipeName, moodId, ingredients } = body;

    if (!recipeName || !moodId) {
      return NextResponse.json({ error: 'recipeName and moodId are required' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Create a safe, consistent filename
    const safeName = recipeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `${safeName}-${moodId}.jpg`;

    // 1. Check if it already exists in cache
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('recipe-images')
      .list('', { search: filename });
      
    if (existingFiles && existingFiles.length > 0) {
      const match = existingFiles.find(f => f.name === filename);
      if (match) {
        // Exists in cache!
        const { data } = supabase.storage.from('recipe-images').getPublicUrl(filename);
        return NextResponse.json({ url: data.publicUrl, cached: true });
      }
    }

    // 2. Generate new image
    const { base64, mimeType } = await generateRecipeImage(recipeName, moodId, ingredients || []);
    
    // 3. Convert absolute base64 to buffer
    const buffer = Buffer.from(base64, 'base64');

    // 4. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(filename, buffer, { 
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: `Failed to upload to storage: ${uploadError.message}` }, { status: 500 });
    }

    // 5. Get Public URL
    const { data } = supabase.storage.from('recipe-images').getPublicUrl(filename);
    
    return NextResponse.json({ url: data.publicUrl, cached: false });
    
  } catch (err: any) {
    console.error('API Error generating image:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
