import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { question, context } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
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

    return res.status(200).json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to generate content" });
  }
}
