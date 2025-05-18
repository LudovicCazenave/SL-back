import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { eventController } from "../controllers/event.controller.js";
import { messageController } from "../controllers/message.controller.js";
import { jwtMiddleware } from "../middlewares/jwtMiddleware.js";
import { userController } from "../controllers/user.controller.js";
import { errorHandler } from "../middlewares/isErrorHandlerMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

// Create a new router instance
export const router = new Router();

// ====================================
// Home Page Routes 
// ====================================

// GET /api/homepage-events
// Retrieves events relevant to the authenticated user.
// jwtMiddleware ensures that the user is authenticated.
// errorHandler wraps the controller to handle errors in a unified manner.
router.route("/api/homepage-events")
  .get(jwtMiddleware, errorHandler(eventController.connectedEvent));

// GET /api/homepage-profiles
// Retrieves profiles that match the connected user's preferences.
// User must be authenticated via jwtMiddleware.
router.route("/api/homepage-profiles")
  .get(jwtMiddleware, errorHandler(userController.connectedProfile));

// ====================================
// Authentication Routes
// ====================================


// POST /api/signin
// Handles user sign in by processing the request in the signIn controller.
router.route("/api/signin")
  .post(errorHandler(authController.signIn));

// GET /api/verify-token
// Verifies the current user's token. Ensures the route is authenticated.
router.route("/api/verify-token")
  .get(jwtMiddleware, errorHandler(authController.verifyToken));

// POST /api/logout
// Logs out the authenticated user.
router.route("/api/logout")
  .post(jwtMiddleware, errorHandler(authController.logout));

// ====================================
// Event Routes
// ====================================

// GET /api/filter-event
// Retrieves filtered events based on specific criteria (e.g., latest events for preset cities).
router.route("/api/filter-event")
  .get(errorHandler(eventController.lastEvent));

// GET /api/events
// Retrieves all events with their associations. Accessible only by authenticated users.
router.route("/api/events")
  .get(jwtMiddleware, errorHandler(eventController.getAllEvents));

// GET /api/events/:slug
// Retrieves a single event by its slug.
router.route("/api/events/:slug")
  .get(jwtMiddleware, errorHandler(eventController.getOneEvent));

// POST /api/events/:slug/register
// Registers the authenticated user for a specific event identified by its slug.
router.route("/api/events/:slug/register")
  .post(jwtMiddleware, errorHandler(eventController.registerForEvent));

// ====================================
// Profile Routes
// ====================================

// POST /api/signup
// Handles user sign up. Uses multer middleware to process a single file upload (i.e., "picture")
// before invoking the signUp controller wrapped in the errorHandler.
router.route("/api/signup")
  .post(upload.single("picture"), errorHandler(userController.signUp));

// GET /api/profiles
// Retrieves all user profiles excluding sensitive fields, accessible to authenticated users.
router.route("/api/profiles")
  .get(jwtMiddleware, errorHandler(userController.getAllProfiles));

// GET /api/profiles/:slug
// Retrieves a single user profile based on the provided slug.
router.route("/api/profiles/:slug")
  .get(jwtMiddleware, errorHandler(userController.getOneProfile));

// ====================================
// Message Routes
// ====================================

// GET /api/messages
// Retrieves all messages involving the authenticated user
// (either as sender or receiver).
router.route("/api/messages")
  .get(jwtMiddleware, errorHandler(messageController.getAllMessages))
  // POST /api/messages
  // Creates a new message from the authenticated user.
  .post(jwtMiddleware, errorHandler(messageController.createMessage));

// ====================================
// Account Routes
// ====================================

// Routes under /api/my-account allow the authenticated user to manage their account.
// - GET retrieves account details.
// - PATCH updates account details (including file uploads like picture).
// - DELETE removes the user account.
router.route("/api/my-account")
  .get(jwtMiddleware, errorHandler(userController.getAccountDetails))
  .patch(jwtMiddleware, upload.single("picture"), errorHandler(userController.updateAccountDetails))
  .delete(jwtMiddleware, errorHandler(userController.deleteAccount));

// ====================================
// 404 Not Found Route
// ====================================

// Catch-all route to handle any undefined endpoints and return a 404 error.
router.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});