import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell } from '@/components/layout/AppShell';
import { ToastProvider } from '@/components/common/Toast';
import { usePathname } from '@/compat/routing';
import Dashboard from '@/pages/dashboard';
import About from '@/pages/about';
import Analytics from '@/pages/analytics';
import Breakdown from '@/pages/breakdown';
import History from '@/pages/history';
import Log from '@/pages/log';
import Settings from '@/pages/settings';
import Target from '@/pages/target';
import './globals.css';

function Router() {
  const pathname = usePathname();
  const [, refresh] = useState(0);

  useEffect(() => {
    const update = () => refresh((value) => value + 1);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);

  const Page = {
    '/': Dashboard,
    '/dashboard': Dashboard,
    '/about': About,
    '/analytics': Analytics,
    '/breakdown': Breakdown,
    '/history': History,
    '/log': Log,
    '/settings': Settings,
    '/target': Target,
  }[pathname] ?? Dashboard;

  return <Page />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AppShell>
        <Router />
      </AppShell>
    </ToastProvider>
  </StrictMode>,
);

