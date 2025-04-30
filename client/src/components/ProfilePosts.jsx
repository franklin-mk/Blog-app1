/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { getImageUrl } from '../utils/imageUrlHandler'

const ProfilePosts = ({ p }) => {
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      dateOnly: date.toString().slice(0, 15),
      timeOnly: date.toString().slice(16, 24)
    }
  }

  // Get category colors
  const getCategoryColor = (index) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ]
    return colors[index % colors.length]
  }

  return (
    <Link to={`/posts/post/${p._id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="md:w-1/3 h-48 md:h-auto relative">
            {p.photo ? (
              <img 
                src={getImageUrl(p.photo)} 
                alt={p.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Categories */}
            {p.categories && p.categories.length > 0 && (
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {p.categories.slice(0, 2).map((cat, index) => (
                  <span 
                    key={index} 
                    className={`${getCategoryColor(index)} text-xs px-2 py-1 rounded-full`}
                  >
                    {cat}
                  </span>
                ))}
                {p.categories.length > 2 && (
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    +{p.categories.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Right: Content */}
          <div className="p-4 md:w-2/3 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                {p.title}
              </h3>
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
                    {p.username ? p.username[0].toUpperCase() : "U"}
                  </div>
                  <span className="mr-3">@{p.username}</span>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(p.updatedAt).dateOnly}</span>
                  <span className="mx-1">•</span>
                  <span>{formatDate(p.updatedAt).timeOnly}</span>
                </div>
              </div>
              
              <p className="text-gray-600 line-clamp-3 mb-4">
                {p.desc.slice(0, 200) + (p.desc.length > 200 ? " ..." : "")}
              </p>
            </div>
            
            <div className="text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors">
              Read more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProfilePosts