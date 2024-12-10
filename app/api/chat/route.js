import { OpenAI } from "openai";
import { database, ref, set } from "../../../lib/firebase";
import normalizeText from "../../../lib/sanitizer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o", // veya 'gpt-4'
      messages: [
        {
          role: "system",
          content:
            "Sen bir yemek uzmanısın. Kullanıcıya menü analizi ve yemek önerileri hakkında yardımcı ol.",
        },

        {
          role: "user",
          content:
            message[0] +
            '. Bu bir uçak yemek menüsüdür. Bu menüdeki yemek isimlerinin büyük harfle yazıldığını göreceksin. Büyük harfle başlayıp küçük devam edenler ise yanındaki eşlikçilerdir. Her yemekte eşlikçi olmayabilir. aralarında veya olan yemeklerden yanlızca birisi seçilebilir. Bana her yemek için yemekadi, eslikci ve aciklama şeklinde dönmeni istiyorum. Dönen sonuç json array içerisinde json objeler şeklinde olmalıdır. aciklama kısmında yemeğin içeriğine göre maksimum 25 kelimelik bir tanıtım yazmanı istiyorum. Yemek isimlerinin ingilizce adlarını yemekadi2 içerisinde, eslikci2 icine eslikciye yazdığın gibi ama ingilizcesini, aciklama2 içerisinde ise 25 kelimelik ingilizce bir tanıtım yazısı yazmanı istiyorum. Diğer açıklama vb şeyleri istemiyorum. tereyağ, reçel, ekmek bir yemektir. Turşu ayrı bir yemektir. Ona göre listeye eklemeni istiyorum. Yerel seçenek bir yemek değildir. Listeye ekleme. \n Bana her yemek için dalle adinda bir property içerisinde, dall-e openai apisine bu yemeklere ait resim çizdirmek için gerekli komutları da vermeni istiyorum. Gelen komutu direk dall-e ye vereceğim. Açıklayıcı olsun. Ayrıca bu yemeklerin ortalama kaç kalori olduklarını calories alanı ile, gluten içerip içermediğini gluten alanı ile, vegan olup olmadığını vegan alanı ile, alerjen içerip içermedğini allergen alanı ile dönmeni istiyorum. url alanında ise internette bulacağın 512x512 piksel ebatların bu yemek ile alakadar resim urllerini döndür. Bana şu formatta JSON döndür: [{ "yemekadi": "", "aciklama": "", "dalle": "",  "eslikci": "","eslikci2": "", "yemekadi2":"" , "aciklama2":"", "calories":"", "gluten": "","vegan": "", "allergen":"", "url":"" }].',
        },
      ],
    });

    let cleanedString = chatCompletion.choices[0].message.content
      .replaceAll("json", "")
      .replaceAll("`", "")
      .trim();

    var jsonObject = [];
    jsonObject = JSON.parse(cleanedString) || [];

    const normalizedData = jsonObject.map((item) => {
      return {
        ...item, // Objeyi olduğu gibi tut
        normalizedText: normalizeText(item.yemekadi), // Yeni bir alan ekle
      };
    });

    await set(ref(database, "meals"), normalizedData);
    return Response.json({ reply: normalizedData });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
