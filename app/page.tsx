import { Suspense } from 'react';
import AppClient from './page-client';

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="app-shell min-h-screen">
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-sm muted">Loading workspace…</div>
          </div>
        </div>
      }
    >
      <AppClient />
    </Suspense>
  );
}
