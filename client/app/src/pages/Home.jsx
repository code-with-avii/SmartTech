import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import Contents from "../components/Contents";
import CategoryMenu from "../components/CategoryMenu.jsx";
import Footer from "../components/Footer.jsx";
import TopNavbar from "../components/TopNavbar.jsx";
import Banner from "../components/Baneer";
import { HomeHero } from "../components/HeroBanner.jsx";

const Home = () => {
  
  return (
    <div>
      <TopNavbar/>
      <Navbar /> 
      {/* <Header /> */}
      <CategoryMenu />
      <div className="container mx-auto px-4 py-8">
        <HomeHero />
      </div>
      <Contents />
      <Banner/>
      <Footer       />
    </div>
  );
};

export default Home;
