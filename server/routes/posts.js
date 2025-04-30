// server/routes/posts.js
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const verifyToken = require('../verifyToken')
const cloudinary = require('cloudinary').v2

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

//CREATE
router.post("/create", verifyToken, async (req, res) => {
    try {
        const newPost = new Post(req.body)
        const savedPost = await newPost.save()
        
        res.status(200).json(savedPost)
    }
    catch(err) {
        res.status(500).json(err)
    }
})

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
    try {
        // If updating an image and there was a previous one, delete the old image
        const post = await Post.findById(req.params.id)
        if (post.photo && req.body.photo && post.photo !== req.body.photo) {
            // Extract public ID from the old Cloudinary URL
            const publicId = post.photo.split('/').pop().split('.')[0]
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(`blog_images/${publicId}`)
                    console.log(`Deleted old image: blog_images/${publicId}`)
                } catch (deleteErr) {
                    console.error("Error deleting old image:", deleteErr)
                }
            }
        }
        
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(updatedPost)
    }
    catch(err) {
        res.status(500).json(err)
    }
})

//DELETE
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        // Get post to access its image URL
        const post = await Post.findById(req.params.id)
        
        // Delete the post image from Cloudinary if it exists
        if (post.photo) {
            // Extract public ID from the Cloudinary URL
            const publicId = post.photo.split('/').pop().split('.')[0]
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(`blog_images/${publicId}`)
                    console.log(`Deleted image: blog_images/${publicId}`)
                } catch (deleteErr) {
                    console.error("Error deleting image:", deleteErr)
                }
            }
        }
        
        // Delete the post and its comments
        await Post.findByIdAndDelete(req.params.id)
        await Comment.deleteMany({postId: req.params.id})
        
        res.status(200).json("Post has been deleted!")
    }
    catch(err) {
        res.status(500).json(err)
    }
})

//GET POST DETAILS
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }
    catch(err) {
        res.status(500).json(err)
    }
})

//GET POSTS
router.get("/", async (req, res) => {
    const query = req.query
    
    try {
        const searchFilter = {
            title: {$regex: query.search, $options: "i"}
        }
        const posts = await Post.find(query.search ? searchFilter : null)
        res.status(200).json(posts)
    }
    catch(err) {
        res.status(500).json(err)
    }
})

//GET USER POSTS
router.get("/user/:userId", async (req, res) => {
    try {
        const posts = await Post.find({userId: req.params.userId})
        res.status(200).json(posts)
    }
    catch(err) {
        res.status(500).json(err)
    }
})

module.exports = router