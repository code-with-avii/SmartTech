import ProductSection from "../components/ProductSection";
import { MobilesHero } from "../components/HeroBanner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TopNavbar from "../components/TopNavbar";

const MobileSection = () => {
  return (
    <div>
      <TopNavbar />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <MobilesHero />
      </div>
      <ProductSection type="mobile" title="Mobile Phones" />
      <Footer />
    </div>
  );
};

export default MobileSection;