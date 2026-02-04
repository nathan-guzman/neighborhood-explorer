import { useEffect, useState } from 'react';
import { Share, X } from 'lucide-react';

const DISMISSED_KEY = 'locale-install-dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|Chrome/.test(ua);
  return isIos && isSafari;
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true);
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosBanner, setShowIosBanner] = useState(false);
  const [dismissed, setDismissed] = useState(() =>
    localStorage.getItem(DISMISSED_KEY) === 'true'
  );

  useEffect(() => {
    if (isStandalone() || dismissed) return;

    if (isIosSafari()) {
      setShowIosBanner(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setDismissed(true);
    setDeferredPrompt(null);
    setShowIosBanner(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      handleDismiss();
    }
    setDeferredPrompt(null);
  };

  if (dismissed || isStandalone()) return null;

  // Android/Chrome native install prompt
  if (deferredPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 shadow-lg pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Install Locale</p>
            <p className="text-xs text-gray-500">Add to your home screen for the best experience.</p>
          </div>
          <button
            onClick={handleInstall}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-full p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  // iOS Safari instructional banner
  if (showIosBanner) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 shadow-lg pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Install Locale</p>
            <p className="mt-1 text-xs text-gray-500">
              Tap the share button <Share size={14} className="inline -mt-0.5" /> in Safari, then select <span className="font-medium">"Add to Home Screen"</span>.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="rounded-full p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
