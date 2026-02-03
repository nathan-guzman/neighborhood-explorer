import { create } from 'zustand';
import { ACTIVE_USER_STORAGE_KEY } from '@/utils/constants';

interface ListFilter {
  category: string | null;
  status: 'all' | 'visited' | 'not_visited' | 'unreviewed' | 'flagged';
  searchQuery: string;
}

interface AppState {
  activeUserId: number | null;
  setActiveUserId: (id: number | null) => void;

  isFetchingBusinesses: boolean;
  setFetchingBusinesses: (v: boolean) => void;

  error: string | null;
  setError: (e: string | null) => void;

  listFilter: ListFilter;
  setListFilter: (filter: Partial<ListFilter>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeUserId: (() => {
    const stored = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    return stored ? Number(stored) : null;
  })(),
  setActiveUserId: (id) => {
    if (id !== null) {
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, String(id));
    } else {
      localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    }
    set({ activeUserId: id });
  },

  isFetchingBusinesses: false,
  setFetchingBusinesses: (v) => set({ isFetchingBusinesses: v }),

  error: null,
  setError: (e) => set({ error: e }),

  listFilter: {
    category: null,
    status: 'all',
    searchQuery: '',
  },
  setListFilter: (filter) =>
    set((state) => ({
      listFilter: { ...state.listFilter, ...filter },
    })),
}));
