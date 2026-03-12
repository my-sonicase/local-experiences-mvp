export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-stone-900 text-white hover:bg-stone-800',
    secondary: 'border border-stone-300 text-stone-700 hover:bg-stone-50',
    ghost: 'text-stone-600 hover:text-stone-900 hover:bg-stone-100',
    danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
