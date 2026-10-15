"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Admin veya API sayfalarını sayma
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // SessionStorage bazlı: Her oturumda veya sayfa geçişinde kaydedilir
    const sessionKey = `lumera_visit_${pathname}`;
    const alreadyLogged = sessionStorage.getItem(sessionKey);

    if (!alreadyLogged) {
      try {
        fetch("/api/analytics/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: pathname }),
        })
          .then(() => {
            sessionStorage.setItem(sessionKey, "1");
          })
          .catch(() => {});
      } catch {}
    }
  }, [pathname]);

  return null;
}
