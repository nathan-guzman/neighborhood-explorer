import { useState } from 'react';
import { X, Check, SkipForward, Flag } from 'lucide-react';
import type { VisitStatus } from '@/types';

interface Props {
  onLeft: () => void;
  onRight: () => void;
  onSkip: () => void;
  onFlag: (status: VisitStatus) => void;
}

export default function SwipeActions({ onLeft, onRight, onSkip, onFlag }: Props) {
  const [showFlagMenu, setShowFlagMenu] = useState(false);

  return (
    <div className="relative">
      {showFlagMenu && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-xl bg-white p-2 shadow-lg border border-gray-200 min-w-[200px]">
          <button
            onClick={() => { onFlag('not_a_business'); setShowFlagMenu(false); }}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Not a real business
          </button>
          <button
            onClick={() => { onFlag('closed'); setShowFlagMenu(false); }}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Permanently closed
          </button>
          <button
            onClick={() => { onFlag('duplicate'); setShowFlagMenu(false); }}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Duplicate
          </button>
          <button
            onClick={() => setShowFlagMenu(false)}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-400 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-5 py-4 pb-2">
        <button
          onClick={onLeft}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-300 text-red-400 transition-all active:scale-90 active:bg-red-50"
          aria-label="Haven't been"
        >
          <X size={28} />
        </button>

        <button
          onClick={() => setShowFlagMenu((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-300 text-orange-400 transition-all active:scale-90 active:bg-orange-50"
          aria-label="Flag business"
        >
          <Flag size={16} />
        </button>

        <button
          onClick={onSkip}
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 transition-all active:scale-90 active:bg-gray-50"
          aria-label="Skip"
        >
          <SkipForward size={16} />
        </button>

        <button
          onClick={onRight}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-green-300 text-green-500 transition-all active:scale-90 active:bg-green-50"
          aria-label="I've been here"
        >
          <Check size={28} />
        </button>
      </div>
    </div>
  );
}
