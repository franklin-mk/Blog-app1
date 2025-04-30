// client/src/pages/EditPost.jsx
import { useContext, useEffect, useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { ImCross } from 'react-icons/im'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdAddCircle } from 'react-icons/md'
import axios from "axios"
import { URL } from "../url"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"

const EditPost = () => {
  const postId = useParams().id
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [file, setFile] = useState(null)
  const [cat, setCat] = useState("")
  const [cats, setCats] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchPost = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/" + postId)
      setTitle(res.data.title)
      setDesc(res.data.desc)
      setFile(res.data.photo)
      setCats(res.data.categories)
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const post = {
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats
    }

    if (file && file !== post.photo) {
      const data = new FormData()
      const filename = Date.now() + file.name
      data.append("img", filename)
      data.append("file", file)
      post.photo = filename
      
      try {
        await axios.post(URL + "/api/upload", data)
      } catch (err) {
        console.log(err)
      }
    }
    
    try {
      const res = await axios.put(URL + "/api/posts/" + postId, post, {
        withCredentials: true
      })
      setIsLoading(false)
      navigate("/posts/post/" + res.data._id)
    } catch (err) {
      console.log(err)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [postId])

  const deleteCategory = (i) => {
    let updatedCats = [...cats]
    updatedCats.splice(i, 1)
    setCats(updatedCats)
  }

  const addCategory = () => {
    if (cat.trim() !== "") {
      let updatedCats = [...cats]
      updatedCats.push(cat)
      setCat("")
      setCats(updatedCats)
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCategory()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow px-4 sm:px-8 md:px-16 lg:px-[200px] py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Update Your Post
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mt-2"></div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form className="w-full flex flex-col space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Post Title</label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter post title"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Featured Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition cursor-pointer">
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <AiOutlineCloudUpload className="text-4xl text-indigo-500 mb-2" />
                  <span className="text-gray-600 text-sm mb-1">Click to upload an image</span>
                  <span className="text-gray-400 text-xs">
                    {file ? 
                      (typeof file === 'string' ? file : file.name) : 
                      "PNG, JPG, GIF up to 10MB"}
                  </span>
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Categories</label>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                    placeholder="Enter post category"
                    type="text"
                  />
                  <button
                    type="button"
                    onClick={addCategory}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition shadow-md flex items-center"
                  >
                    <MdAddCircle className="mr-1" /> Add
                  </button>
                </div>

                {/* Categories Display */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {cats?.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-2 rounded-full"
                    >
                      <p className="text-indigo-800 text-sm">{c}</p>
                      <button
                        type="button"
                        onClick={() => deleteCategory(i)}
                        className="text-white bg-indigo-600 rounded-full cursor-pointer p-1 text-xs hover:bg-indigo-700 transition"
                      >
                        <ImCross size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Post Content</label>
              <textarea
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
                rows={15}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                placeholder="Enter post description"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className={`w-full md:w-[20%] mx-auto py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition shadow-md flex justify-center items-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? "Updating..." : "Update Post"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default EditPost