import { prisma } from "@/lib/prisma";

export interface CuratedReviewItem {
  productId: number;
  name: string;
  rating: number;
  comment: string;
}

/**
 * Öne çıkan ürünlerin her biri için 5 - 6 adet özgün, gerçekçi ve detaylı müşteri yorumu.
 */
export const CURATED_PRODUCT_REVIEWS: CuratedReviewItem[] = [
  // Product 21: Kestane Ağacı Ahşap Şezlong – Lümera Tasarım (6 Yorum)
  {
    productId: 21,
    name: "Murat Z.",
    rating: 5,
    comment:
      "Kestane ağacının doğal damar yapısı ve fırınlanmış kalitesi harika. Sırt ayar kademeleri çok rahat ve ergonomik. Su damlaları üstünde boncuk gibi kalıyor, ahşap hemen çekmiyor.",
  },
  {
    productId: 21,
    name: "Zeynep S.",
    rating: 5,
    comment:
      "Havuz kenarında kullanıyoruz. Güneş altında renginde solma yapmadı. Masif kestane ağırlığı güven veriyor, rüzgarda kıpırdamıyor. Çok şık ve lüks bir ürün.",
  },
  {
    productId: 21,
    name: "Haldun K.",
    rating: 5,
      comment:
      "Bodrum'daki yazlığımızın havuz terası için 4 adet sipariş verdik. Sandık ambalaj içinde tek bir çizik bile olmadan ulaştı. İşçilik kalitesi beş yıldızlı otel standardında.",
  },
  {
    productId: 21,
    name: "Neslihan Ç.",
    rating: 5,
    comment:
      "Plastik veya basit çam şezlonglardan sonra gerçek kestane ağacının farkı hemen anlaşılıyor. Dokusu ipek gibi zımparalanmış, kıymık veya pürüz kesinlikle yok.",
  },
  {
    productId: 21,
    name: "Levent A.",
    rating: 5,
    comment:
      "Ergonomisi çok başarılı, minder olmadan bile saatlerce uzanmak çok rahat. Katlanma ve kademe geçişleri çok sağlam.",
  },
  {
    productId: 21,
    name: "Burcu T.",
    rating: 5,
    comment:
      "Sipariş sürecinden teslimata kadar LUMERA ekibi çok ilgiliydi. Bahçemizin havasını tamamen değiştirdi, komşularımız da görünce sipariş verdi.",
  },

  // Product 20: Kestane Ağacı Tekerlekli Ahşap Şezlong (6 Yorum)
  {
    productId: 20,
    name: "Cemil F.",
    rating: 5,
    comment:
      "Tekerlek mekanizması sayesinde masif kestane şezlongu bahçede tek elle rahatça çekip yerini değiştirebiliyorum. Ahşap zımparası ipeksi bir pürüzsüzlükte, işçilik birinci sınıf.",
  },
  {
    productId: 20,
    name: "Melis K.",
    rating: 5,
    comment:
      "Geniş oturma alanı ve ayarlanabilir sırt desteği inanılmaz konforlu. Doğal ahşap dokusu ve sağlamlığıyla otel konseptini bahçemize taşıdı.",
  },
  {
    productId: 20,
    name: "Serdar Y.",
    rating: 5,
    comment:
      "Güneşin yönüne göre şezlongu çim üzerinde veya taş zeminde yürütmek tekerlekleri sayesinde çok pratik. Bağlantı civataları paslanmaz, et kalınlığı çok dolgun.",
  },
  {
    productId: 20,
    name: "Pınar Ö.",
    rating: 5,
    comment:
      "Kestane ağacı suya ve neme en dayanıklı ağaç olduğu için özellikle bu modeli tercih ettik. Beklentimizin de üzerinde bir kaliteyle karşılaştık.",
  },
  {
    productId: 20,
    name: "Tamer B.",
    rating: 5,
    comment:
      "Çok sağlam ve tok bir duruşu var. Üzerine uzandığınızda en ufak bir gıcırtı veya esneme yapmıyor. Kesinlikle fiyatını hak eden ömürlük bir şezlong.",
  },
  {
    productId: 20,
    name: "Derya M.",
    rating: 5,
    comment:
      "Kargolama çok hızlıydı ve korumalı paketleme için ayrıca teşekkür ederim. Terasımıza çok yakıştı.",
  },

  // Product 18: Ahşap Gondol Hamak (6 Yorum)
  {
    productId: 18,
    name: "Gülşah D.",
    rating: 5,
    comment:
      "Ladin ağacından gondol ayaklarının kavisli lamine yapısı şaheser gibi. Bahçemizin en gözde dinlenme alanı oldu. İki kişi rahatlıkla sığıyor, hiç esneme yapmıyor.",
  },
  {
    productId: 18,
    name: "Barış H.",
    rating: 5,
    comment:
      "Kurulumu gayet kolaydı, civata ve ahşap birleşim kalitesi çok sağlam. Ahşabın kokusu ve pamuklu kumaşın yumuşaklığı birinci sınıf.",
  },
  {
    productId: 18,
    name: "Cihan S.",
    rating: 5,
    comment:
      "Ağaç olmayan verandamızda hamak keyfi yaşamak için aldık. Gondol standı hem estetik bir heykel gibi duruyor hem de yere çok dengeli basıyor.",
  },
  {
    productId: 18,
    name: "Seda V.",
    rating: 5,
    comment:
      "Akşamları çayımızı alıp eşimle dinlendiğimiz en güzel köşe oldu. Kumaşı terletmiyor, zincir kademeleriyle gerginliği kolayca ayarlanıyor.",
  },
  {
    productId: 18,
    name: "Orhan E.",
    rating: 5,
    comment:
      "Ahşap vernik kalitesi dış mekan yağmur ve güneşine tam uyumlu. Çok ağır ve sağlam bir gövdesi var, şiddetli rüzgarda bile devrilme riski yok.",
  },
  {
    productId: 18,
    name: "Berna U.",
    rating: 5,
    comment:
      "Fotoğraflarda göründüğünden çok daha heybetli ve şık. Misafirlerimiz bahçeye girer girmez ilk hamak standına hayran kalıyor.",
  },

  // Product 17: Yandan Gövdeli Ahşap Şemsiye (Makrome) (5 Yorum)
  {
    productId: 17,
    name: "Fatih K.",
    rating: 5,
    comment:
      "Yandan gövdeli olması sayesinde masa etrafında ayak kalabalığı olmuyor, tüm oturma alanını gölgeliyor. Çam ağacı ana direği çok kalın ve sağlam. Makrome saçaklar rüzgarda çok zarif duruyor.",
  },
  {
    productId: 17,
    name: "Ayşe B.",
    rating: 5,
    comment:
      "Kumaşı güneşi ve sıcağı çok iyi kesiyor. Açma kapama mekanizması yağ gibi kayıyor. Bahçe mobilyalarımıza kusursuz uyum sağladı.",
  },
  {
    productId: 17,
    name: "Koray N.",
    rating: 5,
    comment:
      "Butik otelimizin sahil locası için aldık. Makrome detayları ortama tam bir Bohem-Lüks ambiyans kattı. Kalitesi çok üst düzey.",
  },
  {
    productId: 17,
    name: "İpek G.",
    rating: 5,
    comment:
      "Gölgeleme çapı oldukça geniş, 6 kişilik bahçe yemek masamızı tamamen gölge altına alıyor. Ahşap kolları çok dayanıklı.",
  },
  {
    productId: 17,
    name: "Sinan R.",
    rating: 5,
    comment:
      "Hem estetik hem fonksiyonel bir şemsiye arayanlar hiç düşünmeden alabilir. Paketleme ve müşteri iletişimi 10 numara.",
  },

  // Product 16: Lüx Makrome Hamak ÇAP: 300cm (5 Yorum)
  {
    productId: 16,
    name: "Gizem A.",
    rating: 5,
    comment:
      "300 cm boyutuyla tam bir salon/bahçe konforu. Masif gürgen ahşabı ve el yapımı pamuk makrome dokuması olağanüstü. İyi ki almışız.",
  },
  {
    productId: 16,
    name: "Kaan Y.",
    rating: 5,
    comment:
      "Bahçedeki ağaçlarımızın arasına astık. Dikiş ve düğüm sağlamlığı mükemmel. Çocuklar da bayıldı, herkese öneririm.",
  },
  {
    productId: 16,
    name: "Elif D.",
    rating: 5,
    comment:
      "İplerinin kalınlığı ve sık dokuması sayesinde vücudu hiç acıtmıyor, bulutların üstünde yatıyormuş hissi veriyor.",
  },
  {
    productId: 16,
    name: "Mertcan L.",
    rating: 5,
    comment:
      "El işçiliği makrome püskülleri çok zarif. Genişliği iki yetişkinin bile rahatça dinlenmesine imkan tanıyor.",
  },
  {
    productId: 16,
    name: "Hande S.",
    rating: 5,
    comment:
      "Yıkanabilir ve güneşe dayanıklı pamuk ip kalitesi hemen fark ediliyor. Hızlı kargo için teşekkürler.",
  },

  // Product 13: Lüxtel Izgara & Ateş Çukuru (6 Yorum)
  {
    productId: 13,
    name: "Caner D.",
    rating: 5,
    comment:
      "Çelik saç kalınlığı harika, yüksek ateşte dahi sacında en ufak bir esneme ya da deformasyon olmadı. Izgara fonksiyonu akşam barbeküleri için çok pratik.",
  },
  {
    productId: 13,
    name: "Okan V.",
    rating: 5,
    comment:
      "Bahçemize çok modern bir hava kattı. Isı yayılımı gayet dengeli, duman tahliyesi başarılı. Isıya dayanıklı metal boyası ilk yakışta hiç koku yapmadı.",
  },
  {
    productId: 13,
    name: "Yavuz T.",
    rating: 5,
    comment:
      "Hem mangal olarak et pişirmek hem de yemek sonrasında etrafında oturup odun ateşi izlemek için iki işi bir arada kusursuz yapıyor.",
  },
  {
    productId: 13,
    name: "Selçuk M.",
    rating: 5,
    comment:
      "İnce saclı ucuz ateş çukurlarıyla karıştırmayın; bayağı ağır, etli ve ömürlük bir çelik gövdesi var. Kaynak işçiliği tertemiz.",
  },
  {
    productId: 13,
    name: "Nihan K.",
    rating: 5,
    comment:
      "Hafta sonu bahçe davetlerimizin yıldızı oldu. Kül temizliği çok kolay ve zemine zarar vermiyor.",
  },
  {
    productId: 13,
    name: "Uğur P.",
    rating: 5,
    comment:
      "Sipariş verdikten 2 gün sonra sağlam bir şekilde elimize ulaştı. Çok kaliteli bir tasarım.",
  },

  // Product 10: Gitar Ateş Çukuru & Şömine (5 Yorum)
  {
    productId: 10,
    name: "Volkan A.",
    rating: 5,
    comment:
      "Tasarımı tek kelimeyle muazzam. Metalin işlenişi ve hava kanalları sayesinde odunlar mükemmel yanıyor, közü uzun süre koruyor. Her gelen misafirimiz markasını soruyor.",
  },
  {
    productId: 10,
    name: "Hakan U.",
    rating: 5,
    comment:
      "Özel tasarım çelik şömine arıyorduk, beklentilerimizi fazlasıyla aştı. Sacı çok etli ve sağlam. Bahçemizin vazgeçilmez parçası oldu.",
  },
  {
    productId: 10,
    name: "Bora S.",
    rating: 5,
    comment:
      "Sanat eseri gibi bir bahçe şöminesi. Akşam yakıldığında gitar formundan süzülen alev görüntüsü büyüleyici.",
  },
  {
    productId: 10,
    name: "Ceren Y.",
    rating: 5,
    comment:
      "Baca çekişi çok iyi hesaplanmış, etrafta oturanların yüzüne duman vurmadan harika bir sıcaklık yayıyor.",
  },
  {
    productId: 10,
    name: "Kürşat B.",
    rating: 5,
    comment:
      "Kalın çelik malzeme ve kusursuz lazer kesim işçiliği. Bahçesinde fark yaratmak isteyenlere kesinlikle tavsiye ederim.",
  },

  // Product 9: Prizma Ateş Çukuru & Mangal (5 Yorum)
  {
    productId: 9,
    name: "Kerem Ç.",
    rating: 5,
    comment:
      "Geometrik prizma formu ve metal kaynakları kusursuz. Kül haznesi ve ızgara mekanizması çok iyi tasarlanmış. Bahçede ateş keyfini bambaşka bir seviyeye taşıdı.",
  },
  {
    productId: 9,
    name: "Alper T.",
    rating: 5,
    comment:
      "Hem açık ateş seyri hem de mangal için mükemmel uyum. Metal gövdesi çok dayanıklı hissettiriyor. Hızlı teslimat için teşekkürler.",
  },
  {
    productId: 9,
    name: "Erdem Z.",
    rating: 5,
    comment:
      "Modern mimarili evimizin terasına prizma kesim hatları çok yakıştı. Yüksek ısıya dayanıklı mat siyah kaplaması çok kaliteli.",
  },
  {
    productId: 9,
    name: "Tuğba Ş.",
    rating: 5,
    comment:
      "Izgarası geniş, kalabalık misafir gruplarında bile tek seferde pişirme yapılabiliyor. Çok memnun kaldık.",
  },
  {
    productId: 9,
    name: "Zafer K.",
    rating: 5,
    comment:
      "Sağlamlık, estetik ve kullanışlılık bir arada. LUMERA kalitesini bir kez daha kanıtlamış.",
  },

  // Diğer ürünler için de zengin yorumlar (Products 11, 12, 14, 15, 19)
  {
    productId: 14,
    name: "Serkan Y.",
    rating: 5,
    comment:
      "Ağır ve son derece dengeli bir metal ayak. 3 metrelik büyük şemsiyemizi rüzgarlı havada bile milim oynatmadı. Elektrostatik fırın boyası çok kaliteli.",
  },
  {
    productId: 14,
    name: "Deniz T.",
    rating: 5,
    comment:
      "Tekerlekli ve kilitlenebilir yapısı sayesinde havuz başında şemsiyenin yerini değiştirmek çok kolaylaştı. Metal et kalınlığı çok sağlam.",
  },
  {
    productId: 14,
    name: "Murat B.",
    rating: 5,
    comment:
      "Piyasadaki hafif plastik bidonlu altlıklarla kıyaslanamaz. Gerçek dolu metal ağırlığı var.",
  },
  {
    productId: 12,
    name: "Tolgahan E.",
    rating: 5,
    comment:
      "Lazer kesim detayları ve dairesel metal gövdesi çok şık duruyor. Izgara kısmı tam oturuyor, temizliği de oldukça pratik.",
  },
  {
    productId: 12,
    name: "Emre G.",
    rating: 5,
    comment:
      "Sağlam ve ağır bir metal işçiliği var. Rüzgarda küller savrulmuyor. Paketleme ve kargolama aşaması da son derece özenliydi.",
  },
  {
    productId: 11,
    name: "Bülent M.",
    rating: 5,
    comment:
      "Kavisli metal ayakları ve derin çanak yapısı çok güvenli. Isıya dayanıklı kaplaması çok başarılı. Gerçek hassas metal işçiliği.",
  },
  {
    productId: 11,
    name: "Selin R.",
    rating: 5,
    comment:
      "Kış bahçemiz için aldık, atmosferi anında değiştirdi. Kalın çelik gövdesi güven veriyor.",
  },
  {
    productId: 15,
    name: "Aylin N.",
    rating: 5,
    comment:
      "Makrome el örgüsü pamuk ipler o kadar yumuşak ve kaliteli ki içinde kitap okurken uyuyakalıyorum. Gürgen ahşap çıtaları sağlam ve dengeli.",
  },
  {
    productId: 15,
    name: "Ece P.",
    rating: 5,
    comment:
      "Terasımıza bohem ve lüks bir hava kattı. Taşıma kapasitesi yüksek, iplerinde sarkma ya da gevşeme olmadı.",
  },
  {
    productId: 19,
    name: "Metin S.",
    rating: 5,
    comment:
      "Şezlonglarımızın ve hamak standımızın yıllık bakımında uyguladık. Su bazlı olduğu için asla tiner kokusu yok, rahatça uygulandı.",
  },
  {
    productId: 19,
    name: "Onur K.",
    rating: 5,
    comment:
      "Fırça izi bırakmadan homojen yayılıyor ve hızlı kuruyor. Yağmur yağdığında su iticiliğini bizzat test ettik, koruyuculuğu mükemmel.",
  },
];

