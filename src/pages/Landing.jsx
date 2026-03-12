import { Link } from 'react-router-dom'

const categories = [
  { icon: '🎵', name: 'Musicians' },
  { icon: '📱', name: 'Influencers' },
  { icon: '👨‍🍳', name: 'Popup Chefs' },
  { icon: '🎨', name: 'Workshop Hosts' },
]

const businessTypes = ['Cafes', 'Wine Bars', 'Boutique Hotels', 'Coworking Spaces', 'Retail Boutiques', 'Gelato Shops']

export default function Landing() {
  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="flex justify-center gap-2 mb-6">
          {categories.map(cat => (
            <span key={cat.name} className="bg-white border border-stone-200 rounded-full px-3 py-1 text-sm text-stone-600">
              {cat.icon} {cat.name}
            </span>
          ))}
        </div>
        <h1 className="text-5xl font-semibold tracking-tight text-stone-900 max-w-3xl mx-auto leading-tight">
          Book unforgettable local experiences for your venue
        </h1>
        <p className="mt-5 text-lg text-stone-600 max-w-xl mx-auto">
          Connect your business with musicians, popup chefs, influencers, and local talent who bring customers through your door.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            to="/signup"
            className="bg-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-800 transition-colors"
          >
            Post an Experience
          </Link>
          <Link
            to="/events"
            className="border border-stone-300 text-stone-700 px-6 py-3 rounded-xl font-medium hover:bg-stone-100 transition-colors"
          >
            Browse Open Events
          </Link>
        </div>
      </section>

      {/* Two columns */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid md:grid-cols-2 gap-6">
        {/* For Businesses */}
        <div className="bg-white rounded-2xl border border-stone-100 p-8">
          <div className="text-3xl mb-4">🏪</div>
          <h2 className="text-xl font-semibold text-stone-900 mb-2">For Businesses</h2>
          <p className="text-stone-600 mb-5">
            Post an event request and receive applications from vetted local talent. Browse profiles, review rates, and shortlist your favourites — all in one place.
          </p>
          <ul className="space-y-2 text-sm text-stone-600">
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> Post event requests in minutes</li>
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> Receive applications with proposals</li>
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> Shortlist and manage applicants</li>
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> Works for {businessTypes.join(', ')}</li>
          </ul>
          <Link
            to="/signup"
            className="mt-6 inline-block bg-stone-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-stone-800"
          >
            Post your first event →
          </Link>
        </div>

        {/* For Talent */}
        <div className="bg-white rounded-2xl border border-stone-100 p-8">
          <div className="text-3xl mb-4">🎤</div>
          <h2 className="text-xl font-semibold text-stone-900 mb-2">For Talent</h2>
          <p className="text-stone-600 mb-5">
            Discover paid opportunities at local venues. Build your profile, browse event requests that match your category, and apply with a personalised pitch.
          </p>
          <ul className="space-y-2 text-sm text-stone-600">
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> Create a profile with your rates & media</li>
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> Browse events by category & location</li>
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> Apply and track your applications</li>
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> Open to {categories.map(c => c.name).join(', ')}</li>
          </ul>
          <Link
            to="/signup"
            className="mt-6 inline-block border border-stone-300 text-stone-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-stone-50"
          >
            Create your profile →
          </Link>
        </div>
      </section>

      {/* Browse talent CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20 text-center">
        <p className="text-stone-500 text-sm">
          Already have an event in mind?{' '}
          <Link to="/talent" className="text-stone-900 font-medium hover:underline">Browse available talent →</Link>
        </p>
      </section>
    </div>
  )
}
