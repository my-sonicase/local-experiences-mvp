import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, requiredUserType }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400">Loading...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (requiredUserType && profile?.user_type !== requiredUserType) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
