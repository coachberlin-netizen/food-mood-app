// src/lib/ai/image-generator.ts

const MOOD_STYLING: Record<string, string> = {
  activacion: 'bright morning light, citrus colors, energetic composition',
  calma: 'soft diffused light, muted purples and creams, minimal composition',
  focus: 'clean composition, green tones, sharp focus on center',
  social: 'multiple plates, convivial setting, warm golden hour light',
  reset: 'bright and clean, white and turquoise tones, fresh ingredients visible',
  confort: 'warm candlelight, amber tones, steam rising, cozy setting',
};

export async function generateRecipeImage(
  recipeName: string,
  moodId: string,
  ingredients: string[]
): Promise<{ base64: string; mimeType: string }> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_AI_API_KEY is not defined in the environment.');
  }

  const moodStyling = MOOD_STYLING[moodId] || 'beautiful presentation, high quality, appealing food photography';
  const ingredientsText = ingredients.length > 0 ? ` featuring ${ingredients.slice(0, 3).join(', ')}` : '';
  
  const prompt = `Professional food photography of ${recipeName}${ingredientsText}. ${moodStyling}.
Shot from above at 45 degrees. Natural light from the left. 
On a handmade ceramic plate. Rustic wooden table background.
Warm tones, shallow depth of field. No text, no logos.
Style: editorial food magazine, Kinfolk aesthetic.`;

  // We use the REST endpoint for Imagen directly to avoid any missing methods in the SDK
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        outputOptions: { mimeType: 'image/jpeg' }
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini Imagen error:', errorText);
    throw new Error(`Failed to generate image: ${response.status} ${response.statusText}. Details: ${errorText}`);
  }

  const data = await response.json();
  const base64Image = data.predictions?.[0]?.bytesBase64Encoded || data.predictions?.[0]?.bytesBase64;
  const mimeType = data.predictions?.[0]?.mimeType || 'image/jpeg';
  
  if (!base64Image) {
    throw new Error('API request successful but no image data returned.');
  }

  return { base64: base64Image, mimeType };
}
