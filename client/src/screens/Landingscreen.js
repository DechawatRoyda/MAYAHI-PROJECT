import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Landingscreen() {
  return (
    
    <div className=' landing '   >
    
        <div className=' text-center' style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <Navbar />
        <div className='mg' >
            <h1 className=' T-gradient' style={{fontSize:'130px'}}>Mayahi</h1>
            <h3 style={{color:"white"}}>Book unique places to stay and things to do.</h3>
            <h3 style={{color:"white"}}>WHEREVER YOU ARE.</h3>
            <Link to='/home' className='btn landingbtn btn-primary'>Explore</Link>
        </div>
        {/* <div className='d-flex flex-row bs'>
          <div className='col col-4 Optical'><img src="https://image-tc.galaxy.tf/wijpeg-z7gj246rurgop7blls22dttk/daydream-island-resort-vista-suite-1-standard_wide.jpg?crop=0%2C126%2C1345%2C757&width=1140" alt="Girl in a jacket" width="100%" height="100%"/></div>
          <div className='col col-4 Optical'><img src="https://pix8.agoda.net/hotelImages/5904122/-1/fdb21ba85012dbb94e2677a4f247fb01.jpg?ca=7&ce=1&s=1024x768" alt="Girl in a jacket" width="100%" height="100%"/></div>
          <div className='col col-4 Optical'><img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/397694878.jpg?k=169b7007c47ebea54543f58001ac292aab1b887a31ca14603a05b4d44eca2b9e&o=&hp=1" alt="Girl in a jacket" width="100%" height="100%"/></div>
        </div> */}
        </div>
    </div>
  )
}

export default Landingscreen

// linear-gradient(to bottom, black,gray,white)