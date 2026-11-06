// Server entry used only at build time (scripts/prerender.mjs) to produce static HTML.
import { renderToString } from 'react-dom/server';
import { Home } from './pages/Home';

export { renderHead, renderRobots, renderSitemap, renderVcard } from './seo';
export { SITE_URL, INDEXABLE } from './config';

export function render(): string {
  return renderToString(<Home />);
}
