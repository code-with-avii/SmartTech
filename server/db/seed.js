import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load env variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import Category from "../models/category.js";
import Product from "../models/product.js";

// Verify environment variable is loaded
if (!process.env.MONGOURI) {
  console.error("Error: MONGOURI environment variable not found in .env file.");
  process.exit(1);
}

const categoriesData = [
  { name: "Mobiles", description: "Smartphones and mobile devices" },
  { name: "Laptops", description: "High performance laptops and notebooks" },
  { name: "Tablets", description: "Portable tablets and iPads" },
  { name: "Drones", description: "Aerial photography drones and quadcopters" },
  { name: "Cameras", description: "Professional DSLR and mirrorless cameras" }
];

const productsData = [
  // === MOBILES ===
  {
    name: "iPhone 15 Pro Max",
    type: "Mobile",
    price: 159900,
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60",
    description: "Experience the power of titanium with the A17 Pro chip, a customizable Action button, and a powerful camera system.",
    rating: 4.8,
    numReviews: 245,
    variants: [
      { size: "256GB", color: "Titanium Gray", countInStock: 25 },
      { size: "512GB", color: "Titanium Black", countInStock: 15 }
    ]
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    type: "Mobile",
    price: 129999,
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60",
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity.",
    rating: 4.7,
    numReviews: 189,
    variants: [
      { size: "512GB", color: "Titanium Yellow", countInStock: 30 },
      { size: "1TB", color: "Titanium Violet", countInStock: 10 }
    ]
  },
  {
    name: "Google Pixel 8 Pro",
    type: "Mobile",
    price: 106999,
    brand: "Google",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60",
    description: "The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera ever, and help on the go.",
    rating: 4.6,
    numReviews: 122,
    variants: [
      { size: "128GB", color: "Bay Blue", countInStock: 18 },
      { size: "256GB", color: "Obsidian", countInStock: 22 }
    ]
  },
  {
    name: "OnePlus 12",
    type: "Mobile",
    price: 64999,
    brand: "OnePlus",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60",
    description: "Redefined flagships powered by Snapdragon 8 Gen 3, Dual Cryo-velocity VC cooling, and 4th Gen Hasselblad Camera system.",
    rating: 4.5,
    numReviews: 95,
    variants: [
      { size: "256GB", color: "Flowy Emerald", countInStock: 40 },
      { size: "512GB", color: "Silky Black", countInStock: 35 }
    ]
  },
  {
    name: "Xiaomi 14 Ultra",
    type: "Mobile",
    price: 99999,
    brand: "Xiaomi",
    image: "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=500&auto=format&fit=crop&q=60",
    description: "Featuring a Leica Summilux optical lens, a custom 1-inch sensor, and raw power with Snapdragon 8 Gen 3.",
    rating: 4.6,
    numReviews: 60,
    variants: [
      { size: "512GB", color: "Black", countInStock: 12 }
    ]
  },
  {
    name: "iPhone 15",
    type: "Mobile",
    price: 79900,
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60",
    description: "Features Dynamic Island, a 48MP Main camera, and USB-C, all in a durable color-infused glass and aluminum design.",
    rating: 4.6,
    numReviews: 320,
    variants: [
      { size: "128GB", color: "Pink", countInStock: 50 },
      { size: "256GB", color: "Blue", countInStock: 40 }
    ]
  },
  {
    name: "Samsung Galaxy Z Fold 5",
    type: "Mobile",
    price: 154999,
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60",
    description: "The ultimate 7.6-inch main screen device. Fold it up, slip it in your pocket, or open it up for a PC-like multitasking experience.",
    rating: 4.5,
    numReviews: 76,
    variants: [
      { size: "256GB", color: "Icy Blue", countInStock: 8 }
    ]
  },
  {
    name: "Samsung Galaxy Z Flip 5",
    type: "Mobile",
    price: 99999,
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=60",
    description: "Meet the Flex Window. The 3.4-inch cover screen designed for self-expression. Pocket-sized and pocket-perfect.",
    rating: 4.4,
    numReviews: 110,
    variants: [
      { size: "256GB", color: "Mint", countInStock: 20 }
    ]
  },
  {
    name: "OnePlus Nord 4",
    type: "Mobile",
    price: 29999,
    brand: "OnePlus",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60",
    description: "All the essentials you want. Qualcomm Snapdragon power, signature 80W SUPERVOOC charging, and sleek metal finish.",
    rating: 4.3,
    numReviews: 145,
    variants: [
      { size: "128GB", color: "Mercurial Silver", countInStock: 60 }
    ]
  },
  {
    name: "Google Pixel 8a",
    type: "Mobile",
    price: 52999,
    brand: "Google",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60",
    description: "The AI-powered Pixel phone at a great value. Incredible photos, effortless editing, and safety features you can count on.",
    rating: 4.4,
    numReviews: 88,
    variants: [
      { size: "128GB", color: "Aloe Green", countInStock: 30 }
    ]
  },
  {
    name: "Asus ROG Phone 8 Pro",
    type: "Mobile",
    price: 94999,
    brand: "Asus",
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&auto=format&fit=crop&q=60",
    description: "The ultimate gaming smartphone. Packed with a 165Hz display, Snapdragon 8 Gen 3, and dedicated AirTrigger controls.",
    rating: 4.7,
    numReviews: 54,
    variants: [
      { size: "512GB", color: "Phantom Black", countInStock: 15 }
    ]
  },

  // === LAPTOPS ===
  {
    name: "MacBook Pro 16 M3 Max",
    type: "Laptop",
    price: 349900,
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60",
    description: "The ultimate pro laptop. With M3 Max chip, stunning Liquid Retina XDR display, and up to 22 hours of battery life.",
    rating: 4.9,
    numReviews: 92,
    variants: [
      { size: "36GB RAM / 1TB SSD", color: "Space Black", countInStock: 10 }
    ]
  },
  {
    name: "Dell XPS 15",
    type: "Laptop",
    price: 189999,
    brand: "Dell",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60",
    description: "A balance of powerhouse performance and thin design. Features an OLED display and 13th Gen Intel Core processors.",
    rating: 4.6,
    numReviews: 104,
    variants: [
      { size: "16GB RAM / 1TB SSD", color: "Platinum Silver", countInStock: 15 }
    ]
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    type: "Laptop",
    price: 174900,
    brand: "Lenovo",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60",
    description: "The legendary business laptop. Featherlight carbon fiber chassis, award-winning keyboard, and premium security features.",
    rating: 4.7,
    numReviews: 83,
    variants: [
      { size: "32GB RAM / 1TB SSD", color: "Deep Black", countInStock: 12 }
    ]
  },
  {
    name: "ASUS ROG Zephyrus G14",
    type: "Laptop",
    price: 144999,
    brand: "ASUS",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60",
    description: "Incredible 14-inch gaming laptop. Armed with AMD Ryzen 9 and NVIDIA GeForce RTX 4060 graphics.",
    rating: 4.7,
    numReviews: 112,
    variants: [
      { size: "16GB RAM / 512GB SSD", color: "Eclipse Gray", countInStock: 20 }
    ]
  },
  {
    name: "HP Spectre x360",
    type: "Laptop",
    price: 159999,
    brand: "HP",
    image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500&auto=format&fit=crop&q=60",
    description: "A premium 2-in-1 convertible laptop. Craftsman design, stunning OLED touchscreen, and great battery life.",
    rating: 4.5,
    numReviews: 67,
    variants: [
      { size: "16GB RAM / 1TB SSD", color: "Nightfall Black", countInStock: 14 }
    ]
  },
  {
    name: "MacBook Air 13 M3",
    type: "Laptop",
    price: 114900,
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60",
    description: "Strikingly thin and fast. The M3 chip brings supercharged capabilities to Apple's most popular laptop.",
    rating: 4.8,
    numReviews: 215,
    variants: [
      { size: "8GB RAM / 256GB SSD", color: "Starlight", countInStock: 45 },
      { size: "16GB RAM / 512GB SSD", color: "Midnight", countInStock: 30 }
    ]
  },
  {
    name: "Acer Predator Helios 16",
    type: "Laptop",
    price: 139999,
    brand: "Acer",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60",
    description: "High-octane gaming performance. Fitted with an RTX 4070, advanced custom cooling, and a 240Hz screen.",
    rating: 4.5,
    numReviews: 89,
    variants: [
      { size: "16GB RAM / 1TB SSD", color: "Abyssal Black", countInStock: 18 }
    ]
  },
  {
    name: "Dell Inspiron 14",
    type: "Laptop",
    price: 54999,
    brand: "Dell",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60",
    description: "Reliable and compact. Perfect for students and daily work, featuring Intel Core i5 and long battery life.",
    rating: 4.2,
    numReviews: 130,
    variants: [
      { size: "8GB RAM / 512GB SSD", color: "Platinum Silver", countInStock: 40 }
    ]
  },
  {
    name: "HP Pavilion 15",
    type: "Laptop",
    price: 62999,
    brand: "HP",
    image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500&auto=format&fit=crop&q=60",
    description: "A classic all-rounder. Enjoy vibrant visuals on a micro-edge bezel display and solid AMD Ryzen 5 performance.",
    rating: 4.3,
    numReviews: 175,
    variants: [
      { size: "16GB RAM / 512GB SSD", color: "Fog Blue", countInStock: 35 }
    ]
  },
  {
    name: "Lenovo Legion 5 Pro",
    type: "Laptop",
    price: 124999,
    brand: "Lenovo",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60",
    description: "Pro-level gaming laptop. Features a stunning QHD display, Legion Coldfront 4.0 cooling, and AMD Ryzen 7 processing.",
    rating: 4.6,
    numReviews: 140,
    variants: [
      { size: "16GB RAM / 1TB SSD", color: "Storm Grey", countInStock: 25 }
    ]
  },
  {
    name: "Razer Blade 14",
    type: "Laptop",
    price: 219999,
    brand: "Razer",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60",
    description: "The ultimate 14-inch gaming laptop. Ultra-thin form factor, AMD Ryzen 9, and RTX 4070 graphics in a black anodized finish.",
    rating: 4.7,
    numReviews: 45,
    variants: [
      { size: "16GB RAM / 1TB SSD", color: "Classic Black", countInStock: 8 }
    ]
  },

  // === TABLETS ===
  {
    name: "iPad Pro 12.9 M2",
    type: "Tablet",
    price: 119900,
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
    description: "Astonishing performance. Incredibly advanced Liquid Retina XDR display. Superfast wireless connectivity.",
    rating: 4.9,
    numReviews: 115,
    variants: [
      { size: "256GB WiFi", color: "Space Gray", countInStock: 20 }
    ]
  },
  {
    name: "Samsung Galaxy Tab S9 Ultra",
    type: "Tablet",
    price: 108999,
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=60",
    description: "Our largest Dynamic AMOLED 2X tablet. IP68 water and dust resistance. Included S Pen.",
    rating: 4.8,
    numReviews: 90,
    variants: [
      { size: "256GB WiFi+5G", color: "Graphite", countInStock: 15 }
    ]
  },
  {
    name: "iPad Air 5th Gen",
    type: "Tablet",
    price: 59900,
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
    description: "With Apple M1 chip. 12MP Ultra Wide front camera with Center Stage. Five gorgeous colors.",
    rating: 4.7,
    numReviews: 195,
    variants: [
      { size: "64GB WiFi", color: "Blue", countInStock: 30 },
      { size: "256GB WiFi", color: "Space Gray", countInStock: 25 }
    ]
  },
  {
    name: "Microsoft Surface Pro 9",
    type: "Tablet",
    price: 99999,
    brand: "Microsoft",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=60",
    description: "The power of a laptop, the flexibility of a tablet. 13-inch PixelSense touchscreen and built-in kickstand.",
    rating: 4.5,
    numReviews: 76,
    variants: [
      { size: "256GB SSD / 8GB RAM", color: "Platinum", countInStock: 18 }
    ]
  },
  {
    name: "Lenovo Tab P12 Pro",
    type: "Tablet",
    price: 69999,
    brand: "Lenovo",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=60",
    description: "Premium entertainment and productivity tablet. 12.6-inch AMOLED display with Dolby Vision and Precision Pen 3.",
    rating: 4.4,
    numReviews: 60,
    variants: [
      { size: "256GB WiFi", color: "Storm Grey", countInStock: 22 }
    ]
  },
  {
    name: "iPad Mini 6th Gen",
    type: "Tablet",
    price: 49900,
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
    description: "Mega power, mini size. All-screen design with 8.3-inch Liquid Retina display and powerful A15 Bionic chip.",
    rating: 4.7,
    numReviews: 154,
    variants: [
      { size: "64GB WiFi", color: "Purple", countInStock: 40 }
    ]
  },
  {
    name: "Samsung Galaxy Tab S9 FE",
    type: "Tablet",
    price: 36999,
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=60",
    description: "The fan-edition tablet. Dynamic 10.9-inch display, IP68 S Pen, and robust Exynos processor for daily tasks.",
    rating: 4.4,
    numReviews: 92,
    variants: [
      { size: "128GB WiFi", color: "Gray", countInStock: 50 }
    ]
  },
  {
    name: "OnePlus Pad",
    type: "Tablet",
    price: 37999,
    brand: "OnePlus",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
    description: "Smooth without equal. Readfit 7:5 ratio screen, Dimensity 9000 chip, and 67W SUPERVOOC charging.",
    rating: 4.5,
    numReviews: 84,
    variants: [
      { size: "128GB", color: "Halo Green", countInStock: 35 }
    ]
  },
  {
    name: "Xiaomi Pad 6",
    type: "Tablet",
    price: 26999,
    brand: "Xiaomi",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=60",
    description: "High-resolution 144Hz display, Snapdragon 870 processor, and a large 8840mAh battery in a metal unibody design.",
    rating: 4.6,
    numReviews: 210,
    variants: [
      { size: "128GB WiFi", color: "Graphite Grey", countInStock: 70 },
      { size: "256GB WiFi", color: "Mist Blue", countInStock: 45 }
    ]
  },
  {
    name: "Lenovo Yoga Tab 11",
    type: "Tablet",
    price: 21999,
    brand: "Lenovo",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=60",
    description: "The ultimate entertainment tablet with a built-in kickstand, JBL quad speakers, and Dolby Atmos audio.",
    rating: 4.2,
    numReviews: 68,
    variants: [
      { size: "128GB WiFi", color: "Storm Grey", countInStock: 25 }
    ]
  },
  {
    name: "Amazon Fire HD 10",
    type: "Tablet",
    price: 14999,
    brand: "Amazon",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
    description: "Fast and responsive 10.1-inch tablet. Great for streaming videos, reading, and light web browsing.",
    rating: 4.1,
    numReviews: 120,
    variants: [
      { size: "32GB WiFi", color: "Black", countInStock: 100 }
    ]
  },

  // === DRONES ===
  {
    name: "DJI Mavic 3 Pro",
    type: "Drone",
    price: 199999,
    brand: "DJI",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&auto=format&fit=crop&q=60",
    description: "Triple-camera flagship drone. 4/3 CMOS Hasselblad camera, 28x hybrid zoom, and omnidirectional obstacle sensing.",
    rating: 4.9,
    numReviews: 55,
    variants: [
      { size: "Standard Remote", color: "Gray", countInStock: 5 }
    ]
  },
  {
    name: "DJI Mini 4 Pro",
    type: "Drone",
    price: 79999,
    brand: "DJI",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&auto=format&fit=crop&q=60",
    description: "Ultralight folding drone under 249g. Omnidirectional obstacle sensing, 4K/60fps HDR true vertical shooting.",
    rating: 4.8,
    numReviews: 120,
    variants: [
      { size: "DJI RC 2 Controller", color: "Gray", countInStock: 20 }
    ]
  },
  {
    name: "DJI Air 3",
    type: "Drone",
    price: 115000,
    brand: "DJI",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=60",
    description: "Dual primary cameras for wide and 3x medium telephotos. Up to 46 minutes of flight time, omni obstacle sensing.",
    rating: 4.7,
    numReviews: 78,
    variants: [
      { size: "Fly More Combo", color: "Gray", countInStock: 14 }
    ]
  },
  {
    name: "DJI Avata Explorer Combo",
    type: "Drone",
    price: 94900,
    brand: "DJI",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&auto=format&fit=crop&q=60",
    description: "First-person view (FPV) flight experience. Built-in propeller guards, 4K stabilized video, palm-sized convenience.",
    rating: 4.6,
    numReviews: 64,
    variants: [
      { size: "Goggles Integra Combo", color: "Black/Gray", countInStock: 10 }
    ]
  },
  {
    name: "Autel Robotics EVO Lite+",
    type: "Drone",
    price: 89999,
    brand: "Autel",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&auto=format&fit=crop&q=60",
    description: "Supersensitive 1-inch sensor drone. Moonlight algorithm for incredible low-light night videography.",
    rating: 4.5,
    numReviews: 40,
    variants: [
      { size: "Premium Bundle", color: "Orange", countInStock: 8 }
    ]
  },
  {
    name: "Parrot Anafi USA",
    type: "Drone",
    price: 249000,
    brand: "Parrot",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=60",
    description: "Enterprise-grade mapping and thermal imaging drone. 32x zoom, FLIR Boson thermal camera, made in USA.",
    rating: 4.4,
    numReviews: 12,
    variants: [
      { size: "Thermal Pro Pack", color: "Black", countInStock: 3 }
    ]
  },
  {
    name: "Holy Stone HS720G",
    type: "Drone",
    price: 19999,
    brand: "Holy Stone",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&auto=format&fit=crop&q=60",
    description: "GPS drone with a 2-axis gimbal 4K EIS camera. Optical flow positioning, auto-return home, user-friendly.",
    rating: 4.1,
    numReviews: 145,
    variants: [
      { size: "Standard Pack", color: "Dark Gray", countInStock: 50 }
    ]
  },
  {
    name: "DJI Inspire 3",
    type: "Drone",
    price: 649999,
    brand: "DJI",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=60",
    description: "Full-frame 8K CinemaDron. Professional aerial cinematography beast with RTK high-precision positioning.",
    rating: 5.0,
    numReviews: 5,
    variants: [
      { size: "Cinema Premium Suite", color: "Black", countInStock: 2 }
    ]
  },
  {
    name: "Ryze Tello",
    type: "Drone",
    price: 7999,
    brand: "Ryze",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&auto=format&fit=crop&q=60",
    description: "Powered by DJI. An ultra-fun mini toy drone perfect for kids and beginners to learn coding and flying tricks.",
    rating: 4.2,
    numReviews: 310,
    variants: [
      { size: "Base Kit", color: "White/Black", countInStock: 120 }
    ]
  },
  {
    name: "Ruko F11 Pro",
    type: "Drone",
    price: 24999,
    brand: "Ruko",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&auto=format&fit=crop&q=60",
    description: "GPS drone with 4K UHD camera. Up to 60 minutes flight time with two smart batteries, brushless motors.",
    rating: 4.3,
    numReviews: 85,
    variants: [
      { size: "2-Battery Combo", color: "Black", countInStock: 30 }
    ]
  },
  {
    name: "BetaFPV Cetus Pro",
    type: "Drone",
    price: 15999,
    brand: "BetaFPV",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=60",
    description: "The ideal FPV starter kit. Includes Cetus Pro brushless quadcopter, LiteRadio 2 SE transmitter, and VR02 FPV Goggles.",
    rating: 4.5,
    numReviews: 42,
    variants: [
      { size: "FPV RTF Kit", color: "White", countInStock: 25 }
    ]
  },

  // === CAMERAS ===
  {
    name: "Sony Alpha 7 IV Mirrorless",
    type: "Camera",
    price: 199900,
    brand: "Sony",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60",
    description: "A versatile all-rounder. 33MP Exmor R CMOS sensor, advanced autofocus, and 4K 60p recording.",
    rating: 4.8,
    numReviews: 140,
    variants: [
      { size: "Body Only", color: "Black", countInStock: 15 },
      { size: "With 28-70mm Lens", color: "Black", countInStock: 10 }
    ]
  },
  {
    name: "Canon EOS R5",
    type: "Camera",
    price: 299900,
    brand: "Canon",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=60",
    description: "Uncompromised performance. 45MP full-frame sensor, 8K raw video, and 5-axis in-body image stabilization.",
    rating: 4.9,
    numReviews: 68,
    variants: [
      { size: "Body Only", color: "Black", countInStock: 8 }
    ]
  },
  {
    name: "Nikon Z6 II",
    type: "Camera",
    price: 149999,
    brand: "Nikon",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60",
    description: "Full-frame mirrorless camera for enthusiast creators. Dual EXPEED 6 processors, 24.5MP resolution, and 4K video.",
    rating: 4.6,
    numReviews: 50,
    variants: [
      { size: "Body Only", color: "Black", countInStock: 12 }
    ]
  },
  {
    name: "Fujifilm X-T5",
    type: "Camera",
    price: 139999,
    brand: "Fujifilm",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=60",
    description: "Classic styling with modern tech. 40MP APS-C sensor, classic Fujifilm film simulations, and retro dials.",
    rating: 4.7,
    numReviews: 95,
    variants: [
      { size: "With 18-55mm Lens", color: "Silver/Black", countInStock: 15 }
    ]
  },
  {
    name: "GoPro Hero 12 Black",
    type: "Camera",
    price: 37900,
    brand: "GoPro",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60",
    description: "The ultimate action camera. 5.3K video, HyperSmooth 6.0 stabilization, rugged build, waterproof design.",
    rating: 4.7,
    numReviews: 230,
    variants: [
      { size: "Standard Pack", color: "Black", countInStock: 50 },
      { size: "Creator Edition", color: "Black", countInStock: 20 }
    ]
  },
  {
    name: "Sony ZV-E10 Vlog Camera",
    type: "Camera",
    price: 61900,
    brand: "Sony",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=60",
    description: "Made for content creators. Interchangeable lens vlog camera, large APS-C sensor, and high-quality built-in mic.",
    rating: 4.5,
    numReviews: 180,
    variants: [
      { size: "With 16-50mm Power Zoom Lens", color: "White", countInStock: 25 }
    ]
  },
  {
    name: "Canon EOS Rebel T7 DSLR",
    type: "Camera",
    price: 39999,
    brand: "Canon",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60",
    description: "The perfect starter DSLR camera. 24.1 Megapixel CMOS sensor, built-in Wi-Fi and NFC connectivity.",
    rating: 4.3,
    numReviews: 310,
    variants: [
      { size: "With 18-55mm IS II Lens Kit", color: "Black", countInStock: 40 }
    ]
  },
  {
    name: "Panasonic Lumix GH6",
    type: "Camera",
    price: 169999,
    brand: "Panasonic",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=60",
    description: "The videographer's workhorse. Micro Four Thirds 25.2MP sensor, unlimited 4:2:2 10-bit internal recording.",
    rating: 4.6,
    numReviews: 35,
    variants: [
      { size: "Body Only", color: "Black", countInStock: 6 }
    ]
  },
  {
    name: "Nikon D850 DSLR",
    type: "Camera",
    price: 224900,
    brand: "Nikon",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60",
    description: "Pro DSLR powerhouse. 45.7 Megapixel full-frame resolution, extreme detail, and outstanding battery life.",
    rating: 4.8,
    numReviews: 48,
    variants: [
      { size: "Body Only", color: "Black", countInStock: 5 }
    ]
  },
  {
    name: "DJI Osmo Pocket 3",
    type: "Camera",
    price: 49900,
    brand: "DJI",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=60",
    description: "Pocket-sized 3-axis gimbal camera. Features a powerful 1-inch CMOS sensor, rotatable screen, and smart tracking.",
    rating: 4.8,
    numReviews: 89,
    variants: [
      { size: "Creator Combo", color: "Black", countInStock: 18 }
    ]
  },
  {
    name: "Fujifilm Instax Mini 12",
    type: "Camera",
    price: 6999,
    brand: "Fujifilm",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60",
    description: "Get instant real prints. Super simple close-up mode, automatic exposure adjustment, and selfie mirror.",
    rating: 4.4,
    numReviews: 410,
    variants: [
      { size: "Mini 12 Kit", color: "Pastel Blue", countInStock: 150 }
    ]
  }
];

const seedDB = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGOURI);
    console.log("Connected to Database successfully.");

    // Clean current Categories and Products
    console.log("Cleaning existing categories...");
    await Category.deleteMany({});
    console.log("Cleaning existing products...");
    await Product.deleteMany({});

    // Seed Categories
    console.log("Inserting categories...");
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Inserted ${createdCategories.length} categories.`);

    // Map Category IDs
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
    });

    // Populate Category IDs on products and insert
    console.log("Preparing products data with Category ObjectIds...");
    const productsToInsert = productsData.map((prod) => {
      // Find matching Category key (e.g. Mobiles, Laptops, Tablets, Drones, Cameras)
      let catName = prod.type + "s";
      if (prod.type === "Accessories") catName = "Accessories"; // fallback if needed

      const catId = categoryMap[catName.toLowerCase()];
      return {
        ...prod,
        category: catId || null
      };
    });

    console.log(`Inserting ${productsToInsert.length} products...`);
    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`Successfully seeded ${createdProducts.length} products!`);

    await mongoose.disconnect();
    console.log("Disconnected from Database.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding the database:", err);
    process.exit(1);
  }
};

seedDB();
