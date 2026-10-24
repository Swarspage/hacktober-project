import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: process.env.GEMMA_MODEL,
    contents: 'Say hello in Hindi',
  });

  console.log(response.text);
}

main();
