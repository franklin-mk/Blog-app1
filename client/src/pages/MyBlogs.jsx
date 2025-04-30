// client/src/pages/MyBlogs.jsx
import { Link, useLocation } from "react-router-dom"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import { URL } from "../url"
import HomePosts from "../components/HomePosts"
import Loader from "../components/Loader"

const MyBlogs = () => {
  const { search } = useLocation()
  const [posts, setPosts] = useState([])
  const [noResults, setNoResults] = useState(false)
  const [loader, setLoader] = useState(false)
  const { user } = useContext(UserContext)

  const fetchPosts = async () => {
    setLoader(true)
    try {
      const res = await axios.get(URL + "/api/posts/user/" + user._id)
      setPosts(res.data)
      if (res.data.length === 0) {
        setNoResults(true)
      } else {
        setNoResults(false)
      }
      setLoader(false)
    } catch (err) {
      console.log(err)
      setLoader(true)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [search])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow px-4 sm:px-8 md:px-16 lg:px-[200px] py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            My Blogs
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mt-2"></div>
        </div>

        {/* Content Section */}
        <div className="min-h-[60vh]">
          {loader ? (
            <div className="h-[40vh] flex justify-center items-center">
              <Loader />
            </div>
          ) : !noResults ? (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  to={user ? `/posts/post/${post._id}` : "/login"}
                  className="transform transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <HomePosts post={post} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[40vh] text-center">
              <div className="text-6xl text-gray-300 mb-4">📝</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-600 mb-3">
                No posts available
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't created any blog posts yet.
              </p>
              <Link
                to="/write"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md"
              >
                Create New Post
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MyBlogs