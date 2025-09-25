
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    // In a real app, you'd have a more robust way of handling this,
    // but for this context, we'll throw an error if it's missing.
    // The framework is expected to provide this variable.
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateSummary = async (content: string): Promise<string> => {
  if (!process.env.API_KEY) {
    // Return a mock summary if API key is not available
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
