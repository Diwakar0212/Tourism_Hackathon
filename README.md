# 🛡️ SafeSolo - Advanced Solo Travel Safety Platform

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black.svg)](https://socket.io/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-orange.svg)](https://firebase.google.com/)

> **A comprehensive, real-time safety platform for solo travelers with emergency monitoring, AI-powered trip planning, and 24/7 safety features.**

## 🌟 Overview

SafeSolo is a production-ready tourism platform specifically designed for solo travelers, providing comprehensive safety features, real-time monitoring, and AI-powered travel assistance. Built with modern technologies and enterprise-level architecture.

## ✨ Key Features

### 🚨 **Emergency & Safety**
- **Real-time SOS Alerts** - Instant emergency notifications with GPS location
- **Live Location Sharing** - Share location with trusted emergency contacts
- **Safety Check-ins** - Automated safety monitoring and reminders
- **Emergency Contact Management** - Multi-tier emergency response system
- **Weather & Travel Advisories** - Real-time alerts for safety risks

### 🤖 **AI-Powered Intelligence**
- **Smart Trip Planning** - AI-generated itineraries using OpenAI
- **Personalized Recommendations** - Context-aware travel suggestions
- **Risk Assessment** - Intelligent safety analysis for destinations
- **Chat Assistant** - 24/7 AI travel support

### 🔐 **Authentication & Security**
- **Firebase Authentication** - Secure user management
- **JWT Token System** - Professional session handling
- **Role-based Access Control** - Secure API endpoints
- **Rate Limiting** - DDoS protection and abuse prevention

### 💳 **Payment & Bookings**
- **Stripe Integration** - Secure payment processing
- **Multi-currency Support** - Global payment acceptance
- **Booking Management** - Hotels, flights, and activities
- **Automated Refunds** - Smart refund processing

### 🔔 **Real-time Communication**
- **Socket.IO Integration** - Instant notifications
- **Push Notifications** - Cross-platform alert system
- **SMS Alerts** - Emergency SMS via Twilio
- **Email Notifications** - Automated communication

## 🏗️ Technology Stack

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time features
- **Firebase SDK** for authentication

### **Backend**
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Socket.IO** for real-time communication
- **Firebase Admin SDK** for authentication
- **MongoDB/Firestore** for data storage

### **External Integrations**
- **Firebase** - Authentication & Database
- **OpenAI** - AI-powered features
- **Stripe** - Payment processing
- **Twilio** - SMS notifications
- **Google Maps** - Location services
- **Nodemailer** - Email services

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Diwakar0212/Tourism_Hackathon.git
cd Tourism_Hackathon
```

### 2. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup
```bash
# Create environment files
cp .env.example .env.local
cp backend/.env.example backend/.env
```

Fill in your API keys in the environment files:
- Firebase configuration
- Google Maps API key
- Stripe keys (optional)
- OpenAI API key (optional)
- Twilio credentials (optional)

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
node src/quick-server.cjs
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:5173 or http://localhost:5174
- **Backend API**: http://localhost:3001
- **API Features**: http://localhost:3001/api/demo/features

## 📱 Application Features

### **Main Pages**
- **🏠 Home** - Welcome and platform overview
- **🔍 Explore** - Discover destinations and experiences
- **📋 Plan Trip** - AI-powered trip planning
- **✈️ My Trips** - Manage and track travels
- **🎯 Experiences** - Browse activities and bookings
- **🛡️ Safety Center** - Emergency features and monitoring
- **👤 Profile** - User account and settings

### **Safety Center Features**
- Emergency SOS button with GPS location
- Real-time location sharing controls
- Emergency contact management
- Safety check-in scheduling
- Travel advisory monitoring
- Weather alert system

### **Notification System**
- Real-time emergency alerts
- Safety check-in confirmations
- Trip update notifications
- Weather and travel warnings
- Payment confirmations
- AI assistant responses

## 🔧 Configuration

### **Environment Variables**

**Frontend (.env.local):**
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

**Backend (.env):**
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
OPENAI_API_KEY=sk-your_openai_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 📚 API Documentation

### **Authentication Endpoints**
```
POST /api/auth/register  - User registration
POST /api/auth/login     - User login
POST /api/auth/logout    - User logout
POST /api/auth/refresh   - Token refresh
```

### **Safety Endpoints**
```
POST /api/safety/sos-alert    - Trigger SOS alert
POST /api/safety/check-in     - Safety check-in
GET  /api/safety/alerts       - Get safety alerts
POST /api/safety/share-location - Share location
```

### **Real-time Events (Socket.IO)**
```
sos-alert        - Emergency SOS alert
safety-checkin   - Safety check-in update
share-location   - Location sharing
trip-update      - Trip notifications
```

## 🧪 Testing

### **Demo Features**
The application includes demo functions for testing:
- Emergency SOS alerts
- Safety check-ins
- Location sharing
- Weather alerts
- Payment notifications
- AI responses

### **Testing Real-time Features**
1. Open multiple browser tabs
2. Login with different users
3. Test emergency alerts between users
4. Verify Socket.IO connections

## 🚀 Deployment

### **Frontend Deployment (Vercel/Netlify)**
```bash
npm run build
# Deploy dist/ folder
```

### **Backend Deployment (Railway/Heroku)**
```bash
cd backend
npm run build
# Deploy built application
```

### **Environment Variables**
Ensure all production environment variables are set in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for AI-powered features
- **Firebase** for authentication and database
- **Stripe** for secure payment processing
- **Socket.IO** for real-time communication
- **React** and **TypeScript** communities

## 📞 Support

For support and questions:
- Create an [Issue](https://github.com/Diwakar0212/Tourism_Hackathon/issues)
- Email: [Your Email]
- Documentation: Check the `ENVIRONMENT_SETUP.md` file

## 🌟 Star the Project

If you find SafeSolo useful, please ⭐ star this repository to show your support!

---

**Built with ❤️ for solo travelers worldwide** 🌍

## 🏆 Hackathon Achievement

This project represents a comprehensive tourism platform built during a hackathon, showcasing:
- **Full-stack development** with modern technologies
- **Real-time safety features** for solo travelers
- **AI integration** for smart recommendations
- **Professional-grade architecture** ready for production
- **Complete documentation** and setup guides

**SafeSolo - Making solo travel safer, smarter, and more enjoyable!** ✈️🛡️
- Project architecture and folder structure
- Design system with Tailwind CSS configuration
- Core component library (Button, Card, Input, Navigation)
- Homepage with hero section and feature showcase
- Safety Center with SOS button and emergency features
- Responsive navigation for mobile and desktop
- TypeScript interfaces for all data models
- PWA manifest and offline capabilities setup

### 🏗️ In Development
- AI Trip Planner with personalized recommendations
- Explore page with destination discovery
- Trip management system with itinerary builder
- Local experiences marketplace
- User profile and accessibility settings
- Real-time location sharing and safety check-ins

### 📋 Planned Features
- Backend API implementation
- Database schema and Firebase integration
- Machine learning recommendation engine
- AR heritage explorer with Unity integration
- Multilingual chat assistant
- Carbon footprint tracker
- Payment integration with Razorpay
- Real-time emergency response system

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Modern browser with ES2020 support

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/safesolo-platform.git
cd safesolo-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🎨 Component Library

### Core Components
- **Button**: Multi-variant button with loading states and icons
- **Card**: Flexible card component with hover effects
- **Input**: Accessible input with validation and icons
- **Navigation**: Responsive navigation with mobile menu

### Safety Components
- **SOSButton**: Emergency SOS with countdown and location sharing
- **AccessibilityIndicator**: Displays venue accessibility features

### Trip Components
- **TripCard**: Trip overview with status, budget, and progress
- **ItineraryItem**: Individual itinerary entries with timing

## 🔒 Security & Privacy

### Data Protection
- GDPR compliance for user data handling
- End-to-end encryption for sensitive information
- Secure storage of emergency contacts and location data
- Privacy-first approach with minimal data collection

### Safety Features
- Real-time location sharing with trusted contacts
- Emergency SOS with automatic responder notification
- Safe route planning avoiding high-risk areas
- 24/7 monitoring and response system

## 🌍 Accessibility

### WCAG 2.1 AA Compliance
- High contrast ratios for all text and UI elements
- Keyboard navigation support for all interactive elements
- Screen reader compatibility with proper ARIA labels
- Alternative text for all images and visual content

### Inclusive Design
- Multiple input methods (voice, touch, keyboard)
- Flexible font sizes and spacing options
- Color-blind friendly color palette
- Support for assistive technologies

## 📱 Progressive Web App

### PWA Features
- Offline functionality with service worker
- App-like experience on mobile devices
- Background sync for emergency alerts
- Push notifications for safety check-ins
- Home screen installation

### Performance
- Lazy loading for optimal performance
- Image optimization and compression
- Critical path rendering for fast initial load
- Caching strategies for offline access

## 🤝 Contributing

We welcome contributions from developers, designers, and accessibility experts. Please see our contributing guidelines for more information.

### Development Guidelines
- Follow TypeScript strict mode
- Use semantic HTML and ARIA attributes
- Write accessible components by default
- Include proper error handling and validation
- Add comprehensive tests for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Designed with input from solo female travelers and accessibility advocates
- Built with modern web technologies and best practices
- Inspired by the need for safer, more inclusive travel experiences

---

**SafeSolo** - Empowering every traveler to explore the world safely and confidently.