import { useAppStore } from '@/stores/appStore';
import { Search } from 'lucide-react';

interface Props {
  categories: string[];
}

export default function FilterBar({ categories }: Props) {
  const { listFilter, setListFilter } = useAppStore();

  return (
    <div className="space-y-2 border-b border-gray-200 bg-white p-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={listFilter.searchQuery}
          onChange={(e) => setListFilter({ searchQuery: e.target.value })}
          placeholder="Search businesses..."
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <select
          value={listFilter.status}
          onChange={(e) =>
            setListFilter({
              status: e.target.value as typeof listFilter.status,
            })
          }
          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700"
        >
          <option value="all">All</option>
          <option value="visited">Visited</option>
          <option value="not_visited">Not Visited</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="flagged">Flagged</option>
        </select>

        <select
          value={listFilter.category || ''}
          onChange={(e) =>
            setListFilter({
              category: e.target.value || null,
            })
          }
          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
