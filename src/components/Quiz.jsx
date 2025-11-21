import React, { useEffect, useMemo, useState } from 'react'

export default function Quiz({ user }) {
  const API = import.meta.env.VITE_BACKEND_URL || ''
  const [difficulty, setDifficulty] = useState('easy')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setResult(null)
      setAnswers({})
      const res = await fetch(`${API}/quiz/questions?difficulty=${difficulty}&limit=10`)
      const data = await res.json()
      setQuestions(data)
      setLoading(false)
    }
    load()
  }, [difficulty])

  const score = useMemo(() => {
    return questions.reduce((acc, q, i) => acc + ((answers[i] === q.answer_index) ? 1 : 0), 0)
  }, [answers, questions])

  async function submit() {
    const orderedAnswers = questions.map((_, i) => (answers[i] ?? -1))
    const res = await fetch(`${API}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: user.email, answers: orderedAnswers, difficulty })
    })
    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6 md:p-8 shadow-xl w-full max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-semibold">Jurassic Quiz</h2>
        <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} className="bg-slate-900 text-blue-200 border border-slate-600 rounded-lg px-3 py-1.5">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {loading ? (
        <p className="text-blue-200">Loading questions...</p>
      ) : (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-700">
              <p className="text-white font-medium mb-3">{idx+1}. {q.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={()=>setAnswers(prev=>({...prev, [idx]: i}))} className={`px-3 py-2 rounded-lg text-left border transition ${answers[idx]===i ? 'bg-blue-600/80 border-blue-400 text-white' : 'bg-slate-800/70 border-slate-600 text-blue-100 hover:border-blue-400/50'}`}>
                    {String.fromCharCode(65+i)}. {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <p className="text-blue-200">Score: {score} / {questions.length}</p>
            <button onClick={submit} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white">Submit</button>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-emerald-900/40 border border-emerald-600/40 rounded-lg text-emerald-200">
              Final score: {result.score} / {result.total}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
