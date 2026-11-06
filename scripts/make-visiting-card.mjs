// Generates the printable visiting card (not part of the website):
//   visiting card/visiting-card.pdf          single side, 95 × 57 mm including 3 mm bleed
//   visiting card/visiting-card-preview.png  high-resolution image for sharing
// Usage: npm run card
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { launch } from './browser.mjs';

const TEAL = '#16706f';
const OLIVE = '#8a8456';
const GREY = '#6b7178';

const fileUrl = (p) => pathToFileURL(path.resolve(p)).href;

const PHYSIO_MARK = fileUrl('public/images/physio-mark.svg');

const CARD = `
<div class="card">
  <img class="emblem" src="${PHYSIO_MARK}" alt="">
  <div class="text">
    <p class="name">Dr. Prashanth S.</p>
    <p class="title">Physiotherapist</p>
    <p class="quals">BPT, MPT (Musculoskeletal Sciences)</p>
    <ul class="contact">
      <li>+91 94488 98469</li>
      <li>Prashanthlucky507@gmail.com</li>
      <li>WhatsApp available</li>
    </ul>
    <p class="address">Swasthi Health Care Clinic<br>R. T. Nagar Post, Bengaluru</p>
  </div>
</div>`;

const CSS = `
@font-face { font-family: Manrope; font-weight: 200 800; src: url(${fileUrl('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')}); }
@font-face { font-family: Inter; font-weight: 100 900; src: url(${fileUrl('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')}); }
* { margin: 0; padding: 0; box-sizing: border-box; }
ul { list-style: none; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Inter, sans-serif; }

/* Artboard 95 × 57 mm incl. 3 mm bleed; text stays ≥ 4 mm inside the trim. */
.card { position: relative; width: 95mm; height: 57mm; overflow: hidden; background: #fff; }
.emblem { position: absolute; left: 5mm; top: 14mm; width: 26mm; height: 26mm; }
.text { position: absolute; left: 34mm; top: 9.2mm; right: 7mm; }
.name { font: 700 13pt/1.1 Manrope; letter-spacing: -0.01em; color: ${TEAL}; }
.title { margin-top: 1.1mm; font: 600 8.6pt/1.2 Inter; color: ${OLIVE}; }
.quals { margin-top: .7mm; font: 400 6.6pt/1.2 Inter; color: ${GREY}; }
.contact { margin-top: 3.2mm; display: grid; gap: .8mm; }
.contact li { font: 500 7.8pt/1.2 Inter; color: ${TEAL}; }
.contact li:first-child { font-weight: 600; }
.address { margin-top: 3.2mm; font: 400 7.2pt/1.4 Inter; color: ${GREY}; }

`;

const page = (body, extraCss = '') =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}${extraCss}</style></head><body>${body}</body></html>`;

const shopHtml = page(CARD, '@page { size: 95mm 57mm; margin: 0; }');

const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'vcard-'));
const browser = await launch();
const tab = await browser.newPage();
await tab.setViewport({ width: 1200, height: 800, deviceScaleFactor: 3 });
async function open(html, name) {
  const file = path.join(tmp, name);
  await fs.writeFile(file, html);
  await tab.goto(pathToFileURL(file).href, { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
}

const OUT = 'visiting card';
await fs.mkdir(OUT, { recursive: true });

await open(shopHtml, 'shop.html');
await tab.pdf({ path: path.join(OUT, 'visiting-card.pdf'), preferCSSPageSize: true, printBackground: true });
const card = await tab.$('.card');
if (!card) throw new Error('Visiting card preview element was not rendered');
await card.screenshot({ path: path.join(OUT, 'visiting-card-preview.png') });

await browser.close();
await fs.rm(tmp, { recursive: true, force: true });
console.log((await fs.readdir(OUT)).map((f) => `  ${OUT}/${f}`).join('\n'));
