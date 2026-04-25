import ProductSection from "../components/ProductSection";
import { LaptopsHero } from "../components/HeroBanner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TopNavbar from "../components/TopNavbar";

const LaptopSection = () =>{
  return (
    <div>
      <TopNavbar />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <LaptopsHero />
      </div>
      <ProductSection type="laptop" title="Laptops"/>
      <Footer />
    </div>
  );
}

export default LaptopSection;