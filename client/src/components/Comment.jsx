import axios from "axios"
import { BiEdit } from "react-icons/bi"
import { MdDelete } from "react-icons/md"
import { URL } from "../url"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"

const Comment = ({c, post}) => {
  const {user} = useContext(UserContext)
  
  const deleteComment = async(id) => {
    try {
      await axios.delete(URL+"/api/comments/"+id, {withCredentials:true})
      window.location.reload(true)
    }
    catch(err) {
      console.log(err)
    }
  }

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      dateOnly: date.toString().slice(0,15),
      timeOnly: date.toString().slice(16,24)
    }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all hover:shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-2">
            {c.author && c.author[0].toUpperCase()}
          </div>
          <h3 className="font-medium text-gray-800">@{c.author}</h3>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(c.updatedAt).dateOnly}</span>
            <span className="mx-1">•</span>
            <span>{formatDate(c.updatedAt).timeOnly}</span>
          </div>
          
          {user?._id === c?.userId && (
            <button 
              onClick={() => deleteComment(c._id)}
              className="ml-2 text-red-500 hover:text-red-700 transition-colors flex items-center"
              aria-label="Delete comment"
            >
              <MdDelete size={18} />
              <span className="ml-1 hidden sm:inline text-xs">Delete</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-3 pl-10">
        <p className="text-gray-700">{c.comment}</p>
      </div>
    </div>
  )
}

export default Comment