# 🌾 Farmers Support Platform

A comprehensive MERN stack application designed to help farmers access government schemes, get instant support through an AI-powered chatbot, and manage their profiles efficiently.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🤖 **AI-Powered Chatbot** - Get instant answers to farming-related queries
- 📱 **WhatsApp Bot Integration** - Support via WhatsApp messaging
- 🏛️ **Government Schemes** - Browse and search government schemes for farmers
- 🗺️ **Interactive Maps** - Location-based services using Google Maps
- 🔐 **User Authentication** - Secure JWT-based authentication with email verification
- 👤 **User Profiles** - Manage personal information and preferences
- 🌐 **Multilingual Support** - Available in English and Hindi
- 🔊 **Text-to-Speech** - Audio support for accessibility
- ☁️ **File Upload** - Cloudinary integration for image uploads

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Flowbite React** - UI components
- **Vite** - Build tool
- **i18next** - Internationalization

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - File storage
- **Google Cloud TTS** - Text-to-speech
- **SendGrid/Nodemailer** - Email service

### AI/ML
- **LangChain** - AI chatbot framework
- **ChromaDB** - Vector database for chatbot

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - Required for AI chatbot
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/farmers-support-platform.git
cd farmers-support-platform
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client/Learning
npm install
```

### 4. Install Python Dependencies (for AI Chatbot)

```bash
cd ../../
pip install -r requirements.txt
```

## ⚙️ Configuration

### 1. Server Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file and configure:

```env
# Server Configuration
PORT=3000

# MongoDB Configuration
MONGODB_URL=mongodb+srv://your-username:your-password@your-cluster.mongodb.net
DB_NAME=farmers

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# JWT Secret (generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-secure-jwt-secret

# Cloudinary Configuration (https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Getting Configuration Values:

**MongoDB:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<password>` with your database password

**Cloudinary:**
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

**JWT Secret:**
Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Google Cloud TTS (Optional):**
1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Text-to-Speech API
3. Create a service account and download JSON key
4. Place the key file in `server/keys/tts-sa.json`

### 2. Client Environment Variables

Create a `.env` file in the `client/Learning` directory:

```bash
cd client/Learning
cp .env.example .env
```

Edit the `.env` file:

```env
# Google Maps API Key
VITE_API_KEY=your-google-maps-api-key

# Backend API URL
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

**Google Maps API:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Create credentials (API Key)
4. Copy the API key

## 🏃 Running the Application

### Option 1: Run All Services Separately

#### 1. Start MongoDB (if running locally)
```bash
mongod
```

#### 2. Start the Backend Server
```bash
cd server
npm run dev
# Server will start on http://localhost:3000
```

#### 3. Start the Frontend
```bash
cd client/Learning
npm run dev
# Frontend will start on http://localhost:5173
```

#### 4. Start the AI Chatbot (Optional)
```bash
python chatbot_service.py
```

#### 5. Start WhatsApp Bot (Optional)
```bash
python whatsapp_bot.py
```

### Option 2: Using Concurrent Processes

You can create a root `package.json` to run everything together:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client/Learning && npm run dev"
  }
}
```

Then run:
```bash
npm install -g concurrently
npm run dev
```

## 📁 Project Structure

```
farmers-support-platform/
├── server/                      # Backend application
│   ├── controllers/             # Request handlers
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   ├── middleware/              # Custom middleware
│   ├── utils/                   # Utility functions
│   ├── keys/                    # Service account keys (git-ignored)
│   ├── uploads/                 # Temporary file uploads (git-ignored)
│   ├── .env                     # Environment variables (git-ignored)
│   └── package.json             # Server dependencies
│
├── client/Learning/             # Frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Auth/            # Authentication components
│   │   │   ├── Chatbot/         # Chatbot interface
│   │   │   ├── Dashboard/       # Dashboard components
│   │   │   ├── Maps/            # Google Maps components
│   │   │   └── SchemesList/     # Government schemes
│   │   ├── context/             # React Context (Auth, Toast)
│   │   ├── hooks/               # Custom hooks
│   │   ├── config/              # Configuration files
│   │   └── utils/               # Utility functions
│   ├── public/locales/          # i18n translations
│   ├── .env                     # Environment variables (git-ignored)
│   └── package.json             # Client dependencies
│
├── chatbot_service.py           # AI chatbot service
├── whatsapp_bot.py              # WhatsApp bot integration
├── vector.py                    # Vector database operations
├── process_schemes.py           # Scheme processing utilities
├── requirements.txt             # Python dependencies
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Forgot Password
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### User Endpoints

#### Get Profile
```http
GET /api/v1/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PATCH /api/v1/users/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "John Doe Updated",
  "avatar": <file>
}
```

### Schemes Endpoints

#### Get All Schemes
```http
GET /api/v1/schemes
```

#### Search Schemes
```http
GET /api/v1/schemes/search?q=farming
```

### Chatbot Endpoints

#### Send Message
```http
POST /api/v1/chatbot/message
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "What are the benefits of organic farming?"
}
```

### TTS Endpoints

#### Convert Text to Speech
```http
POST /api/v1/tts/synthesize
Content-Type: application/json

{
  "text": "Hello farmer",
  "language": "en-US"
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Keshav** - Initial work

## 🙏 Acknowledgments

- Government of India for scheme data
- MongoDB for database services
- Cloudinary for file storage
- Google Cloud for Maps and TTS services
- All contributors who help improve this project

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for farmers
