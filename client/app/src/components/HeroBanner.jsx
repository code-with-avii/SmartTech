import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = ({ 
  title, 
  subtitle, 
  description, 
  backgroundImage, 
  buttonText, 
  buttonLink,
  height = 'h-96',
  overlayOpacity = 'bg-black/50'
}) => {
  return (
    <div className={`relative ${height} overflow-hidden rounded-lg shadow-2xl`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-scale transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-white px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up">
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 text-blue-200 animate-fade-in-up-delay-1">
              {subtitle}
            </h2>
          )}
          
          {/* Description */}
          {description && (
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto animate-fade-in-up-delay-2">
              {description}
            </p>
          )}
          
          {/* Button */}
          {buttonText && buttonLink && (
            <Link 
              to={buttonLink}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-fade-in-up-delay-3"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>
      
      {/* Gradient Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
  );
};

// Predefined hero banners for different categories
export const HomeHero = () => (
  <HeroBanner
    title="Welcome to SmartTech"
    subtitle="Your One-Stop Electronics Store"
    description="Discover the latest in smartphones, laptops, drones, tablets and more. Shop with confidence and enjoy fast delivery."
    backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    buttonText="Shop Now"
    buttonLink="/mobiles"
    height="h-96 md:h-[500px]"
  />
);

export const MobilesHero = () => (
  <HeroBanner
    title="Latest Smartphones"
    subtitle="Stay Connected with Innovation"
    description="Explore our collection of cutting-edge smartphones from top brands. Find the perfect device for your lifestyle."
    backgroundImage="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    buttonText="Browse Mobiles"
    buttonLink="/mobiles"
  />
);

export const LaptopsHero = () => (
  <HeroBanner
    title="Powerful Laptops"
    subtitle="Work, Play, Create"
    description="High-performance laptops for professionals, students, and gamers. Find your perfect computing companion."
    backgroundImage="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    buttonText="Explore Laptops"
    buttonLink="/laptops"
  />
);

export const TabletsHero = () => (
  <HeroBanner
    title="Versatile Tablets"
    subtitle="Portable Power in Your Hands"
    description="Perfect tablets for work, entertainment, and creativity. Experience the best of mobile computing."
    backgroundImage="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    buttonText="Shop Tablets"
    buttonLink="/tablets"
  />
);

export const DronesHero = () => (
  <HeroBanner
    title="Advanced Drones"
    subtitle="Capture Your World from Above"
    description="Professional aerial photography drones with 4K cameras and GPS navigation"
    backgroundImage="https://images.unsplash.com/photo-1476891684063-1c62776c8710?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    buttonText="Explore Drones"
    buttonLink="/drones"
  />
);

export const CameraHero = () => (
  <HeroBanner
    title="Professional Cameras"
    subtitle="Capture Life in Stunning Detail"
    description="High-performance cameras for photographers and videographers"
    backgroundImage="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    buttonText="Explore Cameras"
    buttonLink="/cameras"
  />
);

export default HeroBanner;
