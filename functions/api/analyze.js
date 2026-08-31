export async function onRequestPost(context) {
  try {
    const { target, lang } = await context.request.json();
    
    // Kunci API baru berformat AQ. milik Anda
    const geminiApiKey = 'AQ.Ab8RN6LM-39cBevmRuS2yPoa9N6q5Way6iX9WzyTxgK_1r5kgA';

    const promptText = `Analyze the following social media account, store, or influencer objectively to check if it has scam indicators or is genuine: "${target}". IMPORTANT: Write the entire response report strictly in language code: "${lang}" (id for Indonesian, en for English, es for Spanish, zh for Chinese). Provide a risk score level and a concise summary.`;

    const apiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey
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
