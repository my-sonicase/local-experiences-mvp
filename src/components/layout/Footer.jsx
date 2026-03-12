export default function Footer() {
  return (
    <footer className="border-t border-stone-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between text-sm text-stone-400">
        <span>Popli &copy; {new Date().getFullYear()}</span>
        <span>Connecting venues with local talent</span>
      </div>
    </footer>
  )
}
