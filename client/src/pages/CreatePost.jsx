import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {ImCross} from 'react-icons/im'
import { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { URL } from '../url'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import { uploadImage } from '../utils/cloudinaryUpload'

const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [file, setFile] = useState(null)
    const {user} = useContext(UserContext)
    const [cat, setCat] = useState("")
    const [cats, setCats] = useState([])
    const [preview, setPreview] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const deleteCategory = (i) => {
       let updatedCats = [...cats]
       updatedCats.splice(i, 1) // Fixed to remove just one item
       setCats(updatedCats)
    }

    const addCategory = () => {
        if (!cat.trim()) return // Prevent adding empty categories
        
        // Prevent duplicate categories
        if (cats.includes(cat)) return
        
        let updatedCats = [...cats]
        updatedCats.push(cat)
        setCat("")
        setCats(updatedCats)
    }

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      
      // Create preview for image
      if (selectedFile) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreview(null)
      }
    }

    const handleCreate = async (e) => {
      e.preventDefault()
      setError("")
      
      if (!title.trim() || !desc.trim()) {
        setError("Title and description are required!")
        return
      }
      
      setUploading(true)
      
      try {
        let imageUrl = null
        let publicId = null
        
        // Upload image to Cloudinary if there is a file
        if (file) {
          try {
            const uploadResult = await uploadImage(file)
            console.log("Upload result:", uploadResult) // Debug output
            
            if (uploadResult && uploadResult.url) {
              imageUrl = uploadResult.url
              publicId = uploadResult.public_id
            } else if (uploadResult && uploadResult.imageUrl) {
              imageUrl = uploadResult.imageUrl
              publicId = uploadResult.public_id
            } else {
              console.error("Upload result missing URL information:", uploadResult)
              setError("Failed to get image URL. Please try again.")
              setUploading(false)
              return
            }
          } catch (uploadErr) {
            console.error("Image upload failed:", uploadErr)
            setError("Failed to upload image. Please try again.")
            setUploading(false)
            return
          }
        }
        
        // Create post with Cloudinary image URL
        const post = {
          title,
          desc,
          username: user.username,
          userId: user._id,
          categories: cats,
          photo: imageUrl,
          photoPublicId: publicId // Store public ID for future reference
        }
  
        const res = await axios.post(URL+"/api/posts/create", post, {withCredentials: true})
        setUploading(false)
        navigate("/posts/post/"+res.data._id)
      }
      catch(err) {
        console.log(err)
        setError("Failed to create post. Please try again.")
        setUploading(false)
      }
  }

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Navbar/>
        
        {/* Content with top padding to account for fixed navbar */}
        <div className="pt-20 flex-grow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6 pb-2 border-b border-gray-100">
                Create a New Post
              </h1>
              
              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}
              
              <form className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Post Title
                  </label>
                  <input 
                    id="title"
                    type="text" 
                    placeholder="Enter an engaging title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                {/* Content Textarea */}
                <div className="space-y-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Post Content
                  </label>
                  <textarea 
                    id="content"
                    rows={12} 
                    placeholder="Write your post content here..." 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  ></textarea>
                </div>
                
                {/* File Upload */}
                <div className="space-y-2">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Featured Image
                  </label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 transition-colors hover:border-indigo-500">
                    <input 
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <label htmlFor="image" className="cursor-pointer text-center">
                      {preview ? (
                        <div className="space-y-4">
                          <img src={preview} alt="Preview" className="mx-auto max-h-48 object-contain rounded-md" />
                          <p className="text-sm text-indigo-600">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-600">Click to upload an image</p>
                          <p className="text-xs text-gray-500">(Optional)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                
                {/* Categories */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Categories
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input 
                      type="text"
                      placeholder="Enter a category" 
                      value={cat}
                      onChange={(e) => setCat(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button 
                      type="button"
                      onClick={addCategory}
                      className="flex-shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Category
                    </button>
                  </div>
                  
                  {/* Category Tags */}
                  {cats.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cats.map((category, index) => (
                        <div 
                          key={index} 
                          className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{category}</span>
                          <button
                            type="button"
                            onClick={() => deleteCategory(index)}
                            className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                          >
                            <ImCross size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-center pt-4 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={handleCreate}
                    disabled={uploading}
                    className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${uploading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Publishing...</span>
                      </div>
                    ) : (
                      'Publish Post'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <Footer/>
      </div>
    )
}

export default CreatePost