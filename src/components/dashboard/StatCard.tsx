interface Props {
  label: string;
  percentage: number;
  color?: string;
}

export default function StatCard({ label, percentage, color = 'text-gray-900' }: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm text-center">
      <div className={`text-2xl font-bold ${color}`}>{percentage}%</div>
      <div className="mt-0.5 text-xs text-gray-400">{label}</div>
    </div>
  );
}
