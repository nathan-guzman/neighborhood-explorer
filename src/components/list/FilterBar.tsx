import { useState } from 'react';
import { useAppStore, type FilterStatus } from '@/stores/appStore';
import { Search, ChevronDown, X } from 'lucide-react';

interface Props {
  categories: string[];
}

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'visited', label: 'Visited' },
  { value: 'not_visited', label: 'Not Visited' },
  { value: 'unreviewed', label: 'Unreviewed' },
  { value: 'flagged', label: 'Flagged' },
];

export default function FilterBar({ categories }: Props) {
  const { listFilter, setListFilter } = useAppStore();
  const [showCategories, setShowCategories] = useState(false);

  const toggleStatus = (status: FilterStatus) => {
    const current = listFilter.statuses;
    if (current.includes(status)) {
      setListFilter({ statuses: current.filter((s) => s !== status) });
    } else {
      setListFilter({ statuses: [...current, status] });
    }
  };

  const toggleCategory = (category: string) => {
    const current = listFilter.categories;
    if (current.includes(category)) {
      setListFilter({ categories: current.filter((c) => c !== category) });
    } else {
      setListFilter({ categories: [...current, category] });
    }
  };

  const clearCategories = () => {
    setListFilter({ categories: [] });
  };

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

      {/* Status chips */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = listFilter.statuses.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggleStatus(opt.value)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Category multi-select dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowCategories((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-700"
        >
          <span>
            {listFilter.categories.length === 0
              ? 'All Categories'
              : `${listFilter.categories.length} categor${listFilter.categories.length === 1 ? 'y' : 'ies'} selected`}
          </span>
          <ChevronDown size={14} className={`transition-transform ${showCategories ? 'rotate-180' : ''}`} />
        </button>

        {showCategories && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {listFilter.categories.length > 0 && (
              <button
                onClick={clearCategories}
                className="flex w-full items-center gap-1 border-b border-gray-100 px-3 py-2 text-xs text-red-500 hover:bg-gray-50"
              >
                <X size={12} />
                Clear all
              </button>
            )}
            {categories.map((cat) => {
              const isSelected = listFilter.categories.includes(cat);
              return (
                <label
                  key={cat}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(cat)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {cat}
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
