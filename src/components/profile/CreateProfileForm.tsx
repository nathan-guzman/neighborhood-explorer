import { useState } from 'react';

interface Props {
  onSubmit: (username: string, pin: string | null) => void;
  onCancel: () => void;
  existingUsernames: string[];
}

export default function CreateProfileForm({ onSubmit, onCancel, existingUsernames }: Props) {
  const [username, setUsername] = useState('');
  const [usePin, setUsePin] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = username.trim();
    if (!trimmed) {
      setError('Username is required');
      return;
    }
    if (existingUsernames.includes(trimmed.toLowerCase())) {
      setError('Username already taken');
      return;
    }
    if (usePin && pin.length !== 4) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    onSubmit(trimmed, usePin ? pin : null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          autoFocus
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={usePin}
            onChange={(e) => {
              setUsePin(e.target.checked);
              if (!e.target.checked) setPin('');
            }}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Protect with a 4-digit PIN</span>
        </label>

        {usePin && (
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 4-digit PIN"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em] text-gray-900 placeholder:text-sm placeholder:tracking-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </form>
  );
}
