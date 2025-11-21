import React from 'react'

export default function Header({ onLogout, user }) {
  return (
    <header className="flex items-center justify-between p-4 md:p-6">
      <div className="flex items-center gap-3">
        <img src="/flame-icon.svg" alt="logo" className="w-10 h-10" />
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Jurassic Quiz</h1>
          <p className="text-blue-200/80 text-xs md:text-sm">From easy to hard • Test your dino knowledge</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-blue-200 text-sm">Hi, {user.name.split(' ')[0]}</span>
            <button onClick={onLogout} className="px-3 py-1.5 rounded-lg bg-red-500/90 hover:bg-red-500 text-white text-sm transition">Logout</button>
          </div>
        ) : null}
      </div>
    </header>
  )
}
