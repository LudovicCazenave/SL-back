import "dotenv/config"; // Load environment variables from .env file
import express from "express";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { router } from "./src/routes/index.routes.js";
import cors from "cors"; // Import CORS middleware to handle cross-origin requests
import cookieParser from "cookie-parser";

import helmet from "helmet"; // Import Helmet to secure Express apps by setting various HTTP headers
import rateLimit from "express-rate-limit"
import { bodySanitizer } from "./src/middlewares/sanitizeMiddleware.js"; // Import body sanitizer middleware

import fs from 'fs';
import path from 'path';

const app = express(); // Initialize the Express application

// Load the Swagger API documentation from the YAML file
const swaggerDocument = YAML.load('./docs/swagger.yaml');

// Set up Swagger UI at the '/api-docs' route so that API documentation is available
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use Helmet to help secure the API by setting various HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Configure cross-origin resource sharing policy for images, etc.
}));

// Enable CORS to specify which origins can access the API
app.use(cors({
  origin: "https://seniorlove-psi.vercel.app", // Allow requests only from this origin (for local development)
  credentials: true,                // Enable cookies and credentials in cross-origin requests
  methods: "GET, PUT, POST, PATCH, DELETE", // Allowed HTTP methods for CORS
  allowedHeaders: "Content-Type, Authorization" // Allowed HTTP headers for CORS
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Define the time window in milliseconds (15 minutes)
  limit: 100, // Set the maximum number of requests allowed within the window
  message: "Trop de requtes, veuillez ressayer plus tard !"
});
 // Apply the rate limiter middleware to the application 
app.use(limiter);
// Use cookieParser to parse cookies into req.cookies
app.use(cookieParser());

// Parse incoming requests with JSON payloads
app.use(express.json()); // Allows parsing JSON bodies from HTTP requests

// Parse incoming requests with URL-encoded payloads (typically from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public/uploads" directory at the route '/public/uploads'
app.use('/public/uploads', express.static('public/uploads'));

// Use the body sanitizer middleware to clean incoming data before handling routes
app.use(bodySanitizer);

// Use the router for all API endpoints defined in your routes
app.use(router);

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Folder "public/uploads" created');
}

// Define the port from the environment or default to 3000 if not provided
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
