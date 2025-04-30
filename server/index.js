// server/index.js
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const path = require("path")
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')
const commentRoute = require('./routes/comments')
const uploadRoute = require('./routes/upload')  // New Cloudinary upload route

// Load environment variables
dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Create temporary multer storage for backward compatibility (if needed)
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Database connection
const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Database is connected successfully!")
  }
  catch(err) {
    console.log(err)
  }
}

// Middlewares
app.use(express.json({ limit: '50mb' }))  // Increased size limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use(cors({
  origin: process.env.CLIENT,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  exposedHeaders: ['set-cookie']
}))

app.use(cookieParser())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/comments", commentRoute)
app.use("/api/upload", uploadRoute)  // New upload route for Cloudinary

// Legacy upload endpoint using multer and cloudinary
app.post("/api/legacy-upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    // Convert buffer to base64 for Cloudinary upload
    const b64 = Buffer.from(req.file.buffer).toString("base64")
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'blog_images',
      resource_type: 'auto'
    })

    return res.status(200).json({
      message: "Image has been uploaded successfully to Cloudinary!",
      imageUrl: result.secure_url,
      public_id: result.public_id
    })
  } catch (error) {
    console.error("Upload error:", error)
    return res.status(500).json({ error: "Error uploading image to Cloudinary" })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(process.env.PORT, () => {
  connectDB()
  console.log("App is running on port " + process.env.PORT)
})