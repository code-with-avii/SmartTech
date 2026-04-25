# SmartTech E-Commerce Website

A modern, feature-rich e-commerce platform built with React, Redux, and Tailwind CSS. SmartTech offers a seamless shopping experience with advanced filtering, wishlist management, and responsive design.

## 🚀 Features

### 🛍️ Shopping Experience
- **Product Categories**: Mobiles, Laptops, Drones, Cameras, Tablets
- **Advanced Filtering**: Price range, brand, and search functionality
- **Quick View**: Modal-based product preview without page navigation
- **Wishlist Management**: Add/remove items with persistent storage
- **Shopping Cart**: Full cart management with quantity controls

### 🎨 User Interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with smooth animations
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Dark Mode Support**: Enhanced user experience options

### 🔐 User Management
- **Authentication**: Login, signup, and password reset
- **Profile Management**: User account settings and preferences
- **Session Persistence**: Secure token-based authentication
- **Admin Dashboard**: Product and order management

### 📦 Product Management
- **Dynamic Product Display**: Real-time product updates
- **Image Lazy Loading**: Optimized performance
- **Product Details**: Comprehensive product information
- **Rating System**: Customer reviews and ratings

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern component-based architecture
- **Redux Toolkit**: State management with persistence
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Font Awesome**: Icon library

### Backend Integration
- **RESTful API**: Product data management
- **JSON Server**: Mock backend for development
- **Axios**: HTTP client for API calls

### Development Tools
- **Vite**: Fast development server
- **ESLint**: Code quality enforcement
- **Git**: Version control

## 📁 Project Structure

```
client/app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── CategoryMenu.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductSection.jsx
│   │   ├── QuickView.jsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Cart.jsx
│   │   ├── Wishlist.jsx
│   │   └── ...
│   ├── Products/           # Category-specific product pages
│   │   ├── Mobilesection.jsx
│   │   ├── Laptopsection.jsx
│   │   ├── DroneSection.jsx
│   │   ├── CameraSection.jsx
│   │   └── TabletSection.jsx
│   ├── Store/              # Redux state management
│   │   ├── cartSlice.js
│   │   ├── wishlistSlice.js
│   │   ├── userSlice.js
│   │   └── store.js
│   └── components/         # Additional UI components
│       ├── HeroBanner.jsx
│       ├── LoadingSkeleton.jsx
│       └── ...
├── public/                # Static assets
├── index.html
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-Commerce website
   ```

2. **Install dependencies**
   ```bash
   cd client/app
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Start the backend server** (if using local JSON server)
   ```bash
   cd server
   npm start
   ```

5. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

## 🎯 Key Features Deep Dive

### Shopping Cart System
- **Add to Cart**: One-click cart addition with quantity management
- **Cart Persistence**: Items saved across browser sessions
- **Real-time Updates**: Instant cart count updates
- **Checkout Integration**: Seamless checkout process

### Wishlist System
- **Add/Remove**: Toggle wishlist status with visual feedback
- **Persistent Storage**: Wishlist items saved locally
- **Quick Actions**: Move items from wishlist to cart
- **Count Badge**: Real-time wishlist item count

### Quick View Modal
- **Product Preview**: Detailed product information without navigation
- **Image Gallery**: High-quality product images
- **Quantity Selection**: Choose quantity before adding to cart
- **Wishlist Integration**: Add items directly from quick view

### Advanced Filtering
- **Price Ranges**: Under 10k, 10k-30k, Above 30k
- **Brand Search**: Filter by product brand
- **Real-time Search**: Live product name search
- **Clear Filters**: One-click filter reset

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) for actions and links
- **Secondary**: Orange (#F97316) for CTAs
- **Accent**: Red (#EF4444) for alerts and important elements
- **Neutral**: Gray shades for text and backgrounds

### Typography
- **Headings**: Bold, responsive font sizes
- **Body**: Clean, readable font stack
- **Buttons**: Consistent weight and spacing

### Components
- **Cards**: Rounded corners, shadows, hover effects
- **Buttons**: Gradient backgrounds, hover states
- **Modals**: Backdrop overlay, smooth animations
- **Navigation**: Sticky header, responsive menu

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=SmartTech
```

### API Endpoints
- **Products**: `GET /products`
- **Users**: `POST /users`, `GET /users/:id`
- **Authentication**: `POST /login`, `POST /register`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
- **Development**: `npm run dev`
- **Production**: `npm run preview`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

**Cart items not persisting**
- Check localStorage permissions
- Verify Redux persist configuration

**Images not loading**
- Check image paths in public folder
- Verify API response structure

**Quick View not working**
- Ensure QuickView component is imported
- Check event handlers and state management

**Wishlist not updating**
- Verify wishlistSlice is imported in store
- Check localStorage availability

## 📞 Support

For support and queries:
- Create an issue in the repository
- Check existing documentation
- Review component examples

---

**Built with ❤️ using modern web technologies**