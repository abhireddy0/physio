import { StrictMode, type ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';

/** Hydrates pre-rendered HTML in production; renders from scratch in `vite dev`. */
export function mount(node: ReactNode) {
  const root = document.getElementById('root')!;
  const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
  const app = (
    <>
      <StrictMode>{node}</StrictMode>
      {!isLocalhost && <Analytics />}
    </>
  );
  if (root.childElementCount > 0) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
