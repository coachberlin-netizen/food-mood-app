import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const keyLine = envContent.split('\n').find(line => line.startsWith('ANTHROPIC_API_KEY='));
const apiKey = keyLine ? keyLine.split('=')[1] : undefined;

const client = new Anthropic({ apiKey });

async function run() {
  const prompt = `Crea UNA receta Food·Mood para el estado "Focus".

Responde SOLO JSON puro (sin markdown, sin bloques de código, solo el objeto JSON crudo):
{
  "title": "nombre",
  "tagline": "frase corta",
  "prepTime": 20,
  "difficulty": "facil",
  "servings": 2,
  "ingredients": [{"name": "x", "quantity": "100g"}],
  "steps": ["paso 1", "paso 2"],
  "foodMoodNote": "conexión intestino-cerebro (2 frases)",
  "imagePrompt": "descripción visual para imagen"
}`;

  try {
    const msg = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{role: 'user', content: prompt}]
    });
    console.log("Success:", msg.content);
  } catch (error) {
    console.error("Error connecting to Claude:", error);
  }
}
run();
