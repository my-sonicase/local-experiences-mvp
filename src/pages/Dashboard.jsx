import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ApplicationCard from '../components/events/ApplicationCard'

export default function Dashboard() {
  const { user, profile, talentProfile, businessProfile } = useAuth()
  const isBusiness = profile?.user_type === 'business'

  const [events, setEvents] = useState([])
  const [applications, setApplications] = useState([])
  const [openEvents, setOpenEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    if (isBusiness) {
      loadBusinessData()
    } else {
      loadTalentData()
    }
  }, [user, isBusiness])

  async function loadBusinessData() {
    const { data } = await supabase
      .from('event_requests')
      .select(`*, talent_categories(name, icon)`)
      .eq('business_id', user.id)
      .order('created_at', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }

  async function loadTalentData() {
    const [appsRes, eventsRes] = await Promise.all([
      supabase
        .from('applications')
        .select(`*, event_requests(id, title, location, event_date)`)
        .eq('talent_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('event_requests')
        .select(`*, talent_categories(name, icon), business_profiles!event_requests_business_id_fkey(business_name)`)
        .eq('status', 'open')
        .order('event_date', { ascending: true })
        .limit(3),
    ])
    setApplications(appsRes.data || [])
    setOpenEvents(eventsRes.data || [])
    setLoading(false)
  }

  function formatDate(d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const needsProfile = isBusiness ? !businessProfile : !talentProfile

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">
              {isBusiness
                ? businessProfile?.business_name || 'Your Dashboard'
                : profile?.full_name || 'Your Dashboard'
              }
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              {isBusiness ? businessProfile?.location : talentProfile?.talent_categories?.name}
            </p>
          </div>
          {isBusiness && (
            <Link to="/events/new">
              <Button>+ Post Event</Button>
            </Link>
          )}
          {!isBusiness && (
            <Link to="/events">
              <Button variant="secondary">Browse Events</Button>
            </Link>
          )}
        </div>

        {/* Profile setup prompt */}
        {needsProfile && (
          <Card className="p-5 mb-6 border-amber-200 bg-amber-50">
            <p className="text-sm text-amber-800 font-medium">
              Complete your profile to {isBusiness ? 'post events and attract talent' : 'apply to events'}.
            </p>
            <Link to="/profile/setup">
              <Button size="sm" className="mt-3">Set up profile →</Button>
            </Link>
          </Card>
        )}

        {isBusiness ? (
          <div>
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Your Events</h2>
            {events.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-stone-500 text-sm mb-4">No events posted yet.</p>
                <Link to="/events/new">
                  <Button>Post your first event</Button>
                </Link>
              </Card>
            ) : (
              <div className="flex flex-col gap-3">
                {events.map(event => (
                  <Link key={event.id} to={`/events/${event.id}`}>
                    <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                          <span>{event.talent_categories?.icon}</span>
                          <span>{event.talent_categories?.name}</span>
                          <span>·</span>
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        <p className="font-medium text-stone-900">{event.title}</p>
                        <p className="text-xs text-stone-400 mt-0.5">📍 {event.location}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge variant={event.status}>{event.status}</Badge>
                        <span className="text-stone-300">→</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Applications */}
            <div>
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Your Applications</h2>
              {applications.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-stone-500 text-sm mb-4">You haven&apos;t applied to any events yet.</p>
                  <Link to="/events">
                    <Button>Browse open events</Button>
                  </Link>
                </Card>
              ) : (
                <div className="flex flex-col gap-3">
                  {applications.map(app => (
                    <ApplicationCard key={app.id} application={app} viewMode="talent" />
                  ))}
                </div>
              )}
            </div>

            {/* Open events teaser */}
            {openEvents.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-stone-900">Open Events</h2>
                  <Link to="/events" className="text-sm text-stone-500 hover:text-stone-900">Browse all →</Link>
                </div>
                <div className="flex flex-col gap-3">
                  {openEvents.map(event => (
                    <Link key={event.id} to={`/events/${event.id}`}>
                      <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                            <span>{event.talent_categories?.icon}</span>
                            <span>{event.talent_categories?.name}</span>
                            <span>·</span>
                            <span>{event.business_profiles?.business_name}</span>
                          </div>
                          <p className="font-medium text-stone-900">{event.title}</p>
                          <p className="text-xs text-stone-400 mt-0.5">{formatDate(event.event_date)} · {event.location}</p>
                        </div>
                        <span className="text-stone-300 flex-shrink-0">→</span>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
