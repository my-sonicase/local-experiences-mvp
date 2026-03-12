import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import TalentCard from '../components/talent/TalentCard'
import Select from '../components/ui/Select'
import Input from '../components/ui/Input'

export default function TalentDirectory() {
  const [talent, setTalent] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({ category: '', location: '', available: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('talent_categories').select('*').order('name').then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

  useEffect(() => {
    loadTalent()
  }, [filters])

  async function loadTalent() {
    setLoading(true)
    let query = supabase
      .from('talent_profiles')
      .select(`
        *,
        profiles(full_name),
        talent_categories(name, slug, icon)
      `)
      .order('created_at', { ascending: false })

    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    if (filters.available) {
      query = query.eq('is_available', true)
    }

    const { data } = await query
    setTalent(data || [])
    setLoading(false)
  }

  function setFilter(field, value) {
    setFilters(f => ({ ...f, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 mb-1">Browse Talent</h1>
          <p className="text-stone-500 text-sm">Discover musicians, influencers, popup chefs, and workshop hosts available to book.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Select
            value={filters.category}
            onChange={e => setFilter('category', e.target.value)}
            className="w-48"
          >
            <option value="">All categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </Select>

          <Input
            placeholder="Filter by location..."
            value={filters.location}
            onChange={e => setFilter('location', e.target.value)}
            className="w-52"
          />

          <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer bg-white border border-stone-200 rounded-lg px-3 py-2 hover:bg-stone-50">
            <input
              type="checkbox"
              checked={filters.available}
              onChange={e => setFilter('available', e.target.checked)}
              className="w-4 h-4 rounded border-stone-300"
            />
            Available only
          </label>
        </div>

        {loading ? (
          <div className="text-stone-400 text-sm">Loading talent...</div>
        ) : talent.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg mb-2">No talent found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {talent.map(t => (
              <TalentCard key={t.user_id} talent={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
