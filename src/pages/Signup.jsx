import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      navigate('/profile/setup')
    }
    setLoading(false)
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 w-full max-w-lg">
          <h1 className="text-xl font-semibold text-stone-900 mb-1">Join Popli</h1>
          <p className="text-sm text-stone-500 mb-8">I am a...</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setUserType('business'); setStep(2) }}
              className="border-2 border-stone-200 rounded-xl p-6 text-left hover:border-stone-900 transition-colors focus:outline-none"
            >
              <div className="text-3xl mb-3">🏪</div>
              <div className="font-semibold text-stone-900">Business</div>
              <div className="text-sm text-stone-500 mt-1">I want to book talent for events at my venue</div>
            </button>

            <button
              onClick={() => { setUserType('talent'); setStep(2) }}
              className="border-2 border-stone-200 rounded-xl p-6 text-left hover:border-stone-900 transition-colors focus:outline-none"
            >
              <div className="text-3xl mb-3">🎤</div>
              <div className="font-semibold text-stone-900">Talent</div>
              <div className="text-sm text-stone-500 mt-1">I want to find paid gigs at local venues</div>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="text-stone-900 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 w-full max-w-sm">
        <button
          onClick={() => setStep(1)}
          className="text-sm text-stone-400 hover:text-stone-600 mb-4 flex items-center gap-1"
        >
          ← Back
        </button>

        <h1 className="text-xl font-semibold text-stone-900 mb-1">Create your account</h1>
        <p className="text-sm text-stone-500 mb-6">
          Signing up as a <strong>{userType}</strong>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full name"
            type="text"
            placeholder="Your name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={8}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={loading} size="lg">
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  )
}
