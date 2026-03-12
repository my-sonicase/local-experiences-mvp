import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function EventCard({ event }) {
  const { id, title, description, event_date, duration_hours, budget_min, budget_max, location, status } = event
  const category = event.talent_categories
  const business = event.business_profiles

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }

  function formatBudget(min, max) {
    if (!min && !max) return 'Budget TBD'
    if (!max) return `$${min}+`
    if (!min) return `Up to $${max}`
    return `$${min}–$${max}`
  }

  return (
    <Card className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <span>{category?.icon}</span>
          <span>{category?.name}</span>
        </div>
        <Badge variant={status}>{status}</Badge>
      </div>

      <div>
        <h3 className="font-semibold text-stone-900">{title}</h3>
        {business && <p className="text-sm text-stone-500 mt-0.5">{business.business_name}</p>}
      </div>

      {description && (
        <p className="text-sm text-stone-600 line-clamp-2">{description}</p>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-stone-500 mt-auto pt-2 border-t border-stone-50">
        <span>📅 {formatDate(event_date)}</span>
        {duration_hours && <span>⏱ {duration_hours}h</span>}
        <span>📍 {location}</span>
        <span className="font-medium text-stone-700">{formatBudget(budget_min, budget_max)}</span>
      </div>

      <Link
        to={`/events/${id}`}
        className="text-sm font-medium text-stone-900 hover:underline"
      >
        View details →
      </Link>
    </Card>
  )
}
