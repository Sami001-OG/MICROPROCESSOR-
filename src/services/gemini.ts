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
      text: data.text || "দুঃখিত, আমি কোনো উত্তর তৈরি করতে পারিনি।",
      reasoning_details: data.reasoning_details
    };
  } catch (error: any) {
    console.error("Tutor API Error:", error);
    
    if (error.message?.includes("API Key configuration missing")) {
      return { text: "⚠️ কনফিগারেশন ত্রুটি: OPENROUTER_API_KEY এনভায়রনমেন্ট ভেরিয়েবলটি অনুপস্থিত। যেহেতু আপনি Vercel-এ ডিপ্লয় করেছেন, আপনাকে অবশ্যই আপনার Vercel Project Settings -> Environment Variables-এ এই কী (key) যোগ করতে হবে এবং তারপর পুনরায় ডিপ্লয় করতে হবে।" };
    }
    
    return { text: `দুঃখিত, আমার নলেজ বেসের সাথে সংযোগ করতে সমস্যা হচ্ছে। ত্রুটি: ${error.message || 'অজানা ত্রুটি'}` };
  }
}
