import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import EventCard from '../components/events/EventCard'
import EventFilters from '../components/events/EventFilters'

export default function EventsList() {
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({ category: '', location: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('talent_categories').select('*').order('name').then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

  useEffect(() => {
    loadEvents()
  }, [filters])

  async function loadEvents() {
    setLoading(true)
    let query = supabase
      .from('event_requests')
      .select(`
        *,
        talent_categories(name, slug, icon),
        business_profiles!event_requests_business_id_fkey(business_name, location, logo_url)
      `)
      .eq('status', 'open')
      .order('event_date', { ascending: true })

    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    const { data } = await query
    setEvents(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 mb-1">Open Event Requests</h1>
          <p className="text-stone-500 text-sm">Businesses looking for talent. Apply to the ones that fit.</p>
        </div>

        <div className="mb-6">
          <EventFilters
            categories={categories}
            filters={filters}
            onChange={setFilters}
          />
        </div>

        {loading ? (
          <div className="text-stone-400 text-sm">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg mb-2">No open events found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
