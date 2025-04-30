//client/src/pages/PostDetails.jsx
import { useNavigate, useParams } from "react-router-dom"
import Comment from "../components/Comment"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { BiEdit } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import axios from "axios"
import { URL } from "../url"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import Loader from "../components/Loader"
import { getImageUrl } from "../utils/imageUrlHandler"

const PostDetails = () => {
  const postId = useParams().id
  const [post, setPost] = useState({})
  const { user } = useContext(UserContext)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()
  
  const fetchPost = async() => {
    try {
      const res = await axios.get(URL+"/api/posts/"+postId)
      setPost(res.data)
    }
    catch(err) {
      console.log(err)
    }
  }

  const handleDeletePost = async() => {
    try {
      const res = await axios.delete(URL+"/api/posts/"+postId, {withCredentials:true})
      console.log(res.data)
      navigate("/")
    }
    catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPostComments = async() => {
    setLoader(true)
    try {
      const res = await axios.get(URL+"/api/comments/post/"+postId)
      // Sort comments by updatedAt date (newest first)
      const sortedComments = res.data.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })
      setComments(sortedComments)
      setLoader(false)
    }
    catch(err) {
      setLoader(true)
      console.log(err)
    }
  }

  useEffect(() => {
    fetchPostComments()
  }, [postId])

  const postComment = async(e) => {
    e.preventDefault()
    if (!comment.trim()) return; // Don't post empty comments
    
    try {
      const res = await axios.post(
        URL+"/api/comments/create",
        {
          comment: comment,
          author: user.username,
          postId: postId,
          userId: user._id
        },
        {withCredentials: true}
      )
      
      // Add the new comment at the beginning of the comments array (newest first)
      setComments([res.data, ...comments])
      setComment("") // Clear comment input
    }
    catch(err) {
      console.log(err)
    }
  }
  
  // Handle comment deletion without page reload
  const handleDeleteComment = async(commentId) => {
    try {
      await axios.delete(URL+"/api/comments/"+commentId, {withCredentials:true})
      // Filter out the deleted comment
      setComments(comments.filter(c => c._id !== commentId))
    }
    catch(err) {
      console.log(err)
    }
  }
  
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return {
      dateOnly: date.toString().slice(0,15),
      timeOnly: date.toString().slice(16,24)
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar/>

      {/* Content with top padding to account for fixed navbar */}
      <div className="pt-20 flex-grow">
        {loader ? (
          <div className="h-[80vh] flex justify-center items-center w-full">
            <Loader/>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Post Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">{post.title}</h1>
                {user?._id === post?.userId && (
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => navigate("/edit/"+postId)}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <BiEdit size={20} className="mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button 
                      onClick={handleDeletePost}
                      className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                    >
                      <MdDelete size={20} className="mr-1" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 text-gray-600 text-sm">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-2">
                    {post.username && post.username[0].toUpperCase()}
                  </div>
                  <span className="font-medium">@{post.username}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(post.updatedAt).dateOnly}</span>
                  <span className="mx-1">•</span>
                  <span>{formatDate(post.updatedAt).timeOnly}</span>
                </div>
              </div>
            </div>
            
            {/* Post Content */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {post.photo && (
                <div className="w-full overflow-hidden">
                  <img 
                    src={getImageUrl(post.photo)} 
                    className="w-full h-auto object-cover max-h-[500px]" 
                    alt={post.title || "Post image"}
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed">{post.desc}</p>
                </div>
                
                {post.categories && post.categories.length > 0 && (
                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-700">Categories:</span>
                      {post.categories?.map((category, index) => (
                        <span 
                          key={index} 
                          className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Comments {comments.length > 0 && `(${comments.length})`}
              </h3>
              
              {/* Add comment form */}
              {user ? (
                <div className="mb-6">
                  <form onSubmit={postComment} className="flex flex-col sm:flex-row gap-2">
                    <input 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)} 
                      type="text" 
                      placeholder="Write a comment..." 
                      className="flex-grow outline-none py-3 px-4 border border-gray-300 rounded-l-lg sm:rounded-r-none rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button 
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-r-lg sm:rounded-l-none rounded-l-lg transition-colors"
                    >
                      Post
                    </button>
                  </form>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    Please{" "}
                    <span 
                      className="text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium" 
                      onClick={() => navigate("/login")}
                    >
                      login
                    </span>{" "}
                    to join the conversation.
                  </p>
                </div>
              )}
              
              {/* Comments list */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Comment 
                      key={comment._id} 
                      c={comment} 
                      post={post} 
                      onDelete={handleDeleteComment}
                    />
                  ))
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer/>
    </div>
  )
}

export default PostDetails