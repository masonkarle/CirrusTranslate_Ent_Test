
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getTranslationDraft(text: string, sourceLang: string, targetLang: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following text from ${sourceLang} to ${targetLang}. Provide a high-quality, natural-sounding translation. Only return the translated text.
      
      Text: "${text}"`,
    });
    return response.text || "Failed to generate translation.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error getting draft. Please try again.";
  }
}

export async function reviewTranslation(source: string, target: string, sourceLang: string, targetLang: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the translation accuracy from ${sourceLang} to ${targetLang}.
      
      Original: "${source}"
      Translation: "${target}"
      
      Provide a critique and suggestions if any. If it's perfect, say "Looks good!"`,
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error during review.";
  }
}
