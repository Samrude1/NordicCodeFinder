# NordicCode Backend API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**Finland's Premier Code School Directory Platform**

A production-ready, full-stack web application featuring a robust RESTful backend API and modern responsive frontend. The platform provides comprehensive information about **13 top Finnish coding institutions** (Universities, Universities of Applied Sciences, Vocational Colleges, and Bootcamps) with detailed course catalogs, user reviews, and geospatial search capabilities.

🚀 **[Live Demo](https://bootcampfinder.onrender.com/)** | 📖 [Troubleshooting Guide](TROUBLESHOOTING.md)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Database Seeding](#database-seeding)
- [Deployment](#deployment)
- [Security](#security)
- [Performance](#performance)
- [License](#license)

---

## Features

### 🎯 Core Functionality

- **Comprehensive Bootcamp Directory**: Browse and search 13 Finnish coding institutions with detailed information
- **Course Catalog**: Complete course listings with tuition information (Free vs Non-EU pricing)
- **User Reviews & Ratings**: Community-driven reviews with 1-10 rating system
- **Geospatial Search**: Find bootcamps within a specified radius using zipcode
- **Advanced Filtering**: Query by career paths, location, housing, job assistance, and more
- **Photo Uploads**: Bootcamp image management with file validation

### 🔐 Authentication & Authorization

- **JWT-based Authentication**: Secure token-based auth with HTTP-only cookies
- **Role-Based Access Control**: Three-tier system (User, Publisher, Admin)
- **Password Management**: Secure password hashing with bcrypt, reset via email
- **Protected Routes**: Middleware-based route protection by role

### 🛡️ Security Features

- **Helmet.js Integration**: Security headers including Content Security Policy (CSP)
- **Rate Limiting**: 
  - General API: 100 requests per 15 minutes
  - Login endpoint: 50 requests per 15 minutes
- **NoSQL Injection Prevention**: MongoDB query sanitization
- **XSS Protection**: Input sanitization and output encoding
- **HPP Protection**: HTTP Parameter Pollution prevention
- **CORS Configuration**: Controlled cross-origin resource sharing

### ⚡ Performance Optimizations

- **Gzip Compression**: All responses compressed for faster transmission
- **Database Indexing**: Geospatial 2dsphere indexing for location queries
- **Advanced Query Middleware**: Efficient pagination, sorting, and field selection
- **Virtual Population**: Optimized related data fetching without duplication

### 🎨 Frontend Features

- **Modern UI/UX**: Glassmorphism design with semantic HTML5 and CSS3
- **Responsive Design**: Mobile-first architecture with adaptive layouts
- **Dynamic Content**: Live bootcamp catalog with pagination and quick-view modals
- **Real-time Updates**: Interactive reviews and ratings display
- **Skeleton Screens**: Native loading states for better perceived performance

---

## Tech Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM v8
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Email**: Nodemailer (password resets)

### Security & Middleware
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **cors** - Cross-Origin Resource Sharing
- **express-mongo-sanitize** - NoSQL injection prevention
- **xss-clean** - XSS attack prevention
- **hpp** - HTTP Parameter Pollution protection

### Utilities
- **node-geocoder** - Address geocoding for geospatial features
- **slugify** - URL-friendly slugs
- **compression** - Gzip response compression
- **morgan** - HTTP request logging
- **express-fileupload** - File upload handling

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript (ES6+)** - No framework dependencies
- **Font Awesome** - Icon library

### Development Tools
- **nodemon** - Auto-restart on file changes
- **cross-env** - Cross-platform environment variables
- **dotenv** - Environment configuration

---

## Architecture

### Project Structure

```
backend/
├── config/
│   ├── config.env          # Environment variables (gitignored)
│   ├── config.env.example  # Environment template
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── auth.js             # Authentication logic
│   ├── bootcamps.js        # Bootcamp CRUD operations
│   ├── courses.js          # Course management
│   ├── reviews.js          # Review system
│   └── users.js            # User management (admin)
├── middleware/
│   ├── advancedResults.js  # Query filtering, pagination, sorting
│   ├── async.js            # Async handler wrapper
│   ├── auth.js             # JWT verification & authorization
│   ├── error.js            # Global error handler
│   ├── logger.js           # Request logging
│   └── security.js         # Security middleware (Helmet, rate limiting, CORS)
├── models/
│   ├── Bootcamp.js         # Bootcamp schema with geospatial data
│   ├── Course.js           # Course schema
│   ├── Review.js           # Review schema with rating validation
│   └── User.js             # User schema with password hashing
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── bootcamps.js        # Bootcamp routes
│   ├── courses.js          # Course routes
│   ├── reviews.js          # Review routes
│   └── users.js            # User routes (admin)
├── utils/
│   ├── errorResponse.js    # Custom error class
│   ├── geocoder.js         # Geocoding configuration
│   └── sendEmail.js        # Email utility
├── public/
│   ├── index.html          # Main page
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   ├── style.css           # Global styles
│   ├── js/
│   │   └── app.js          # Frontend JavaScript
│   └── uploads/            # Uploaded images
├── _data/                  # Seed data (JSON files)
├── server.js               # Application entry point
├── seeder.js               # Database seeder script
└── package.json
```

### Data Models & Relationships

```
User (1) ──────< (N) Bootcamp
                      │
                      ├──< (N) Course
                      └──< (N) Review ──> (1) User
```

- **Users** can create multiple bootcamps (Publishers)
- **Bootcamps** have multiple courses and reviews
- **Reviews** belong to one bootcamp and one user
- **Cascade Delete**: Deleting a bootcamp removes all associated courses

---

## API Documentation

Base URL: `https://bootcampfinder.onrender.com/api/v1`  
Local Development: `http://localhost:5000/api/v1`

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/logout` | Logout user (clear cookie) | Private |
| GET | `/auth/me` | Get current logged-in user | Private |
| PATCH | `/auth/updatedetails` | Update user name/email | Private |
| PATCH | `/auth/updatepassword` | Update password | Private |
| POST | `/auth/forgotpassword` | Send password reset email | Public |
| PUT | `/auth/resetpassword/:resettoken` | Reset password with token | Public |

#### Example: Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Bootcamp Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/bootcamps` | Get all bootcamps (with filtering) | Public |
| GET | `/bootcamps/:id` | Get single bootcamp | Public |
| POST | `/bootcamps` | Create new bootcamp | Publisher/Admin |
| PUT | `/bootcamps/:id` | Update bootcamp | Publisher/Admin (owner) |
| DELETE | `/bootcamps/:id` | Delete bootcamp | Publisher/Admin (owner) |
| GET | `/bootcamps/radius/:zipcode/:distance` | Get bootcamps within radius (km) | Public |
| PUT | `/bootcamps/:id/photo` | Upload bootcamp photo | Publisher/Admin (owner) |

#### Advanced Query Features

**Filtering:**
```http
GET /api/v1/bootcamps?careers=Web Development&housing=true
```

**Selecting Fields:**
```http
GET /api/v1/bootcamps?select=name,description,housing
```

**Sorting:**
```http
GET /api/v1/bootcamps?sort=-averageRating,name
```

**Pagination:**
```http
GET /api/v1/bootcamps?page=2&limit=10
```

**Geospatial Search:**
```http
GET /api/v1/bootcamps/radius/00100/50
# Returns bootcamps within 50km of zipcode 00100 (Helsinki)
```

---

### Course Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/courses` | Get all courses | Public |
| GET | `/bootcamps/:bootcampId/courses` | Get courses for specific bootcamp | Public |
| GET | `/courses/:id` | Get single course | Public |
| POST | `/bootcamps/:bootcampId/courses` | Add course to bootcamp | Publisher/Admin (owner) |
| PUT | `/courses/:id` | Update course | Publisher/Admin (owner) |
| DELETE | `/courses/:id` | Delete course | Publisher/Admin (owner) |

---

### Review Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reviews` | Get all reviews | Public |
| GET | `/bootcamps/:bootcampId/reviews` | Get reviews for specific bootcamp | Public |
| GET | `/reviews/:id` | Get single review | Public |
| POST | `/bootcamps/:bootcampId/reviews` | Add review to bootcamp | Private (User) |
| PUT | `/reviews/:id` | Update review | Private (owner) |
| DELETE | `/reviews/:id` | Delete review | Private (owner) |

**Note:** Users can only submit one review per bootcamp.

---

### User Endpoints (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get single user | Admin |
| POST | `/users` | Create user | Admin |
| PUT | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

---

## Getting Started

### Prerequisites

- **Node.js** v14.0.0 or higher ([Download](https://nodejs.org/))
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** - VS Code recommended ([Download](https://code.visualstudio.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nordiccode-backend.git
   cd nordiccode-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example config file
   cp config/config.env.example config/config.env
   
   # Edit config/config.env with your settings
   ```
   
   See [Environment Configuration](#environment-configuration) for details.

4. **Start MongoDB**
   
   **Option A: Local MongoDB**
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```
   
   **Option B: MongoDB Atlas**
   - Use your Atlas connection string in `MONGO_URI`

5. **Seed the database** (optional but recommended)
   ```bash
   npm run seed
   ```
   
   See [Database Seeding](#database-seeding) for more options.

6. **Run the application**
   
   **Development mode** (with auto-restart):
   ```bash
   npm run dev
   ```
   
   **Production mode**:
   ```bash
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:5000
   - API: http://localhost:5000/api/v1

---

## Environment Configuration

Create a `config/config.env` file with the following variables:

```env
# Environment
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/nordiccode
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/nordiccode?retryWrites=true&w=majority

# File Upload
FILE_UPLOAD_PATH=./public/uploads
MAX_FILE_UPLOAD=1000000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email Configuration (for password reset)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=your_mailtrap_username
SMTP_PASSWORD=your_mailtrap_password
FROM_EMAIL=noreply@nordiccode.io
FROM_NAME=NordicCode
```

### Configuration Notes

- **JWT_SECRET**: Use a strong, random string in production (e.g., generate with `openssl rand -base64 32`)
- **SMTP Settings**: For development, use [Mailtrap](https://mailtrap.io/). For production, use a service like SendGrid, Mailgun, or AWS SES
- **MONGO_URI**: Ensure your IP is whitelisted in MongoDB Atlas if using cloud database

---

## Database Seeding

The project includes a seeder script to populate the database with sample data.

### Import Sample Data

```bash
node seeder -i
```

This will import:
- 13 Finnish bootcamps/institutions
- Multiple courses per bootcamp
- Sample users (see test credentials below)

### Delete All Data

```bash
node seeder -d
```

**Warning:** This will delete all data from the database.

### Test Credentials

After seeding, use these credentials to test different roles:

| Email | Password | Role |
|-------|----------|------|
| `admin@gmail.com` | `123456` | Admin |
| `publisher@gmail.com` | `123456` | Publisher |
| `user@gmail.com` | `123456` | User |

---

## Deployment

### Deploying to Render

1. **Create a new Web Service** on [Render](https://render.com/)

2. **Connect your GitHub repository**

3. **Configure the service:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add environment variables** in Render dashboard:
   - Set `NODE_ENV=production`
   - Add all variables from `config.env.example`
   - Use MongoDB Atlas URI for `MONGO_URI`
   - Configure production SMTP settings

5. **Deploy** and wait for the build to complete

### Pre-Deployment Checklist

- [ ] Set strong `JWT_SECRET` (not the example value)
- [ ] Use MongoDB Atlas or production database
- [ ] Configure production SMTP service
- [ ] Set `NODE_ENV=production`
- [ ] Update CORS origins in `middleware/security.js` to include your frontend URL
- [ ] Test all API endpoints in production
- [ ] Verify rate limiting is working
- [ ] Check security headers with [Security Headers](https://securityheaders.com/)

---

## Security

This application implements multiple layers of security:

### Authentication & Authorization
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Stored in HTTP-only cookies to prevent XSS attacks
- **Role-Based Access**: Middleware checks for user roles before allowing actions
- **Password Reset**: Time-limited tokens (10 minutes) sent via email

### Protection Mechanisms
- **Helmet.js**: Sets security-related HTTP headers
- **Rate Limiting**: Prevents brute-force attacks
- **NoSQL Injection**: Input sanitization with mongo-sanitize
- **XSS Prevention**: Input sanitization and output encoding
- **HPP Protection**: Prevents HTTP Parameter Pollution
- **CORS**: Controlled cross-origin access

### Best Practices
- Environment variables for sensitive data
- No passwords or secrets in code
- Mongoose validation on all inputs
- Custom error handling without stack traces in production
- Unhandled rejection handling

---

## Performance

### Optimizations Implemented

- **Gzip Compression**: Reduces response size by ~70%
- **Database Indexing**: 2dsphere index on location field for geospatial queries
- **Query Optimization**: Advanced results middleware for efficient pagination
- **Virtual Population**: Avoids data duplication in related resources
- **Lazy Loading**: Frontend implements skeleton screens and progressive loading

### Performance Metrics

- **API Response Time**: < 200ms average (excluding database queries)
- **Largest Contentful Paint (LCP)**: Optimized with compression and lazy loading
- **Database Queries**: Indexed fields for sub-50ms query times

---

## Development

### Running Tests

API testing can be done with tools like:
- **Postman**: Import the API endpoints
- **Thunder Client**: VS Code extension
- **curl**: Command-line testing

Example curl request:
```bash
curl -X GET https://bootcampfinder.onrender.com/api/v1/bootcamps
```

### Debugging in VS Code

1. Create `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Debug Server",
         "program": "${workspaceFolder}/server.js",
         "envFile": "${workspaceFolder}/config/config.env"
       }
     ]
   }
   ```

2. Set breakpoints and press F5 to start debugging

### Logging

- **Development**: Morgan logs all HTTP requests in dev format
- **Production**: Errors logged to console, consider adding file logging or service like Loggly

---

## Troubleshooting

For common issues and solutions, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

Common issues:
- MongoDB connection errors
- nodemon not found
- CORS errors
- File upload issues
- JWT token problems

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Sami Rautanen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Author

**Sami Rautanen**

- Portfolio: [Your Portfolio URL]
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## Acknowledgments

- Finnish coding institutions for inspiring this project
- The Node.js and Express.js communities
- MongoDB for excellent documentation
- All contributors and testers

---

<div align="center">
  <strong>Built with ❤️ in Finland</strong>
</div>
