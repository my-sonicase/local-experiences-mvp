import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'

export default function NewEvent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    category_id: '',
    description: '',
    event_date: '',
    start_time: '',
    duration_hours: '',
    budget_min: '',
    budget_max: '',
    location: '',
  })

  useEffect(() => {
    supabase.from('talent_categories').select('*').order('name').then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase
      .from('event_requests')
      .insert({
        business_id: user.id,
        title: form.title,
        category_id: form.category_id,
        description: form.description || null,
        event_date: form.event_date,
        start_time: form.start_time || null,
        duration_hours: form.duration_hours ? parseFloat(form.duration_hours) : null,
        budget_min: form.budget_min ? parseFloat(form.budget_min) : null,
        budget_max: form.budget_max ? parseFloat(form.budget_max) : null,
        location: form.location,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else {
      navigate(`/events/${data.id}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 mb-1">Post a new event</h1>
          <p className="text-stone-500 text-sm">Tell talent what you need and receive applications.</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Event title"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Friday Evening Acoustic Set"
              required
            />

            <Select
              label="Talent category"
              value={form.category_id}
              onChange={set('category_id')}
              required
            >
              <option value="">Select category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </Select>

            <Textarea
              label="Description"
              value={form.description}
              onChange={set('description')}
              placeholder="Describe the event, the vibe you're going for, audience size, what's included (PA, food, etc.)..."
              rows={5}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Event date"
                type="date"
                value={form.event_date}
                onChange={set('event_date')}
                required
              />
              <Input
                label="Start time (optional)"
                type="time"
                value={form.start_time}
                onChange={set('start_time')}
              />
            </div>

            <Input
              label="Duration (hours)"
              type="number"
              value={form.duration_hours}
              onChange={set('duration_hours')}
              placeholder="e.g. 3"
              min={0}
              step={0.5}
            />

            <Input
              label="Location"
              value={form.location}
              onChange={set('location')}
              placeholder="e.g. Paddington, Sydney"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Budget min (AUD)"
                type="number"
                value={form.budget_min}
                onChange={set('budget_min')}
                placeholder="e.g. 150"
                min={0}
              />
              <Input
                label="Budget max (AUD)"
                type="number"
                value={form.budget_max}
                onChange={set('budget_max')}
                placeholder="e.g. 300"
                min={0}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} size="lg">
                {loading ? 'Posting...' : 'Post event'}
              </Button>
              <Button type="button" variant="secondary" size="lg" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
