# Technology Stack

## Overview

This application uses a modern, simple-to-integrate tech stack that's perfect for rapid development and easy deployment.

## Frontend Stack

### React 18
- **Why:** Industry standard, excellent ecosystem, great developer experience
- **Purpose:** Building interactive user interfaces
- **Documentation:** https://react.dev/

### Vite
- **Why:** Fastest build tool, instant hot module replacement, zero-config setup
- **Purpose:** Development server and build tool
- **Documentation:** https://vitejs.dev/

### React Router DOM
- **Why:** Most popular routing solution for React
- **Purpose:** Client-side routing and navigation
- **Documentation:** https://reactrouter.com/

### Tailwind CSS
- **Why:** Utility-first CSS framework, rapid UI development, no custom CSS needed
- **Purpose:** Styling and responsive design
- **Documentation:** https://tailwindcss.com/

### Axios
- **Why:** Simple HTTP client, better than fetch API
- **Purpose:** Making API requests to backend
- **Documentation:** https://axios-http.com/

## Backend Stack

### Node.js
- **Why:** JavaScript runtime, same language as frontend
- **Purpose:** Server-side JavaScript execution
- **Documentation:** https://nodejs.org/

### Express.js
- **Why:** Minimal, flexible, most popular Node.js framework
- **Purpose:** Web server and API framework
- **Documentation:** https://expressjs.com/

### SQLite (better-sqlite3)
- **Why:** Zero-configuration database, file-based, perfect for development
- **Purpose:** Data persistence (users, submissions)
- **Documentation:** https://github.com/WiseLibs/better-sqlite3
- **Note:** No separate database server needed!

### JWT (jsonwebtoken)
- **Why:** Stateless authentication, industry standard
- **Purpose:** User authentication and authorization
- **Documentation:** https://github.com/auth0/node-jsonwebtoken

### bcryptjs
- **Why:** Secure password hashing
- **Purpose:** Encrypting user passwords
- **Documentation:** https://github.com/dcodeIO/bcrypt.js

## External Services

### NewsAPI.org
- **Why:** Free tier available, reliable, easy to integrate
- **Purpose:** Fetching real news articles
- **Documentation:** https://newsapi.org/docs
- **Alternative:** Falls back to mock data if API unavailable
- **Free Tier:** 100 requests/day

## Why This Stack?

### Simplicity
- **Single Language:** JavaScript/JSX throughout
- **No Complex Setup:** SQLite requires no server setup
- **Fast Development:** Hot reload, instant feedback

### Easy Integration
- **Standard Tools:** All tools are industry-standard
- **Great Documentation:** Extensive documentation available
- **Large Community:** Easy to find help and solutions

### Scalability Path
- **Easy Migration:** Can switch to PostgreSQL/MySQL later
- **Production Ready:** All tools are production-tested
- **Deployment Friendly:** Easy to deploy to Vercel, Heroku, etc.

## Development Workflow

1. **Frontend Development:** React + Vite (instant hot reload)
2. **Backend Development:** Express (auto-restart with nodemon)
3. **Database:** SQLite (no setup, just works)
4. **Styling:** Tailwind (utility classes, no CSS files)

## Package Management

- **npm:** Node Package Manager (comes with Node.js)
- **No yarn/pnpm needed:** Standard npm works perfectly

## Build Tools

- **Vite:** Frontend bundler (faster than Webpack)
- **No Babel needed:** Vite handles transpilation
- **No Webpack config:** Zero configuration required

## Why Not Other Options?

### Why not MongoDB?
- SQLite is simpler for this use case
- No separate database server needed
- Easier to backup (single file)

### Why not Next.js?
- Vite + React is simpler for this project
- More control over routing
- Faster development server

### Why not TypeScript?
- JavaScript is simpler for rapid development
- Can be added later if needed
- Less boilerplate code

## Installation Requirements

### Required
- **Node.js:** v18 or higher
- **npm:** Comes with Node.js

### Optional
- **NewsAPI.org account:** For real news (free tier available)
- **Git:** For version control

## Performance

- **Frontend:** Vite provides instant hot reload
- **Backend:** Express is lightweight and fast
- **Database:** SQLite is very fast for this scale
- **Build Time:** Vite builds in seconds

## Security Features

- **Password Hashing:** bcryptjs
- **JWT Tokens:** Secure authentication
- **CORS:** Configured for security
- **Input Validation:** Server-side validation

## Future Enhancements

This stack allows easy addition of:
- **TypeScript:** Can be added incrementally
- **PostgreSQL:** Easy migration path
- **Redis:** For caching (if needed)
- **Docker:** Easy containerization
- **CI/CD:** Standard Node.js deployment

