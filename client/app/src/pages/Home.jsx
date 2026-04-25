import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Contents from "../components/Contents";
import CategoryMenu from "../components/CategoryMenu";
import Footer from "../components/Footer";
import TopNavbar from "../components/TopNavbar";
import Banner from "../components/Baneer";
import { HomeHero } from "../components/HeroBanner";

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
