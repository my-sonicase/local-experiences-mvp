import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [talentProfile, setTalentProfile] = useState(null)
  const [businessProfile, setBusinessProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!profileData) return

    setProfile(profileData)

    if (profileData.user_type === 'talent') {
      const { data } = await supabase
        .from('talent_profiles')
        .select('*, talent_categories(id, name, slug, icon)')
        .eq('user_id', userId)
        .single()
      setTalentProfile(data || null)
      setBusinessProfile(null)
    } else {
      const { data } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      setBusinessProfile(data || null)
      setTalentProfile(null)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          setLoading(true)
          await loadProfile(session.user.id)
          setLoading(false)
        } else {
          setProfile(null)
          setTalentProfile(null)
          setBusinessProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function refreshProfile() {
    if (user) await loadProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      talentProfile,
      businessProfile,
      loading,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
