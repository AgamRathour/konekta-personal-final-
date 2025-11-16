# Konekta Backend

Backend API server for the Konekta social networking application.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

   - Copy `.env.example` to `.env`
   - Update the configuration values with your own

3. **Set up MongoDB:**
   - Option A: Local MongoDB
     ```bash
     # Make sure MongoDB is running on localhost:27017
     mongod
     ```
   - Option B: MongoDB Atlas
     - Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     - Update `MONGODB_URI` in `.env` with your connection string

## Environment Variables

| Variable               | Description                      | Example                                          |
| ---------------------- | -------------------------------- | ------------------------------------------------ |
| `MONGODB_URI`          | MongoDB connection string        | `mongodb://localhost:27017/konekta`              |
| `JWT_SECRET`           | Secret key for JWT tokens        | `your_secret_key`                                |
| `JWT_EXPIRE`           | JWT expiration time              | `7d`                                             |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID           | `xxx.apps.googleusercontent.com`                 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret       | `xxx`                                            |
| `GOOGLE_CALLBACK_URL`  | Google OAuth callback URL        | `http://localhost:5000/api/auth/google/callback` |
| `EMAIL_USER`           | Gmail address for sending emails | `your_email@gmail.com`                           |
| `EMAIL_PASSWORD`       | Gmail app-specific password      | `xxxx xxxx xxxx xxxx`                            |
| `FRONTEND_URL`         | Frontend application URL         | `http://localhost:5175`                          |
| `PORT`                 | Server port                      | `5000`                                           |
| `NODE_ENV`             | Environment                      | `development` or `production`                    |

## Running the Server

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`)

## API Routes

### Health Check

- `GET /health` - Server health status

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/refresh-token` - Refresh JWT token
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

## Features

✅ Express.js server with security middleware (Helmet)  
✅ MongoDB connection with error handling  
✅ CORS enabled for frontend communication  
✅ Passport.js Google OAuth integration  
✅ JWT authentication  
✅ Email verification via Nodemailer  
✅ Error handling middleware  
✅ Graceful shutdown handling  
✅ Environment-based configuration

## Project Structure

```
konekta-backend/
├── config/
│   └── passportConfig.js      # Passport.js configuration
├── controllers/
│   └── authController.js       # Authentication logic
├── middleware/
│   ├── auth.js                 # JWT authentication middleware
│   └── errorHandler.js         # Error handling middleware
├── models/
│   └── User.js                 # User schema and model
├── routes/
│   └── auth.js                 # Authentication routes
├── utils/
│   └── mailer.js               # Email utility functions
├── .env                        # Environment variables (local)
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies
└── server.js                   # Main server file
```

## Development Notes

- The server includes proper error handling and logging
- MongoDB connection issues don't crash the server in development mode
- SIGTERM and SIGINT signals are handled for graceful shutdown
- All environment variables should be set in `.env` file (never commit this file)

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env` is correct
- For Atlas, verify IP whitelist and connection string format

### Port Already in Use

- Change `PORT` in `.env` to an available port
- Or kill the process using the port: `lsof -ti:5000 | xargs kill -9`

### CORS Errors

- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check CORS middleware configuration in `server.js`

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "konekta-api"
   ```
3. Set up reverse proxy (nginx/Apache) pointing to the server
4. Use HTTPS in production
5. Update all URLs to use HTTPS in `.env`

## Security Recommendations

- ⚠️ Never commit `.env` file to git
- ⚠️ Change `JWT_SECRET` in production
- ⚠️ Use strong passwords and app-specific passwords
- ⚠️ Enable HTTPS in production
- ⚠️ Keep dependencies updated: `npm audit fix`
- ⚠️ Use environment-specific configs for prod vs dev

## Support

For issues or questions, check the main Konekta repository documentation.
