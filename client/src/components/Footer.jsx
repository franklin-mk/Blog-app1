//COMPLETED
import { Link } from "react-router-dom"

const Footer = () => {
    return (
      < >
  <div className="sticky mb-0 mt-8 w-full bg-black px-8 md:px-[300px] flex md:flex-row flex-col space-y-6 md:space-y-0 items-start md:justify-between text-sm md:text-md py-8 ">
         <div className="flex flex-col text-white">
           <p>Developers Info:</p>
           <p>June B</p>
           <p>Franklin M</p>
           <p>Kevin K</p>
           <p>Vincent K</p>
           <p>Jenelica G</p>
         </div>
  
         <div className="flex flex-col text-white">
           <p>Support Contacts:</p>
           <p>(+254) 0712345</p>
           <p>(+254) 0798765</p>
           <br />
           <p> <Link to="/aichat">AI Chat & Support</Link></p>

         </div>
  
         <div className="flex flex-col text-white">
           <p>Privacy Policy</p>
           <p>About Us</p>
           <p>Terms & Conditions</p>
           <p>Terms of Service</p>
         </div>
      </div>
      <p className="mb-0 bottom-0 py-2 pb-6 text-center text-white bg-slate-900 text-sm">All rights reserved @DEV HUB 2024</p>
      </>
      
    )
  }
  
  export default Footer