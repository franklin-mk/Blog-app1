// Fixed index.js
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const multer = require('multer')
const path = require("path")
const fs = require('fs')
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')
const commentRoute = require('./routes/comments')

// Ensure image directory exists
const imageDir = path.join(__dirname, "/images")
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

//database connection
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database is connected successfully!")
    }
    catch(err) {
        console.log(err)
    }
}

//middlewares
dotenv.config()
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")))

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

//image upload
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, "images")
    },
    filename: (req, file, fn) => {
        fn(null, req.body.img)
    }
})

const upload = multer({storage: storage})
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        // Console logging to debug
        console.log("Upload request received:", req.body);
        console.log("File uploaded:", req.file);
        
        return res.status(200).json("Image has been uploaded successfully!")
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json("Error uploading image")
    }
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(process.env.PORT, () => {
    connectDB()
    console.log("App is running on port " + process.env.PORT)
})