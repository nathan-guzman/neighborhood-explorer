import type { User } from '@/types';

interface Props {
  users: User[];
  onSelect: (user: User) => void;
  onCreate: () => void;
}

export default function ProfileList({ users, onSelect, onCreate }: Props) {
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelect(user)}
          className="flex w-full items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-shadow active:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900">{user.username}</div>
            <div className="text-sm text-gray-400">
              {user.pinHash ? 'PIN protected' : 'No PIN'}
            </div>
          </div>
        </button>
      ))}

      <button
        onClick={onCreate}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-4 text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-500"
      >
        <span className="text-2xl">+</span>
        <span className="font-medium">Create new profile</span>
      </button>
    </div>
  );
}
