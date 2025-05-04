import sanitizeHtml from 'sanitize-html';

export function bodySanitizer(req, res, next) {
  // Define sanitize-html options to allow arrays while stripping all HTML tags and attributes
  const options = {
    allowedTags: [],
    allowedAttributes: {},
    allowArray: true,
  };
 
  // Check if request contains a body
  if (req.body) {
    // Loop through each property in request body
    for (const key in req.body) {
      // Only sanitize string values to avoid type errors
      if (typeof req.body[key] === 'string') {
        // Clean the value by removing any malicious HTML
        req.body[key] = sanitizeHtml(req.body[key], options);
      }
    }
  }
  // Continue to next middleware
  next();
}
