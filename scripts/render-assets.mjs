// Renders brand assets into public/: favicons, app icons and the Open Graph image.
// Uses the same fonts and real portrait as the site. Run with `npm run assets`.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { launch } from './browser.mjs';

const url = (p) => pathToFileURL(path.resolve(p)).href;
const fonts = `
  @font-face { font-family: Manrope; font-weight: 200 800; src: url(${url('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')}); }
  @font-face { font-family: Inter; font-weight: 100 900; src: url(${url('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')}); }
  * { margin: 0; box-sizing: border-box; }
`;

const icon = (size) => `<!doctype html><style>${fonts}
  body { width:${size}px; height:${size}px; background:#0f2a44; display:grid; place-items:center; position:relative; }
  b { font: 700 ${size * 0.42}px/1 Manrope; color:#fff; letter-spacing:${size * 0.01}px; transform: translateY(-${size * 0.04}px); }
  i { position:absolute; left:${size * 0.22}px; right:${size * 0.22}px; bottom:${size * 0.2}px; height:${Math.max(2, size * 0.05)}px; background:#3fb5ad; border-radius:9px; }
</style><body><b>PS</b><i></i></body>`;

const og = `<!doctype html><style>${fonts}
  body { width:1200px; height:630px; background:#0f2a44; color:#fff; font-family:Inter; display:grid; grid-template-columns: 1fr 470px; overflow:hidden; }
  .copy { padding: 70px 0 64px 76px; display:flex; flex-direction:column; }
  .eyebrow { font: 700 20px Manrope; letter-spacing: .14em; text-transform: uppercase; color:#3fb5ad; display:flex; align-items:center; gap:14px; }
  .eyebrow:before { content:''; width:34px; height:3px; background:#3fb5ad; }
  h1 { font: 800 70px/1.05 Manrope; letter-spacing:-.03em; margin-top: 30px; }
  .role { font: 600 32px Manrope; color:#fff; opacity:.92; margin-top: 16px; }
  .quals { font-size: 24px; opacity:.75; margin-top: 10px; }
  .foot { margin-top:auto; display:flex; gap: 36px; font: 600 23px Manrope; }
  .foot span { display:flex; flex-direction:column; }
  .foot small { font: 500 17px Inter; opacity:.65; margin-top: 4px; }
  .photo { position:relative; }
  .photo img { width:100%; height:100%; object-fit:cover; object-position: 50% 12%; }
  .photo:before { content:''; position:absolute; left:0; top:0; bottom:0; width:8px; background:#3fb5ad; z-index:1; }
</style><body>
  <div class="copy">
    <div class="eyebrow">Physiotherapy & Rehabilitation</div>
    <h1>Dr. Prashanth S.</h1>
    <div class="role">Physiotherapist · Bengaluru</div>
    <div class="quals">BPT, MPT (Musculoskeletal Sciences)</div>
    <div class="foot">
      <span>4+ years<small>at Manipal Hospitals</small></span>
      <span>800+<small>patients treated</small></span>
      <span>Home visits<small>on enquiry</small></span>
    </div>
  </div>
  <div class="photo"><img src="${url('public/images/portrait-1000.jpg')}"></div>
</body>`;

const browser = await launch();
const page = await browser.newPage();
async function shot(html, w, h, out, type = 'png') {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  // file:// page so local fonts and the portrait can load
  const tmp = path.join(os.tmpdir(), `brand-asset-${w}x${h}.html`);
  await fs.writeFile(tmp, html);
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type, ...(type === 'jpeg' ? { quality: 88 } : {}) });
  console.log('wrote', out);
}
await shot(icon(32), 32, 32, 'public/favicon-32.png');
await shot(icon(180), 180, 180, 'public/apple-touch-icon.png');
await shot(icon(192), 192, 192, 'public/icon-192.png');
await shot(icon(512), 512, 512, 'public/icon-512.png');
await shot(og, 1200, 630, 'public/og-image.jpg', 'jpeg');
await browser.close();
