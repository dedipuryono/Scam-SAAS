export async function onRequestPost(context) {
  try {
    const { target, lang = "id" } = await context.request.json();

    // Validasi input
    if (!target || target.trim() === "") {
      return new Response(
        JSON.stringify({
          error: "Target tidak boleh kosong"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Ambil API Key dari Cloudflare Environment Variable
    const geminiApiKey = context.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY belum dikonfigurasi di Cloudflare"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Prompt AI
    const promptText = `
Analyze the following social media account, online store, influencer, or digital profile:

"${target}"

Instructions:
- Write the entire response in language: ${lang}
- Give a risk level:
  LOW RISK
  MEDIUM RISK
  HIGH RISK
- Explain the reasons.
- Provide a short summary.
- Be objective.
- If there is insufficient public information, clearly state that the analysis is limited.
`;

    // Request ke Gemini
    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText
                }
              ]
            }
          ]
        })
      }
    );

    const data = await apiResponse.json();

    // Logging untuk Cloudflare
    console.log("=================================");
    console.log("Gemini Status:", apiResponse.status);
    console.log("Gemini Response:", JSON.stringify(data));
    console.log("=================================");

    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({
          error:
            data?.error?.message ||
            "Gemini API Error",
          details: data
        }),
        {
          status: apiResponse.status,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Server Error:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Internal Server Error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
