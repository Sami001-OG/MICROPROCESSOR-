export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { question, context } = req.body;
    
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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";

    const systemInstruction = "You are a world-class expert on Intel 8085 and 8086 microprocessors. You help students achieve mastery by explaining complex concepts simply, providing assembly code examples, and correcting misunderstandings.";
    
    const prompt = `You are an expert microprocessor professor specializing in 8085 and 8086 architectures. 
Answer the following question based on the provided context or your general expertise.
Keep the tone educational, clear, and professional.

Context: ${context}
Question: ${question}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      return res.status(response.status).json({ error: "Failed to generate content from OpenRouter" });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return res.status(200).json({ text });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Failed to generate content" });
  }
}
