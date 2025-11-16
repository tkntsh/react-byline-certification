# Setup Instructions

## Quick Start Guide

Follow these steps to get your Byline Certification application up and running:

### Step 1: Install Dependencies

Run this command in the root directory to install all dependencies (both root and client):

```bash
npm run install-all
```

This will install:
- Backend dependencies (Express, SQLite, JWT, etc.)
- Frontend dependencies (React, Vite, Tailwind CSS, etc.)

### Step 2: Environment Configuration

Create a `.env` file in the root directory with the following content:

```env
# News API Configuration (optional - will use mock data if not provided)
NEWS_API_KEY=your_newsapi_org_key_here

# JWT Secret for authentication (change this in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000
```

**Note:** 
- The `NEWS_API_KEY` is optional. If you don't provide it, the app will use mock news data.
- To get a free NewsAPI.org key, visit: https://newsapi.org/register
- The `JWT_SECRET` should be a random string for security (you can generate one or use any string for development)

### Step 3: Start the Application

Run this command to start both the backend and frontend servers:

```bash
npm run dev
```

This will:
- Start the backend server on `http://localhost:5000`
- Start the frontend development server on `http://localhost:5173`

### Step 4: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Default Admin Account

After the first run, a default admin account is automatically created:
- **Email:** admin@99.ninenine
- **Password:** admin99*

**Important:** Change this password immediately in production!

## Project Structure

```
byline-certification-app/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── context/       # React context (Auth)
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                 # Express backend application
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware (auth)
│   ├── database.js        # Database setup
│   └── index.js           # Server entry point
├── package.json           # Root package.json
└── README.md              # Project documentation
```

## Available Scripts

### Root Directory

- `npm run dev` - Start both backend and frontend servers
- `npm run server` - Start only the backend server
- `npm run install-all` - Install all dependencies (root + client)
- `npm run build` - Build the frontend for production

### Client Directory

- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Port Already in Use

If port 5000 or 5173 is already in use:
1. Change the `PORT` in `.env` file for backend
2. Change the port in `client/vite.config.js` for frontend

### Database Issues

If you encounter database errors:
- Delete the `database.db` file and restart the server
- The database will be recreated automatically

### News API Not Working

If NewsAPI.org is not working:
- The app will automatically fall back to mock news data
- No action needed - the app will continue to function normally

## Development Tips

1. **Hot Reload:** Both frontend and backend support hot reload during development
2. **Database:** SQLite database file (`database.db`) is created automatically
3. **Authentication:** JWT tokens are stored in localStorage
4. **Admin Access:** First registered user becomes admin, or use the default admin account

## Next Steps

1. Sign up for a new account or use the default admin account
2. Explore the news section on the home page
3. Submit a test report
4. Review submissions as an admin
5. Customize the styling and content to match your needs

## Support

For issues or questions, refer to the main README.md file or check the code comments for detailed explanations of each component's functionality.

