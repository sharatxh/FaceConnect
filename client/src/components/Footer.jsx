
import React from 'react'

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white px-5 py-5">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">

        <p className="text-sm font-semibold text-slate-700">
          FaceConnect
        </p>

        <p className="text-xs text-slate-500">
          © 2026 FaceConnect. All rights reserved.
        </p>

        <p className="text-xs text-slate-400">
          Connect face-to-face, anywhere.
        </p>

      </div>
    </footer>
  )
}

export default Footer
