import { buildProductImageFileName } from "@/lib/utils/productImage";

/**
 * Tarayıcı tarafında (Client-Side) görselleri boyutlandırıp sıkıştırır.
 * 5-20 MB'lık kamera fotoğraflarını yüksek kalitede ~150-350 KB'a indirger.
 */
export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0
  mimeType?: string; // "image/jpeg" | "image/webp"
  customName?: string; // Ürün adı (dosya adını ürün ismi yapmak için)
  index?: number; // Galeri sırası (2, 3, ...)
}

function renameFileIfNeeded(
  file: File,
  customName?: string,
  index?: number
): File {
  if (!customName) return file;
  const targetName = buildProductImageFileName(
    customName,
    file.name,
    index,
    file.type
  );
  if (file.name === targetName) return file;
  return new File([file], targetName, {
    type: file.type,
    lastModified: Date.now(),
  });
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
    customName,
    index,
  } = options;

  // Görsel değilse veya SVG / GIF ise sıkıştırmadan (gerekirse yeniden adlandırarak) döndür
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return renameFileIfNeeded(file, customName, index);
  }

  // Zaten küçükse (< 250 KB) sıkıştırmaya gerek yok, sadece ürün adını uygula
  if (
    file.size <= 250 * 1024 &&
    (file.type === "image/jpeg" || file.type === "image/webp")
  ) {
    return renameFileIfNeeded(file, customName, index);
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
          resolve(renameFileIfNeeded(file, customName, index));
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
              resolve(renameFileIfNeeded(file, customName, index));
              return;
            }

            // Dosya adını ürün adına göre ayarla
            const baseProductOrFileName =
              customName ||
              file.name.substring(0, file.name.lastIndexOf(".")) ||
              file.name;
            const newFileName = buildProductImageFileName(
              baseProductOrFileName,
              file.name,
              index,
              mimeType
            );

            const compressedFile = new File([blob], newFileName, {
              type: mimeType,
              lastModified: Date.now(),
            });

            // Eğer sıkıştırılmış dosya orijinalinden büyükse orijinali (ürün adıyla) kullan
            if (compressedFile.size >= file.size) {
              resolve(renameFileIfNeeded(file, customName, index));
            } else {
              resolve(compressedFile);
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        resolve(renameFileIfNeeded(file, customName, index));
      };

      if (readerEvent.target?.result) {
        img.src = readerEvent.target.result as string;
      } else {
        resolve(renameFileIfNeeded(file, customName, index));
      }
    };

    reader.onerror = () => {
      resolve(renameFileIfNeeded(file, customName, index));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Birden fazla görseli paralel olarak optimize eder ve ürün adına göre numaralandırır.
 */
export async function compressImages(
  files: File[],
  options?: CompressImageOptions,
  startIndex = 2
): Promise<File[]> {
  return Promise.all(
    files.map((file, idx) =>
      compressImage(file, {
        ...options,
        index: options?.index !== undefined ? options.index + idx : startIndex + idx,
      })
    )
  );
}
