import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { USER_TYPE } from '../../lib/constants'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-stone-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-stone-900 tracking-tight text-lg">
          Local Experiences
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {!user ? (
            <>
              <Link to="/events" className="text-stone-600 hover:text-stone-900">Browse Events</Link>
              <Link to="/talent" className="text-stone-600 hover:text-stone-900">Find Talent</Link>
              <Link to="/login" className="text-stone-600 hover:text-stone-900">Login</Link>
              <Link to="/signup" className="bg-stone-900 text-white px-4 py-1.5 rounded-lg hover:bg-stone-800">
                Sign Up
              </Link>
            </>
          ) : profile?.user_type === USER_TYPE.BUSINESS ? (
            <>
              <Link to="/events/new" className="text-stone-600 hover:text-stone-900">Post Event</Link>
              <Link to="/dashboard" className="text-stone-600 hover:text-stone-900">My Events</Link>
              <Link to="/talent" className="text-stone-600 hover:text-stone-900">Find Talent</Link>
              <button onClick={handleSignOut} className="text-stone-400 hover:text-stone-600">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/events" className="text-stone-600 hover:text-stone-900">Browse Events</Link>
              <Link to="/dashboard" className="text-stone-600 hover:text-stone-900">My Applications</Link>
              <Link to="/talent" className="text-stone-600 hover:text-stone-900">Talent</Link>
              <button onClick={handleSignOut} className="text-stone-400 hover:text-stone-600">Sign Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
