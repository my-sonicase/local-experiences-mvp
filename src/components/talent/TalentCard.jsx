import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function TalentCard({ talent }) {
  const { user_id, bio, location, hourly_rate, is_available, talent_categories } = talent
  const name = talent.profiles?.full_name

  return (
    <Card className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <span>{talent_categories?.icon}</span>
          <span>{talent_categories?.name}</span>
        </div>
        <Badge variant={is_available ? 'open' : 'closed'}>
          {is_available ? 'Available' : 'Unavailable'}
        </Badge>
      </div>

      <div>
        <h3 className="font-semibold text-stone-900">{name}</h3>
        {location && <p className="text-sm text-stone-500 mt-0.5">📍 {location}</p>}
      </div>

      {bio && (
        <p className="text-sm text-stone-600 line-clamp-3">{bio}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-50">
        {hourly_rate ? (
          <span className="text-sm font-semibold text-stone-700">${hourly_rate}/hr</span>
        ) : (
          <span className="text-sm text-stone-400">Rate on request</span>
        )}
        <Link
          to={`/talent/${user_id}`}
          className="text-sm font-medium text-stone-900 hover:underline"
        >
          View profile →
        </Link>
      </div>
    </Card>
  )
}
