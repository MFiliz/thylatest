import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o", // veya 'gpt-4'
      messages: message,
    });
    //return Response.json({ reply: "" });
    return Response.json({
      reply: chatCompletion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
