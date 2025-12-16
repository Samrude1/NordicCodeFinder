# NordicCode (2025)

**Finland's Premier Code School Directory**  
A comprehensive platform comprising a robust RESTful backend API and a modern, responsive frontend user interface. It allows users to browse, search, and review Finnish coding bootcamps/universities, with full authentication and role-based access control.

---

## Features

### Frontend Client
- **Modern UI/UX**: Built with semantic HTML5, CSS3 (Glassmorphism design), and Vanilla JavaScript.
- **Dynamic Content**:
  - Live bootcamp catalog with pagination.
  - Interactive "Quick View" modals for bootcamp specific details.
  - Real-time reviews/ratings display.
- **Authentication**: Fully integrated Login and Registration forms managing JWT tokens.
- **Responsive Design**: Mobile-first architecture with custom navigation.

### Backend API
- **Resource Management**: CRUD operations for Bootcamps, Courses, Users, and Reviews.
- **Advanced Querying**: Select, Sort, Pagination, and Filtering (e.g., by radius using Geospatial data).
- **Security & Reliability**:
  - JWT Authentication & Role-based Authorization (User/Publisher/Admin).
  - Security headers (Helmet), CORS enabled, Rate Limiting, and XSS sanitization.
  - Image upload capabilities with validation.

---

## Tech Stack

- **Frontend:** HTML5, Vanilla CSS3, JavaScript (ES6+), FontAwesome
- **Backend:** Node.js, Express.js
- **Database:** MongoDB & Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **Email:** Nodemailer (password resets)
- **Deployment:** Render (Live)

---

## Development & IDE Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas URL)
- [VSCode](https://code.visualstudio.com/) (Recommended IDE)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd nordiccode_api
    ```
2.  **Install Dependencies**:
    *   This installs all backend libraries and development tools like `nodemon`.
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    *   Rename `config/config.env.example` to `config/config.env` (if applicable) and add your `MONGO_URI`.

### Running with VSCode
1.  **Open Project**:
    *   Open VSCode -> `File` -> `Open Folder` -> Select the project root.
2.  **Integrated Terminal**:
    *   Press `` Ctrl + ` `` to open the terminal.
    *   **Development Mode** (Hot-reloading):
        ```bash
        npm run dev
        ```
        *Note: This requires `nodemon` (installed via step 2).*
    *   **Production Mode**:
        ```bash
        npm start
        ```
3.  **Debugging**:
    *   Open the "Run and Debug" commands (`Ctrl + Shift + D`).
    *   Click "create a launch.json file" -> "Node.js".
    *   Set the `program` attribute to `"${workspaceFolder}/server.js"`.

### Troubleshooting
- **`nodemon` not found**: Ensure you ran `npm install`. If it persists, try installing globally: `npm install -g nodemon`.
- **MongoDB connection error**: Ensure your local MongoDB service is running or your Atlas URI is correct in `config.env`.

