import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function TalentProfile() {
  const { id } = useParams()
  const [talent, setTalent] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [talentRes, profileRes] = await Promise.all([
        supabase
          .from('talent_profiles')
          .select(`*, talent_categories(name, slug, icon)`)
          .eq('user_id', id)
          .single(),
        supabase
          .from('profiles')
          .select('full_name, created_at')
          .eq('id', id)
          .single(),
      ])
      setTalent(talentRes.data)
      setProfile(profileRes.data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400">Loading...</div>
      </div>
    )
  }

  if (!talent || !profile) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400">Talent not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/talent" className="text-sm text-stone-400 hover:text-stone-600 mb-6 inline-block">
          ← Back to talent
        </Link>

        <Card className="p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
                <span>{talent.talent_categories?.icon}</span>
                <span>{talent.talent_categories?.name}</span>
              </div>
              <h1 className="text-2xl font-semibold text-stone-900">{profile.full_name}</h1>
              {talent.location && (
                <p className="text-stone-500 mt-1">📍 {talent.location}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <Badge variant={talent.is_available ? 'open' : 'closed'}>
                {talent.is_available ? 'Available' : 'Currently unavailable'}
              </Badge>
              {talent.hourly_rate && (
                <p className="text-lg font-semibold text-stone-900">${talent.hourly_rate}/hr</p>
              )}
            </div>
          </div>

          {talent.bio && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wide mb-2">About</h2>
              <p className="text-stone-700 leading-relaxed">{talent.bio}</p>
            </div>
          )}

          {talent.media_urls && talent.media_urls.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wide mb-3">Links & Media</h2>
              <div className="flex flex-wrap gap-2">
                {talent.media_urls.map((url, i) => {
                  let label = url
                  try {
                    const u = new URL(url)
                    label = u.hostname.replace('www.', '')
                  } catch {}
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-stone-200 text-stone-700 text-sm px-3 py-1.5 rounded-lg hover:bg-stone-50 hover:border-stone-400 transition-colors"
                    >
                      {label} ↗
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
