import { URL } from '../url';
import axios from 'axios';

/**
 * Upload an image to Cloudinary via our backend API
 * @param {File} imageFile - The image file to upload
 * @returns {Promise} - Promise resolving to the upload result with image URL
 */
export const uploadImage = async (imageFile) => {
    try {
      // Convert the file to base64
      const base64 = await fileToBase64(imageFile);
      
      // Send to our API endpoint - using axios with withCredentials to include cookies
      const response = await axios.post(`${URL}/api/upload/base64`, 
        { image: base64 },
        { withCredentials: true }  // This will send cookies with the request
      );
      
      // Return the response data with imageUrl field for compatibility
      return {
        ...response.data,
        imageUrl: response.data.url // Map 'url' to 'imageUrl' for consistency
      };
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
};
  
/**
 * Delete an image from Cloudinary via our backend API
 * @param {string} publicId - The public ID of the image
 * @returns {Promise} - Promise resolving to the deletion result
 */
export const deleteImage = async (publicId) => {
    try {
      const response = await axios.delete(`${URL}/api/upload/${encodeURIComponent(publicId)}`, 
        { withCredentials: true }  // This will send cookies with the request
      );
      
      return response.data;
    } catch (error) {
      console.error('Image deletion error:', error);
      throw error;
    }
};
  
/**
 * Convert a File object to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Promise resolving to base64 string
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
};
  
/**
 * Extract the public ID from a Cloudinary URL
 * @param {string} cloudinaryUrl - The Cloudinary URL
 * @returns {string|null} - The public ID or null if not found
 */
export const getPublicIdFromUrl = (cloudinaryUrl) => {
    if (!cloudinaryUrl) return null;
    
    try {
      // Parse the Cloudinary URL to extract public ID
      // Example URL: https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/blog_images/abcdef123456.jpg
      
      // Extract the part after /upload/
      const uploadIndex = cloudinaryUrl.indexOf('/upload/');
      if (uploadIndex === -1) return null;
      
      // Get everything after /upload/ and remove the version (v1234567890/)
      let path = cloudinaryUrl.substring(uploadIndex + 8);
      
      // Remove version number if present
      const versionMatch = path.match(/^v\d+\//);
      if (versionMatch) {
        path = path.substring(versionMatch[0].length);
      }
      
      // Remove file extension if present
      const extensionIndex = path.lastIndexOf('.');
      if (extensionIndex !== -1) {
        path = path.substring(0, extensionIndex);
      }
      
      return path; // This should be something like "blog_images/abcdef123456"
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
};