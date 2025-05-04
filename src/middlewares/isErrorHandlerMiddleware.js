// Middleware for error handling
// This higher-order function takes a controller function as an argument and returns a new async function.
// The returned function wraps the controller execution in a try-catch block to handle errors consistently.
export const errorHandler = (controller) => async (req, res, next) => {
  try {
    // Execute the provided controller function. If it returns a promise, await its resolution.
    await controller(req, res, next);
  } catch (err) {
    // Check the error type (name) to determine the appropriate HTTP status code and error message.
    if (err.name === 'UnauthorizedError') {
      // Handle authentication-related errors.
      console.log(err, '<< 401 UNAUTHORIZED');
      res.status(401).json({ err: 'Invalid token' });
    } else if (err.name === 'NotFoundError') {
      // Handle cases when a resource is not found.
      console.log(err, '<< 404 NOT FOUND');
      res.status(404).json({ err: 'Not found' });
    } else if (err.name === 'ForbiddenError') {
      // Handle cases of insufficient permission.
      console.log(err, '<< 403 FORBIDDEN ERROR');
      res.status(403).json({ err: 'forbidden error' });
    } else {
      // For any other type of error, respond with a generic internal server error.
      console.log(err, '<< 500 INTERNAL SERVER ERROR');
      res.status(500).json({ err: 'Something went wrong' });
    }
  }
};
