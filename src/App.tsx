import { Component, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAppStore } from '@/stores/appStore';
import { useActiveUser } from '@/hooks/useUser';
import AppShell from '@/components/layout/AppShell';
import ProfileSelectScreen from '@/screens/ProfileSelectScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import SwipeScreen from '@/screens/SwipeScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import ListScreen from '@/screens/ListScreen';
import MapScreen from '@/screens/MapScreen';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, color: 'red', fontFamily: 'monospace' }}>
          <h1>App Error</h1>
          <pre>{this.state.error.message}</pre>
          <pre>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppRoutes() {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const user = useActiveUser();

  if (!activeUserId) {
    return (
      <Routes>
        <Route path="/profiles" element={<ProfileSelectScreen />} />
        <Route path="*" element={<Navigate to="/profiles" replace />} />
      </Routes>
    );
  }

  if (user === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (user.homeLat === null || user.homeLng === null) {
    return (
      <Routes>
        <Route path="/setup" element={<OnboardingScreen />} />
        <Route path="*" element={<Navigate to="/setup" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/swipe" element={<SwipeScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/list" element={<ListScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="*" element={<Navigate to="/swipe" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
