import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import ApplicationCard from '../components/events/ApplicationCard'

export default function EventDetail() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const isBusiness = profile?.user_type === 'business'

  const [event, setEvent] = useState(null)
  const [applications, setApplications] = useState([])
  const [myApplication, setMyApplication] = useState(null)
  const [loading, setLoading] = useState(true)

  // Apply form state
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [applyMessage, setApplyMessage] = useState('')
  const [applyRate, setApplyRate] = useState('')
  const [applyLoading, setApplyLoading] = useState(false)
  const [applyError, setApplyError] = useState('')

  useEffect(() => {
    loadEvent()
    if (user && isBusiness) loadApplications()
    if (user && !isBusiness) loadMyApplication()
  }, [id, user, isBusiness])

  async function loadEvent() {
    const { data } = await supabase
      .from('event_requests')
      .select(`
        *,
        talent_categories(name, slug, icon),
        business_profiles!event_requests_business_id_fkey(business_name, location, logo_url, description)
      `)
      .eq('id', id)
      .single()
    setEvent(data)
    setLoading(false)
  }

  async function loadApplications() {
    const { data } = await supabase
      .from('applications')
      .select(`
        *,
        profiles(full_name),
        talent_profiles(location, hourly_rate, talent_categories(name, icon))
      `)
      .eq('event_request_id', id)
      .order('created_at', { ascending: true })
    setApplications(data || [])
  }

  async function loadMyApplication() {
    if (!user) return
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('event_request_id', id)
      .eq('talent_id', user.id)
      .single()
    setMyApplication(data || null)
  }

  async function handleApply(e) {
    e.preventDefault()
    setApplyError('')
    setApplyLoading(true)

    const { data, error } = await supabase
      .from('applications')
      .insert({
        event_request_id: id,
        talent_id: user.id,
        message: applyMessage,
        proposed_rate: applyRate ? parseFloat(applyRate) : null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      setApplyError(error.message)
    } else {
      setMyApplication(data)
      setShowApplyForm(false)
    }
    setApplyLoading(false)
  }

  async function handleStatusChange(applicationId, newStatus) {
    const { data } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId)
      .select()
      .single()

    if (data) {
      setApplications(apps =>
        apps.map(a => a.id === applicationId ? { ...a, status: newStatus } : a)
      )
    }
  }

  async function handleCloseEvent() {
    await supabase.from('event_requests').update({ status: 'closed' }).eq('id', id)
    setEvent(e => ({ ...e, status: 'closed' }))
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  function formatBudget(min, max) {
    if (!min && !max) return null
    if (!max) return `$${min}+`
    if (!min) return `Up to $${max}`
    return `$${min}–$${max}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400">Loading...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400">Event not found.</div>
      </div>
    )
  }

  const isEventOwner = user && event.business_id === user.id
  const budget = formatBudget(event.budget_min, event.budget_max)

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/events" className="text-sm text-stone-400 hover:text-stone-600 mb-6 inline-block">
          ← Back to events
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <span>{event.talent_categories?.icon}</span>
                  <span>{event.talent_categories?.name}</span>
                </div>
                <Badge variant={event.status}>{event.status}</Badge>
              </div>

              <h1 className="text-2xl font-semibold text-stone-900 mb-1">{event.title}</h1>
              <p className="text-stone-500 text-sm mb-5">{event.business_profiles?.business_name}</p>

              {event.description && (
                <p className="text-stone-600 leading-relaxed">{event.description}</p>
              )}

              <div className="mt-5 pt-5 border-t border-stone-100 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-stone-400 text-xs mb-1">Date</p>
                  <p className="text-stone-800 font-medium">{formatDate(event.event_date)}</p>
                </div>
                {event.start_time && (
                  <div>
                    <p className="text-stone-400 text-xs mb-1">Start time</p>
                    <p className="text-stone-800 font-medium">{event.start_time}</p>
                  </div>
                )}
                {event.duration_hours && (
                  <div>
                    <p className="text-stone-400 text-xs mb-1">Duration</p>
                    <p className="text-stone-800 font-medium">{event.duration_hours} hours</p>
                  </div>
                )}
                {budget && (
                  <div>
                    <p className="text-stone-400 text-xs mb-1">Budget</p>
                    <p className="text-stone-800 font-medium">{budget}</p>
                  </div>
                )}
                <div>
                  <p className="text-stone-400 text-xs mb-1">Location</p>
                  <p className="text-stone-800 font-medium">{event.location}</p>
                </div>
              </div>

              {isEventOwner && event.status === 'open' && (
                <div className="mt-5 pt-5 border-t border-stone-100">
                  <Button variant="secondary" size="sm" onClick={handleCloseEvent}>
                    Close event
                  </Button>
                </div>
              )}
            </Card>

            {/* Talent: Apply section */}
            {!isBusiness && user && event.status === 'open' && !isEventOwner && (
              <Card className="p-6">
                {myApplication ? (
                  <div>
                    <p className="text-sm font-medium text-stone-700 mb-1">Your application</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant={myApplication.status}>{myApplication.status}</Badge>
                      {myApplication.proposed_rate && (
                        <span className="text-sm text-stone-600">${myApplication.proposed_rate} proposed</span>
                      )}
                    </div>
                    {myApplication.message && (
                      <p className="text-sm text-stone-600 mt-3">{myApplication.message}</p>
                    )}
                  </div>
                ) : showApplyForm ? (
                  <form onSubmit={handleApply} className="flex flex-col gap-4">
                    <h3 className="font-semibold text-stone-900">Apply to this event</h3>
                    <Textarea
                      label="Your pitch"
                      value={applyMessage}
                      onChange={e => setApplyMessage(e.target.value)}
                      placeholder="Introduce yourself, why you're a great fit, and anything else the business should know..."
                      rows={4}
                      required
                    />
                    <Input
                      label="Proposed rate (AUD)"
                      type="number"
                      value={applyRate}
                      onChange={e => setApplyRate(e.target.value)}
                      placeholder="e.g. 200"
                      min={0}
                    />
                    {applyError && <p className="text-sm text-red-500">{applyError}</p>}
                    <div className="flex gap-3">
                      <Button type="submit" disabled={applyLoading}>
                        {applyLoading ? 'Submitting...' : 'Submit application'}
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => setShowApplyForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-stone-600">Interested in this event?</p>
                    <Button onClick={() => setShowApplyForm(true)}>Apply now</Button>
                  </div>
                )}
              </Card>
            )}

            {!user && (
              <Card className="p-6 text-center">
                <p className="text-stone-600 text-sm mb-3">Sign in to apply to this event.</p>
                <Link to="/login">
                  <Button>Sign in to apply</Button>
                </Link>
              </Card>
            )}

            {/* Business: Applicants */}
            {isEventOwner && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Applicants ({applications.length})
                </h2>
                {applications.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="text-stone-400 text-sm">No applications yet. Share your event to attract talent.</p>
                  </Card>
                ) : (
                  <div className="flex flex-col gap-3">
                    {applications.map(app => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        viewMode="business"
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Business info */}
          <div>
            <Card className="p-5">
              <h3 className="font-semibold text-stone-900 mb-3">About the venue</h3>
              {event.business_profiles?.logo_url && (
                <img
                  src={event.business_profiles.logo_url}
                  alt={event.business_profiles.business_name}
                  className="w-12 h-12 rounded-lg object-cover mb-3"
                  onError={e => { e.target.style.display = 'none' }}
                />
              )}
              <p className="font-medium text-stone-800">{event.business_profiles?.business_name}</p>
              {event.business_profiles?.location && (
                <p className="text-sm text-stone-500 mt-0.5">📍 {event.business_profiles.location}</p>
              )}
              {event.business_profiles?.description && (
                <p className="text-sm text-stone-600 mt-3">{event.business_profiles.description}</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
