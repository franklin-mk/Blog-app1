import { IF } from '../url'

const HomePosts = ({ post }) => {
  // Format date for better display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  // Function to determine category color
  const getCategoryColor = (category) => {
    const colors = {
      "technology": "bg-blue-100 text-blue-800",
      "lifestyle": "bg-pink-100 text-pink-800",
      "travel": "bg-green-100 text-green-800",
      "food": "bg-orange-100 text-orange-800",
      "health": "bg-red-100 text-red-800",
      "business": "bg-purple-100 text-purple-800",
      "design": "bg-yellow-100 text-yellow-800",
      "art": "bg-indigo-100 text-indigo-800"
    };
    
    // Default color if category doesn't match
    const randomColors = Object.values(colors);
    const randomIndex = Math.floor(Math.random() * randomColors.length);
    
    return colors[category?.toLowerCase()] || randomColors[randomIndex];
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
      {/* Image */}
      <div className="w-full md:w-2/5 h-[200px] md:h-[250px] overflow-hidden relative">
        <img 
          src={IF + post.photo} 
          alt={post.title} 
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent opacity-70"></div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col w-full md:w-3/5 p-4 md:p-6">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 3).map((category, index) => (
              <span 
                key={index} 
                className={`text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColor(category)}`}
              >
                {category}
              </span>
            ))}
          </div>
        )}
      
        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
          {post.title}
        </h2>
        
        {/* Meta information */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="font-medium text-indigo-600">@{post.username}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(post.updatedAt)}</span>
        </div>
        
        {/* Post description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.desc}
        </p>
        
        {/* Read more */}
        <div className="mt-auto">
          <span className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Continue reading
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export default HomePosts