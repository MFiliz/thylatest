import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  console.log("dall-e  start");
  try {
    const { prompt, meal } = await req.json();
    console.log(prompt);
    console.log(meal);

    const imageResponse = await openai.images.generate({
      prompt: prompt,
      n: 1, // Bir görsel oluştur
    });

    console.log("dall-e end");
    console.log(imageResponse.data[0].url);
    return Response.json({
      reply: imageResponse.data[0].url,
      meal: meal,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
