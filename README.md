# Byline Certification Web Application

A web application that provides users with the opportunity to get their byline certification through submitting reports for editing and marking.

## Features

- 📰 News media presentation (like CNN or BBC)
- 🔐 User authentication (login/signup)
- 📝 Report submission system
- ✅ Admin dashboard for marking submissions
- 📊 Certification tracking
- ℹ️ About page

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Styling**: Tailwind CSS
- **Authentication**: JWT tokens
- **News API**: NewsAPI.org (with mock data fallback)

## Project Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

1. **Install all dependencies** (root and client):
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**:
   - Create a `.env` file in the root directory
   - Add your NewsAPI.org API key (optional, will use mock data if not provided):
     ```
     NEWS_API_KEY=your_api_key_here
     JWT_SECRET=your_secret_key_here
     PORT=5000
     ```

3. **Get a free NewsAPI.org key** (optional):
   - Visit https://newsapi.org/
   - Sign up for a free account
   - Get your API key from the dashboard
   - Add it to your `.env` file

4. **Start the development servers**:
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 5000) and frontend dev server (port 5173)

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Default Admin Account

After first run, a default admin account is automatically created:
- **Email:** admin@99.ninenine
- **Password:** admin99*
- **Name:** admin99

**Important:** Change this password immediately in production!

## Project Structure

```
byline-certification-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── database.js        # Database setup
│   └── index.js           # Server entry point
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### News
- `GET /api/news` - Get news articles

### Submissions
- `POST /api/submissions` - Create submission
- `GET /api/submissions` - Get user's submissions
- `GET /api/submissions/:id` - Get submission by ID
- `PUT /api/submissions/:id` - Update submission (admin only)
- `GET /api/admin/submissions` - Get all submissions (admin only)

## Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:5173

## License

MIT

