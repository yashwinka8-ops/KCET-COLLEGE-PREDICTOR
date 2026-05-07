import { GoogleGenerativeAI } from "@google/generative-ai";
import intelligence from "@/lib/data/intelligence.json";

export async function POST(req: Request) {
  try {
    const { messages, modelId } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const topColleges = intelligence.top_gems.map(c => `${c.name} (ID: ${c.college_id}, Avg Salary: ${c.metrics.salary}LPA, ROI: ${c.metrics.roi})`).join(", ");

    const systemPrompt = `You are the Official KCET Counselor AI for the KCET Predictor platform.
CRITICAL RULES:
1. You ONLY talk about KCET (Karnataka Common Entrance Test) and engineering colleges in Karnataka/Bangalore.
2. If a student asks about "10,000 rank", you must assume it is a KCET RANK, not JEE Main.
3. Your knowledge base includes these top institutions: ${topColleges}.
4. Mention Tier 1 colleges like RVCE, PESU, BMSCE, MSRIT, and UVCE for high ranks.
5. Mention Tier 2/3 gems like BNMIT, RNSIT, CMRIT for mid-to-high ranks.
6. Use markdown, be encouraging, and always refer to "Karnataka Counseling" or "KEA".
7. NEVER give advice about NITs, IIITs, or BITS unless specifically asked why they aren't in the KCET list. Focus on COMEDK/KCET colleges.`;

    // 1. Gemini Models
    if (modelId.startsWith('gemini')) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ 
        model: modelId,
        systemInstruction: systemPrompt
      });
      
      const chat = model.startChat({
        history: messages.slice(0, -1).map((m: any) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        })),
      });

      const result = await chat.sendMessage(lastMessage);
      const response = await result.response;
      return new Response(JSON.stringify({ content: response.text() }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. NVIDIA Models
    if (modelId.startsWith('nvidia-')) {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
        },
        body: JSON.stringify({
          model: modelId.replace('nvidia-', ''), // Strip the router prefix
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m: any) => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content
            }))
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      if (data.status === 404) throw new Error(`NVIDIA Model Not Found. It might be deprecated or restricted on your key.`);
      if (!data.choices?.[0]?.message?.content) {
        throw new Error(`Invalid response from NVIDIA: ${JSON.stringify(data)}`);
      }
      return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Groq Models (Fallback for Llama, Qwen, Mistral etc.)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }))
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    if (!data.choices?.[0]?.message?.content) {
      throw new Error(`Invalid response from Groq: ${JSON.stringify(data)}`);
    }
    return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
      headers: { "Content-Type": "application/json" },
    });

    throw new Error("Unsupported model provider");
  } catch (error: any) {
    console.error("Multi-Model API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to generate response" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
