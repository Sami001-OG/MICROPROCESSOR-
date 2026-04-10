export async function askTutor(messages: any[]) {
  try {
    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return {
      text: data.text || "I'm sorry, I couldn't generate a response.",
      reasoning_details: data.reasoning_details
    };
  } catch (error: any) {
    console.error("Tutor API Error:", error);
    
    if (error.message?.includes("API Key configuration missing")) {
      return { text: "⚠️ Configuration Error: The OPENROUTER_API_KEY environment variable is missing. Since you deployed to Vercel, you must add this key in your Vercel Project Settings -> Environment Variables, and then redeploy." };
    }
    
    return { text: `I'm sorry, I'm having trouble connecting to my knowledge base right now. Error: ${error.message || 'Unknown error'}` };
  }
}
