import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import FavoritesView from "./FavoritesView";

export default function ClientFavoritesPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <HeaderWrapper />
      <FavoritesView />
      <Footer />
    </div>
  );
}