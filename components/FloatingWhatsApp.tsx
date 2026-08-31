"use client";

export default function FloatingWhatsApp() {
  const whatsappUrl = "https://wa.me/905358746909?text=" + encodeURIComponent("Merhaba LUMERA, ürünler ve sipariş hakkında bilgi almak istiyorum.");

  return (
    <aside aria-label="WhatsApp İletişim Hattı" className="fixed bottom-20 md:bottom-8 right-3.5 md:right-8 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 md:gap-2.5 rounded-full bg-[#25D366] px-4 py-3 md:px-5 md:py-3.5 text-black font-extrabold text-xs md:text-sm shadow-[0_8px_30px_rgba(37,211,102,0.55)] transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] hover:shadow-[0_12px_40px_rgba(37,211,102,0.7)] border border-white/20 active:scale-95"
      >
        {/* Pulse effect ring */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white shadow-sm"></span>
        </span>

        {/* WhatsApp SVG Icon */}
        <svg
          className="h-5 w-5 md:h-6 md:w-6 fill-current shrink-0 text-black"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.572-.321-1.198-.507-2.029-1.637-2.09-1.717-.061-.08-.501-.666-.501-1.272 0-.606.317-.905.43-.1027.113-.122.247-.152.33-.152.082 0 .165.001.237.004.076.004.178-.029.278.212.103.248.351.856.382.919.031.063.051.136.01.218-.041.082-.062.133-.124.205-.062.072-.13.16-.186.216-.062.062-.127.13-.055.254.072.124.321.53.69 1.859.475.423.876.554 1 .616.124.062.196.052.268-.031.072-.082.31-.361.393-.485.082-.124.165-.103.278-.062.113.041.722.341.846.403.124.062.207.093.237.144.031.052.031.3-.113.705z" />
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.892.528 3.663 1.448 5.174L2 22l4.981-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.67 0-3.228-.48-4.545-1.31l-.326-.208-3.376.945.942-3.308-.225-.34A7.95 7.95 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
        </svg>

        {/* Text for desktop & mobile */}
        <span className="text-xs md:text-sm font-black tracking-tight text-black">
          <span className="md:hidden">WhatsApp Sipariş</span>
          <span className="hidden md:inline">WhatsApp Sipariş Hattı</span>
        </span>
      </a>
    </aside>
  );
}
