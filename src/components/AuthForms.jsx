import React, { useState } from 'react'

const Input = ({ label, type = 'text', value, onChange, placeholder }) => (
  <label className="block">
    <span className="text-blue-200 text-sm">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full px-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-600/50 focus:border-blue-400 outline-none text-white placeholder:text-slate-400"
    />
  </label>
)

export default function AuthForms({ onLoginSuccess }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API = import.meta.env.VITE_BACKEND_URL || ''

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const body = mode === 'login' ? { email, password } : { name, email, password }
      const res = await fetch(API + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Something went wrong')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }))
      onLoginSuccess({ name: data.name, email: data.email, token: data.token })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6 md:p-8 shadow-xl w-full max-w-md">
      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => setMode('login')} className={`px-4 py-2 rounded-lg text-sm ${mode==='login' ? 'bg-blue-500 text-white' : 'bg-slate-700/60 text-blue-200'}`}>Login</button>
        <button onClick={() => setMode('register')} className={`px-4 py-2 rounded-lg text-sm ${mode==='register' ? 'bg-blue-500 text-white' : 'bg-slate-700/60 text-blue-200'}`}>Register</button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === 'register' && (
          <Input label="Name" value={name} onChange={setName} placeholder="Juan D."
          />
        )}
        <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button disabled={loading} className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition disabled:opacity-60">
          {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create account')}
        </button>
      </form>
      <p className="text-center text-blue-300/70 text-xs mt-4">Jurassic theme • Filipino labels</p>
    </div>
  )
}
