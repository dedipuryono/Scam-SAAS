export async function onRequestPost(context) {
  try {
    const { target, lang } = await context.request.json();
    
    // Kunci API Gemini Anda yang baru dan valid
    const geminiApiKey = 'Ab8RN6ID33Wk9Kljrk70UeDIi9UzbcweuG-Z4-pPoNsmoX3frw';

    const promptText = `Analyze the following social media account, store, or influencer objectively to check if it has scam indicators or is genuine: "${target}". IMPORTANT: Write the entire response report strictly in language code: "${lang}" (id for Indonesian, en for English, es for Spanish, zh for Chinese). Provide a risk score level and a concise summary.`;

    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
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
