export async function onRequestPost(context) {
  try {
    const { target, lang } = await context.request.json();
    
    // Kunci API Gemini Anda
    const geminiApiKey = 'AQ.Ab8RN6I1O5wKZNSEx1en4vWD5mdX7_bpKzvbKetGIDyRMLbzFA';

    const promptText = `Analyze the following social media account, store, or influencer objectively to check if it has scam indicators or is genuine: "${target}". IMPORTANT: Write the entire response report strictly in language code: "${lang}" (id for Indonesian, en for English, es for Spanish, zh for Chinese). Provide a risk score level and a concise summary.`;

    // Menggunakan parameter key di URL agar universal
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }]
      })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return new Response(JSON.stringify({ 
        error: data.error?.message || 'Gemini API Error', 
        details: data 
      }), {
        status: apiResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
