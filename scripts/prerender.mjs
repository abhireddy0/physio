// Post-build step: injects pre-rendered HTML + <head> tags into the page and
// writes robots.txt, sitemap.xml and the vCard. Runs after `vite build --ssr`.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = 'dist';
const SSR = 'dist-ssr';
const ssr = await import(pathToFileURL(path.resolve(SSR, 'entry-server.js')).href);

const target = path.join(DIST, 'index.html');
let html = await fs.readFile(target, 'utf8');
if (!html.includes('<!--app-->') || !html.includes('<!--head-->')) throw new Error('Placeholders missing in index.html');
html = html.replace('<!--head-->', ssr.renderHead()).replace('<!--app-->', ssr.render());
await fs.writeFile(target, html);
console.log('prerendered index.html');

await fs.writeFile(path.join(DIST, 'robots.txt'), ssr.renderRobots());
await fs.writeFile(path.join(DIST, 'prashanth-s.vcf'), ssr.renderVcard());
const sitemap = ssr.renderSitemap(new Date().toISOString().slice(0, 10));
if (sitemap) await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap);
await fs.rm(SSR, { recursive: true, force: true });

if (!ssr.SITE_URL) {
  console.warn(
    '\n⚠  VITE_SITE_URL is not set — built as STAGING: noindex, robots "Disallow: /", no sitemap,' +
      ' no canonical/OG URLs.\n   Set VITE_SITE_URL (see .env.example) for the production build.\n',
  );
} else {
  console.log(`\nProduction URL: ${ssr.SITE_URL} · indexing ${ssr.INDEXABLE ? 'ENABLED' : 'DISABLED'}\n`);
}
