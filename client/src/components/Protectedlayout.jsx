
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Protectedlayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Protectedlayout
