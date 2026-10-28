import HeaderWrapper from "@/components/HeaderWrapper";
import Categories from "@/components/Categories";
import BrandStory from "@/components/BrandStory";
import ProductList from "@/components/ProductList";
import Advantages from "@/components/Advantages";
import Footer from "@/components/Footer";

export default async function Home() {
  return (
    <div className="min-h-screen bg-transparent text-[#f7f3eb] flex flex-col justify-between">
      <HeaderWrapper />
      <main className="flex-1 pt-6">
        <Categories />
        <ProductList />
        <BrandStory />
        <Advantages />
      </main>
      <Footer />
    </div>
  );
}