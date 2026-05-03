import ProductSection from "../components/ProductSectionTemp.jsx";
import { LaptopsHero } from "../components/HeroBanner.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import TopNavbar from "../components/TopNavbar.jsx";

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