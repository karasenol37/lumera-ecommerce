"use client";

import { useEffect, useRef, useState } from "react";
import { cleanWordHtml, formatProductDescription } from "@/lib/utils/formatDescription";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  label = "Ürün Açıklaması *",
  placeholder = "Ürünün özelliklerini, malzeme detaylarını ve kullanım alanlarını detaylı olarak buraya yazın veya Word'den yapıştırın...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"visual" | "html">("visual");
  const [copiedWordNotice, setCopiedWordNotice] = useState(false);

  // Sync internal editor HTML with prop when changed externally (e.g. on load)
  useEffect(() => {
    if (editorRef.current && viewMode === "visual") {
      const currentHtml = editorRef.current.innerHTML;
      if (currentHtml !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, viewMode]);

  function handleInput() {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  }

  function executeCommand(command: string, arg: string | undefined = undefined) {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();

    const clipboardData = e.clipboardData;
    const htmlData = clipboardData.getData("text/html");
    const textData = clipboardData.getData("text/plain");

    let contentToInsert = "";

    if (htmlData) {
      // Word veya zengin metinden gelen HTML'i temizle
      contentToInsert = cleanWordHtml(htmlData);
      setCopiedWordNotice(true);
      setTimeout(() => setCopiedWordNotice(false), 4000);
    } else if (textData) {
      // Düz metin ise satır sonlarını ve madde işaretlerini biçimlendir
      contentToInsert = formatProductDescription(textData);
    }

    if (contentToInsert) {
      document.execCommand("insertHTML", false, contentToInsert);
      handleInput();
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </label>

        <div className="flex items-center gap-2">
          {copiedWordNotice && (
            <span className="text-[11px] text-emerald-400 font-medium animate-pulse">
              ✓ Word biçimlendirmesi başarıyla korundu
            </span>
          )}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "visual" ? "html" : "visual")}
            className="text-[11px] font-semibold text-[#c8a165] hover:text-[#e5c184] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg transition cursor-pointer"
          >
            {viewMode === "visual" ? "HTML Kod Görünümü" : "Görsel Düzenleyici"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#090a0f] overflow-hidden focus-within:border-[#c8a165] transition shadow-inner">
        {/* Toolbar */}
        {viewMode === "visual" && (
          <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-[#121420]/90 p-2 text-xs">
            <button
              type="button"
              onClick={() => executeCommand("bold")}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 text-white font-bold cursor-pointer transition"
              title="Kalın (Ctrl+B)"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => executeCommand("italic")}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 text-white italic font-serif cursor-pointer transition"
              title="İtalik (Ctrl+I)"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => executeCommand("underline")}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 text-white underline cursor-pointer transition"
              title="Altı Çizili (Ctrl+U)"
            >
              U
            </button>

            <div className="h-4 w-px bg-white/15 mx-1" />

            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "h3")}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 text-[#c8a165] font-semibold cursor-pointer transition"
              title="Başlık Ekle"
            >
              H3 Başlık
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "h4")}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 text-[#e5c184] font-semibold cursor-pointer transition"
              title="Alt Başlık Ekle"
            >
              H4 Alt Başlık
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "p")}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 text-zinc-300 cursor-pointer transition"
              title="Normal Paragraf"
            >
              Paragraf
            </button>

            <div className="h-4 w-px bg-white/15 mx-1" />

            <button
              type="button"
              onClick={() => executeCommand("insertUnorderedList")}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 text-white flex items-center gap-1 cursor-pointer transition"
              title="Madde İşaretli Liste"
            >
              <span>•</span>
              <span>Liste</span>
            </button>
            <button
              type="button"
              onClick={() => executeCommand("insertOrderedList")}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 text-white flex items-center gap-1 cursor-pointer transition"
              title="Numaralı Liste"
            >
              <span>1.</span>
              <span>Sıralı Liste</span>
            </button>

            <div className="h-4 w-px bg-white/15 mx-1" />

            <button
              type="button"
              onClick={() => executeCommand("removeFormat")}
              className="px-2 py-1.5 rounded hover:bg-red-500/20 text-red-400 text-[11px] cursor-pointer transition"
              title="Seçili Alanın Biçimlendirmesini Temizle"
            >
              Biçimi Temizle
            </button>

            <span className="ml-auto text-[10px] text-zinc-500 hidden md:inline">
              📋 Word&apos;den kopyalayıp doğrudan yapıştırabilirsiniz (Ctrl+V)
            </span>
          </div>
        )}

        {/* Visual Editor */}
        {viewMode === "visual" ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onPaste={handlePaste}
            data-placeholder={placeholder}
            className="min-h-[220px] max-h-[500px] overflow-y-auto p-4 text-sm text-zinc-200 focus:outline-none product-description-editor leading-relaxed"
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={9}
            className="w-full p-4 font-mono text-xs text-zinc-300 bg-transparent focus:outline-none"
            placeholder="<p>HTML formatında ürün açıklaması...</p>"
          />
        )}
      </div>

      <p className="text-[11px] text-zinc-500">
        💡 Microsoft Word veya başka bir dökümandan kopyaladığınız metinlerde kalın yazılar, maddeler ve satır aralıkları otomatik olarak korunur.
      </p>
    </div>
  );
}
