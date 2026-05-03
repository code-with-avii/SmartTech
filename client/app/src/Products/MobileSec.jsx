import ProductSection from "../components/ProductSectionTemp.jsx";
import { MobilesHero } from "../components/HeroBanner.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import TopNavbar from "../components/TopNavbar.jsx";

const MobileSection = () => {
  return (
    <div>
      <TopNavbar />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <MobilesHero />
      </div>
      <Productsection type="mobile" title="Mobile Phones" />
      <Footer />
    </div>
  );
};

export default MobileSection;