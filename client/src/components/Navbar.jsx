//Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BsSearch } from 'react-icons/bs'
import { FaBars } from 'react-icons/fa'
import { useContext, useState, useEffect } from "react"
import Menu from "./Menu"
import { UserContext } from "../context/UserContext"
import { CgProfile } from "react-icons/cg"

const Navbar = () => {
  const [prompt, setPrompt] = useState("")
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const path = useLocation().pathname
  const { user } = useContext(UserContext)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showMenu = () => setMenu(!menu)

  const handleSearch = (e) => {
    if (e.key === 'Enter' && prompt.trim()) {
      navigate(`?search=${prompt}`)
    }
  }

  const handleSearchClick = () => {
    if (prompt.trim()) {
      navigate(`?search=${prompt}`)
    }
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || path !== '/' ? 'bg-white shadow-md py-3' : 'bg-white py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-[200px] flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-xl md:text-2xl font-extrabold text-indigo-600">
            Ari-Blog
          </h1>
        </Link>

        {/* Search Bar - Desktop */}
        {path === "/" && (
          <div className="hidden md:flex items-center relative max-w-md w-full mx-4 opacity-100">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search posts..."
              className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            />
            <div 
              onClick={handleSearchClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 cursor-pointer"
            >
              <BsSearch size={18} />
            </div>
          </div>
        )}

        {/* Search Bar - Mobile */}
        {path === "/" && (
          <div className="md:hidden flex items-center relative">
            <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleSearch}
              className="w-32 sm:w-40 py-1.5 pl-8 pr-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Search..." 
              type="text"
            />
            <div 
              onClick={handleSearchClick}
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <BsSearch size={14} />
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="font-medium text-gray-800 hover:text-indigo-600 transition-colors"
          >
            Home
          </Link>

          {user && (
            <>
              <Link 
                to="/write" 
                className="font-medium text-gray-800 hover:text-indigo-600 transition-colors"
              >
                Write
              </Link>
              <Link 
                to={`/myblogs/${user._id}`} 
                className="font-medium text-gray-800 hover:text-indigo-600 transition-colors"
              >
                My Blogs
              </Link>
            </>
          )}
          
          {!user && (
            <Link 
              to="/login" 
              className="font-medium text-gray-800 hover:text-indigo-600 transition-colors"
            >
              Login
            </Link>
          )}
          
          {user ? (
            <div className="relative">
              <button 
                onClick={showMenu}
                className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                aria-label="User Menu"
              >
                {user.username ? user.username[0].toUpperCase() : "U"}
              </button>
              {menu && <Menu />}
            </div>
          ) : (
            <Link 
              to="/register" 
              className="px-4 py-1.5 rounded-full font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Register
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {user && path !== '/' && (
            <Link 
              to="/write"
              className="mr-4 text-indigo-600 font-medium"
            >
              Write
            </Link>
          )}
          
          <button 
            onClick={showMenu}
            className="p-1.5 rounded-full border-2 border-indigo-600 text-indigo-600 flex items-center justify-center"
            aria-label="Menu"
          >
            <FaBars size={16} />
          </button>
          {menu && <Menu />}
        </div>

      </div>
    </div>
  )
}

export default Navbar