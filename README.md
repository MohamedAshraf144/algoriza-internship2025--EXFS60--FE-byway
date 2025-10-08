# 🎓 Byway Learning Platform - Frontend

A modern, responsive learning management system built with React, TypeScript, and Material-UI.

## 🚀 Live Demo
[View Live Demo](https://mohamedashraf144.github.io/algoriza-internship2025--EXFS60--FE-byway)

## 🔗 Backend API
[Live API](http://mohamedexfs60-001-site1.mtempurl.com)

## ✨ Features

### 🎯 Core Features
- **Course Management**: Browse, search, and filter courses
- **User Authentication**: JWT-based auth with Google OAuth
- **Shopping Cart**: Add courses to cart and checkout
- **Admin Dashboard**: Analytics and user management
- **Responsive Design**: Works on all devices

### 🛠️ Technical Features
- **Modern React**: React 18 with hooks and functional components
- **TypeScript**: Full type safety and better development experience
- **Material-UI**: Beautiful, accessible components
- **State Management**: Context API for global state
- **API Integration**: RESTful API with Axios
- **Routing**: React Router for navigation

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Build Tool**: Create React App
- **Deployment**: GitHub Pages

## 📱 Pages & Components

### 🏠 Public Pages
- **Landing Page**: Course showcase and platform overview
- **Course Details**: Detailed course information and enrollment
- **Authentication**: Login and registration forms
- **Search & Filter**: Advanced course search functionality

### 👤 User Pages
- **Dashboard**: User profile and purchased courses
- **Shopping Cart**: Course cart and checkout process
- **My Courses**: Access to purchased courses

### 🔧 Admin Pages
- **Dashboard**: Platform analytics and statistics
- **Course Management**: Add, edit, and delete courses
- **User Management**: View and manage users
- **Order Management**: Track and manage orders

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MohamedAshraf144/algoriza-internship2025--EXFS60--FE-byway.git
cd algoriza-internship2025--EXFS60--FE-byway
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Open in browser**
```
http://localhost:3002
```

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## 🔧 Configuration

### API Configuration
The application is configured to use the production backend:
```typescript
// src/services/api.ts
const API_BASE_URL = 'http://mohamedexfs60-001-site1.mtempurl.com/api';
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── services/           # API services
├── config/             # Configuration files
├── types/              # TypeScript types
├── utils/              # Utility functions
└── assets/             # Static assets
```

## 🎨 UI/UX Features

- **Material Design**: Modern, accessible interface
- **Responsive**: Mobile-first design
- **Dark/Light Theme**: Theme switching support
- **Animations**: Smooth transitions and interactions
- **Accessibility**: WCAG compliant

## 🔐 Authentication

- **JWT Tokens**: Secure authentication
- **Google OAuth**: Social login integration
- **Role-based Access**: Admin and user roles
- **Protected Routes**: Secure page access

## 🛒 Shopping Features

- **Add to Cart**: Course enrollment
- **Checkout Process**: Secure payment flow
- **Order History**: Track purchases
- **Course Access**: Immediate access after purchase

## 📊 Admin Features

- **Analytics Dashboard**: Platform statistics
- **User Management**: View and manage users
- **Course Management**: CRUD operations
- **Order Tracking**: Monitor sales and orders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@byway.com or create an issue.

## 🙏 Acknowledgments

- Material-UI team for the amazing component library
- React team for the excellent framework
- TypeScript team for type safety