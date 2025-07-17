# Ubazol - Delivery Marketplace App

Ubazol is a comprehensive delivery marketplace app that enables customers to order goods from vendors and arrange delivery to drop-off locations. Built with React Native and Expo, it provides a modern, user-friendly experience for on-demand delivery services.

## 🚀 Features

### Customer Features
- **Vendor Discovery** - Browse and search local vendors/stores
- **Product Catalog** - View detailed product listings with photos and descriptions
- **Shopping Cart** - Add/remove items, modify quantities, apply discounts
- **Order Management** - Place orders, track delivery status, view order history
- **Delivery Scheduling** - Choose delivery time slots and drop-off locations
- **Real-time Tracking** - Track delivery driver location and estimated arrival
- **Rating & Reviews** - Rate vendors, products, and delivery experience
- **Favorites & Reorders** - Save favorite vendors and easily reorder
- **Push Notifications** - Order updates, promotions, delivery alerts

### Core Functionality
- **Location Services** - GPS-based vendor discovery and delivery tracking
- **Multi-vendor Cart** - (with single vendor restriction for order consistency)
- **Order Status Tracking** - Real-time order status updates
- **Secure Storage** - Local data persistence with AsyncStorage
- **Modern UI/UX** - Beautiful, intuitive interface with smooth animations

## 🛠 Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation 6
- **State Management**: React Context + useReducer
- **Storage**: AsyncStorage for local data persistence
- **Location**: Expo Location for GPS and geocoding
- **Notifications**: Expo Notifications
- **Icons**: Expo Vector Icons (Ionicons)
- **Styling**: StyleSheet with custom theme system

## 📱 App Structure

### Core Screens
- **HomeScreen** - Main dashboard with featured vendors and categories
- **VendorsScreen** - Browse all available vendors
- **CartScreen** - Shopping cart with quantity controls and checkout
- **OrdersScreen** - Order history and active orders
- **ProfileScreen** - User account and preferences
- **VendorDetailScreen** - Individual vendor menu and products
- **ProductDetailScreen** - Product details and add to cart
- **CheckoutScreen** - Order review and payment
- **OrderTrackingScreen** - Real-time order tracking
- **SearchScreen** - Search for vendors and products

### Context Providers
- **UserContext** - Authentication, profile, favorites, loyalty points
- **CartContext** - Shopping cart management and operations
- **OrderContext** - Order creation, tracking, and history
- **LocationContext** - GPS location, delivery addresses, geocoding
- **NotificationContext** - Push notifications and alerts

## 🎨 Design System

### Theme Configuration
- **Colors**: Modern color palette with primary, secondary, accent colors
- **Typography**: Consistent text styles and font weights
- **Spacing**: Standardized spacing system (xs, sm, md, lg, xl, xxl)
- **Shadows**: Three-tier shadow system (small, medium, large)
- **Border Radius**: Consistent corner radius values

### UI Components
- Custom button components with different variants
- Card components with shadows and rounded corners
- Input fields with validation states
- Loading states and error handling
- Badge and notification indicators

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ubazol
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

### Project Structure
```
Ubazol/
├── App.js                 # Main app component with navigation
├── src/
│   ├── screens/          # All screen components
│   ├── context/          # Context providers for state management
│   ├── components/       # Reusable UI components
│   ├── utils/           # Utility functions and theme
│   ├── services/        # API services and external integrations
│   ├── hooks/           # Custom React hooks
│   └── constants/       # App constants and configurations
├── assets/              # Images, fonts, and other static assets
└── package.json         # Dependencies and scripts
```

## 🔧 Configuration

### Environment Setup
The app is configured to work out of the box with:
- Development mode enabled
- Location permissions requested automatically
- Notification permissions handled gracefully
- Sample data for demonstration

### Customization
- **Theme**: Modify `src/utils/theme.js` to customize colors, spacing, and typography
- **Sample Data**: Update sample vendors and products in HomeScreen
- **Navigation**: Modify navigation structure in `App.js`
- **Features**: Add or remove features by updating context providers

## 📦 Key Dependencies

```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "@react-navigation/stack": "^6.x",
  "react-native-screens": "^3.x",
  "react-native-safe-area-context": "^4.x",
  "expo-location": "^16.x",
  "expo-notifications": "^0.x",
  "@react-native-async-storage/async-storage": "^1.x",
  "@expo/vector-icons": "^13.x"
}
```

## 🔮 Future Enhancements

### Planned Features
- **Real-time Chat** - Communication between customers and vendors
- **Multiple Payment Methods** - Credit cards, digital wallets, cash on delivery
- **Advanced Search** - Filters, sorting, and search suggestions
- **Vendor Management** - Complete vendor dashboard for managing products and orders
- **Driver App** - Separate app for delivery drivers
- **Admin Dashboard** - Web-based admin panel for platform management
- **Analytics** - Order analytics and business insights
- **Promotions** - Discount codes, loyalty programs, and special offers

### Technical Improvements
- **API Integration** - Connect to real backend services
- **Real-time Updates** - WebSocket integration for live order updates
- **Image Optimization** - CDN integration for faster image loading
- **Performance** - Code splitting and lazy loading
- **Testing** - Unit tests, integration tests, and E2E testing
- **CI/CD** - Automated testing and deployment pipeline

## 📄 App Workflow

### Customer Journey
1. **Browse** - Discover vendors by category or location
2. **Select** - Choose vendor and browse products
3. **Cart** - Add items to cart with quantity selection
4. **Checkout** - Review order, select delivery address, choose payment
5. **Track** - Monitor order status and delivery progress
6. **Receive** - Get delivery confirmation and rate experience

### Order States
- `pending` - Order placed, awaiting vendor confirmation
- `confirmed` - Vendor confirmed the order
- `preparing` - Vendor is preparing the order
- `ready_for_pickup` - Order ready for driver pickup
- `out_for_delivery` - Driver picked up and en route
- `delivered` - Order successfully delivered
- `cancelled` - Order cancelled by customer or vendor

## 🤝 Contributing

This is a demonstration project showcasing a complete delivery marketplace app architecture. The codebase is designed to be:
- **Modular** - Easy to extend with new features
- **Scalable** - Context-based state management
- **Maintainable** - Consistent code structure and naming
- **Documented** - Clear code comments and documentation

## 📱 Screenshots

The app features a modern, intuitive design with:
- Clean home screen with vendor categories
- Smooth navigation between screens
- Professional cart and checkout flow
- Real-time order tracking interface
- Responsive design for different screen sizes

## 🔐 Privacy & Security

- **Local Storage** - User data stored securely on device
- **Location Privacy** - Location access requested only when needed
- **Data Validation** - Input validation and error handling
- **Secure Navigation** - Protected routes and authentication flow

---

**Built with ❤️ using React Native and Expo**

This app demonstrates a complete delivery marketplace solution with modern mobile app development practices and user-centric design.