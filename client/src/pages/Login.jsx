
import { SignIn, SignUp, useUser } from '@clerk/react'
import React from 'react'
import { Navigate } from 'react-router-dom'

const Login = ({ mode = 'login' }) => {
  const isRegister = mode === 'register'
  const { isLoaded, isSignedIn } = useUser()

  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10">

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {isRegister
            ? 'Create an account to start your meetings.'
            : 'Sign in to continue to your meetings.'}
        </p>
      </div>

      <div className="w-full flex justify-center">
        <div className="flex justify-center">
          {isRegister ? (
            <SignUp
              routing="path"
              path="/register"
              signInUrl="/login"
              fallbackRedirectUrl="/dashboard"
            />
          ) : (
            <SignIn
              routing="path"
              path="/login"
              signUpUrl="/register"
              fallbackRedirectUrl="/dashboard"
            />
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Secure authentication powered by Clerk.
      </p>

    </main>
  )
}

export default Login
