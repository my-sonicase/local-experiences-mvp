import Select from '../ui/Select'
import Input from '../ui/Input'

export default function EventFilters({ categories, filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={filters.category}
        onChange={e => onChange({ ...filters, category: e.target.value })}
        className="w-44"
      >
        <option value="">All categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
        ))}
      </Select>

      <Input
        placeholder="Filter by location..."
        value={filters.location}
        onChange={e => onChange({ ...filters, location: e.target.value })}
        className="w-52"
      />
    </div>
  )
}
