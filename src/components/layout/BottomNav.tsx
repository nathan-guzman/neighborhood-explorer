import { useLocation, useNavigate } from 'react-router';
import { Layers, BarChart3, List, Map } from 'lucide-react';

const tabs = [
  { path: '/swipe', label: 'Explore', icon: Layers },
  { path: '/dashboard', label: 'Stats', icon: BarChart3 },
  { path: '/list', label: 'List', icon: List },
  { path: '/map', label: 'Map', icon: Map },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-around border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]">
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
              active
                ? 'text-blue-600'
                : 'text-gray-400 active:text-gray-600'
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span className={active ? 'font-semibold' : ''}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
