const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary').v2
const { Buffer } = require('buffer')
const verifyToken = require('../verifyToken')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Direct upload endpoint for base64 encoded images
router.post("/base64", verifyToken, async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ error: "No image data provided" })
    }

    // Upload to Cloudinary using base64 data
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: 'blog_images',
      resource_type: 'auto'
    })

    // Return the Cloudinary URL and details
    return res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    })

  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error)
    return res.status(500).json({ error: "Image upload failed", details: error.message })
  }
})

// File upload endpoint for binary data
router.post("/file", verifyToken, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const file = req.files.image
    
    // Create a promise for the Cloudinary upload
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: 'blog_images',
        resource_type: 'auto'
      }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }).end(file.data)
    })

    // Wait for upload to complete
    const result = await uploadPromise

    return res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    })

  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error)
    return res.status(500).json({ error: "File upload failed", details: error.message })
  }
})

// Delete image endpoint - updated to handle full public_id path
router.delete("/:publicId(*)", verifyToken, async (req, res) => {
  try {
    const publicId = req.params.publicId
    
    if (!publicId) {
      return res.status(400).json({ error: "No public ID provided" })
    }

    console.log(`Attempting to delete image with public ID: ${publicId}`)

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === 'ok') {
      return res.status(200).json({ message: "Image deleted successfully" })
    } else {
      return res.status(404).json({ error: "Image not found or already deleted", result })
    }
    
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    return res.status(500).json({ error: "Image deletion failed", details: error.message })
  }
})

module.exports = router