import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { BUSINESS_TYPES } from '../lib/constants'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'

export default function ProfileSetup() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Business fields
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  // Talent fields
  const [categoryId, setCategoryId] = useState('')
  const [bio, setBio] = useState('')
  const [talentLocation, setTalentLocation] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [mediaUrls, setMediaUrls] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    supabase.from('talent_categories').select('*').order('name').then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

  async function handleBusinessSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.from('business_profiles').upsert({
      user_id: user.id,
      business_name: businessName,
      business_type: businessType,
      location,
      description,
      logo_url: logoUrl || null,
      website_url: websiteUrl || null,
    }, { onConflict: 'user_id' })

    if (error) {
      setError(error.message)
    } else {
      await refreshProfile()
      navigate('/dashboard')
    }
    setLoading(false)
  }

  async function handleTalentSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const urls = mediaUrls
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const { error } = await supabase.from('talent_profiles').upsert({
      user_id: user.id,
      category_id: categoryId,
      bio,
      location: talentLocation,
      hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
      media_urls: urls.length > 0 ? urls : null,
      is_available: isAvailable,
    }, { onConflict: 'user_id' })

    if (error) {
      setError(error.message)
    } else {
      await refreshProfile()
      navigate('/dashboard')
    }
    setLoading(false)
  }

  const isBusiness = profile?.user_type === 'business'

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          <h1 className="text-xl font-semibold text-stone-900 mb-1">
            {isBusiness ? 'Set up your venue profile' : 'Set up your talent profile'}
          </h1>
          <p className="text-sm text-stone-500 mb-6">
            This is what {isBusiness ? 'talent' : 'businesses'} will see when they find you.
          </p>

          {isBusiness ? (
            <form onSubmit={handleBusinessSubmit} className="flex flex-col gap-4">
              <Input
                label="Venue / Business name"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. The Roastery"
                required
              />
              <Select
                label="Business type"
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
                required
              >
                <option value="">Select type...</option>
                {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
              <Input
                label="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Paddington, Sydney"
                required
              />
              <Textarea
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Tell talent about your venue, your vibe, and the kinds of events you host..."
                rows={4}
              />
              <Input
                label="Logo URL (optional)"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="https://..."
                type="url"
              />
              <Input
                label="Website URL (optional)"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://..."
                type="url"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={loading} size="lg">
                {loading ? 'Saving...' : 'Save profile & continue'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleTalentSubmit} className="flex flex-col gap-4">
              <Select
                label="Your category"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </Select>
              <Textarea
                label="Bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell businesses what you do, your style, experience, and what makes you a great fit for local events..."
                rows={5}
              />
              <Input
                label="Location"
                value={talentLocation}
                onChange={e => setTalentLocation(e.target.value)}
                placeholder="e.g. Surry Hills, Sydney"
                required
              />
              <Input
                label="Hourly rate (AUD)"
                type="number"
                value={hourlyRate}
                onChange={e => setHourlyRate(e.target.value)}
                placeholder="e.g. 150"
                min={0}
              />
              <Textarea
                label="Media links (comma-separated)"
                value={mediaUrls}
                onChange={e => setMediaUrls(e.target.value)}
                placeholder="https://soundcloud.com/..., https://instagram.com/..."
                rows={2}
              />
              <label className="flex items-center gap-3 text-sm text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={e => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                I am currently available for bookings
              </label>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={loading} size="lg">
                {loading ? 'Saving...' : 'Save profile & continue'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
