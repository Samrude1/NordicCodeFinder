const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const securityMiddleware = require("./middleware/security");
const compression = require("compression"); // Added compression

// Ladataan ympäristömuuttujat config.env-tiedostosta
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express();

// Compress all responses
app.use(compression());

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Security middleware – Helmet, RateLimit, CORS jne.
securityMiddleware(app);

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// file uploading
app.use(fileupload());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

app.set("json spaces", 2); // Pretty print JSON responses

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Käynnistetään palvelin
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

// Handle unhandled rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
