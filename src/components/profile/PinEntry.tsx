import { useState } from 'react';

interface Props {
  username: string;
  onSubmit: (pin: string) => void;
  onCancel: () => void;
  error?: string;
}

export default function PinEntry({ username, onSubmit, onCancel, error }: Props) {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      onSubmit(pin);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
          {username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{username}</h2>
        <p className="text-sm text-gray-500">Enter your PIN to continue</p>
      </div>

      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
        placeholder="----"
        autoFocus
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em] text-gray-900 placeholder:tracking-[0.5em] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />

      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={pin.length !== 4}
          className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          Unlock
        </button>
      </div>
    </form>
  );
}
