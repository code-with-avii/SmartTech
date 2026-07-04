import ProductSection from "../components/ProductSectionTemp.jsx";
import { LaptopsHero } from "../components/HeroBanner.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import CategoryMenu from "../components/CategoryMenu.jsx";
const LaptopSection = () =>{
  return (
    <div>
<Navbar />
      <div className="container mx-auto px-4 py-8">
        <CategoryMenu/>
        <LaptopsHero />
      </div>
      <ProductSection type="laptop" title="Laptops"/>
      <Footer />
    </div>
  );
}

export default LaptopSection;