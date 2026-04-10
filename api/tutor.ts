export const maxDuration = 60; // Allow up to 60 seconds for OpenRouter API

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;
    
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim();

    if (!OPENROUTER_API_KEY) {
      console.error("Missing OPENROUTER_API_KEY environment variable");
      return res.status(500).json({ error: "API Key configuration missing" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "https://micromaster.app",
        "X-Title": "MicroMaster AI Tutor"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: messages,
        reasoning: { enabled: true }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      
      let errorMessage = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorText;
      } catch (e) {
        // Ignore parse error
      }
      
      return res.status(response.status).json({ error: `OpenRouter Error: ${errorMessage}` });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;
    
    if (!message) {
      return res.status(500).json({ error: "No response generated" });
    }

    return res.status(200).json({ 
      text: message.content || "I'm sorry, I couldn't generate a response.",
      reasoning_details: message.reasoning_details
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Failed to generate content" });
  }
}
