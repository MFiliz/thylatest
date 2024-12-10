export default function normalizeText(text) {
  // Türkçe karakterler ve dönüştürme eşlemeleri
  const turkishCharsMap = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };

  // Türkçe karakterleri dönüştürme
  const normalized = text
    .split("")
    .map((char) => turkishCharsMap[char] || char) // Türkçe karakterleri dönüştür
    .join("");

  return normalized
    .toLowerCase() // Küçük harfe çevir
    .replace(/[^a-z0-9\s-]/g, "") // Özel karakterleri kaldır (sadece harf, sayı, boşluk ve "-" bırak)
    .replace(/\s+/g, "-") // Boşlukları "-" ile değiştir
    .replace(/-+/g, "-") // Birden fazla "-" varsa bir "-" ile değiştir
    .trim(); // Baş ve sondaki boşlukları kaldır
}
