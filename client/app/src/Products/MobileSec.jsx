import ProductSection from "../components/ProductSectionTemp.jsx";
import { MobilesHero } from "../components/HeroBanner.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import CategoryMenu from "../components/CategoryMenu.jsx";
const MobileSection = () => {
  return (
    <div>
<Navbar />
      <div className="container mx-auto px-4 py-8">
        <CategoryMenu/>
        <MobilesHero />
      </div>
      <ProductSection type="mobile" title="Mobile Phones" />
      <Footer />
    </div>
  );
};

export default MobileSection;