import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import AuthForms from './components/AuthForms'
import Quiz from './components/Quiz'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (stored && token) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
  }, [])

  function onLogout() {
    const API = import.meta.env.VITE_BACKEND_URL || ''
    const token = localStorage.getItem('token')
    fetch(API + '/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}), }).finally(()=>{
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    })
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900 via-slate-900 to-slate-950 relative">
      <div className="absolute inset-0 pointer-events-none bg-[url('https://images.unsplash.com/photo-1629380321590-3b3f75d66dec?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM2MjQzMTR8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay" />
      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <Header onLogout={onLogout} user={user} />

        <div className="mt-6 md:mt-10 flex flex-col items-center">
          {!user ? (
            <AuthForms onLoginSuccess={setUser} />
          ) : (
            <Quiz user={user} />
          )}
        </div>

        <footer className="mt-10 text-center text-blue-200/70 text-sm">
          Jurassic theme • May login, logout at register • Easy to Hard quiz
        </footer>
      </div>
    </div>
  )
}

export default App
