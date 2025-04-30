// client/src/pages/Profile.jsx
import { useContext, useEffect, useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import ProfilePosts from "../components/ProfilePosts"
import axios from "axios"
import { IF, URL } from "../url"
import { UserContext } from "../context/UserContext"
import { Link, useNavigate, useParams } from "react-router-dom"

const Profile = () => {
  const param = useParams().id
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [updated, setUpdated] = useState(false)

  const fetchProfile = async () => {
    try {
      const res = await axios.get(URL + "/api/users/" + user._id)
      setUsername(res.data.username)
      setEmail(res.data.email)
      setPassword(res.data.password)
    } catch (err) {
      console.log(err)
    }
  }

  const handleUserUpdate = async () => {
    setUpdated(false)
    try {
      const res = await axios.put(
        URL + "/api/users/" + user._id,
        { username, email, password },
        { withCredentials: true }
      )
      setUpdated(true)
    } catch (err) {
      console.log(err)
      setUpdated(false)
    }
  }

  const handleUserDelete = async () => {
    try {
      const res = await axios.delete(URL + "/api/users/" + user._id, {
        withCredentials: true,
      })
      setUser(null)
      navigate("/")
    } catch (err) {
      console.log(err)
    }
  }

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/user/" + user._id)
      setPosts(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [param])

  useEffect(() => {
    fetchUserPosts()
  }, [param])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow px-4 sm:px-8 md:px-16 lg:px-[200px] py-8 mt-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Profile
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mt-2"></div> 
        </div>

        {/* Main Content */}
        <div className="flex flex-col-reverse md:flex-row gap-8">
          {/* Posts Column */}
          <div className="md:w-2/3 w-full">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mr-3 flex items-center justify-center text-white text-sm">
                  {posts.length}
                </span>
                Your Posts
              </h2>
              <div className="border-t border-gray-100 pt-4">
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((p) => (
                      <Link
                        key={p._id}
                        to={user ? `/posts/post/${p._id}` : "/login"}
                        className="block transition hover:bg-indigo-50 rounded-lg"
                      >
                        <ProfilePosts p={p} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No posts yet. Start writing!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Column */}
          <div className="md:w-1/3 w-full">
            <div className="bg-white rounded-lg shadow-md p-6 md:sticky md:top-24">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                  {username ? username[0].toUpperCase() : "U"}
                </div>
                <h2 className="text-xl font-bold text-center text-gray-800">
                  Profile Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Username</label>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className="w-full outline-none px-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 transition"
                    placeholder="Your username"
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="w-full outline-none px-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 transition"
                    placeholder="Your email"
                    type="email"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                  <button
                    onClick={handleUserUpdate}
                    className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition shadow-md"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleUserDelete}
                    className="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:opacity-90 transition shadow-md"
                  >
                    Delete
                  </button>
                </div>

                {updated && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg text-sm flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Profile updated successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Profile