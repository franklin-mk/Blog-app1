/**
 * Utility function to handle image URLs properly whether they are from Cloudinary or local
 * @param {string} imageUrl - The image URL from the database
 * @returns {string} - The proper URL to display the image
 */
import { IF } from '../url';

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return ''; // Return empty string if no image
  
  // Check if it's already a complete URL (starts with http or https)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl; // It's a Cloudinary URL, return as is
  }
  
  // Otherwise, it's a relative path, prepend with IF
  return IF + imageUrl;
};