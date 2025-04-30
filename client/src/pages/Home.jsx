//client/src/pages/Home.jsx
import axios from "axios"
import Footer from "../components/Footer"
import HomePosts from "../components/HomePosts"
import Navbar from "../components/Navbar"
import { IF, URL } from "../url"
import { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Loader from '../components/Loader'
import { UserContext } from "../context/UserContext"

const Home = () => {
  const { search } = useLocation()
  const [posts, setPosts] = useState([])
  const [noResults, setNoResults] = useState(false)
  const [loader, setLoader] = useState(false)
  const { user } = useContext(UserContext)

  const fetchPosts = async () => {
    setLoader(true)
    try {
      const res = await axios.get(URL + "/api/posts/" + search)
      setPosts(res.data)
      setNoResults(res.data.length === 0)
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Navbar />

      {/* Padding to prevent navbar overlap */}
      <div className="pt-20"> {/* 80px padding to account for fixed navbar */}

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-10 px-8 md:px-[200px]">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 mt-6">Welcome to Ari-Blog</h1>
            <p className="text-lg md:text-xl opacity-90">Discover stories, insights, and inspiration from our community</p>
            {!user && (
              <div className="mt-6">
                <Link to="/register" className="bg-white text-indigo-600 px-6 py-2 rounded-full font-medium mr-4 hover:bg-opacity-90 transition-all">
                  Join Now
                </Link>
                <Link to="/login" className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-indigo-600 transition-all">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Posts Section */}
        <div className="px-4 sm:px-8 md:px-[100px] lg:px-[200px] py-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">
              {search ? `Search Results${search.replace("?search=", " for ")}` : "Latest Posts"}
            </h2>

            {loader ? (
              <div className="h-[40vh] flex justify-center items-center">
                <Loader />
              </div>
            ) : !noResults ? (
              <div className="grid grid-cols-1 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post._id}
                    to={user ? `/posts/post/${post._id}` : "/login"}
                    className="block transform hover:scale-[1.01] transition-all duration-200"
                  >
                    <HomePosts post={post} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M12 4a8 8 0 100 16 8 8 0 000-16z" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-gray-800">No posts available</h3>
                <p className="mt-2 text-gray-500">Try a different search or check back later!</p>
                {search && (
                  <Link
                    to="/"
                    className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                  >
                    View All Posts
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home
