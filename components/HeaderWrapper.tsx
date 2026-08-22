import { getSessionUser } from "@/lib/session";
import { getSiteSettings } from "@/lib/services/settingsService";
import { prisma } from "@/lib/prisma";
import HeaderState from "./HeaderState";

export default async function HeaderWrapper() {
  const user = await getSessionUser();
  const settings = await getSiteSettings();

  let unreadMessageCount = 0;
  if (user && user.role === "ADMIN") {
    try {
      const contactModel = (prisma as any).contactMessage;
      if (contactModel) {
        unreadMessageCount = await contactModel.count({
          where: { isRead: false },
        });
      }
    } catch (err) {
      console.error("Error fetching unread message count:", err);
    }
  }

  return (
    <HeaderState
      user={user}
      settings={settings}
      unreadMessageCount={unreadMessageCount}
    />
  );
}