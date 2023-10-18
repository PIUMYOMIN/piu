import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Menubar from '../../components/Menubar'

export default function Layout() {
  return (
    <div>
      <Navbar />
      <Menubar />
      <div className='max-w-7xl mx-auto mt-5'>
        <Outlet />
      </div>
    </div>
  )
}