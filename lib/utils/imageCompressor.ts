/**
 * Tarayıcı tarafında (Client-Side) görselleri boyutlandırıp sıkıştırır.
 * 5-20 MB'lık kamera fotoğraflarını yüksek kalitede ~150-350 KB'a indirger.
 */
export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0
  mimeType?: string; // "image/jpeg" | "image/webp"
}

export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    mimeType = "image/jpeg",
  } = options;

  // Görsel değilse veya SVG / GIF ise sıkıştırmadan döndür
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  // Zaten küçükse (< 250 KB) sıkıştırmaya gerek yok
  if (file.size <= 250 * 1024 && (file.type === "image/jpeg" || file.type === "image/webp")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Boyut oranını koruyarak küçült
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // Canvas context alınamazsa orijinal dosyayı dön
          return;
        }

        // Yüksek kaliteli çizim ayarları
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Arka planı beyaz yap (şeffaf png'ler jpeg'e çevrilirken siyah olmasın)
        if (mimeType === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Dosya adı uzantısını ayarla
            const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
            const extension = mimeType === "image/webp" ? ".webp" : ".jpg";
            const newFileName = `${originalName}${extension}`;

            const compressedFile = new File([blob], newFileName, {
              type: mimeType,
              lastModified: Date.now(),
            });

            // Eğer sıkıştırılmış dosya orijinalinden büyükse orijinali kullan
            if (compressedFile.size >= file.size) {
              resolve(file);
            } else {
              resolve(compressedFile);
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // Hata durumunda orijinal dosyayı döndür
      };

      if (readerEvent.target?.result) {
        img.src = readerEvent.target.result as string;
      } else {
        resolve(file);
      }
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Birden fazla görseli paralel olarak optimize eder.
 */
export async function compressImages(
  files: File[],
  options?: CompressImageOptions
): Promise<File[]> {
  return Promise.all(files.map((file) => compressImage(file, options)));
}
