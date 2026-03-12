import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/layout/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProfileSetup from './pages/ProfileSetup'
import Dashboard from './pages/Dashboard'
import EventsList from './pages/EventsList'
import NewEvent from './pages/NewEvent'
import EventDetail from './pages/EventDetail'
import TalentDirectory from './pages/TalentDirectory'
import TalentProfile from './pages/TalentProfile'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-stone-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/events" element={<EventsList />} />
              <Route path="/talent" element={<TalentDirectory />} />
              <Route path="/talent/:id" element={<TalentProfile />} />

              {/* Protected routes */}
              <Route path="/profile/setup" element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/events/new" element={
                <ProtectedRoute requiredUserType="business">
                  <NewEvent />
                </ProtectedRoute>
              } />
              <Route path="/events/:id" element={<EventDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
