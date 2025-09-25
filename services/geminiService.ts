import { GoogleGenAI } from "@google/genai";

// This shim is necessary because the app runs in a browser without a build step,
// so `process` is not defined. We default to an undefined API key.
const API_KEY = (typeof process !== 'undefined' && process.env && process.env.API_KEY) 
  ? process.env.API_KEY 
  : undefined;

// Warn if the API key is not available.
if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will use mock data.");
}

// Initialize the AI client only if the API key is present.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateSummary = async (content: string): Promise<string> => {
  // If the AI client wasn't initialized, return a mock summary.
  if (!ai) {
    return "This is a mock summary. Set up your Gemini API key to generate a real one.";
  }
  
  try {
    const prompt = `Please provide a concise, one-paragraph summary of the following blog post content. The summary should capture the main points and be suitable for a preview card.
---
${content}
---
Summary:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Use the .text property for direct text access
    return response.text.trim();

  } catch (error) {
    console.error("Error generating summary with Gemini API:", error);
    throw new Error("Failed to generate summary. Please check your API key and connection.");
  }
};
