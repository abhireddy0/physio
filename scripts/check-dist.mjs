// QA for the built site: serves dist/, loads each page at mobile + desktop widths,
// fails on console errors / failed requests, and verifies contact links and the vCard.
// Usage: npm run build && npm run check [-- --shots <dir>]
import fs from 'node:fs/promises';
import path from 'node:path';
import { preview } from 'vite';
import { launch } from './browser.mjs';

const shotsDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : '';
const server = await preview({ preview: { port: 4317, strictPort: true }, logLevel: 'silent' });
const base = 'http://localhost:4317';
const browser = await launch();
const problems = [];
const fail = (msg) => problems.push(msg);

const robots = await (await fetch(`${base}/robots.txt`)).text();
const siteUrl = (robots.match(/^Sitemap: (.*)\/sitemap\.xml$/m) || [])[1] || '';
console.log('robots.txt:', JSON.stringify(robots));
console.log('production URL:', siteUrl || '(none — staging build)');

const vcf = await (await fetch(`${base}/prashanth-s.vcf`)).text();
if (!vcf.startsWith('BEGIN:VCARD') || !vcf.includes('TEL;TYPE=CELL,VOICE,pref:+919448898469') || !vcf.trim().endsWith('END:VCARD'))
  fail('vCard invalid');
if (/localhost/.test(vcf)) fail('vCard contains localhost');
console.log('vCard:\n' + vcf);

const PAGES = ['/'];
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'tablet', width: 820, height: 1180, deviceScaleFactor: 1 },
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
];

for (const vp of VIEWPORTS) {
  for (const p of PAGES) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    page.on('console', (m) => ['error', 'warning'].includes(m.type()) && fail(`${vp.name} ${p} console.${m.type()}: ${m.text()}`));
    page.on('pageerror', (e) => fail(`${vp.name} ${p} pageerror: ${e.message}`));
    page.on('requestfailed', (r) => fail(`${vp.name} ${p} request failed: ${r.url()}`));
    page.on('response', (r) => r.status() >= 400 && fail(`${vp.name} ${p} HTTP ${r.status()}: ${r.url()}`));
    await page.goto(base + p, { waitUntil: 'networkidle0' });
    // scroll through so lazy images load
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForNetworkIdle({ idleTime: 300 });

    const report = await page.evaluate(() => {
      const links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
      const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      const brokenImgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
      const noAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length;
      const h1 = document.querySelectorAll('h1').length;
      const smallTargets = [...document.querySelectorAll('a.btn, button, .action-bar__btn')]
        .filter((el) => el.offsetParent && el.getBoundingClientRect().height < 40).map((el) => el.textContent.trim());
      const robots = document.querySelector('meta[name=robots]')?.content;
      const canonical = document.querySelector('link[rel=canonical]')?.href || '';
      const description = document.querySelector('meta[name=description]')?.content || '';
      const structuredData = JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent || 'null');
      const structuredTypes = (structuredData?.['@graph'] || []).map((item) => item['@type']);
      const treatmentPhotos = [...document.images]
        .map((i) => i.currentSrc || i.src)
        .filter((src) => /\/(cupping|taping-(arm|shoulder))-/i.test(src));
      return {
        links, overflow, brokenImgs, noAlt, h1, smallTargets, robots, canonical, title: document.title,
        description, structuredTypes, treatmentPhotos,
      };
    });
    if (report.overflow) fail(`${vp.name} ${p} horizontal overflow`);
    if (report.brokenImgs.length) fail(`${vp.name} ${p} broken images ${report.brokenImgs}`);
    if (report.noAlt) fail(`${vp.name} ${p} ${report.noAlt} images without alt`);
    if (report.h1 !== 1) fail(`${vp.name} ${p} has ${report.h1} h1`);
    if (report.smallTargets.length) fail(`${vp.name} ${p} small tap targets: ${report.smallTargets}`);
    if (!report.title || report.title.length > 65) fail(`${vp.name} ${p} missing or overly long title`);
    if (!report.description || report.description.length > 160) fail(`${vp.name} ${p} missing or overly long meta description`);
    if (!report.structuredTypes.includes('Person') || !report.structuredTypes.includes('Service'))
      fail(`${vp.name} ${p} missing Person or Service structured data`);
    if (siteUrl && (!report.canonical.startsWith(siteUrl) || !report.structuredTypes.includes('WebPage')))
      fail(`${vp.name} ${p} missing production canonical or WebPage structured data`);
    if (report.treatmentPhotos.length) fail(`${vp.name} ${p} includes patient treatment photos: ${report.treatmentPhotos}`);
    for (const href of report.links) {
      if (href.startsWith('#') && href.length > 1 && !(await page.$(href))) fail(`${p} dead anchor ${href}`);
      if (href.startsWith('tel:') && !['tel:+919448898469', 'tel:112'].includes(href)) fail(`${p} unexpected tel ${href}`);
      if (href.includes('wa.me/') && !/^https:\/\/wa\.me\/(919448898469)?\?text=/.test(href)) fail(`${p} bad WhatsApp link ${href}`);
      if (/localhost|127\.0\.0\.1/.test(href)) fail(`${p} localhost link ${href}`);
      if (href.startsWith('/') && !href.startsWith('//')) {
        const r = await fetch(base + href);
        if (!r.ok) fail(`${p} broken internal link ${href} (${r.status})`);
      }
    }
    if (vp.name === 'mobile') console.log(`${p} | ${report.title} | robots=${report.robots} | canonical=${report.canonical || '-'} | links=${report.links.length}`);
    if (shotsDir) {
      await fs.mkdir(shotsDir, { recursive: true });
      await page.screenshot({ path: path.join(shotsDir, `${vp.name}${p.replace(/\//g, '_') || '_'}.png`), fullPage: true });
    }
    await page.close();
  }
}

await browser.close();
server.httpServer.close();
if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):\n- ` + [...new Set(problems)].join('\n- '));
  process.exit(1);
}
console.log('\n✓ All checks passed');
