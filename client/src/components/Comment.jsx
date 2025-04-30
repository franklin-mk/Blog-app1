//client/src/components/Comment.jsx
import { useContext } from "react"
import { MdDelete } from "react-icons/md"
import { UserContext } from "../context/UserContext"

const Comment = ({c, post, onDelete}) => {
  const {user} = useContext(UserContext)
  
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      dateOnly: date.toString().slice(0,15),
      timeOnly: date.toString().slice(16,24)
    }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 transition-all hover:shadow-md">
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row gap-2 xs:items-center xs:justify-between">
        {/* Author Info */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-2 flex-shrink-0">
            {c.author && c.author[0].toUpperCase()}
          </div>
          <h3 className="font-medium text-gray-800 truncate">@{c.author}</h3>
        </div>
        
        {/* Timestamp and Actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1 xs:mt-0 pl-10 xs:pl-0">
          <div className="flex items-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="whitespace-nowrap">{formatDate(c.updatedAt).dateOnly}</span>
            <span className="mx-1 hidden xs:inline">•</span>
            <span className="whitespace-nowrap hidden xs:inline">{formatDate(c.updatedAt).timeOnly}</span>
          </div>
          
          {user?._id === c?.userId && (
            <button 
              onClick={() => onDelete(c._id)}
              className="text-red-500 hover:text-red-700 transition-colors flex items-center ml-auto xs:ml-2"
              aria-label="Delete comment"
            >
              <MdDelete size={16} className="flex-shrink-0" />
              <span className="ml-1 text-xs">Delete</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Comment Content */}
      <div className="mt-2 sm:mt-3 pl-0 xs:pl-10">
        <p className="text-gray-700 text-sm sm:text-base break-words">{c.comment}</p>
      </div>
    </div>
  )
}

export default Comment