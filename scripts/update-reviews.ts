import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const reviewsData = [
  // Product 14: Metal Şemsiye Ayağı / Şemsiye Altlığı (METAL)
  {
    productId: 14,
    name: "Serkan Y.",
    rating: 5,
    comment: "Ağır ve son derece dengeli bir metal ayak. 3 metrelik büyük şemsiyemizi rüzgarlı havada bile milim oynatmadı. Elektrostatik fırın boyası çok kaliteli, paslanma yapacak gibi durmuyor.",
  },
  {
    productId: 14,
    name: "Deniz T.",
    rating: 5,
    comment: "Tekerlekli ve kilitlenebilir yapısı sayesinde havuz başında şemsiyenin yerini değiştirmek çok kolaylaştı. Metal et kalınlığı ve bağlantı noktaları çok sağlam.",
  },
  {
    productId: 14,
    name: "Murat B.",
    rating: 5,
    comment: "Piyasadaki hafif plastik bidonlu altlıklarla kıyaslanamaz. Gerçek dolu metal ağırlığı var. Sapasağlam paketlenmiş olarak ulaştı.",
  },

  // Product 13: Lüxtel Izgara & Ateş Çukuru (METAL)
  {
    productId: 13,
    name: "Caner D.",
    rating: 5,
    comment: "Çelik saç kalınlığı harika, yüksek ateşte dahi sacında en ufak bir esneme ya da deformasyon olmadı. Izgara fonksiyonu akşam barbeküleri için çok pratik.",
  },
  {
    productId: 13,
    name: "Okan V.",
    rating: 5,
    comment: "Bahçemize çok modern bir hava kattı. Isı yayılımı gayet dengeli, duman tahliyesi başarılı. Isıya dayanıklı metal boyası ilk yakışta hiç koku yapmadı.",
  },

  // Product 12: Kora Ateş Çukuru & ızgara (METAL)
  {
    productId: 12,
    name: "Tolgahan E.",
    rating: 5,
    comment: "Lazer kesim detayları ve dairesel metal gövdesi çok şık duruyor. Izgara kısmı tam oturuyor, temizliği de oldukça pratik. Akşam sohbetlerimizin merkezi oldu.",
  },
  {
    productId: 12,
    name: "Emre G.",
    rating: 5,
    comment: "Sağlam ve ağır bir metal işçiliği var. Rüzgarda küller savrulmuyor. Paketleme ve kargolama aşaması da son derece özenliydi.",
  },

  // Product 11: Otantik Ateş Çukuru (METAL)
  {
    productId: 11,
    name: "Bülent M.",
    rating: 5,
    comment: "Kavisli metal ayakları ve derin çanak yapısı çok güvenli. Isıya dayanıklı kaplaması çok başarılı. Gerçek hassas metal işçiliği.",
  },
  {
    productId: 11,
    name: "Selin R.",
    rating: 5,
    comment: "Kış bahçemiz için aldık, atmosferi anında değiştirdi. Kalın çelik gövdesi güven veriyor. LUMERA ekibine ilgilerinden dolayı teşekkürler.",
  },

  // Product 10: Gitar Ateş Çukuru & Şömine (METAL)
  {
    productId: 10,
    name: "Volkan A.",
    rating: 5,
    comment: "Tasarımı tek kelimeyle muazzam. Metalin işlenişi ve hava kanalları sayesinde odunlar mükemmel yanıyor, közü uzun süre koruyor. Her gelen misafirimiz markasını soruyor.",
  },
  {
    productId: 10,
    name: "Hakan U.",
    rating: 5,
    comment: "Özel tasarım çelik şömine arıyorduk, beklentilerimizi fazlasıyla aştı. Sacı çok etli ve sağlam. Bahçemizin vazgeçilmez parçası oldu.",
  },

  // Product 9: Prizma Ateş Çukuru & Mangal (METAL)
  {
    productId: 9,
    name: "Kerem Ç.",
    rating: 5,
    comment: "Geometrik prizma formu ve metal kaynakları kusursuz. Kül haznesi ve ızgara mekanizması çok iyi tasarlanmış. Bahçede ateş keyfini bambaşka bir seviyeye taşıdı.",
  },
  {
    productId: 9,
    name: "Alper T.",
    rating: 5,
    comment: "Hem açık ateş seyri hem de mangal için mükemmel uyum. Metal gövdesi çok dayanıklı hissettiriyor. Hızlı teslimat için teşekkürler.",
  },

  // Product 21: Kestane Ağacı Ahşap Şezlong – Lümera Tasarım
  {
    productId: 21,
    name: "Murat Z.",
    rating: 5,
    comment: "Kestane ağacının doğal damar yapısı ve fırınlanmış kalitesi harika. Sırt ayar kademeleri çok rahat ve ergonomik. Su damlaları üstünde boncuk gibi kalıyor, ahşap hemen çekmiyor.",
  },
  {
    productId: 21,
    name: "Zeynep S.",
    rating: 5,
    comment: "Havuz kenarında kullanıyoruz. Güneş altında renginde solma yapmadı. Masif kestane ağırlığı güven veriyor, rüzgarda kıpırdamıyor. Çok şık ve lüks bir ürün.",
  },

  // Product 20: Kestane Ağacı Tekerlekli Ahşap Şezlong
  {
    productId: 20,
    name: "Cemil F.",
    rating: 5,
    comment: "Tekerlek mekanizması sayesinde masif kestane şezlongu bahçede tek elle rahatça çekip yerini değiştirebiliyorum. Ahşap zımparası ipeksi bir pürüzsüzlükte, işçilik birinci sınıf.",
  },
  {
    productId: 20,
    name: "Melis K.",
    rating: 5,
    comment: "Geniş oturma alanı ve ayarlanabilir sırt desteği inanılmaz konforlu. Doğal ahşap dokusu ve sağlamlığıyla otel konseptini bahçemize taşıdı.",
  },

  // Product 18: Ahşap Gondol Hamak (LADİN AHŞAP)
  {
    productId: 18,
    name: "Gülşah D.",
    rating: 5,
    comment: "Ladin ağacından gondol ayaklarının kavisli lamine yapısı şaheser gibi. Bahçemizin en gözde dinlenme alanı oldu. İki kişi rahatlıkla sığıyor, hiç esneme yapmıyor.",
  },
  {
    productId: 18,
    name: "Barış H.",
    rating: 5,
    comment: "Kurulumu gayet kolaydı, civata ve ahşap birleşim kalitesi çok sağlam. Ahşabın kokusu ve pamuklu kumaşın yumuşaklığı birinci sınıf.",
  },

  // Product 15: Lüx Makrome Hamak ÇAP: 250 cm
  {
    productId: 15,
    name: "Aylin N.",
    rating: 5,
    comment: "Makrome el örgüsü pamuk ipler o kadar yumuşak ve kaliteli ki içinde kitap okurken uyuyakalıyorum. Gürgen ahşap çıtaları sağlam ve dengeli.",
  },
  {
    productId: 15,
    name: "Ece P.",
    rating: 5,
    comment: "Terasımıza bohem ve lüks bir hava kattı. Taşıma kapasitesi yüksek, iplerinde sarkma ya da gevşeme olmadı. Paketleme çok özenliydi.",
  },

  // Product 16: Lüx Makrome Hamak ÇAP: 300cm
  {
    productId: 16,
    name: "Gizem A.",
    rating: 5,
    comment: "300 cm boyutuyla tam bir salon/bahçe konforu. Masif gürgen ahşabı ve el yapımı pamuk makrome dokuması olağanüstü. İyi ki almışız.",
  },
  {
    productId: 16,
    name: "Kaan Y.",
    rating: 5,
    comment: "Bahçedeki ağaçlarımızın arasına astık. Dikiş ve düğüm sağlamlığı mükemmel. Çocuklar da bayıldı, herkese öneririm.",
  },

  // Product 17: Yandan Gövdeli Ahşap Şemsiye (Makrome)
  {
    productId: 17,
    name: "Fatih K.",
    rating: 5,
    comment: "Yandan gövdeli olması sayesinde masa etrafında ayak kalabalığı olmuyor, tüm oturma alanını gölgeliyor. Çam ağacı ana direği çok kalın ve sağlam. Makrome saçaklar rüzgarda çok zarif duruyor.",
  },
  {
    productId: 17,
    name: "Ayşe B.",
    rating: 5,
    comment: "Kumaşı güneşi ve sıcağı çok iyi kesiyor. Açma kapama mekanizması yağ gibi kayıyor. Bahçe mobilyalarımıza kusursuz uyum sağladı.",
  },

  // Product 19: Su Bazlı Ahsap Bakım Verniği 1 Kg
  {
    productId: 19,
    name: "Metin S.",
    rating: 5,
    comment: "Şezlonglarımızın ve hamak standımızın yıllık bakımında uyguladık. Su bazlı olduğu için asla tiner kokusu yok, rahatça uygulandı. Ahşabın doğal damarlarını harika canlandırdı.",
  },
  {
    productId: 19,
    name: "Onur K.",
    rating: 5,
    comment: "Fırça izi bırakmadan homojen yayılıyor ve hızlı kuruyor. Yağmur yağdığında su iticiliğini bizzat test ettik, damlalar yüzeyden kayıp gidiyor. Koruyuculuğu mükemmel.",
  },
];

async function updateReviews() {
  console.log("Mevcut yorumlar siliniyor ve ürünlere özel güncelleniyor...");
  await prisma.review.deleteMany({});

  for (const item of reviewsData) {
    // Check if product exists
    const prod = await prisma.product.findUnique({ where: { id: item.productId } });
    if (prod) {
      await prisma.review.create({
        data: {
          productId: item.productId,
          name: item.name,
          rating: item.rating,
          comment: item.comment,
          isApproved: true,
        },
      });
      console.log(`✓ [${prod.name}] için yorum eklendi: ${item.name} (${item.rating}★)`);
    } else {
      console.log(`! Product id ${item.productId} bulunamadı.`);
    }
  }

  console.log("Tüm yorumlar başarıyla güncellendi!");
}

updateReviews()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
