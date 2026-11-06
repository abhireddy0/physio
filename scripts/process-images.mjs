// Converts the original photos in source-photos/ into optimised, EXIF-stripped
// responsive images in public/images/. Re-run with `npm run images`.
import fs from 'node:fs/promises';
import path from 'node:path';
import convert from 'heic-convert';
import sharp from 'sharp';

const SRC = 'source-photos';
const OUT = 'public/images';

// crop: [left, top, width, height] as fractions of the auto-oriented image
const JOBS = [
  { src: 'p2.jpeg', name: 'portrait', crop: [0.1, 0, 0.8, 1], widths: [480, 800, 1000] },
  { src: 'p2.jpeg', name: 'portrait-square', crop: [0.18, 0, 0.64, 0.64], widths: [320, 640] },
  { src: 'p4.HEIC', name: 'hospital', crop: [0, 0.04, 1, 0.96], widths: [600, 900, 1300] },
];

const PRIVATE_IMAGE_PREFIXES = ['cupping-', 'taping-shoulder-', 'taping-arm-'];
for (const file of await fs.readdir(OUT).catch((error) => {
  if (error.code === 'ENOENT') return [];
  throw error;
})) {
  if (PRIVATE_IMAGE_PREFIXES.some((prefix) => file.startsWith(prefix))) {
    await fs.rm(path.join(OUT, file));
  }
}

const cache = new Map();
async function load(file) {
  if (cache.has(file)) return cache.get(file);
  let buf = await fs.readFile(path.join(SRC, file));
  if (/\.heic$/i.test(file)) buf = Buffer.from(await convert({ buffer: buf, format: 'JPEG', quality: 0.95 }));
  buf = await sharp(buf).rotate().toBuffer(); // bake in EXIF orientation
  cache.set(file, buf);
  return buf;
}

await fs.mkdir(OUT, { recursive: true });
const manifest = {};
for (const job of JOBS) {
  const buf = await load(job.src);
  const { width: W, height: H } = await sharp(buf).metadata();
  const [l, t, w, h] = job.crop;
  const region = { left: Math.round(l * W), top: Math.round(t * H), width: Math.round(w * W), height: Math.round(h * H) };
  const cropped = await sharp(buf).extract(region).toBuffer();
  for (const width of job.widths.filter((x) => x <= region.width)) {
    const base = sharp(cropped).resize({ width, withoutEnlargement: true });
    await base.clone().webp({ quality: 78 }).toFile(path.join(OUT, `${job.name}-${width}.webp`));
    await base.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, `${job.name}-${width}.jpg`));
  }
  manifest[job.name] = { width: region.width, height: region.height, widths: job.widths.filter((x) => x <= region.width) };
  console.log(job.name, region.width, 'x', region.height);
}
await fs.writeFile('src/data/image-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
