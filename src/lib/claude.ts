import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateRecipeForMood(
  moodId: string,
  moodName: string,
  excludedTitles?: string
) {
  let prompt = `Crea UNA receta Food·Mood para el estado "${moodName}".\n`;
  if (excludedTitles) {
    prompt += `IMPORTANTE: El usuario ya ha probado estas recetas este mes: ${excludedTitles}. Por favor, genera una receta COMPLETAMENTE DIFERENTE a estas.\n`;
  }
  prompt += `
Responde SOLO JSON puro (sin markdown, sin bloques de código, solo el objeto JSON crudo):
{
  "title": "nombre de la receta interactiva y wellness",
  "tagline": "frase corta que despierte calma o enfoque",
  "prepTime": 20,
  "difficulty": "facil",
  "servings": 2,
  "ingredients": [{"name": "ejemplo: Kale", "quantity": "100g"}],
  "steps": ["paso 1 de preparación", "paso 2"],
  "foodMoodNote": "Dato curioso sobre la conexión intestino-cerebro (max 2 frases cálidas)",
  "imagePrompt": "descripción visual minimalista para generar la imagen de la receta"
}`;

  const msg = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1500,
    temperature: 0.7,
    messages: [{role: 'user', content: prompt}]
  })

  try {
    // Haiku a veces añade texto, así que parsear asegurando el JSON
    const block = msg.content[0];
    const text = block.type === 'text' ? block.text.trim() : '';
    // Limpiar bloque markdown si la IA insiste en ponerlo
    const jsonStr = text.replace(/^```json/g, '').replace(/```$/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("No se pudo parsear el JSON de Claude:", e, msg.content);
    throw new Error('Claude no devolvió un JSON válido.');
  }
}
