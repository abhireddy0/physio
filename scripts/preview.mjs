import fs from 'node:fs/promises';
import path from 'node:path';
import convert from 'heic-convert';
import sharp from 'sharp';
const out = process.argv[2];
await fs.mkdir(out, { recursive: true });
for (const f of await fs.readdir('.')) {
  if (!/\.(heic|jpe?g)$/i.test(f)) continue;
  let buf = await fs.readFile(f);
  if (/\.heic$/i.test(f)) buf = Buffer.from(await convert({ buffer: buf, format: 'JPEG', quality: 0.92 }));
  const img = sharp(buf).rotate();
  const m = await img.metadata();
  await img.resize({ width: 700 }).jpeg({ quality: 70 }).toFile(path.join(out, f.replace(/\..*$/, '') + '.jpg'));
  console.log(f, m.width, m.height, m.orientation);
}
