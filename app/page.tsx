import HeaderWrapper from "@/components/HeaderWrapper";
import Categories from "@/components/Categories";
import BrandStory from "@/components/BrandStory";
import ProductList from "@/components/ProductList";
import Advantages from "@/components/Advantages";
import Footer from "@/components/Footer";

export default async function Home() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
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