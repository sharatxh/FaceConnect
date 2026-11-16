
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HistoryIcon,
  LayoutDashboardIcon,
  SparklesIcon,
} from 'lucide-react'
import { UserButton, useUser } from '@clerk/react'

const Navbar = () => {
  const { isSignedIn, user } = useUser()
  const location = useLocation()

  const userName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'User'

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      name: 'Sessions',
      path: '/sessions',
      icon: HistoryIcon,
    },
    {
      name: 'Pricing',
      path: '/pricing',
      icon: SparklesIcon,
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

        {/* Brand */}
        <Link
          to="/dashboard"
          className="shrink-0 text-xl font-bold tracking-tight text-slate-900"
        >
          Face<span className="text-primary">Connect</span>
        </Link>

        {/* Desktop Navigation */}
        {isSignedIn && (
          <nav className="hidden items-center gap-1 rounded-xl bg-slate-50 p-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-500 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <Icon size={17} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        )}

        {/* User */}
        {isSignedIn && (
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden text-sm font-medium text-slate-600 lg:block">
              Welcome, {userName}
            </span>

            <UserButton afterSignOutUrl="/login" />
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isSignedIn && (
        <nav className="flex justify-center gap-2 border-t border-slate-100 px-3 py-2 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                  active
                    ? 'bg-blue-50 text-primary'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={15} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}

export default Navbar
