/**
 * Ürün açıklamasını Word veya zengin metin formatından temizler ve biçimlendirir.
 */

export function cleanWordHtml(html: string): string {
  if (!html) return "";

  let clean = html;

  // 1. Word XML ve özel yorum taglarını kaldır
  clean = clean.replace(/<!--[\s\S]*?-->/gi, "");
  clean = clean.replace(/<xml[\s\S]*?<\/xml>/gi, "");
  clean = clean.replace(/<style[\s\S]*?<\/style>/gi, "");
  clean = clean.replace(/<script[\s\S]*?<\/script>/gi, "");
  clean = clean.replace(/<o:p[\s\S]*?<\/o:p>/gi, "");
  clean = clean.replace(/<\/?o:p[^>]*>/gi, "");
  clean = clean.replace(/<\/?w:[^>]*>/gi, "");
  clean = clean.replace(/<\/?m:[^>]*>/gi, "");
  clean = clean.replace(/<\/?v:[^>]*>/gi, "");

  // 2. Word Mso ve gereksiz class/style özniteliklerini kaldır
  clean = clean.replace(/class="[^"]*"/gi, "");
  clean = clean.replace(/class='[^']*'/gi, "");
  clean = clean.replace(/style="[^"]*mso-[^"]*"/gi, "");
  clean = clean.replace(/style="[^"]*color:\s*(?:black|windowtext|#000000|rgb\(0,\s*0,\s*0\))[^"]*"/gi, "");
  clean = clean.replace(/style="[^"]*background(?:-color)?:\s*(?:white|#ffffff|rgb\(255,\s*255,\s*255\))[^"]*"/gi, "");
  clean = clean.replace(/lang="[^"]*"/gi, "");

  // 3. Boş span ve font taglarını kaldır
  clean = clean.replace(/<\/?font[^>]*>/gi, "");
  clean = clean.replace(/<span\s*>\s*<\/span>/gi, "");
  clean = clean.replace(/<p\s*>\s*(&nbsp;|\s)*<\/p>/gi, "");

  // 4. B, Strong, I, Em, U, H2, H3, H4, UL, OL, LI, P etiketlerini koru
  clean = clean.trim();

  return clean;
}

export function formatProductDescription(raw: string | null | undefined): string {
  if (!raw) return "";

  const text = raw.trim();

  // Eğer metin zaten HTML etiketleri içeriyorsa (p, ul, ol, strong, b, h2, h3, br vb.)
  const hasHtml = /<(p|ul|ol|li|strong|b|i|em|h[1-6]|table|br)[^>]*>/i.test(text);

  if (hasHtml) {
    return cleanWordHtml(text);
  }

  // Düz metin ise satır sonlarını ve madde işaretlerini akıllıca HTML'e dönüştür
  const lines = text.split(/\r?\n/);
  let htmlResult = "";
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inList) {
        htmlResult += "</ul>";
        inList = false;
      }
      continue;
    }

    // Madde işareti kontrolü (•, -, *, 1., 2.)
    const bulletMatch = line.match(/^[•\-*]\s*(.+)$/);
    const numMatch = line.match(/^(\d+)[.)]\s*(.+)$/);

    if (bulletMatch) {
      if (!inList) {
        htmlResult += '<ul class="list-disc pl-5 my-2 space-y-1">';
        inList = true;
      }
      htmlResult += `<li>${bulletMatch[1]}</li>`;
    } else if (numMatch) {
      if (!inList) {
        htmlResult += '<ol class="list-decimal pl-5 my-2 space-y-1">';
        inList = true;
      }
      htmlResult += `<li>${numMatch[2]}</li>`;
    } else {
      if (inList) {
        htmlResult += inList ? "</ul>" : "</ol>";
        inList = false;
      }

      // Kalın başlık algılama (örn: "Özellikler:", "Malzeme Bilgisi:")
      if (line.endsWith(":") && line.length < 50) {
        htmlResult += `<h4 class="font-bold text-[#e5c184] mt-3 mb-1 text-sm sm:text-base">${line}</h4>`;
      } else {
        htmlResult += `<p class="my-1.5 leading-relaxed">${line}</p>`;
      }
    }
  }

  if (inList) {
    htmlResult += "</ul>";
  }

  return htmlResult;
}
