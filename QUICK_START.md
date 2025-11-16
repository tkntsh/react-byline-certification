# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Create `.env` File
Create a `.env` file in the root directory:
```env
NEWS_API_KEY=your_key_here (optional)
JWT_SECRET=any_random_string
PORT=5000
```

### 3. Start the App
```bash
npm run dev
```

Visit: **http://localhost:5173**

## 📋 Default Admin Login

- **Email:** admin@99.ninenine
- **Password:** admin99*

## 🎯 Key Features

✅ News display (CNN/BBC style)  
✅ User registration and login  
✅ Report submission system  
✅ Admin review and marking  
✅ Certification tracking  
✅ About page  

## 📁 Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root dependencies
└── .env            # Environment variables
```

## 🔑 Important Files

- `server/index.js` - Backend server entry
- `client/src/App.jsx` - Frontend routing
- `server/database.js` - Database setup
- `client/src/services/api.js` - API calls

## 🛠️ Common Commands

```bash
npm run dev          # Start both servers
npm run server       # Backend only
cd client && npm run dev  # Frontend only
```

## 📚 Documentation

- `README.md` - Full documentation
- `SETUP.md` - Detailed setup instructions
- `TECH_STACK.md` - Technology explanations

## 🐛 Troubleshooting

**Port in use?** Change PORT in `.env`  
**Database error?** Delete `database.db` and restart  
**News API down?** App uses mock data automatically  

## 💡 Next Steps

1. Sign up or login with admin account
2. Explore the news section
3. Submit a test report
4. Review as admin
5. Customize to your needs!

