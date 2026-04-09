import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askTutor(question: string, context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `You are an expert microprocessor professor specializing in 8085 and 8086 architectures. 
      Answer the following question based on the provided context or your general expertise.
      Keep the tone educational, clear, and professional.
      
      Context: ${context}
      Question: ${question}`,
      config: {
        systemInstruction: "You are a world-class expert on Intel 8085 and 8086 microprocessors. You help students achieve mastery by explaining complex concepts simply, providing assembly code examples, and correcting misunderstandings.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
}
