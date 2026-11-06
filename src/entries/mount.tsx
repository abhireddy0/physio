import { StrictMode, type ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

/** Hydrates pre-rendered HTML in production; renders from scratch in `vite dev`. */
export function mount(node: ReactNode) {
  const root = document.getElementById('root')!;
  const app = <StrictMode>{node}</StrictMode>;
  if (root.childElementCount > 0) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
