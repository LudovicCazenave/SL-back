import multer from "multer";

// Define the path where uploaded files will be stored.
const uploadsPath = "./public/uploads/";

// Configure the storage engine using multer.diskStorage.
// This determines the destination folder and how the files are named.
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files.
  destination: function (req, file, cb) {
    // The callback is invoked with no error and the designated destination.
    cb(null, uploadsPath);
  },
  // Define a custom filename for each uploaded file to minimize name collisions.
  filename: function (req, file, cb) {
    // Generate a unique suffix using the current timestamp and a random number.
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    // Combine the unique suffix with the original file name.
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// Create a file filter to restrict uploads to image files only.
const fileFilter = (req, file, cb) => {
  // Check if the MIME type of the file starts with "image/"
  if (file.mimetype.startsWith("image/")) {
    // Accept the file if it is an image.
    cb(null, true);
  } else {
    // Reject the file and pass an error message if it's not an image.
    cb(new Error("Seuls les fichiers d'image sont autorisés."), false);
  }
};

// Export a configured multer instance
export const upload = multer({
  // Use the defined storage configuration.
  storage: storage,
  // Apply the file filter to allow only images.
  fileFilter: fileFilter,
  // Uncomment the following line to enforce a file size limit of 5MB.
  // limits: { fileSize: 5 * 1024 * 1024 }
});
