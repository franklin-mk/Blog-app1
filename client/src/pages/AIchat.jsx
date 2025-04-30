import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


const AIchat = () => {
  return (
    <div>
        <Navbar/>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <iframe 
                src="https://xfince-wildlife-chatbot.hf.space/" 
                title="Travel Bot"
            style={{ width: '100%', height: '100%', border: 'none' }}
            />
        </div>
        <Footer/>
    </div>
  )
}

export default AIchat