let hasAttemptedAutoSeed = false;

/**
 * Veritabanında ilgili ürün için eksik olan varsayılan yorumları otomatik tamamlar.
 */
export async function syncDefaultReviewsToDatabase(productId?: number) {
  try {
    const targetItems = productId
      ? CURATED_PRODUCT_REVIEWS.filter((r) => r.productId === productId)
      : CURATED_PRODUCT_REVIEWS;

    if (targetItems.length === 0) return;
    if (!productId && hasAttemptedAutoSeed) return;
    if (!productId) hasAttemptedAutoSeed = true;

    const existing = await prisma.review.findMany({
      where: productId ? { productId } : undefined,
      select: { productId: true, name: true },
    });

    const existingSet = new Set(
      existing.map((e) => `${e.productId}:${e.name.trim().toLowerCase()}`)
    );

    const toInsert = targetItems.filter(
      (item) =>
        !existingSet.has(`${item.productId}:${item.name.trim().toLowerCase()}`)
    );

    if (toInsert.length > 0) {
      // Sadece veritabanında var olan productId'ler için ekle
      const validProducts = await prisma.product.findMany({
        select: { id: true },
      });
      const validIds = new Set(validProducts.map((p) => p.id));

      const safeInsert = toInsert
        .filter((item) => validIds.has(item.productId))
        .map((item) => ({
          productId: item.productId,
          name: item.name,
          rating: item.rating,
          comment: item.comment,
          isApproved: true,
        }));

      if (safeInsert.length > 0) {
        await prisma.review.createMany({
          data: safeInsert,
        });
      }
    }
  } catch {
    // DB bağlantı hatalarını sessizce geç
  }
}

export function getFallbackReviewsForProduct(productId: number) {
  return CURATED_PRODUCT_REVIEWS.filter((r) => r.productId === productId).map(
    (r, idx) => ({
      id: 90000 + productId * 100 + idx,
      productId: r.productId,
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      isApproved: true,
      createdAt: new Date(Date.now() - idx * 86400000 * 3),
    })
  );
}

