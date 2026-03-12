export default function Badge({ children, variant = 'default' }) {
  const variants = {
    open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    closed: 'bg-stone-100 text-stone-500 border-stone-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    shortlisted: 'bg-blue-50 text-blue-700 border-blue-200',
    rejected: 'bg-red-50 text-red-600 border-red-200',
    default: 'bg-stone-100 text-stone-600 border-stone-200',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  )
}
