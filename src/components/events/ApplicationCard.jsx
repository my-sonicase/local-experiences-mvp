import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

// viewMode: 'business' (see applicants) or 'talent' (see own application)
export default function ApplicationCard({ application, viewMode = 'talent', onStatusChange }) {
  const { id, message, proposed_rate, status, created_at } = application

  // business view: application has profile info joined
  const talentProfile = application.talent_profiles
  const talentName = application.profiles?.full_name

  // talent view: application has event info joined
  const event = application.event_requests

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  }

  if (viewMode === 'business') {
    return (
      <Card className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Link to={`/talent/${application.talent_id}`} className="font-semibold text-stone-900 hover:underline">
                {talentName || 'Talent'}
              </Link>
              {talentProfile?.talent_categories && (
                <span className="text-xs text-stone-400">
                  {talentProfile.talent_categories.icon} {talentProfile.talent_categories.name}
                </span>
              )}
            </div>
            {talentProfile?.location && (
              <p className="text-xs text-stone-400 mt-0.5">📍 {talentProfile.location}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {proposed_rate && (
              <span className="text-sm font-semibold text-stone-700">${proposed_rate}</span>
            )}
            <Badge variant={status}>{status}</Badge>
          </div>
        </div>

        {message && (
          <p className="text-sm text-stone-600">{message}</p>
        )}

        <p className="text-xs text-stone-400">Applied {formatDate(created_at)}</p>

        {status === 'pending' && onStatusChange && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              onClick={() => onStatusChange(id, 'shortlisted')}
            >
              Shortlist
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onStatusChange(id, 'rejected')}
            >
              Reject
            </Button>
          </div>
        )}
        {status === 'shortlisted' && onStatusChange && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onStatusChange(id, 'pending')}
            >
              Move back to pending
            </Button>
          </div>
        )}
      </Card>
    )
  }

  // talent view
  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          {event && (
            <Link to={`/events/${event.id}`} className="font-semibold text-stone-900 hover:underline">
              {event.title}
            </Link>
          )}
          {event?.location && <p className="text-xs text-stone-400 mt-0.5">📍 {event.location}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {proposed_rate && <span className="text-sm font-semibold text-stone-700">${proposed_rate}</span>}
          <Badge variant={status}>{status}</Badge>
        </div>
      </div>
      {message && <p className="text-sm text-stone-600">{message}</p>}
      <p className="text-xs text-stone-400">Submitted {formatDate(created_at)}</p>
    </Card>
  )
}
