import { unlink } from 'fs/promises'; // Import promise-based file deletion function from fs
import { existsSync } from 'fs';        // Import synchronous file existence check from fs

export async function deleteFileIfExists(filePath) {
  
  // If no file path is provided, exit the function.
  if (!filePath) {
    return;
  }
  
  // Normalize the file path:
  // If the provided filePath already starts with 'public/', leave it unchanged.
  // Otherwise, prepend 'public/' to the filePath.
  const normalizedPath = filePath.startsWith('public/')
    ? filePath
    : `public/${filePath}`;
  
  try {
    // Check synchronously if the file exists at the normalized path.
    if (existsSync(normalizedPath)) {
      // If the file exists, delete it using the asynchronous unlink function.
      await unlink(normalizedPath);
      console.log(`Fichier supprimé avec succès: ${normalizedPath}`);
    }
  } catch (error) {
    // Log an error if the file deletion process fails.
    console.error(`Erreur lors de la suppression du fichier ${normalizedPath}:`, error);
  }
};