import { useDashboardStats } from '@/hooks/useDashboardStats';
import ProgressRing from '@/components/dashboard/ProgressRing';
import StatCard from '@/components/dashboard/StatCard';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';

export default function DashboardScreen() {
  const stats = useDashboardStats();

  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-6 flex justify-center">
        <ProgressRing
          total={stats.total}
          visited={stats.visited}
          notVisited={stats.notVisited}
          unreviewed={stats.unreviewed}
        />
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard
          label="Visited"
          percentage={stats.total > 0 ? Math.round((stats.visited / stats.total) * 100) : 0}
          color="text-green-600"
        />
        <StatCard
          label="Not Visited"
          percentage={stats.total > 0 ? Math.round((stats.notVisited / stats.total) * 100) : 0}
          color="text-red-500"
        />
        <StatCard
          label="Unreviewed"
          percentage={stats.total > 0 ? Math.round((stats.unreviewed / stats.total) * 100) : 0}
          color="text-gray-400"
        />
      </div>

      {stats.categories.length > 0 && (
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <CategoryBreakdown categories={stats.categories} />
        </div>
      )}
    </div>
  );
}
