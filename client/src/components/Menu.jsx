//USE THIS FOR THE DESIGN AND COLOURS REFERNCES
import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import { URL } from "../url"
import { Link, useNavigate } from "react-router-dom"
import { CgProfile } from "react-icons/cg"
import { BiLogOut, BiPencil } from "react-icons/bi"
import { MdDashboard, MdOutlineSmartToy } from "react-icons/md"

const Menu = () => {
  const { user } = useContext(UserContext)
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await axios.get(URL+"/api/auth/logout", {withCredentials: true})
      setUser(null)
      navigate("/login")
    }
    catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="absolute top-12 right-0 z-50 w-52 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
      {/* User Info Section */}
      {user && (
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-lg">
              {user.username ? user.username[0].toUpperCase() : "U"}
            </div>
            <div className="ml-3">
              <p className="font-medium truncate">{user.username}</p>
              <p className="text-xs text-indigo-200 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="py-2">
        {!user && (
          <>
            <Link to="/login" className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors">
              <svg className="w-5 h-5 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Login</span>
            </Link>
            
            <Link to="/register" className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors">
              <svg className="w-5 h-5 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Register</span>
            </Link>
          </>
        )}
        
        {user && (
          <>
            <Link to={"/profile/"+user._id} className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors">
              <CgProfile className="w-5 h-5 mr-3 text-indigo-600" />
              <span>Profile</span>
            </Link>
            
            <Link to="/write" className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors">
              <BiPencil className="w-5 h-5 mr-3 text-indigo-600" />
              <span>Write</span>
            </Link>
            
            <Link to={"/myblogs/"+user._id} className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors">
              <MdDashboard className="w-5 h-5 mr-3 text-indigo-600" />
              <span>My Blogs</span>
            </Link>
            
            <Link to="/aichat" className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors">
              <MdOutlineSmartToy className="w-5 h-5 mr-3 text-indigo-600" />
              <span>AI Chat Assistant</span>
            </Link>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <BiLogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Menu