ERRORS TO BE SOLVED:
//on createpost error:
(
THE IMAGES ARE BEING UPLOADED TO CLOUDINARY BUT THE IMAGES ARENT BEING DISPALYED ON THE BLOG PAGES
)


//on editpost error:
(
    1. (
DELETE http://localhost:5000/api/upload/blog_images/a5xsi8xo9zrq1qdopc0s 404 (Not Found)
e.send	@	frame_ant.js:2
deleteImage	@	cloudinaryUpload.js:38
handleUpdate	@	EditPost.jsx:61

cloudinaryUpload.js:44 Image deletion error: 
AxiosError {message: 'Request failed with status code 404', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
code
: 
"ERR_BAD_REQUEST"
config
: 
{transitional: {…}, adapter: Array(3), transformRequest: Array(1), transformResponse: Array(1), timeout: 0, …}
message
: 
"Request failed with status code 404"
name
: 
"AxiosError"
request
: 
XMLHttpRequest {url: 'http://localhost:5000/api/upload/blog_images/a5xsi8xo9zrq1qdopc0s', onreadystatechange: null, readyState: 4, timeout: 0, withCredentials: true, …}
response
: 
{data: '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta char…mages/a5xsi8xo9zrq1qdopc0s</pre>\n</body>\n</html>\n', status: 404, statusText: 'Not Found', headers: AxiosHeaders, config: {…}, …}
stack
: 
"AxiosError: Request failed with status code 404\n    at settle (http://localhost:5173/node_modules/.vite/deps/axios.js?v=e64626d4:1205:12)\n    at XMLHttpRequest.onloadend (http://localhost:5173/node_modules/.vite/deps/axios.js?v=e64626d4:1551:7)\n    at Axios.request (http://localhost:5173/node_modules/.vite/deps/axios.js?v=e64626d4:2067:41)\n    at async deleteImage (http://localhost:5173/src/utils/cloudinaryUpload.js?t=1746038792733:38:24)\n    at async handleUpdate (http://localhost:5173/src/pages/EditPost.jsx?t=1746038834586:71:19)"
[[Prototype]]
: 
Error
deleteImage	@	cloudinaryUpload.js:44
await in deleteImage		
handleUpdate	@	EditPost.jsx:61
EditPost.jsx:63 Error deleting old image: 
AxiosError {message: 'Request failed with status code 404', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
code
: 
"ERR_BAD_REQUEST"
config
: 
{transitional: {…}, adapter: Array(3), transformRequest: Array(1), transformResponse: Array(1), timeout: 0, …}
message
: 
"Request failed with status code 404"
name
: 
"AxiosError"
request
: 
XMLHttpRequest {url: 'http://localhost:5000/api/upload/blog_images/a5xsi8xo9zrq1qdopc0s', onreadystatechange: null, readyState: 4, timeout: 0, withCredentials: true, …}
response
: 
{data: '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta char…mages/a5xsi8xo9zrq1qdopc0s</pre>\n</body>\n</html>\n', status: 404, statusText: 'Not Found', headers: AxiosHeaders, config: {…}, …}
stack
: 
"AxiosError: Request failed with status code 404\n    at settle (http://localhost:5173/node_modules/.vite/deps/axios.js?v=e64626d4:1205:12)\n    at XMLHttpRequest.onloadend (http://localhost:5173/node_modules/.vite/deps/axios.js?v=e64626d4:1551:7)\n    at Axios.request (http://localhost:5173/node_modules/.vite/deps/axios.js?v=e64626d4:2067:41)\n    at async deleteImage (http://localhost:5173/src/utils/cloudinaryUpload.js?t=1746038792733:38:24)\n    at async handleUpdate (http://localhost:5173/src/pages/EditPost.jsx?t=1746038834586:71:19)"
[[Prototype]]
: 
Error
handleUpdate	@	EditPost.jsx:63
    )

2. THE IMAGES ARE BEING UPLOADED TO CLOUDINARY AFTER EDITING BUT THE IMAGES ARENT BEING DISPALYED ON THE BLOG PAGES
)

